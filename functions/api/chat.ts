import type { PagesFunction } from "@cloudflare/workers-types";

import {
  buildOpenRouterUrl,
  DEFAULT_OPENROUTER_BASE_URL,
  OPENROUTER_CHAT_PATH,
} from "../../shared/openrouter";

const ALLOWED_ORIGIN = "https://disaai.de";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

interface Env {
  OPENROUTER_API_KEY: string;
  OPENROUTER_BASE_URL?: string;
  RATE_LIMIT_KV: KVNamespace; // Cloudflare KV namespace for rate limiting
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

const getClientIdentifier = (request: Request) =>
  request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "anonymous";

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

  const clientId = getClientIdentifier(request);
  if (await isRateLimited(clientId, env.RATE_LIMIT_KV)) {
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(JSON.stringify({ error: "Too many requests. Please slow down." }), {
      status: 429,
      headers: corsHeaders,
    });
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
    upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: upstreamHeaders,
    });
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
