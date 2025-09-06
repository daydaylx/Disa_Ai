/* eslint-disable no-undef */
import type { ChatMessage } from "../types/chat";

export interface CreateArgs {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  abortSignal?: AbortSignal;
  referer?: string;
  title?: string;
}

export interface StreamChunk {
  contentDelta?: string;
  done?: boolean;
}

interface SseDelta {
  choices?: Array<{ delta?: { content?: string } }>;
}
function isSseDelta(x: unknown): x is SseDelta {
  if (!x || typeof x !== "object") return false;
  const obj = x as Record<string, unknown>;
  if (!Array.isArray(obj.choices)) return false;
  return true;
}

export async function createChatCompletion(
  args: CreateArgs,
): Promise<Response | AsyncIterable<StreamChunk>> {
  const {
    apiKey,
    model,
    messages,
    temperature = 0.7,
    maxTokens = 1000,
    stream = false,
    abortSignal,
    referer = typeof window !== "undefined" ? window.location.origin : "http://localhost",
    title = "Disa AI",
  } = args;

  const initHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "HTTP-Referer": referer,
    "X-Title": title,
  };

  const initBody = JSON.stringify({
    model,
    messages: messages.map(({ role, content }) => ({ role, content })),
    temperature,
    max_tokens: maxTokens,
    stream,
  });

  const init: RequestInit = {
    method: "POST",
    headers: initHeaders,
    body: initBody,
    // KEIN signal: undefined – nur setzen, wenn vorhanden
  };
  if (abortSignal) {
    // exactOptionalPropertyTypes: signal nur setzen, wenn wirklich da
    (init as { signal?: AbortSignal }).signal = abortSignal;
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", init);

  if (!res.ok) {
    const text = await safeText(res);
    throw new Error(`OpenRouter HTTP ${res.status}${text ? `: ${text}` : ""}`);
  }

  const body = res.body;
  if (!stream || !body) {
    return res;
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  async function* iterate(): AsyncIterable<StreamChunk> {
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const chunk = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const contentDelta = parseSseData(chunk);
          if (contentDelta === null) continue;
          if (contentDelta === "[DONE]") {
            yield { done: true };
            return;
          }
          if (contentDelta) yield { contentDelta };
        }
      }
    } finally {
      try {
        await reader.cancel();
      } catch {
        /* noop */
      }
    }
    yield { done: true };
  }

  return iterate();
}

function parseSseData(block: string): string | null {
  const lines = block.split("\n").map((l) => l.trim());
  for (const line of lines) {
    if (!line.startsWith("data:")) continue;
    const payload = line.slice(5).trim();
    if (payload === "[DONE]") return "[DONE]";
    try {
      const obj = JSON.parse(payload) as unknown;
      if (isSseDelta(obj)) {
        const delta = obj.choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta.length > 0) return delta;
      }
    } catch {
      /* ignore malformed data frame */
    }
  }
  return null;
}

async function safeText(res: Response): Promise<string | null> {
  try {
    const t = await res.text();
    return t?.slice(0, 500) ?? null;
  } catch {
    return null;
  }
}
