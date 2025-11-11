import type { PagesFunction } from "@cloudflare/workers-types";

const ALLOWED_ORIGIN = "https://disaai.de";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitState = new Map<string, number[]>();

interface Env {
  OPENROUTER_API_KEY: string;
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

const isRateLimited = (clientId: string) => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const requestTimes = rateLimitState.get(clientId) ?? [];
  const filteredTimes = requestTimes.filter((timestamp) => timestamp > windowStart);

  if (filteredTimes.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitState.set(clientId, filteredTimes);
    return true;
  }

  filteredTimes.push(now);
  if (filteredTimes.length > RATE_LIMIT_MAX_REQUESTS) {
    filteredTimes.splice(0, filteredTimes.length - RATE_LIMIT_MAX_REQUESTS);
  }
  rateLimitState.set(clientId, filteredTimes);
  return false;
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
  if (isRateLimited(clientId)) {
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
    const upstreamHeaders: Record<string, string> = {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://disaai.de",
      "X-Title": "DisaAI",
    };
    if (acceptHeader) {
      upstreamHeaders["Accept"] = acceptHeader;
    }

    upstreamResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
