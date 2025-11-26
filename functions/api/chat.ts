import type {
  IncomingRequestCfProperties,
  PagesFunction,
  Request,
} from "@cloudflare/workers-types";

import {
  buildOpenRouterUrl,
  DEFAULT_OPENROUTER_BASE_URL,
  OPENROUTER_CHAT_PATH,
} from "../../shared/openrouter";

const ALLOWED_ORIGIN = "https://disaai.de";
const _RATE_LIMIT_WINDOW_MS = 60_000;
const _RATE_LIMIT_MAX_REQUESTS = 20;

// Import allowed models from models.ts to avoid duplication
import { ALLOWED_FREE_MODEL_IDS } from "./models";

// Default model when client sends invalid model
const DEFAULT_FREE_MODEL = "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";

// Hard caps for security
const MAX_TOKENS_CAP = 1200;
const MAX_TEMPERATURE = 1.2;
const MIN_TEMPERATURE = 0.0;

// Soft rate limiting
const BURST_LIMIT_MS = 3000; // Minimum 3 seconds between requests
const DAILY_BUDGET = 40; // 40 requests per day per IP
const _SOFT_THROTTLE_COOLDOWN_MS = 90000; // 90 seconds cooldown

interface Env {
  OPENROUTER_API_KEY: string;
  OPENROUTER_BASE_URL?: string;
  RATE_LIMIT_KV: KVNamespace; // Cloudflare KV namespace for rate limiting
}

interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  presence_penalty?: number;
}

const createCorsHeaders = (origin: string | null) => {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "content-type, accept");
  headers.set("Access-Control-Max-Age", "86400");
  if (origin === ALLOWED_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  return headers;
};

const getClientIdentifier = async (
  request: Request<unknown, IncomingRequestCfProperties<unknown>>,
  salt: string = "disaai-rate-limit-v1", // Default salt for privacy
) => {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for") ??
    "anonymous";

  // Use crypto.subtle for secure, GDPR-compliant hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHex.substring(0, 16);
};

// Enhanced rate limiting with soft throttling
const checkRateLimits = async (
  clientId: string,
  kv: KVNamespace,
): Promise<{
  allowed: boolean;
  throttleType?: "burst" | "daily" | "soft";
  message?: string;
}> => {
  const now = Date.now();

  // Check burst limit (minimum time between requests)
  const burstKey = `burst:${clientId}`;
  try {
    const lastRequest = await kv.get(burstKey, { type: "json" });
    if (lastRequest && now - lastRequest < BURST_LIMIT_MS) {
      return {
        allowed: false,
        throttleType: "burst",
        message: "Hohe Auslastung. Bitte kurz neu versuchen.",
      };
    }
  } catch (error) {
    console.warn("Burst limit check failed:", error);
  }

  // Check daily budget
  const dailyKey = `daily:${clientId}:${Math.floor(now / 86400000)}`; // Key per day
  try {
    const storedData = await kv.get(dailyKey, { type: "json" });
    let requestCount = storedData || 0;

    if (requestCount >= DAILY_BUDGET) {
      return {
        allowed: false,
        throttleType: "daily",
        message: "Hohe Auslastung. Bitte kurz neu versuchen.",
      };
    }

    // Update counters
    await kv.put(burstKey, JSON.stringify(now), { expirationTtl: 86400 });
    await kv.put(dailyKey, JSON.stringify(requestCount + 1), { expirationTtl: 86400 });
  } catch (error) {
    console.error("Daily limit check failed:", error);
    // Fail open - allow request if KV is unavailable
  }

  return { allowed: true };
};

// Validate and sanitize request
const validateRequest = (payload: unknown): ChatRequest | null => {
  try {
    if (!payload || typeof payload !== "object") return null;

    const data = payload as any;
    if (!Array.isArray(data.messages)) return null;

    // Validate messages
    const messages = data.messages
      .map((msg: any) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: String(msg.content || ""),
      }))
      .filter((msg) => ["user", "assistant", "system"].includes(msg.role));

    if (messages.length === 0) return null;

    // Validate and sanitize model
    let model = DEFAULT_FREE_MODEL;
    if (typeof data.model === "string" && ALLOWED_FREE_MODEL_IDS.includes(data.model)) {
      model = data.model;
    }

    // Validate and sanitize parameters
    const temperature =
      typeof data.temperature === "number"
        ? Math.max(MIN_TEMPERATURE, Math.min(MAX_TEMPERATURE, data.temperature))
        : undefined;

    const max_tokens =
      typeof data.max_tokens === "number"
        ? Math.min(MAX_TOKENS_CAP, Math.max(1, data.max_tokens))
        : undefined;

    const top_p = typeof data.top_p === "number" ? Math.max(0, Math.min(1, data.top_p)) : undefined;

    const presence_penalty =
      typeof data.presence_penalty === "number"
        ? Math.max(-2, Math.min(2, data.presence_penalty))
        : undefined;

    return {
      messages,
      model,
      temperature,
      max_tokens,
      top_p,
      presence_penalty,
    };
  } catch (error) {
    console.error("Request validation failed:", error);
    return null;
  }
};

// Log request metadata (no chat content)
const logRequest = async (
  clientId: string,
  model: string,
  tokenUsage: number,
  status: number,
  kv: KVNamespace,
) => {
  try {
    const now = Date.now();
    const logEntry = {
      timestamp: now,
      model,
      tokenUsage,
      status,
      date: new Date(now).toISOString().split("T")[0],
    };

    // Store daily logs (keep for 7 days)
    const logKey = `logs:${clientId}:${Math.floor(now / 86400000)}`;
    const existingLogs = (await kv.get(logKey, { type: "json" })) || [];
    existingLogs.push(logEntry);

    await kv.put(logKey, JSON.stringify(existingLogs), {
      expirationTtl: 7 * 86400, // 7 days
    });
  } catch (error) {
    console.warn("Request logging failed:", error);
  }
};

export const onRequestOptions: PagesFunction = async ({ request }) => {
  const corsHeaders = createCorsHeaders(request.headers.get("Origin"));
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const origin = request.headers.get("Origin");
  const corsHeaders = createCorsHeaders(origin);

  if (!env.OPENROUTER_API_KEY) {
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(JSON.stringify({ error: "Missing server configuration." }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  const clientId = await getClientIdentifier(request);

  // Check enhanced rate limits
  const rateLimitResult = await checkRateLimits(clientId, env.RATE_LIMIT_KV);
  if (!rateLimitResult.allowed) {
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(
      JSON.stringify({
        error: rateLimitResult.message || "Hohe Auslastung. Bitte kurz neu versuchen.",
      }),
      {
        status: 429,
        headers: corsHeaders,
      },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(JSON.stringify({ error: "Invalid JSON payload." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Validate request
  const validatedRequest = validateRequest(payload);
  if (!validatedRequest) {
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(JSON.stringify({ error: "Ungültige Anfrage." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  let upstreamResponse: Response;
  try {
    const acceptHeader = request.headers.get("Accept") || undefined;
    const upstreamUrl = buildOpenRouterUrl(
      env.OPENROUTER_BASE_URL ?? DEFAULT_OPENROUTER_BASE_URL,
      OPENROUTER_CHAT_PATH,
    );

    const upstreamHeaders: Record<string, string> = {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://disaai.de",
      "X-Title": "DisaAI",
    };
    if (acceptHeader) {
      upstreamHeaders["Accept"] = acceptHeader;
    }

    upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      body: JSON.stringify(validatedRequest),
      headers: upstreamHeaders,
    });

    // Log request metadata
    const tokenUsage = await upstreamResponse
      .clone()
      .json()
      .then((data) => data?.usage?.total_tokens || 0)
      .catch(() => 0);

    await logRequest(
      clientId,
      validatedRequest.model,
      tokenUsage,
      upstreamResponse.status,
      env.RATE_LIMIT_KV,
    );
  } catch (error) {
    console.error("Failed to reach OpenRouter", error);
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(JSON.stringify({ error: "Unable to reach the chat service." }), {
      status: 502,
      headers: corsHeaders,
    });
  }

  const responseHeaders = new Headers(corsHeaders);
  responseHeaders.set("Cache-Control", "no-store");
  responseHeaders.set(
    "Content-Type",
    upstreamResponse.headers.get("content-type") ?? "application/json",
  );

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
};
