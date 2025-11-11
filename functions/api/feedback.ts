import type { PagesFunction } from "@cloudflare/workers-types";

const ALLOWED_ORIGIN = "https://disaai.de";

interface Env {
  feedback: KVNamespace;
}

interface FeedbackPayload {
  message: string;
  email?: string;
  metadata?: unknown;
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

const validatePayload = (data: unknown): data is FeedbackPayload => {
  if (!data || typeof data !== "object") {
    return false;
  }

  const { message, email } = data as FeedbackPayload;
  if (typeof message !== "string" || message.trim().length === 0) {
    return false;
  }

  if (email !== undefined && typeof email !== "string") {
    return false;
  }

  return true;
};

export const onRequestOptions: PagesFunction = async ({ request }) => {
  const corsHeaders = createCorsHeaders(request.headers.get("Origin"));
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get("Origin");
  const corsHeaders = createCorsHeaders(origin);

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

  if (!validatePayload(payload)) {
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(JSON.stringify({ error: "Invalid feedback payload." }), {
      status: 422,
      headers: corsHeaders,
    });
  }

  const feedbackPayload = payload as FeedbackPayload;
  const feedbackId = `${Date.now()}-${crypto.randomUUID()}`;
  const storedRecord = {
    ...feedbackPayload,
    createdAt: new Date().toISOString(),
  };

  try {
    await env.feedback.put(feedbackId, JSON.stringify(storedRecord));
  } catch (error) {
    console.error("Failed to store feedback", error);
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(JSON.stringify({ error: "Unable to save feedback." }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  corsHeaders.set("Content-Type", "application/json");
  corsHeaders.set("Cache-Control", "no-store");
  return new Response(JSON.stringify({ success: true }), {
    status: 201,
    headers: corsHeaders,
  });
};
