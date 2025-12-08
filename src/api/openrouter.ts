import {
  buildOpenRouterUrl,
  DEFAULT_OPENROUTER_BASE_URL,
  OPENROUTER_CHAT_PATH,
  OPENROUTER_MODELS_PATH,
} from "../../shared/openrouter";
import { getEnvConfigSafe } from "../config/env";
import { mapError } from "../lib/errors";
import { fetchJson } from "../lib/http";
import { chatConcurrency } from "../lib/net/concurrency";
import { fetchWithTimeoutAndRetry } from "../lib/net/fetchTimeout";
import { hasApiKey, readApiKey } from "../lib/openrouter/key";
import type { ChatMessage } from "../types/chat";
import type { OpenRouterChatResponse, OpenRouterStreamChunk } from "../types/openrouter";
import { chatOnceViaProxy, chatStreamViaProxy } from "./proxyClient";

const MODEL_KEY = "disa_model";

const { chatEndpoint: ENDPOINT, modelsEndpoint: MODELS_ENDPOINT } = (() => {
  const base = getEnvConfigSafe().VITE_OPENROUTER_BASE_URL || DEFAULT_OPENROUTER_BASE_URL;
  return {
    chatEndpoint: buildOpenRouterUrl(base, OPENROUTER_CHAT_PATH),
    modelsEndpoint: buildOpenRouterUrl(base, OPENROUTER_MODELS_PATH),
  } as const;
})();

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
    return (
      localStorage.getItem(MODEL_KEY) ||
      "cognitivecomputations/dolphin-mistral-24b-venice-edition:free"
    );
  } catch {
    return "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";
  }
}

/**
 * Direct call to OpenRouter API (requires user API key)
 */
async function chatOnceDirect(
  messages: ChatMessage[],
  opts?: { model?: string; signal?: AbortSignal; requestKey?: string },
) {
  const key = opts?.requestKey ?? "chat-once";
  return chatConcurrency.startRequest(key, async (signal) => {
    const combinedSignal = opts?.signal ? combineSignals([opts.signal, signal]) : signal;
    try {
      const headers = getHeaders();
      const model = opts?.model ?? getModelFallback();
      const body = { model, messages, stream: false };
      const data = await fetchJson<OpenRouterChatResponse>(ENDPOINT, {
        method: "POST",
        headers,
        body,
        timeoutMs: 30000,
        retries: 2,
        signal: combinedSignal,
      });

      // Type-safe access to response
      const text = data.choices[0]?.message?.content ?? "";
      return { text, raw: data };
    } catch (error) {
      throw mapError(error);
    }
  });
}

/**
 * Chat once - auto-routes to proxy or direct based on API key presence
 * No API key needed when using proxy mode
 */
export async function chatOnce(
  messages: ChatMessage[],
  opts?: { model?: string; signal?: AbortSignal; requestKey?: string },
) {
  // AUTO-ROUTING: Use proxy if no user API key, otherwise direct
  if (!hasApiKey()) {
    return chatOnceViaProxy(messages, {
      model: opts?.model,
      signal: opts?.signal,
    });
  }

  return chatOnceDirect(messages, opts);
}

type ChatRequestTuning = {
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  max_tokens?: number;
};

/**
 * Direct streaming call to OpenRouter API (requires user API key)
 */
async function chatStreamDirect(
  messages: ChatMessage[],
  onDelta: (
    textDelta: string,
    messageData?: { id?: string; role?: string; timestamp?: number; model?: string },
  ) => void,
  opts?: {
    model?: string;
    params?: ChatRequestTuning;
    signal?: AbortSignal;
    onStart?: () => void;
    onDone?: (full: string) => void;
    requestKey?: string;
  },
) {
  const key = opts?.requestKey ?? "chat-stream";
  return chatConcurrency.startRequest(key, async (signal) => {
    const combinedSignal = opts?.signal ? combineSignals([opts.signal, signal]) : signal;
    try {
      const headers = getHeaders();
      const model = opts?.model ?? getModelFallback();
      const payload: Record<string, unknown> = {
        model,
        messages,
        stream: true,
      };

      if (opts?.params) {
        for (const [key, value] of Object.entries(opts.params)) {
          if (value !== undefined) {
            payload[key] = value;
          }
        }
      }
      const res = await fetchWithTimeoutAndRetry(ENDPOINT, {
        timeoutMs: 45000,
        signal: combinedSignal,
        maxRetries: 1,
        retryDelayMs: 2000,
        fetchOptions: {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
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
          // CRITICAL FIX: Race reader against a timeout to prevent mobile hangs
          const readPromise = reader.read();
          const timeoutPromise = new Promise<ReadableStreamReadResult<Uint8Array>>((_, reject) => {
            setTimeout(() => reject(new Error("STREAM_INACTIVITY_TIMEOUT")), 60000);
          });

          const { value, done } = await Promise.race([readPromise, timeoutPromise]);
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
                const json = JSON.parse(payload) as OpenRouterStreamChunk;
                if (json.error) {
                  throw new Error(json.error.message || "Unbekannter API-Fehler");
                }
                const delta = json.choices[0]?.delta?.content ?? "";
                const messageData = json.choices[0]?.message;
                if (!started) {
                  started = true;
                  opts?.onStart?.();
                }
                if (delta || messageData) {
                  onDelta(delta, messageData);
                  full += delta;
                }
              } catch (err) {
                throw mapError(err);
              }
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

/**
 * Chat stream - auto-routes to proxy or direct based on API key presence
 * No API key needed when using proxy mode
 */
export async function chatStream(
  messages: ChatMessage[],
  onDelta: (
    textDelta: string,
    messageData?: { id?: string; role?: string; timestamp?: number; model?: string },
  ) => void,
  opts?: {
    model?: string;
    params?: ChatRequestTuning;
    signal?: AbortSignal;
    onStart?: () => void;
    onDone?: (full: string) => void;
    requestKey?: string;
  },
) {
  // AUTO-ROUTING: Use proxy if no user API key, otherwise direct
  if (!hasApiKey()) {
    return chatStreamViaProxy(messages, onDelta, {
      model: opts?.model,
      params: opts?.params,
      signal: opts?.signal,
      onStart: opts?.onStart,
      onDone: opts?.onDone,
    });
  }

  return chatStreamDirect(messages, onDelta, opts);
}

/**
 * Check API connectivity by fetching the models endpoint
 * @param opts - Optional timeout and signal configuration
 * @returns Promise that resolves if API is reachable, rejects otherwise
 */
export async function checkApiHealth(opts?: {
  timeoutMs?: number;
  signal?: AbortSignal;
}): Promise<void> {
  const timeoutMs = opts?.timeoutMs ?? 3000;

  try {
    await fetchJson(MODELS_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      timeoutMs,
      retries: 0,
      signal: opts?.signal,
    });
  } catch (error) {
    throw mapError(error);
  }
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

  // Atomic registration: check and register in same iteration without gaps
  for (const signal of signals) {
    if (aborted) break; // Stop if already aborted

    // ATOMIC: Check and immediately register listener without any code in between
    if (signal.aborted) {
      abortHandler();
      break; // Exit loop after handling abort
    } else {
      // Immediately add listener while we know signal is not aborted
      signal.addEventListener("abort", abortHandler, { once: true });
      cleanup.push(() => signal.removeEventListener("abort", abortHandler));
    }
  }

  return controller.signal;
}
