/**
 * Cloudflare Function: /api/vision
 *
 * Proxies vision requests to Z.AI API using server-side API key.
 * This prevents exposing the API key to clients.
 *
 * Environment Variables Required (Cloudflare Secrets):
 * - ZAI_API_KEY: Your Z.AI API key
 *
 * @see https://docs.z.ai
 */

interface Env {
  ZAI_API_KEY: string;
}

interface VisionRequest {
  prompt: string;
  imageDataUrl: string;
  mimeType: string;
  filename?: string;
}

interface VisionResponse {
  text: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  model: string;
}

// Z.AI API configuration
const ZAI_API_BASE_URL = "https://api.z.ai/api/paas/v4";
const ZAI_CHAT_ENDPOINT = `${ZAI_API_BASE_URL}/chat/completions`;
const ZAI_MODEL_ID = "glm-4.6v";

// Allowed origins for CORS validation
const ALLOWED_ORIGINS = [
  "https://disaai.de",
  "https://disa-ai.pages.dev",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
];

// Configuration
const MAX_DATA_URL_SIZE = 10 * 1024 * 1024; // 10MB max after processing
const REQUEST_TIMEOUT_MS = 30000; // 30 seconds timeout
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/**
 * Check if origin is allowed for CORS
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed.replace(/:\d+$/, "")));
}

/**
 * Get CORS origin header value
 */
function getCORSOrigin(request: Request): string {
  const origin = request.headers.get("Origin");
  return isAllowedOrigin(origin) ? origin! : ALLOWED_ORIGINS[0];
}

/**
 * Handle CORS preflight requests
 */
function handleCORS(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": getCORSOrigin(request),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/**
 * Return JSON error response with CORS headers
 */
function jsonError(message: string, status: number, code: string, request?: Request): Response {
  const origin = request ? getCORSOrigin(request) : "*";
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
    },
  });
}

/**
 * Validate data URL format
 */
function isValidDataUrl(dataUrl: string): boolean {
  const regex = /^data:image\/(jpeg|jpg|png|webp);base64,/i;
  return regex.test(dataUrl);
}

/**
 * Estimate data URL size in bytes
 */
function estimateDataUrlSize(dataUrl: string): number {
  const base64Data = dataUrl.split(",")[1];
  if (!base64Data) return 0;
  return Math.ceil((base64Data.length * 3) / 4);
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

  // Only allow POST requests
  if (request.method !== "POST") {
    return jsonError("Method not allowed. Use POST.", 405, "METHOD_NOT_ALLOWED", request);
  }

  try {
    // Validate API key is configured (FAIL FAST)
    if (!env.ZAI_API_KEY) {
      console.error("❌ ZAI_API_KEY not configured in Cloudflare Secrets");
      console.error(
        "🔧 Fix: Run `npx wrangler pages secret put ZAI_API_KEY --project-name=disaai`",
      );
      return jsonError(
        "Server configuration error: API key not configured. Please set ZAI_API_KEY in Cloudflare Dashboard.",
        500,
        "MISSING_API_KEY",
        request,
      );
    }

    // Log successful key presence (NEVER log the actual value)
    console.log("✅ ZAI_API_KEY is configured (length:", env.ZAI_API_KEY.length, "chars)");

    // Parse request body
    let body: VisionRequest;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON in request body", 400, "INVALID_JSON", request);
    }

    // Validate required fields
    if (!body.prompt || typeof body.prompt !== "string") {
      return jsonError(
        "Invalid request: 'prompt' string is required",
        400,
        "MISSING_PROMPT",
        request,
      );
    }

    if (!body.imageDataUrl || typeof body.imageDataUrl !== "string") {
      return jsonError(
        "Invalid request: 'imageDataUrl' string is required",
        400,
        "MISSING_IMAGE",
        request,
      );
    }

    if (!body.mimeType || typeof body.mimeType !== "string") {
      return jsonError(
        "Invalid request: 'mimeType' string is required",
        400,
        "MISSING_MIME_TYPE",
        request,
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(body.mimeType.toLowerCase())) {
      return jsonError(
        `Unsupported MIME type: ${body.mimeType}. Allowed: JPEG, PNG, WebP`,
        400,
        "UNSUPPORTED_MIME_TYPE",
        request,
      );
    }

    // Validate data URL format
    if (!isValidDataUrl(body.imageDataUrl)) {
      return jsonError("Invalid image data URL format", 400, "INVALID_DATA_URL", request);
    }

    // Validate data URL size (server-side check)
    const estimatedSize = estimateDataUrlSize(body.imageDataUrl);
    if (estimatedSize > MAX_DATA_URL_SIZE) {
      const sizeMB = (estimatedSize / (1024 * 1024)).toFixed(2);
      return jsonError(
        `Image too large (${sizeMB} MB after processing). Maximum: 10 MB`,
        413,
        "PAYLOAD_TOO_LARGE",
        request,
      );
    }

    // Trim prompt
    const prompt = body.prompt.trim();

    // Build Z.AI request payload (OpenAI-compatible format)
    const zaiPayload = {
      model: ZAI_MODEL_ID,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: body.imageDataUrl,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      stream: false,
    };

    // Log request for debugging (do NOT log imageDataUrl)
    console.log(
      `📤 Proxying vision request to Z.AI: model=${ZAI_MODEL_ID}, mime=${body.mimeType}, size=${estimatedSize}`,
    );

    // Make request to Z.AI API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let zaiResponse: Response;
    try {
      zaiResponse = await fetch(ZAI_CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.ZAI_API_KEY}`,
        },
        body: JSON.stringify(zaiPayload),
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return jsonError("Request to Z.AI API timed out", 504, "GATEWAY_TIMEOUT", request);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    // Check if Z.AI request was successful
    if (!zaiResponse.ok) {
      console.error(`❌ Z.AI API error: ${zaiResponse.status} ${zaiResponse.statusText}`);

      // Try to get error details from Z.AI
      let errorMessage = `Z.AI API error: ${zaiResponse.status}`;
      let errorCode = `HTTP_${zaiResponse.status}`;

      try {
        const errorData = await zaiResponse.json();
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        }
        if (errorData?.error?.code) {
          errorCode = errorData.error.code;
        }
      } catch {
        // If we can't parse the error, use the status text
        errorMessage = `Z.AI API error: ${zaiResponse.status} ${zaiResponse.statusText}`;
      }

      // Map common status codes
      const statusMap: Record<number, number> = {
        400: 400,
        401: 500, // Bad server config
        403: 500, // Bad server config
        429: 429, // Rate limit
        500: 502,
        502: 502,
        503: 503,
        504: 504,
      };

      const mappedStatus = statusMap[zaiResponse.status] ?? 502;
      return jsonError(errorMessage, mappedStatus, errorCode, request);
    }

    // Parse Z.AI response
    const responseData = await zaiResponse.json();

    // Validate Z.AI response structure
    if (!responseData?.choices?.[0]?.message?.content) {
      console.error(
        "❌ Invalid Z.AI response structure:",
        JSON.stringify(responseData).slice(0, 200),
      );
      return jsonError("Invalid response from Z.AI API", 502, "INVALID_RESPONSE", request);
    }

    // Build our response format
    const visionResponse: VisionResponse = {
      text: responseData.choices[0].message.content,
      model: responseData.model || ZAI_MODEL_ID,
      usage: responseData.usage,
    };

    console.log(
      `✅ Vision response from Z.AI: model=${visionResponse.model}, tokens=${visionResponse.usage?.total_tokens || "N/A"}`,
    );

    const corsOrigin = getCORSOrigin(request);

    return new Response(JSON.stringify(visionResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
      },
    });
  } catch (error) {
    console.error("❌ Unexpected error in /api/vision:", error);

    return jsonError(
      error instanceof Error ? error.message : "Internal server error",
      500,
      "INTERNAL_ERROR",
      request,
    );
  }
}
