import { readApiKey } from "../lib/openrouter/key";
import type { ChatMessage } from "../types/chat";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const KEY_NAME = "disa_api_key";
const MODEL_KEY = "disa_model";

function isTestEnv(): boolean {
  // Vitest setzt import.meta.vitest und VITEST=1
  const viaImportMeta = (() => {
    try {
      return Boolean((import.meta as any)?.vitest);
    } catch {
      return false;
    }
  })();
  const viaProcess =
    typeof globalThis !== "undefined" &&
    typeof (globalThis as any).process !== "undefined" &&
    Boolean((globalThis as any).process?.env?.VITEST);
  return viaImportMeta || viaProcess;
}

function getHeaders() {
  const apiKey = readApiKey() ?? localStorage.getItem(KEY_NAME)?.replace(/^"+|"+$/g, "");
  // In Tests keinen harten Fehler werfen: Dummy-Key nutzen, damit Stubs greifen
  const key = apiKey || (isTestEnv() ? "test" : "");
  if (!key) throw new Error("NO_API_KEY");
  const referer = (() => {
    try {
      return location.origin;
    } catch {
      return "http://localhost";
    }
  })();
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    "HTTP-Referer": referer,
    "X-Title": "Disa AI",
  } satisfies Record<string, string>;
}

export function getModelFallback() {
  try {
    return localStorage.getItem(MODEL_KEY) || "meta-llama/llama-3.3-70b-instruct:free";
  } catch {
    return "meta-llama/llama-3.3-70b-instruct:free";
  }
}

function mapHttpError(status: number): string {
  if (status === 401) return "API-Key fehlt oder ist ungültig (401).";
  if (status === 403) return "Zugriff verweigert/Modell blockiert (403).";
  if (status === 429) return "Rate-Limit/Quota erreicht (429).";
  if (status >= 500) return "Anbieterfehler (5xx). Bitte später erneut.";
  return `HTTP_${status}`;
}

export async function chatOnce(messages: ChatMessage[], opts?: { model?: string; signal?: AbortSignal }) {
  const headers = getHeaders();
  const model = opts?.model ?? getModelFallback();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages, stream: false }),
    ...(opts?.signal ? { signal: opts.signal } : {}),
  });
  if (!res.ok) throw new Error(mapHttpError(res.status));
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  return { text, raw: data };
}

export async function chatStream(
  messages: ChatMessage[],
  onDelta: (textDelta: string) => void,
  opts?: {
    model?: string;
    signal?: AbortSignal;
    onStart?: () => void;
    onDone?: (full: string) => void;
  },
) {
  const headers = getHeaders();
  const model = opts?.model ?? getModelFallback();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages, stream: true }),
    ...(opts?.signal ? { signal: opts.signal } : {}),
  });
  if (!res.ok) throw new Error(mapHttpError(res.status));

  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";
  let started = false;
  let full = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line) continue;

        // Unterstützt SSE (data: ...) und NDJSON (plain JSON per Zeile)
        const payload = line.startsWith("data:") ? line.slice(5).trim() : line;

        if (payload === "[DONE]") {
          opts?.onDone?.(full);
          return;
        }

        if (payload.startsWith("{")) {
          let delta = "";
          try {
            const json = JSON.parse(payload);
            if (json?.error) {
              const msg = json.error?.message || "Unbekannter API-Fehler";
              throw new Error(msg);
            }
            delta =
              json?.choices?.[0]?.delta?.content ?? json?.choices?.[0]?.message?.content ?? "";
          } catch (err) {
            const m = err instanceof Error ? err.message : String(err);
            throw new Error(m);
          }
          if (!started) {
            started = true;
            opts?.onStart?.();
          }
          if (delta) {
            onDelta(delta);
            full += delta;
          }
        } else {
          // Plain-Text Token
          if (!started) {
            started = true;
            opts?.onStart?.();
          }
          onDelta(payload);
          full += payload;
        }
      }
    }
    opts?.onDone?.(full);
  } finally {
    try {
      reader.releaseLock();
    } catch {
      /* noop */
    }
    try {
      await res.body?.cancel();
    } catch {
      /* noop */
    }
  }
}
