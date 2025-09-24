/* OpenRouter Service - Phase 4
   - Fehlerklassen
   - Model-Liste
   - Chat-Streaming per Async-Generator
   - Keine externen Abhaengigkeiten
*/

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}
export class AuthError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401, "unauthorized");
    this.name = "AuthError";
  }
}
export class RateLimitError extends ApiError {
  constructor(message = "Rate limited") {
    super(message, 429, "rate_limited");
    this.name = "RateLimitError";
  }
}

export type ORModel = {
  id: string;
  name?: string;
  context_length?: number;
  pricing?: { prompt?: number; completion?: number; unit?: string } | null;
  tags?: string[];
  description?: string;
  provider?: string;
};

export type Message = { role: "system" | "user" | "assistant"; content: string };

export type StreamOptions = {
  apiKey: string;
  baseUrl?: string;
  model: string;
  messages: Message[];
  maxTokens?: number;
  temperature?: number;
  top_p?: number;
  stop?: string[];
  extraHeaders?: Record<string, string>;
  signal?: AbortSignal;
};

const DEFAULT_BASE = "https://openrouter.ai/api/v1";

async function fetchJson<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    if (res.status === 401) throw new AuthError();
    if (res.status === 429) throw new RateLimitError();
    let msg = "HTTP " + String(res.status);
    try {
      if (ct.includes("application/json")) {
        const j: any = await res.json();
        if (j && j.error && j.error.message) msg = j.error.message;
        else if (j && j.message) msg = j.message;
      } else {
        const t = await res.text();
        if (t) msg = t.slice(0, 400);
      }
    } catch {
      // ignore parse errors
    }
    throw new ApiError(msg, res.status);
  }
  if (!ct.includes("application/json")) {
    // Not JSON; return the raw response casted to any
    return res as any as T;
  }
  return res.json() as Promise<T>;
}

function headersJson(apiKey: string, extra?: Record<string, string>): HeadersInit {
  if (!apiKey) throw new AuthError("Missing API key");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "HTTP-Referer": "https://disaai.local",
    "X-Title": "Disa AI",
    ...(extra || {}),
  };
}

export async function listModels(
  apiKey: string,
  baseUrl: string = DEFAULT_BASE,
): Promise<ORModel[]> {
  if (!apiKey) {
    return [
      { id: "auto", name: "Auto (Fallback)" },
      { id: "qwen2.5-coder-32b", name: "Qwen2.5 Coder 32B (demo)" },
    ];
  }
  type Resp = {
    data: Array<{
      id: string;
      name?: string;
      context_length?: number;
      pricing?: any;
      tags?: string[];
      description?: string;
      provider?: { name?: string } | null;
    }>;
  };
  const data = await fetchJson<Resp>(`${baseUrl}/models`, {
    method: "GET",
    headers: headersJson(apiKey),
  });
  return (data && data.data ? data.data : []).map((m) => ({
    id: m.id,
    name: m.name,
    context_length: m.context_length,
    pricing: m.pricing ?? null,
    tags: m.tags,
    description: m.description,
    provider: m.provider?.name,
  }));
}

async function* parseSSE(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  let buf = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx = buf.indexOf("\n\n");
      while (idx !== -1) {
        const raw = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        const lines = raw.split("\n").map((s) => s.trim());
        const dataLines = lines.filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim());
        if (dataLines.length > 0) {
          const payload = dataLines.join("\n");
          if (payload === "[DONE]") return;
          try {
            const json = JSON.parse(payload);
            yield json;
          } catch {
            yield payload;
          }
        }
        idx = buf.indexOf("\n\n");
      }
    }
    if (buf) {
      try {
        yield JSON.parse(buf);
      } catch {
        /* ignore */
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function* streamChat(
  opts: StreamOptions,
): AsyncGenerator<{ type: "delta" | "error" | "done"; text?: string; error?: string }> {
  const {
    apiKey,
    baseUrl = DEFAULT_BASE,
    model,
    messages,
    maxTokens,
    temperature,
    top_p,
    stop,
    extraHeaders,
    signal,
  } = opts;

  if (!apiKey) {
    throw new AuthError("Missing API key");
  }
  if (!model) {
    throw new ApiError("Missing model", 400);
  }
  if (!messages || !messages.length) {
    throw new ApiError("Missing messages", 400);
  }

  const controller = new AbortController();
  if (signal) {
    if (signal.aborted) controller.abort();
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      ...headersJson(apiKey, extraHeaders),
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      max_tokens: maxTokens,
      temperature,
      top_p,
      stop,
    }),
    signal: controller.signal,
  });

  if (!res.ok || !res.body) {
    if (res.status === 401) throw new AuthError();
    if (res.status === 429) throw new RateLimitError();
    const code = res.status || 0;
    throw new ApiError("HTTP " + String(code), code);
  }

  try {
    for await (const evt of parseSSE(res.body)) {
      try {
        const choice = (evt as any)?.choices?.[0];
        const delta = choice?.delta?.content ?? (evt as any)?.delta?.content;
        if (typeof delta === "string" && delta.length) {
          yield { type: "delta", text: delta };
        }
      } catch {
        // ignore malformed chunk
      }
    }
    yield { type: "done" };
  } catch (e: any) {
    if (e && e.name === "AbortError") return;
    const msg = e?.message || "Stream error";
    yield { type: "error", error: msg };
  }
}
