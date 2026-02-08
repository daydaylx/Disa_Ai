/**
 * Cloudflare Function: /api/chat
 *
 * Proxies chat requests to OpenRouter API using server-side API key.
 * This prevents exposing the API key to clients and enables free-tier access for all users.
 *
 * Environment Variables Required (Cloudflare Secrets):
 * - OPENROUTER_API_KEY: Your OpenRouter API key
 *
 * @see https://developers.cloudflare.com/pages/functions/
 */

interface Env {
  OPENROUTER_API_KEY: string;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model: string;
  stream: boolean;
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  max_tokens?: number;
}

// OpenRouter API endpoint
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Production domains (exact match required)
const PRODUCTION_HOSTS = new Set(["disaai.de", "www.disaai.de", "disa-ai.pages.dev"]);

// Development hosts (localhost and 127.0.0.1 with any port)
const DEV_HOSTS = new Set(["localhost", "127.0.0.1"]);

/**
 * Securely validate origin against allowlist
 * - Only HTTPS in production (HTTP allowed for localhost dev)
 * - Exact hostname match (no prefix/substring tricks)
 * - Preview domains: *.pages.dev subdomains allowed
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;

  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    // Invalid URL format
    return false;
  }

  const { protocol, hostname, port } = url;

  // Development: allow http://localhost:* and http://127.0.0.1:*
  if (protocol === "http:" && DEV_HOSTS.has(hostname)) {
    return true;
  }

  // Production: require HTTPS
  if (protocol !== "https:") {
    return false;
  }

  // Exact match against production hosts
  if (PRODUCTION_HOSTS.has(hostname)) {
    return true;
  }

  // Allow preview deployments: *.pages.dev
  // IMPORTANT: Only *.pages.dev, not arbitrary subdomains
  if (hostname.endsWith(".pages.dev")) {
    // Ensure no additional dots before .pages.dev
    // Valid: my-app-xyz.pages.dev
    // Invalid: evil.com.pages.dev (blocked by this check)
    const parts = hostname.split(".");
    if (parts.length === 3 && parts[1] === "pages" && parts[2] === "dev") {
      return true;
    }
  }

  return false;
}

/**
 * Get CORS headers for allowed origin
 */
function getCORSHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin");

  if (isAllowedOrigin(origin)) {
    return {
      "Access-Control-Allow-Origin": origin!,
      Vary: "Origin",
    };
  }

  // No CORS headers for disallowed origins
  return {};
}

/**
 * Handle CORS preflight requests
 */
function handleCORS(request: Request): Response {
  const origin = request.headers.get("Origin");

  if (!isAllowedOrigin(origin)) {
    // Reject preflight from disallowed origins
    return new Response(null, {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin!,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "600",
      Vary: "Origin",
    },
  });
}

/**
 * Return JSON error response with CORS headers
 */
function jsonError(message: string, status: number, request?: Request): Response {
  const corsHeaders = request ? getCORSHeaders(request) : {};

  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

/**
 * Main request handler for Cloudflare Pages Function
 */
export async function onRequest(context: {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<any>) => void;
}): Promise<Response> {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return handleCORS(request);
  }

  // Validate origin for actual requests
  const origin = request.headers.get("Origin");
  if (!isAllowedOrigin(origin)) {
    console.warn(`❌ Blocked request from disallowed origin: ${origin || "(none)"}`);
    return new Response(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Only allow POST requests
  if (request.method !== "POST") {
    return jsonError("Method not allowed. Use POST.", 405, request);
  }

  try {
    // Validate API key is configured
    if (!env.OPENROUTER_API_KEY) {
      console.error("❌ OPENROUTER_API_KEY not configured in Cloudflare Secrets");
      return jsonError(
        "Server configuration error: API key not configured. Please set OPENROUTER_API_KEY in Cloudflare Dashboard.",
        500,
        request,
      );
    }

    // Parse request body
    let body: ChatRequest;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON in request body", 400, request);
    }

    // Validate required fields
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return jsonError(
        "Invalid request: 'messages' array is required and must not be empty",
        400,
        request,
      );
    }

    if (!body.model || typeof body.model !== "string") {
      return jsonError("Invalid request: 'model' string is required", 400, request);
    }

    // Build OpenRouter request payload
    const openRouterPayload: Record<string, unknown> = {
      model: body.model,
      messages: body.messages,
      stream: body.stream ?? true,
    };

    // Add optional parameters if provided
    if (body.temperature !== undefined) openRouterPayload.temperature = body.temperature;
    if (body.top_p !== undefined) openRouterPayload.top_p = body.top_p;
    if (body.presence_penalty !== undefined)
      openRouterPayload.presence_penalty = body.presence_penalty;
    if (body.max_tokens !== undefined) openRouterPayload.max_tokens = body.max_tokens;

    // Get origin for HTTP-Referer header (for OpenRouter attribution)
    const referer = origin || "https://disaai.de";

    // Log request for debugging (IMPORTANT: do NOT log message contents or API keys)
    console.log(`📤 Proxying request to OpenRouter: model=${body.model}, stream=${body.stream}`);

    // Make request to OpenRouter API
    const openRouterResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": referer,
        "X-Title": "Disa AI",
      },
      body: JSON.stringify(openRouterPayload),
    });

    // Check if OpenRouter request was successful
    if (!openRouterResponse.ok) {
      console.error(
        `❌ OpenRouter API error: ${openRouterResponse.status} ${openRouterResponse.statusText}`,
      );

      // Try to get error details from OpenRouter
      let errorMessage = `OpenRouter API error: ${openRouterResponse.status}`;
      try {
        const errorData = await openRouterResponse.json();
        if (errorData?.error) {
          errorMessage = errorData.error.message || errorData.error;
        }
      } catch {
        // If we can't parse the error, use the status text
        errorMessage = `OpenRouter API error: ${openRouterResponse.status} ${openRouterResponse.statusText}`;
      }

      return jsonError(errorMessage, openRouterResponse.status, request);
    }

    const corsHeaders = getCORSHeaders(request);

    // Handle streaming response
    if (body.stream) {
      console.log("✅ Streaming response from OpenRouter");
      return new Response(openRouterResponse.body, {
        status: openRouterResponse.status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          ...corsHeaders,
        },
      });
    }

    // Handle non-streaming response
    const responseData = await openRouterResponse.json();
    console.log("✅ Non-streaming response from OpenRouter");

    return new Response(JSON.stringify(responseData), {
      status: openRouterResponse.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("❌ Unexpected error in /api/chat:", error);

    return jsonError(
      error instanceof Error ? error.message : "Internal server error",
      500,
      request,
    );
  }
}
