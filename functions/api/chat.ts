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

// Allowed origins for CORS (reserved for future CORS validation)
const _ALLOWED_ORIGINS = [
  "https://disaai.de",
  "https://disa-ai.pages.dev",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
];

/**
 * Handle CORS preflight requests
 */
function handleCORS(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/**
 * Return JSON error response with CORS headers
 */
function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
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
    return handleCORS();
  }

  // Only allow POST requests
  if (request.method !== "POST") {
    return jsonError("Method not allowed. Use POST.", 405);
  }

  try {
    // Validate API key is configured
    if (!env.OPENROUTER_API_KEY) {
      console.error("❌ OPENROUTER_API_KEY not configured in Cloudflare Secrets");
      return jsonError(
        "Server configuration error: API key not configured. Please set OPENROUTER_API_KEY in Cloudflare Dashboard.",
        500,
      );
    }

    // Parse request body
    let body: ChatRequest;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON in request body", 400);
    }

    // Validate required fields
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return jsonError("Invalid request: 'messages' array is required and must not be empty", 400);
    }

    if (!body.model || typeof body.model !== "string") {
      return jsonError("Invalid request: 'model' string is required", 400);
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
    const origin = request.headers.get("origin") || "https://disaai.de";

    // Log request for debugging (remove in production if too verbose)
    console.log(`📤 Proxying request to OpenRouter: model=${body.model}, stream=${body.stream}`);

    // Make request to OpenRouter API
    const openRouterResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": origin,
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

      return jsonError(errorMessage, openRouterResponse.status);
    }

    // Handle streaming response
    if (body.stream) {
      console.log("✅ Streaming response from OpenRouter");
      return new Response(openRouterResponse.body, {
        status: openRouterResponse.status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
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
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("❌ Unexpected error in /api/chat:", error);

    return jsonError(error instanceof Error ? error.message : "Internal server error", 500);
  }
}
