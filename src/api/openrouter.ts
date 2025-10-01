import { mapError } from "../lib/errors";
import { chatConcurrency } from "../lib/net/concurrency";
import { fetchWithTimeoutAndRetry } from "../lib/net/fetchTimeout";
import { readApiKey } from "../lib/openrouter/key";
import type { ChatMessage } from "../types/chat";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_KEY = "disa_model";

function isTestEnv(): boolean {
  const viaImportMeta = (() => {
    try {
      return Boolean((import.meta as any).vitest);
    } catch {
      return false;
    }
  })();
  const viaProcess = (() => {
    try {
      const g = globalThis as any;
      return Boolean(g?.process?.env?.VITEST);
    } catch {
      return false;
    }
  })();
  return viaImportMeta || viaProcess;
}

function getHeaders() {
  const apiKey = readApiKey(); // Only use secure keyStore, no localStorage fallback

  // SECURITY: In test environment, require valid API key (no hardcoded fallbacks)
  // Tests should use mocked fetch instead of real API calls
  if (!apiKey) {
    if (isTestEnv()) {
      throw mapError(new Error("NO_API_KEY_IN_TESTS"));
    }
    throw mapError(new Error("NO_API_KEY"));
  }
  const referer = (() => {
    try {
      return location.origin;
    } catch {
      return "http://localhost";
    }
  })();
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": referer,
    "X-Title": "Disa AI",
  } satisfies Record<string, string>;
}

export function getModelFallback() {
  try {
    // Model selection is non-sensitive, localStorage is acceptable here
    return localStorage.getItem(MODEL_KEY) || "meta-llama/llama-3.3-70b-instruct:free";
  } catch {
    return "meta-llama/llama-3.3-70b-instruct:free";
  }
}

export async function chatOnce(
  messages: ChatMessage[],
  opts?: { model?: string; signal?: AbortSignal },
) {
  const key = `chat-once-${Date.now()}`;
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
        throw mapError(res);
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content ?? "";
      return { text, raw: data };
    } catch (error) {
      throw mapError(error);
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
  const key = `chat-stream-${Date.now()}`;
  return chatConcurrency.startRequest(key, async (signal) => {
    const combinedSignal = opts?.signal ? combineSignals([opts.signal, signal]) : signal;
    try {
      const headers = getHeaders();
      const model = opts?.model ?? getModelFallback();
      const res = await fetchWithTimeoutAndRetry(ENDPOINT, {
        timeoutMs: 45000,
        signal: combinedSignal,
        maxRetries: 1,
        retryDelayMs: 2000,
        fetchOptions: {
          method: "POST",
          headers,
          body: JSON.stringify({ model, messages, stream: true }),
        },
      });

      if (!res.ok) {
        throw mapError(res);
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
            if (!line || line.startsWith(":")) continue;

            const payload = line.startsWith("data:") ? line.slice(5).trim() : line;
            if (/^OPENROUTER\b/i.test(payload)) continue;

            if (payload === "[DONE]") {
              opts?.onDone?.(full);
              return;
            }

            if (payload.startsWith("{")) {
              try {
                const json = JSON.parse(payload);
                if (json?.error) {
                  throw new Error(json.error?.message || "Unbekannter API-Fehler");
                }
                const delta = json?.choices?.[0]?.delta?.content ?? "";
                if (!started) {
                  started = true;
                  opts?.onStart?.();
                }
                if (delta) {
                  onDelta(delta);
                  full += delta;
                }
              } catch (err) {
                throw mapError(err);
              }
            } else {
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
        reader.releaseLock();
        res.body?.cancel().catch(() => {});
      }
    } catch (error) {
      throw mapError(error);
    }
  });
}

function combineSignals(signals: AbortSignal[]): AbortSignal {
  // Use native AbortSignal.any() to avoid race conditions
  // Available in Node.js v20.7.0+ and modern browsers
  if ("any" in AbortSignal && typeof AbortSignal.any === "function") {
    return AbortSignal.any(signals);
  }

  // Fallback for older environments with race condition protection
  const controller = new AbortController();
  let aborted = false;
  const cleanup: (() => void)[] = [];

  // Check if already aborted before setting up listeners
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      return controller.signal;
    }
  }

  // Set up listeners with race condition protection
  const abortHandler = () => {
    if (aborted) return; // Prevent double abort
    aborted = true;

    // Clean up all listeners
    cleanup.forEach((fn) => {
      try {
        fn();
      } catch {
        // Ignore cleanup errors
      }
    });

    controller.abort();
  };

  for (const signal of signals) {
    // Double-check in case signal was aborted between checks
    if (signal.aborted) {
      abortHandler();
      return controller.signal;
    }

    signal.addEventListener("abort", abortHandler, { once: true });
    cleanup.push(() => signal.removeEventListener("abort", abortHandler));
  }

  return controller.signal;
}
