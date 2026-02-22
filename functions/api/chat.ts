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
const OPENROUTER_MODELS_API_URL = "https://openrouter.ai/api/v1/models";

const ALLOWED_ORIGINS = ["https://disaai.de", "https://disa-ai.pages.dev"] as const;

// Cloudflare Pages preview deployments use <hash>.disa-ai.pages.dev
const PAGES_PREVIEW_PATTERN = /^https:\/\/[a-f0-9]+\.disa-ai\.pages\.dev$/;

const MODEL_SUFFIX_FREE = ":free";
const MODELS_FETCH_TIMEOUT_MS = 15000;
const MODEL_FALLBACK_MAX_ATTEMPTS = 3;

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

interface OpenRouterErrorPayload {
  error?: string | { message?: string };
  message?: string;
}

interface OpenRouterModelCatalogEntry {
  id?: unknown;
}

interface OpenRouterModelsResponse {
  data?: OpenRouterModelCatalogEntry[];
}

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
  if (ALLOWED_ORIGINS.includes(origin as any)) return true;
  // Support Cloudflare Pages preview deployments (e.g. abc123.disa-ai.pages.dev)
  return PAGES_PREVIEW_PATTERN.test(origin);
}

function getCORSOrigin(request: Request): string {
  const origin = request.headers.get("Origin");
  if (origin && isAllowedOrigin(origin)) return origin;
  return ALLOWED_ORIGINS[0];
}

function isValidReferer(request: Request): boolean {
  const referer = request.headers.get("Referer");
  if (!referer) return false;

  const origin = request.headers.get("Origin") || "";
  try {
    const refererOrigin = new URL(referer).origin;
    return refererOrigin === origin && isAllowedOrigin(refererOrigin);
  } catch {
    return false;
  }
}

function getRequestOrigin(origin: string | null): string {
  return origin || "https://disaai.de";
}

function isFreeModelId(modelId: string): boolean {
  return modelId.endsWith(MODEL_SUFFIX_FREE);
}

function buildFallbackModelCandidates(primaryModel: string, freeModelIds: Set<string>): string[] {
  return Array.from(freeModelIds)
    .filter((modelId) => modelId !== primaryModel)
    .sort((a, b) => a.localeCompare(b));
}

function isRetryableModelFailure(status: number, message: string): boolean {
  if (status === 402 || status === 404) return true;
  if (status !== 429) return false;

  const normalized = message.toLowerCase();
  return (
    normalized.includes("temporarily rate-limited upstream") ||
    normalized.includes("provider returned error") ||
    normalized.includes("no endpoints found")
  );
}

async function parseOpenRouterError(
  response: Response,
): Promise<{ status: number; message: string }> {
  let errorMessage = `OpenRouter API error: ${response.status} ${response.statusText}`;

  try {
    const errorData = (await response.json()) as OpenRouterErrorPayload;
    if (errorData?.error) {
      errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : errorData.error.message || errorMessage;
    } else if (typeof errorData?.message === "string" && errorData.message.trim().length > 0) {
      errorMessage = errorData.message;
    }
  } catch {
    // Ignore JSON parsing errors and keep status-based fallback message.
  }

  return { status: response.status, message: errorMessage };
}

async function fetchLiveFreeModelIds(apiKey: string, requestOrigin: string): Promise<Set<string>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, MODELS_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_MODELS_API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": requestOrigin,
        "X-Title": "Disa AI",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const parsedError = await parseOpenRouterError(response);
      throw new Error(
        `Unable to fetch OpenRouter model catalog (${parsedError.status}): ${parsedError.message}`,
      );
    }

    const payload = (await response.json()) as OpenRouterModelsResponse;
    const freeModelIds = new Set<string>();

    for (const entry of payload.data ?? []) {
      const modelId = typeof entry?.id === "string" ? entry.id : "";
      if (modelId && isFreeModelId(modelId)) {
        freeModelIds.add(modelId);
      }
    }

    if (freeModelIds.size === 0) {
      throw new Error("OpenRouter model catalog returned no free models.");
    }

    return freeModelIds;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function sendOpenRouterChatRequest(
  apiKey: string,
  requestOrigin: string,
  payload: Record<string, unknown>,
): Promise<Response> {
  return fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": requestOrigin,
      "X-Title": "Disa AI",
    },
    body: JSON.stringify(payload),
  });
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

function isRequestBodySizeAllowed(request: Request, requestBody: string): boolean {
  const contentLength = request.headers.get("Content-Length");
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (!Number.isNaN(size) && size > ABUSE_CONTROLS.maxRequestBodySize) {
      return false;
    }
  }

  return requestBody.length <= ABUSE_CONTROLS.maxRequestBodySize;
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

  // Track streaming concurrency so we can always decrement on errors.
  let concurrencyAcquired = false;
  let concurrencyClientIp = "unknown";

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

    const requestOrigin = getRequestOrigin(origin);

    // Reject oversized requests early (best-effort)
    const contentLength = request.headers.get("Content-Length");
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      if (!Number.isNaN(size) && size > ABUSE_CONTROLS.maxRequestBodySize) {
        console.warn("⚠️ Request size exceeds limit (Content-Length)");
        return jsonError("Request size exceeds limit", 400, request);
      }
    }

    // Read body once (Request body streams can only be consumed once)
    const requestBody = await request.text();

    // Validate request size (body length)
    if (!isRequestBodySizeAllowed(request, requestBody)) {
      console.warn("⚠️ Request size exceeds limit (body length)");
      return jsonError("Request size exceeds limit", 400, request);
    }

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

    // Cheap pre-check: only free models are allowed.
    if (!isFreeModelId(validationResult.data.model)) {
      console.warn(`⚠️ Non-free model rejected: ${validationResult.data.model}`);
      return jsonError(
        `Model not allowed: ${validationResult.data.model}. Only free OpenRouter models (:free) are supported.`,
        400,
        request,
      );
    }

    // Get client IP for abuse controls
    const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
    concurrencyClientIp = clientIp;

    // Check rate limit (cheap, before HMAC)
    const rateLimitResult = checkRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      console.warn(`⚠️ Rate limit exceeded for IP: ${clientIp}`);
      return rateLimitError(request, rateLimitResult.remaining || 0);
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

    // Fresh model check: always validate against OpenRouter's current free model catalog.
    let liveFreeModelIds: Set<string>;
    try {
      liveFreeModelIds = await fetchLiveFreeModelIds(env.OPENROUTER_API_KEY, requestOrigin);
    } catch (error) {
      console.error("❌ Failed to fetch live free models:", error);
      return jsonError(
        "OpenRouter model catalog unavailable. Please retry in a few seconds.",
        503,
        request,
      );
    }

    if (!liveFreeModelIds.has(validationResult.data.model)) {
      console.warn(`⚠️ Model not in live free catalog: ${validationResult.data.model}`);
      return jsonError(
        `Model not allowed: ${validationResult.data.model}. Please choose a currently available free OpenRouter model.`,
        400,
        request,
      );
    }

    // Concurrency limit is only meaningful for streaming (long-lived) requests.
    const wantsStream = Boolean(validationResult.data.stream ?? true);
    concurrencyAcquired = false;

    if (wantsStream) {
      const concurrencyResult = checkConcurrencyLimit(clientIp);
      if (!concurrencyResult.allowed) {
        console.warn(`⚠️ Concurrency limit exceeded for IP: ${clientIp}`);
        return jsonError(
          "Too many concurrent requests. Please wait for current requests to complete.",
          429,
          request,
        );
      }
      concurrencyAcquired = true;
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

    // Log request (minimal for security)
    let activeModel = validationResult.data.model;
    console.log(`✅ Proxying authenticated request: model=${activeModel}, ip=${clientIp}`);

    let openRouterResponse = await sendOpenRouterChatRequest(
      env.OPENROUTER_API_KEY,
      requestOrigin,
      openRouterPayload,
    );

    let fallbackAttempts = 0;
    let fallbackCandidateIndex = 0;
    const fallbackCandidates = buildFallbackModelCandidates(activeModel, liveFreeModelIds);
    let lastOpenRouterError = {
      status: openRouterResponse.status,
      message: `OpenRouter API error: ${openRouterResponse.status}`,
    };

    while (!openRouterResponse.ok) {
      lastOpenRouterError = await parseOpenRouterError(openRouterResponse);
      const canRetryModel = isRetryableModelFailure(
        lastOpenRouterError.status,
        lastOpenRouterError.message,
      );
      const nextFallbackModel = fallbackCandidates[fallbackCandidateIndex];

      if (!canRetryModel || !nextFallbackModel || fallbackAttempts >= MODEL_FALLBACK_MAX_ATTEMPTS) {
        break;
      }

      fallbackAttempts += 1;
      fallbackCandidateIndex += 1;
      activeModel = nextFallbackModel;
      openRouterPayload.model = activeModel;

      console.warn(
        `⚠️ Retrying with fallback model (${fallbackAttempts}/${MODEL_FALLBACK_MAX_ATTEMPTS}): ${activeModel}`,
      );

      openRouterResponse = await sendOpenRouterChatRequest(
        env.OPENROUTER_API_KEY,
        requestOrigin,
        openRouterPayload,
      );
    }

    if (!openRouterResponse.ok) {
      console.error(
        `❌ OpenRouter API error after ${fallbackAttempts} fallback attempt(s): ${lastOpenRouterError.status} ${lastOpenRouterError.message}`,
      );

      if (concurrencyAcquired) {
        decrementConcurrency(clientIp);
        concurrencyAcquired = false;
      }

      return jsonError(lastOpenRouterError.message, lastOpenRouterError.status, request);
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
            if (concurrencyAcquired) {
              decrementConcurrency(clientIp);
              concurrencyAcquired = false;
            }
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

    if (concurrencyAcquired) {
      decrementConcurrency(clientIp);
      concurrencyAcquired = false;
    }

    return new Response(JSON.stringify(responseData), {
      status: openRouterResponse.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
      },
    });
  } catch (error) {
    console.error("❌ Unexpected error in /api/chat:", error);

    if (concurrencyAcquired) {
      decrementConcurrency(concurrencyClientIp);
      concurrencyAcquired = false;
    }

    return jsonError(
      error instanceof Error ? error.message : "Internal server error",
      500,
      context.request,
    );
  }
}
