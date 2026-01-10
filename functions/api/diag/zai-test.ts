/**
 * Cloudflare Function: /api/diag/zai-test
 *
 * DIAGNOSTIC ENDPOINT - Live Z.AI API connectivity test.
 * Makes a minimal request to Z.AI API to verify credentials work.
 *
 * SECURITY:
 * - Disabled in production unless explicitly enabled
 * - Uses a tiny test payload to minimize API costs
 * - Does NOT expose full API responses, only status
 *
 * Environment Variables:
 * - ZAI_API_KEY: Required for testing
 * - ENABLE_DIAG_ENDPOINTS: Set to "true" to enable in production
 */

interface Env {
  ZAI_API_KEY?: string;
  ENABLE_DIAG_ENDPOINTS?: string;
}

interface TestResult {
  endpoint: string;
  timestamp: string;
  environment: string;
  test: {
    api_key_configured: boolean;
    api_reachable: boolean;
    auth_valid: boolean;
    response_valid: boolean;
    latency_ms?: number;
    error?: string;
    error_code?: string;
    http_status?: number;
  };
  recommendation?: string;
}

const ZAI_API_BASE_URL = "https://api.z.ai/api/paas/v4";
const ZAI_CHAT_ENDPOINT = `${ZAI_API_BASE_URL}/chat/completions`;
const ZAI_MODEL_ID = "glm-4.6v";

// Minimal test payload - 1x1 red pixel PNG as base64
const TEST_IMAGE_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

function isProduction(request: Request): boolean {
  const host = new URL(request.url).hostname;
  return host === "disaai.de" || host === "disaai.pages.dev";
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  // Security: Disable in production unless explicitly enabled
  const diagEnabled = env.ENABLE_DIAG_ENDPOINTS === "true";
  const isProd = isProduction(request);

  if (isProd && !diagEnabled) {
    return new Response(
      JSON.stringify({
        error: "Diagnostic endpoints disabled in production",
        hint: "Set ENABLE_DIAG_ENDPOINTS=true in environment variables to enable",
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Only allow GET requests
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use GET." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result: TestResult = {
    endpoint: "/api/diag/zai-test",
    timestamp: new Date().toISOString(),
    environment: isProd ? "production" : "development",
    test: {
      api_key_configured: false,
      api_reachable: false,
      auth_valid: false,
      response_valid: false,
    },
  };

  // Check if API key is configured
  if (!env.ZAI_API_KEY) {
    result.test.error = "ZAI_API_KEY not configured";
    result.recommendation =
      "Set ZAI_API_KEY in Cloudflare Dashboard > Settings > Environment Variables";
    return new Response(JSON.stringify(result, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  result.test.api_key_configured = true;

  // Build minimal test payload
  const testPayload = {
    model: ZAI_MODEL_ID,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: TEST_IMAGE_DATA_URL },
          },
          {
            type: "text",
            text: "ping",
          },
        ],
      },
    ],
    stream: false,
    max_tokens: 10, // Minimal response to save API costs
  };

  // Make test request to Z.AI
  const startTime = Date.now();
  let zaiResponse: Response;

  try {
    zaiResponse = await fetch(ZAI_CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.ZAI_API_KEY}`,
      },
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    result.test.latency_ms = Date.now() - startTime;
    result.test.api_reachable = true;
    result.test.http_status = zaiResponse.status;
  } catch (error) {
    result.test.error = error instanceof Error ? error.message : "Network request failed";
    result.test.error_code = "FETCH_ERROR";
    result.recommendation = "Check network connectivity and Z.AI API status at https://status.z.ai";

    return new Response(JSON.stringify(result, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check authentication
  if (zaiResponse.status === 401 || zaiResponse.status === 403) {
    result.test.auth_valid = false;
    result.test.error = "Authentication failed";
    result.test.error_code = `HTTP_${zaiResponse.status}`;

    try {
      const errorData = await zaiResponse.json();
      if (errorData?.error?.message) {
        result.test.error = errorData.error.message;
      }
    } catch {
      // Ignore JSON parse errors
    }

    result.recommendation = "Verify ZAI_API_KEY is correct. Get a new key at https://api.z.ai";

    return new Response(JSON.stringify(result, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if request was successful
  if (!zaiResponse.ok) {
    result.test.error = `Z.AI API error: ${zaiResponse.status} ${zaiResponse.statusText}`;
    result.test.error_code = `HTTP_${zaiResponse.status}`;

    try {
      const errorData = await zaiResponse.json();
      if (errorData?.error?.message) {
        result.test.error = errorData.error.message;
      }
    } catch {
      // Ignore JSON parse errors
    }

    if (zaiResponse.status === 429) {
      result.recommendation = "Rate limit exceeded. Wait and try again.";
    } else if (zaiResponse.status >= 500) {
      result.recommendation = "Z.AI API is experiencing issues. Check https://status.z.ai";
    } else {
      result.recommendation = "Check Z.AI API documentation for error details";
    }

    return new Response(JSON.stringify(result, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  result.test.auth_valid = true;

  // Validate response structure
  try {
    const responseData = await zaiResponse.json();

    if (responseData?.choices?.[0]?.message?.content) {
      result.test.response_valid = true;
    } else {
      result.test.response_valid = false;
      result.test.error = "Invalid response structure from Z.AI";
      result.test.error_code = "INVALID_RESPONSE";
    }
  } catch (error) {
    result.test.error = error instanceof Error ? error.message : "Failed to parse JSON response";
    result.test.error_code = "JSON_PARSE_ERROR";
  }

  // Final verdict
  if (result.test.response_valid) {
    result.recommendation = "✅ Z.AI API is configured correctly and working!";
  }

  const status = result.test.response_valid ? 200 : 500;

  return new Response(JSON.stringify(result, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
