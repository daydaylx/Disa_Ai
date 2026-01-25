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
  RATE_LIMIT_MAX_REQUESTS?: string;
  RATE_LIMIT_WINDOW_MS?: string;
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

// Allowed origins for CORS validation
const ALLOWED_ORIGINS = [
  "https://disaai.de",
  "https://disa-ai.pages.dev",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
];

// Rate limiting store (in-memory for Cloudflare Workers)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// API Key format validation
const API_KEY_PATTERN = /^sk-or-v1-[a-zA-Z0-9]{48}$/;

/**
 * Check if origin is allowed for CORS
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed.replace(/:\d+$/, "")));
}

/**
 * Get client IP address from request
 */
function getClientIP(request: Request): string {
  const cfConnectingIP = request.headers.get("CF-Connecting-IP");
  const xForwardedFor = request.headers.get("X-Forwarded-For");
  const xRealIP = request.headers.get("X-Real-IP");

  return cfConnectingIP || xForwardedFor?.split(",")[0]?.trim() || xRealIP || "unknown";
}

/**
 * Check rate limit for client IP
 */
function checkRateLimit(env: Env, ip: string): { allowed: boolean; retryAfter?: number } {
  const maxRequests = parseInt(env.RATE_LIMIT_MAX_REQUESTS || "100", 10);
  const windowMs = parseInt(env.RATE_LIMIT_WINDOW_MS || "60000", 10); // 1 minute default

  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment counter
  record.count++;
  return { allowed: true };
}

/**
 * Validate API key format
 */
function isValidAPIKey(apiKey: string): boolean {
  return API_KEY_PATTERN.test(apiKey) || apiKey.startsWith("sk-or-v1-");
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
function jsonError(message: string, status: number, request?: Request): Response {
  const origin = request ? getCORSOrigin(request) : "*";
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
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

  // Only allow POST requests
  if (request.method !== "POST") {
    return jsonError("Method not allowed. Use POST.", 405, request);
  }

  try {
    // Validate API key is configured and has correct format
    if (!env.OPENROUTER_API_KEY) {
      console.error("❌ OPENROUTER_API_KEY not configured in Cloudflare Secrets");
      return jsonError(
        "Server configuration error: API key not configured. Please set OPENROUTER_API_KEY in Cloudflare Dashboard.",
        500,
        request,
      );
    }

    if (!isValidAPIKey(env.OPENROUTER_API_KEY)) {
      console.error("❌ OPENROUTER_API_KEY has invalid format");
      return jsonError(
        "Server configuration error: API key has invalid format. Please check OPENROUTER_API_KEY in Cloudflare Dashboard.",
        500,
        request,
      );
    }

    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitCheck = checkRateLimit(env, clientIP);

    if (!rateLimitCheck.allowed) {
      console.warn(`⚠️ Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: rateLimitCheck.retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": getCORSOrigin(request),
            "Retry-After": String(rateLimitCheck.retryAfter),
          },
        },
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

    // Validate messages structure
    for (const msg of body.messages) {
      if (!msg.role || !["system", "user", "assistant"].includes(msg.role)) {
        return jsonError(
          `Invalid message role: ${msg.role}. Must be 'system', 'user', or 'assistant'`,
          400,
          request,
        );
      }
      if (typeof msg.content !== "string" || msg.content.trim().length === 0) {
        return jsonError(`Invalid message content: must be a non-empty string`, 400, request);
      }
    }

    // Validate temperature range
    if (body.temperature !== undefined && (body.temperature < 0 || body.temperature > 2)) {
      return jsonError(
        `Invalid temperature: must be between 0 and 2, got ${body.temperature}`,
        400,
        request,
      );
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

      return jsonError(errorMessage, openRouterResponse.status, request);
    }

    const corsOrigin = getCORSOrigin(request);

    // Handle streaming response
    if (body.stream) {
      console.log("✅ Streaming response from OpenRouter");
      return new Response(openRouterResponse.body, {
        status: openRouterResponse.status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": corsOrigin,
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
        "Access-Control-Allow-Origin": corsOrigin,
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
