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
import { readApiKey } from "../lib/openrouter/key";
import type { ChatMessage } from "../types/chat";

const MODEL_KEY = "disa_model";

// Proxy endpoint configuration
const PROXY_CHAT_ENDPOINT = "/api/chat";

const { chatEndpoint: ENDPOINT, modelsEndpoint: MODELS_ENDPOINT } = (() => {
  // In production, use proxy endpoint
  if (!isTestEnv()) {
    return {
      chatEndpoint: PROXY_CHAT_ENDPOINT,
      modelsEndpoint: buildOpenRouterUrl(DEFAULT_OPENROUTER_BASE_URL, OPENROUTER_MODELS_PATH),
    } as const;
  }

  // In test environment, use direct OpenRouter endpoint
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

function getHeaders(): Record<string, string> {
  // In production, use proxy endpoint without API key
  if (!isTestEnv()) {
    return {
      "Content-Type": "application/json",
      "HTTP-Referer": getReferer(),
      "X-Title": "Disa AI",
    };
  }

  // In test environment, require valid API key (no hardcoded fallbacks)
  // Tests should use mocked fetch instead of real API calls
  const apiKey = readApiKey();
  if (!apiKey) {
    throw mapError(new Error("NO_API_KEY_IN_TESTS"));
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": getReferer(),
    "X-Title": "Disa AI",
  };
}

function getReferer(): string {
  try {
    return location.origin;
  } catch {
    return "http://localhost";
  }
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
  opts?: { model?: string; signal?: AbortSignal; requestKey?: string },
) {
  const key = opts?.requestKey ?? "chat-once";
  return chatConcurrency.startRequest(key, async (signal) => {
    const combinedSignal = opts?.signal ? combineSignals([opts.signal, signal]) : signal;
    try {
      const headers = getHeaders();
      const model = opts?.model ?? getModelFallback();
      const body = { model, messages, stream: false };

      // In production, use proxy endpoint
      const endpoint = isTestEnv() ? ENDPOINT : PROXY_CHAT_ENDPOINT;

      const data = await fetchJson(endpoint, {
        method: "POST",
        headers,
        body,
        timeoutMs: 30000,
        retries: 2,
        signal: combinedSignal,
      });

      const text = data?.choices?.[0]?.message?.content ?? "";
      return { text, raw: data };
    } catch (error) {
      throw mapError(error);
    }
  });
}

type ChatRequestTuning = {
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  max_tokens?: number;
};

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

      // In production, use proxy endpoint
      const endpoint = isTestEnv() ? ENDPOINT : PROXY_CHAT_ENDPOINT;

      const res = await fetchWithTimeoutAndRetry(endpoint, {
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
                const messageData = json?.choices?.[0]?.message;
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
