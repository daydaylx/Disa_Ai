import type { PagesFunction } from "@cloudflare/workers-types";

import {
  buildOpenRouterUrl,
  DEFAULT_OPENROUTER_BASE_URL,
  OPENROUTER_CHAT_PATH,
} from "../../shared/openrouter";
// Import free model allowlist and parameter caps
import { clampModelParams, DEFAULT_FREE_MODEL, getSafeModelId } from "../../src/config/freeModels";

const ALLOWED_ORIGIN = "https://disaai.de";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const DAILY_BUDGET = 50; // Daily request budget per IP/Device
const SOFT_THROTTLE_COOLDOWN_MS = 120_000; // 2 minutes cooldown when budget exceeded
const SOFT_THROTTLE_TOKEN_REDUCTION = 300; // Reduced max_tokens when throttled

interface Env {
  OPENROUTER_API_KEY: string;
  OPENROUTER_BASE_URL?: string;
  RATE_LIMIT_KV: KVNamespace; // Cloudflare KV namespace for rate limiting
  DAILY_BUDGET_KV: KVNamespace; // Cloudflare KV namespace for daily budget tracking
}

const createCorsHeaders = (origin: string | null) => {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "content-type, accept");
  headers.set("Access-Control-Max-Age", "86400");
  if (origin === ALLOWED_ORIGIN || isTrustedOrigin(origin)) {
    headers.set("Access-Control-Allow-Origin", origin || ALLOWED_ORIGIN);
    headers.set("Vary", "Origin");
  }
  return headers;
};

const getClientIdentifier = (request: Request) => {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for") ??
    "anonymous";
  // Use a simple hash to anonymize the IP for logging
  return `ip_${simpleHash(ip)}`;
};

/**
 * Simple hash function to anonymize client identifiers
 */
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Rate limiting using Cloudflare KV
const isRateLimited = async (clientId: string, kv: KVNamespace) => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const key = `ratelimit:${clientId}`;

  try {
    // Get existing request times from KV
    const storedData = await kv.get(key, { type: "json" });
    let requestTimes: number[] = storedData || [];

    // Filter requests within the current window
    requestTimes = requestTimes.filter((timestamp) => timestamp > windowStart);

    // Check if rate limit is exceeded
    if (requestTimes.length >= RATE_LIMIT_MAX_REQUESTS) {
      return true;
    }

    // Add current request time
    requestTimes.push(now);

    // Store updated request times back to KV with expiration
    await kv.put(key, JSON.stringify(requestTimes), {
      expirationTtl: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000), // TTL in seconds
    });

    return false;
  } catch (error) {
    console.error("Rate limiting error:", error);
    // Fail open - if KV is unavailable, allow the request to proceed
    return false;
  }
};

/**
 * Check if client has exceeded daily budget
 */
const isDailyBudgetExceeded = async (clientId: string, kv: KVNamespace): Promise<boolean> => {
  try {
    const key = `dailybudget:${clientId}`;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const budgetKey = `${key}:${today}`;

    // Get current count for today
    const count = await kv.get(budgetKey);
    const currentCount = count ? parseInt(count, 10) : 0;

    return currentCount >= DAILY_BUDGET;
  } catch (error) {
    console.error("Daily budget check error:", error);
    // Fail open - if KV is unavailable, allow the request to proceed
    return false;
  }
};

/**
 * Increment daily budget counter
 */
const incrementDailyBudget = async (clientId: string, kv: KVNamespace): Promise<void> => {
  try {
    const key = `dailybudget:${clientId}`;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const budgetKey = `${key}:${today}`;

    // Get current count for today
    const count = await kv.get(budgetKey);
    const currentCount = count ? parseInt(count, 10) : 0;

    // Increment and store with 24h expiration
    await kv.put(budgetKey, (currentCount + 1).toString(), {
      expirationTtl: 86400, // 24 hours in seconds
    });
  } catch (error) {
    console.error("Daily budget increment error:", error);
    // Fail silently - don't block the request
  }
};

/**
 * Check if client is in soft throttle mode (cooldown period)
 */
const isSoftThrottled = async (clientId: string, kv: KVNamespace): Promise<boolean> => {
  try {
    const key = `softthrottle:${clientId}`;
    const throttleData = await kv.get(key, { type: "json" });

    if (throttleData) {
      const { until } = throttleData as { until: number };
      return Date.now() < until;
    }

    return false;
  } catch (error) {
    console.error("Soft throttle check error:", error);
    return false;
  }
};

/**
 * Set soft throttle for client
 */
const setSoftThrottle = async (clientId: string, kv: KVNamespace): Promise<void> => {
  try {
    const key = `softthrottle:${clientId}`;
    const until = Date.now() + SOFT_THROTTLE_COOLDOWN_MS;

    await kv.put(key, JSON.stringify({ until }), {
      expirationTtl: Math.ceil(SOFT_THROTTLE_COOLDOWN_MS / 1000),
    });
  } catch (error) {
    console.error("Soft throttle set error:", error);
  }
};

/**
 * Validate payload structure
 */
function isValidPayload(payload: unknown): payload is {
  messages: Array<{ role: string; content: string }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
} {
  if (!payload || typeof payload !== "object") return false;

  const { messages } = payload as { messages?: unknown };

  return (
    Array.isArray(messages) &&
    messages.every(
      (msg) =>
        msg &&
        typeof msg === "object" &&
        typeof msg.role === "string" &&
        typeof msg.content === "string",
    )
  );
}

/**
 * Check if origin is trusted
 */
function isTrustedOrigin(origin: string | null): boolean {
  if (!origin) return false;

  try {
    const url = new URL(origin);
    return (
      url.hostname === "disaai.de" ||
      url.hostname === "www.disaai.de" ||
      url.hostname === "localhost" ||
      url.hostname.endsWith(".localhost") ||
      url.hostname === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

export const onRequestOptions: PagesFunction = async ({ request }) => {
  const corsHeaders = createCorsHeaders(request.headers.get("Origin"));
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const origin = request.headers.get("Origin");
  const corsHeaders = createCorsHeaders(origin);

  // Validate origin for security
  if (!isTrustedOrigin(origin)) {
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(JSON.stringify({ error: "Untrusted origin." }), {
      status: 403,
      headers: corsHeaders,
    });
  }

  if (!env.OPENROUTER_API_KEY) {
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(JSON.stringify({ error: "Missing server configuration." }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  const clientId = getClientIdentifier(request);

  // Check hard rate limit (burst protection)
  if (await isRateLimited(clientId, env.RATE_LIMIT_KV)) {
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(
      JSON.stringify({
        error: "Zu viele Anfragen. Bitte kurz warten und erneut versuchen.",
      }),
      {
        status: 429,
        headers: corsHeaders,
      },
    );
  }

  // Check daily budget
  const dailyBudgetExceeded = await isDailyBudgetExceeded(clientId, env.DAILY_BUDGET_KV);

  // Check soft throttle (cooldown period)
  let isThrottled = await isSoftThrottled(clientId, env.RATE_LIMIT_KV);

  // If budget exceeded and not in cooldown, set soft throttle
  if (dailyBudgetExceeded && !isThrottled) {
    await setSoftThrottle(clientId, env.RATE_LIMIT_KV);
    isThrottled = true;
  }

  // If throttled, apply soft limits
  if (isThrottled) {
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(
      JSON.stringify({
        error: "Hohe Auslastung. Bitte kurz neu versuchen.",
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
    return new Response(JSON.stringify({ error: "Ungültige JSON-Nutzlast." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Validate payload structure
  if (!isValidPayload(payload)) {
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(
      JSON.stringify({
        error:
          "Ungültige Anfragestruktur. Erwartet: { messages: Array, model?: string, temperature?: number, max_tokens?: number }",
      }),
      {
        status: 400,
        headers: corsHeaders,
      },
    );
  }

  // Extract and validate model
  const model = getSafeModelId(payload.model || DEFAULT_FREE_MODEL);

  // Clamp model parameters to safe ranges
  const { max_tokens, temperature } = clampModelParams({
    max_tokens: payload.max_tokens,
    temperature: payload.temperature,
  });

  // Override payload with safe values
  const safePayload = {
    ...payload,
    model,
    max_tokens,
    temperature,
    stream: true, // Force streaming for better UX
  };

  let upstreamResponse: Response;
  try {
    const acceptHeader = request.headers.get("Accept");
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

    // Log request metadata (no sensitive data)
    console.log(`Proxy request: client=${clientId}, model=${model}, max_tokens=${max_tokens}`);

    upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      body: JSON.stringify(safePayload),
      headers: upstreamHeaders,
    });

    // Increment daily budget counter after successful request
    await incrementDailyBudget(clientId, env.DAILY_BUDGET_KV);
  } catch (error) {
    console.error("Failed to reach OpenRouter", error);
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(
      JSON.stringify({
        error: "Der Chat-Service ist vorübergehend nicht verfügbar.",
      }),
      {
        status: 502,
        headers: corsHeaders,
      },
    );
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
