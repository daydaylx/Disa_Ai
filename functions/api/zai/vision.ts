/**
 * Cloudflare Pages Function: /api/zai/vision
 *
 * Proxies image analysis requests to Z.ai GLM-4.6v Vision API.
 * The API key is stored server-side only and never exposed to clients.
 *
 * Environment Variables Required (Cloudflare Secrets):
 * - ZAI_API_KEY: Your Z.ai API key
 *
 * @see https://developers.cloudflare.com/pages/functions/
 */

interface Env {
  ZAI_API_KEY: string;
}

// Z.ai API configuration
const ZAI_API_URL = "https://api.z.ai/api/paas/v4/chat/completions";
const ZAI_VISION_MODEL = "glm-4.6v";

// Request limits
const MAX_IMAGE_SIZE_MB = 10;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_PROMPT_LENGTH = 2000;
const REQUEST_TIMEOUT_MS = 60000; // 60 seconds

// Allowed image MIME types
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

// Allowed origins for CORS validation
const ALLOWED_ORIGINS = [
  "https://disaai.de",
  "https://disa-ai.pages.dev",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
];

interface VisionRequest {
  prompt: string;
  imageDataUrl: string; // base64 data URL: "data:image/png;base64,..."
}

interface ZaiVisionResponse {
  success: boolean;
  text?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
  code?: string;
}

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
 * Return JSON response with CORS headers
 */
function jsonResponse(data: ZaiVisionResponse, status: number, request: Request): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": getCORSOrigin(request),
    },
  });
}

/**
 * Return error response
 */
function errorResponse(message: string, code: string, status: number, request: Request): Response {
  return jsonResponse({ success: false, error: message, code }, status, request);
}

/**
 * Validate base64 data URL format and extract MIME type
 */
function parseDataUrl(dataUrl: string): { mimeType: string; base64: string } | null {
  const match = dataUrl.match(/^data:(image\/[a-z+]+);base64,(.+)$/i);
  if (!match) return null;
  return { mimeType: match[1].toLowerCase(), base64: match[2] };
}

/**
 * Estimate base64 decoded size in bytes
 */
function estimateBase64Size(base64: string): number {
  // Remove padding and calculate: base64 chars * 0.75 = bytes
  const padding = (base64.match(/=+$/) || [""])[0].length;
  return Math.floor((base64.length * 3) / 4) - padding;
}

/**
 * Main request handler for Cloudflare Pages Function
 */
export async function onRequest(context: {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<unknown>) => void;
}): Promise<Response> {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return handleCORS(request);
  }

  // Only allow POST requests
  if (request.method !== "POST") {
    return errorResponse("Method not allowed. Use POST.", "METHOD_NOT_ALLOWED", 405, request);
  }

  try {
    // Validate API key is configured
    if (!env.ZAI_API_KEY) {
      console.error("❌ ZAI_API_KEY not configured in Cloudflare Secrets");
      return errorResponse(
        "Server configuration error: Z.ai API key not configured.",
        "CONFIG_ERROR",
        500,
        request,
      );
    }

    // Parse request body
    let body: VisionRequest;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON in request body", "INVALID_JSON", 400, request);
    }

    // Validate prompt
    if (!body.prompt || typeof body.prompt !== "string") {
      return errorResponse("'prompt' string is required", "MISSING_PROMPT", 400, request);
    }

    if (body.prompt.length > MAX_PROMPT_LENGTH) {
      return errorResponse(
        `Prompt too long (max ${MAX_PROMPT_LENGTH} characters)`,
        "PROMPT_TOO_LONG",
        400,
        request,
      );
    }

    // Validate image data URL
    if (!body.imageDataUrl || typeof body.imageDataUrl !== "string") {
      return errorResponse("'imageDataUrl' data URL is required", "MISSING_IMAGE", 400, request);
    }

    const parsed = parseDataUrl(body.imageDataUrl);
    if (!parsed) {
      return errorResponse(
        "Invalid image format. Expected data:image/..;base64,... URL",
        "INVALID_IMAGE_FORMAT",
        400,
        request,
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(parsed.mimeType)) {
      return errorResponse(
        `Unsupported image type: ${parsed.mimeType}. Allowed: PNG, JPEG, WebP, GIF`,
        "UNSUPPORTED_IMAGE_TYPE",
        400,
        request,
      );
    }

    // Validate image size
    const imageSize = estimateBase64Size(parsed.base64);
    if (imageSize > MAX_IMAGE_SIZE_BYTES) {
      const sizeMB = (imageSize / (1024 * 1024)).toFixed(1);
      return errorResponse(
        `Image too large: ${sizeMB} MB (max ${MAX_IMAGE_SIZE_MB} MB)`,
        "IMAGE_TOO_LARGE",
        413,
        request,
      );
    }

    console.log(
      `📤 Z.ai Vision request: prompt=${body.prompt.slice(0, 50)}..., image=${parsed.mimeType}, size=${(imageSize / 1024).toFixed(0)}KB`,
    );

    // Build Z.ai API request payload
    // Following Z.ai GLM-4.6v format: messages[].content is array of parts
    const zaiPayload = {
      model: ZAI_VISION_MODEL,
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
              text: body.prompt,
            },
          ],
        },
      ],
    };

    // Make request to Z.ai API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let zaiResponse: Response;
    try {
      zaiResponse = await fetch(ZAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.ZAI_API_KEY}`,
        },
        body: JSON.stringify(zaiPayload),
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return errorResponse(
          "Request timeout: Z.ai API took too long to respond",
          "TIMEOUT",
          504,
          request,
        );
      }
      throw fetchError;
    }
    clearTimeout(timeoutId);

    // Handle Z.ai API errors
    if (!zaiResponse.ok) {
      console.error(`❌ Z.ai API error: ${zaiResponse.status} ${zaiResponse.statusText}`);

      let errorMessage = `Z.ai API error: ${zaiResponse.status}`;
      let errorCode = "ZAI_API_ERROR";

      try {
        const errorData = await zaiResponse.json();
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData?.error) {
          errorMessage = typeof errorData.error === "string" ? errorData.error : errorMessage;
        }
      } catch {
        // Use default error message
      }

      // Map specific status codes
      if (zaiResponse.status === 401) {
        errorCode = "AUTH_ERROR";
        errorMessage = "Z.ai authentication failed";
      } else if (zaiResponse.status === 429) {
        errorCode = "RATE_LIMITED";
        errorMessage = "Z.ai rate limit exceeded. Please try again later.";
      } else if (zaiResponse.status === 413) {
        errorCode = "PAYLOAD_TOO_LARGE";
        errorMessage = "Image too large for Z.ai API";
      }

      return errorResponse(errorMessage, errorCode, zaiResponse.status, request);
    }

    // Parse successful response
    let responseData: {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
      usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
      };
    };

    try {
      responseData = await zaiResponse.json();
    } catch {
      return errorResponse("Failed to parse Z.ai response", "PARSE_ERROR", 502, request);
    }

    const text = responseData?.choices?.[0]?.message?.content;
    if (!text) {
      return errorResponse("No response content from Z.ai", "EMPTY_RESPONSE", 502, request);
    }

    console.log(`✅ Z.ai Vision response: ${text.slice(0, 100)}...`);

    return jsonResponse(
      {
        success: true,
        text,
        usage: responseData.usage,
      },
      200,
      request,
    );
  } catch (error) {
    console.error("❌ Unexpected error in /api/zai/vision:", error);

    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      "INTERNAL_ERROR",
      500,
      request,
    );
  }
}
