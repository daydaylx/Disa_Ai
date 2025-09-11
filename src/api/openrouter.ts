import { chatConcurrency } from "../lib/net/concurrency";
import { handleResponseError,mapNetworkError } from "../lib/net/errorMapping";
import { fetchWithTimeoutAndRetry } from "../lib/net/fetchTimeout";
import { readApiKey } from "../lib/openrouter/key";
import type { ChatMessage } from "../types/chat";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const KEY_NAME = "disa_api_key";
const MODEL_KEY = "disa_model";

function isTestEnv(): boolean {
  // Vitest setzt import.meta.vitest und VITEST=1
  const viaImportMeta = (() => {
    try {
      return Boolean((import.meta as unknown as { vitest?: unknown })?.vitest);
    } catch {
      return false;
    }
  })();
  const viaProcess = (() => {
    try {
      const g = globalThis as unknown as { process?: { env?: Record<string, unknown> } };
      return Boolean(g?.process?.env?.VITEST);
    } catch {
      return false;
    }
  })();
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

// Error mapping moved to ../lib/net/errorMapping.ts

export async function chatOnce(messages: ChatMessage[], opts?: { model?: string; signal?: AbortSignal }) {
  const key = `chat-once-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  
  return chatConcurrency.startRequest(key, async (signal) => {
    const combinedSignal = opts?.signal ? combineSignals([opts.signal, signal]) : signal;
    
    try {
      const headers = getHeaders();
      const model = opts?.model ?? getModelFallback();
      
      const res = await fetchWithTimeoutAndRetry(ENDPOINT, {
        timeoutMs: 30000,
        signal: combinedSignal,
        maxRetries: 2,
        retryDelayMs: 1000,
        fetchOptions: {
          method: "POST",
          headers,
          body: JSON.stringify({ model, messages, stream: false }),
        },
      });
      
      if (!res.ok) {
        await handleResponseError(res);
      }
      
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content ?? "";
      return { text, raw: data };
    } catch (error) {
      throw mapNetworkError(error instanceof Error ? error : new Error(String(error)));
    }
  });
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
  const key = `chat-stream-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  
  return chatConcurrency.startRequest(key, async (signal) => {
    const combinedSignal = opts?.signal ? combineSignals([opts.signal, signal]) : signal;
    
    try {
      const headers = getHeaders();
      const model = opts?.model ?? getModelFallback();
      
      const res = await fetchWithTimeoutAndRetry(ENDPOINT, {
        timeoutMs: 45000, // Longer timeout for streaming
        signal: combinedSignal,
        maxRetries: 1, // Less retries for streaming
        retryDelayMs: 2000,
        fetchOptions: {
          method: "POST",
          headers,
          body: JSON.stringify({ model, messages, stream: true }),
        },
      });
      
      if (!res.ok) {
        await handleResponseError(res);
      }

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
            // Kommentare (": keep-alive") ignorieren
            if (line.startsWith(":")) continue;
            const payload = line.startsWith("data:") ? line.slice(5).trim() : line;

            // OpenRouter Status-Zwischenzeilen ignorieren
            if (/^OPENROUTER\b/i.test(payload)) continue;

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
                throw mapNetworkError(err instanceof Error ? err : new Error(String(err)));
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
    } catch (error) {
      throw mapNetworkError(error instanceof Error ? error : new Error(String(error)));
    }
  });
}

// Utility to combine multiple AbortSignals
function combineSignals(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      break;
    }
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }
  
  return controller.signal;
}