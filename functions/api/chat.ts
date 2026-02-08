/**
 * Cloudflare Function: /api/chat (SECURED)
 *
 * Proxies chat requests to OpenRouter API with security measures:
 * - HMAC-based authentication
 * - Origin/Referer validation
 * - Rate limiting (in-memory)
 * - Request validation (Zod)
 * - Abuse controls
 *
 * Environment Variables Required (Cloudflare Secrets):
 * - OPENROUTER_API_KEY: Your OpenRouter API key
 * - PROXY_SHARED_SECRET: Shared secret for HMAC verification
 *
 * @see docs/guides/PROXY_SECURITY.md
 */

import { z } from "zod";

interface Env {
  OPENROUTER_API_KEY: string;
  PROXY_SHARED_SECRET: string;
}

// =====================
// TYPES & SCHEMAS
// =====================

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const ChatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().max(10000), // Max 10 KB per message
});

interface ChatRequest {
  messages: ChatMessage[];
  model: string;
  stream?: boolean;
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  max_tokens?: number;
}

const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(50), // 1-50 messages
  model: z.string(),
  stream: z.boolean().optional().default(true),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  presence_penalty: z.number().min(-2).max(2).optional(),
  max_tokens: z.number().min(1).max(8192).optional(),
});

// =====================
// CONSTANTS
// =====================

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const ALLOWED_ORIGINS = ["https://disaai.de", "https://disa-ai.pages.dev"] as const;

const ALLOWED_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-2-9b-it:free",
  "mistralai/mistral-7b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "qwen/qwen-2.5-7b-instruct:free",
] as const;

const RATE_LIMIT_CONFIG = {
  requestsPerMinute: 60,
  windowMs: 60 * 1000, // 60 seconds
  maxConcurrentStreams: 3,
} as const;

const ABUSE_CONTROLS = {
  maxRequestBodySize: 100 * 1024, // 100 KB
  maxStreamDurationMs: 120 * 1000, // 120 seconds
  requestTimeoutMs: 60 * 1000, // 60 seconds
} as const;

// =====================
// RATE LIMITING (In-Memory)
// =====================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Simple in-memory rate limit tracker
const rateLimitMap = new Map<string, RateLimitEntry>();

function checkRateLimit(clientIp: string): { allowed: boolean; remaining?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);

  if (!entry || now > entry.resetTime) {
    // New window or expired
    rateLimitMap.set(clientIp, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.requestsPerMinute - 1 };
  }

  if (entry.count >= RATE_LIMIT_CONFIG.requestsPerMinute) {
    return { allowed: false };
  }

  // Increment counter
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_CONFIG.requestsPerMinute - entry.count };
}

// =====================
// ORIGIN VALIDATION
// =====================

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin as any);
}

function getCORSOrigin(request: Request): string {
  const origin = request.headers.get("Origin");
  return isAllowedOrigin(origin) ? origin! : ALLOWED_ORIGINS[0];
}

function isValidReferer(request: Request): boolean {
  const referer = request.headers.get("Referer");
  if (!referer) return false;

  const origin = request.headers.get("Origin") || "";
  try {
    const refererOrigin = new URL(referer).origin;
    return refererOrigin === origin && ALLOWED_ORIGINS.includes(refererOrigin as any);
  } catch {
    return false;
  }
}

// =====================
// HMAC VERIFICATION
// =====================

// Synchronous HMAC generation using crypto.subtle
// Note: This is async, but we'll use it properly
async function generateHMAC(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = encoder.encode(secret);
  const message = encoder.encode(data);

  const keyData = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", keyData, message);

  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyHMAC(
  body: string,
  signature: string,
  secret: string,
  timestamp: number,
): Promise<boolean> {
  // Check timestamp (prevent replay attacks)
  const now = Math.floor(Date.now() / 1000);
  const timestampWindow = 300; // 5 minutes

  if (Math.abs(now - timestamp) > timestampWindow) {
    return false;
  }

  const data = `${body}:${timestamp}`;
  const expectedSignature = await generateHMAC(data, secret);

  return signature === expectedSignature;
}

// =====================
// ABUSE CONTROLS
// =====================

async function validateRequestSize(request: Request): Promise<boolean> {
  try {
    const contentLength = request.headers.get("Content-Length");
    if (contentLength && parseInt(contentLength, 10) > ABUSE_CONTROLS.maxRequestBodySize) {
      return false;
    }

    const body = await request.text();
    return body.length <= ABUSE_CONTROLS.maxRequestBodySize;
  } catch {
    return false;
  }
}

function checkConcurrencyLimit(clientIp: string): { allowed: boolean; active: number } {
  const activeKey = `concurrent:${clientIp}`;
  const entry = rateLimitMap.get(activeKey);
  const active = entry?.count || 0;

  if (active >= RATE_LIMIT_CONFIG.maxConcurrentStreams) {
    return { allowed: false, active };
  }

  // Increment for new request
  if (entry) {
    entry.count++;
  } else {
    rateLimitMap.set(activeKey, { count: 1, resetTime: Date.now() + 3600000 });
  }

  return { allowed: true, active: active + 1 };
}

function decrementConcurrency(clientIp: string): void {
  const activeKey = `concurrent:${clientIp}`;
  const entry = rateLimitMap.get(activeKey);
  if (entry && entry.count > 0) {
    entry.count--;
  }
}

// =====================
// RESPONSE HELPERS
// =====================

function handleCORS(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": getCORSOrigin(request),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept, X-Proxy-Secret, X-Proxy-Timestamp",
      "Access-Control-Max-Age": "86400",
    },
  });
}

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

function rateLimitError(request: Request, remaining: number): Response {
  const origin = getCORSOrigin(request);
  return new Response(
    JSON.stringify({
      error: "Rate limit exceeded",
      retryAfter: RATE_LIMIT_CONFIG.windowMs / 1000,
      remaining,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
        "Retry-After": "60",
      },
    },
  );
}

// =====================
// MAIN HANDLER
// =====================

export async function onRequest(context: {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<any>) => void;
}): Promise<Response> {
  const { request, env, waitUntil: _waitUntil } = context;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return handleCORS(request);
  }

  // Only allow POST requests
  if (request.method !== "POST") {
    return jsonError("Method not allowed. Use POST.", 405, request);
  }

  try {
    // Validate environment variables
    if (!env.OPENROUTER_API_KEY) {
      console.error("❌ OPENROUTER_API_KEY not configured");
      return jsonError("Server configuration error: API key not configured", 500, request);
    }

    if (!env.PROXY_SHARED_SECRET) {
      console.error("❌ PROXY_SHARED_SECRET not configured");
      return jsonError("Server configuration error: Shared secret not configured", 500, request);
    }

    // Validate Origin and Referer
    const origin = request.headers.get("Origin");
    if (!isAllowedOrigin(origin)) {
      console.warn(`⚠️ Forbidden origin: ${origin}`);
      return jsonError("Forbidden origin", 403, request);
    }

    if (!isValidReferer(request)) {
      console.warn(`⚠️ Invalid referer for origin: ${origin}`);
      return jsonError("Invalid referer", 403, request);
    }

    // Validate request size
    const validSize = await validateRequestSize(request);
    if (!validSize) {
      console.warn("⚠️ Request size exceeds limit");
      return jsonError("Request size exceeds limit", 400, request);
    }

    // Get client IP for rate limiting
    const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";

    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      console.warn(`⚠️ Rate limit exceeded for IP: ${clientIp}`);
      return rateLimitError(request, rateLimitResult.remaining || 0);
    }

    // Check concurrency limit for streaming requests
    const concurrencyResult = checkConcurrencyLimit(clientIp);
    if (!concurrencyResult.allowed) {
      console.warn(`⚠️ Concurrency limit exceeded for IP: ${clientIp}`);
      return jsonError(
        "Too many concurrent requests. Please wait for current requests to complete.",
        429,
        request,
      );
    }

    // Re-read body (we consumed it for size validation)
    const requestBody = await request.text();

    // Parse request body
    let parsedBody: ChatRequest;
    try {
      parsedBody = JSON.parse(requestBody);
    } catch {
      return jsonError("Invalid JSON in request body", 400, request);
    }

    // Validate with Zod schema
    const validationResult = ChatRequestSchema.safeParse(parsedBody);
    if (!validationResult.success) {
      console.warn(`⚠️ Invalid request: ${JSON.stringify(validationResult.error.issues)}`);
      return jsonError(
        "Invalid request: " +
          validationResult.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
        400,
        request,
      );
    }

    // Manual model validation
    if (!ALLOWED_MODELS.includes(validationResult.data.model as any)) {
      console.warn(`⚠️ Invalid model: ${validationResult.data.model}`);
      return jsonError(
        `Model not allowed: ${validationResult.data.model}. Allowed models: ${ALLOWED_MODELS.join(", ")}`,
        400,
        request,
      );
    }

    // Verify HMAC signature
    const signature = request.headers.get("X-Proxy-Secret");
    const timestamp = request.headers.get("X-Proxy-Timestamp");

    if (!signature || !timestamp) {
      console.warn("⚠️ Missing authentication headers");
      return jsonError(
        "Missing authentication headers (X-Proxy-Secret, X-Proxy-Timestamp)",
        401,
        request,
      );
    }

    const timestampNum = parseInt(timestamp, 10);
    if (isNaN(timestampNum)) {
      return jsonError("Invalid timestamp format", 400, request);
    }

    const validHMAC = await verifyHMAC(
      requestBody,
      signature,
      env.PROXY_SHARED_SECRET,
      timestampNum,
    );

    if (!validHMAC) {
      console.warn("⚠️ Invalid HMAC signature");
      return jsonError("Invalid authentication signature", 401, request);
    }

    // Build OpenRouter request payload
    const openRouterPayload: Record<string, unknown> = {
      model: validationResult.data.model,
      messages: validationResult.data.messages,
      stream: validationResult.data.stream ?? true,
    };

    // Add optional parameters if provided
    if (validationResult.data.temperature !== undefined) {
      openRouterPayload.temperature = validationResult.data.temperature;
    }
    if (validationResult.data.top_p !== undefined) {
      openRouterPayload.top_p = validationResult.data.top_p;
    }
    if (validationResult.data.presence_penalty !== undefined) {
      openRouterPayload.presence_penalty = validationResult.data.presence_penalty;
    }
    if (validationResult.data.max_tokens !== undefined) {
      openRouterPayload.max_tokens = validationResult.data.max_tokens;
    }

    // Get origin for HTTP-Referer header
    const requestOrigin = origin || "https://disaai.de";

    // Log request (minimal for security)
    console.log(
      `✅ Proxying authenticated request: model=${validationResult.data.model}, ip=${clientIp}`,
    );

    // Make request to OpenRouter API
    const openRouterResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": requestOrigin,
        "X-Title": "Disa AI",
      },
      body: JSON.stringify(openRouterPayload),
    });

    // Check if OpenRouter request was successful
    if (!openRouterResponse.ok) {
      console.error(
        `❌ OpenRouter API error: ${openRouterResponse.status} ${openRouterResponse.statusText}`,
      );

      let errorMessage = `OpenRouter API error: ${openRouterResponse.status}`;
      try {
        const errorData = await openRouterResponse.json();
        if (errorData?.error) {
          errorMessage =
            typeof errorData.error === "string" ? errorData.error : errorData.error.message;
        }
      } catch {
        errorMessage = `OpenRouter API error: ${openRouterResponse.status} ${openRouterResponse.statusText}`;
      }

      decrementConcurrency(clientIp);

      return jsonError(errorMessage, openRouterResponse.status, request);
    }

    const corsOrigin = getCORSOrigin(request);

    // Handle streaming response
    if (validationResult.data.stream) {
      console.log("✅ Streaming response from OpenRouter");

      // Set up stream timeout
      const streamController = new AbortController();
      const timeoutId = setTimeout(() => {
        streamController.abort();
      }, ABUSE_CONTROLS.maxStreamDurationMs);

      const streamWithTimeout = new ReadableStream({
        async start(controller) {
          const reader = openRouterResponse.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              controller.enqueue(value);
            }

            controller.close();
          } catch (error: any) {
            if (error.name === "AbortError") {
              console.warn("⚠️ Stream timeout exceeded");
              controller.error(new Error("Stream timeout exceeded"));
            } else {
              controller.error(error);
            }
          } finally {
            clearTimeout(timeoutId);
            decrementConcurrency(clientIp);
          }
        },
      });

      return new Response(streamWithTimeout, {
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

    decrementConcurrency(clientIp);

    return new Response(JSON.stringify(responseData), {
      status: openRouterResponse.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
      },
    });
  } catch (error) {
    console.error("❌ Unexpected error in /api/chat:", error);

    // Get client IP for rate limit decrement
    const clientIp = context.request.headers.get("CF-Connecting-IP") || "unknown";
    decrementConcurrency(clientIp);

    return jsonError(
      error instanceof Error ? error.message : "Internal server error",
      500,
      context.request,
    );
  }
}
