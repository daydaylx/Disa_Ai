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
import { readApiKey } from "../lib/openrouter/key";
import type { ChatMessage } from "../types/chat";

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

// Proxy function that forwards to Cloudflare Worker
export async function chatStreamProxy(
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
  const key = opts?.requestKey ?? "chat-stream-proxy";

  return new Promise<void>((resolve, reject) => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let buffer = "";
    let full = "";
    let started = false;

    const controller = new AbortController();
    const signal = opts?.signal
      ? AbortSignal.any([opts.signal, controller.signal])
      : controller.signal;

    const fetchData = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
            model: opts?.model,
            temperature: opts?.params?.temperature,
            max_tokens: opts?.params?.max_tokens,
            top_p: opts?.params?.top_p,
            presence_penalty: opts?.params?.presence_penalty,
          }),
          signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body from chat service");
        }

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
                resolve();
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
                  console.warn("Failed to parse SSE chunk:", err);
                }
              }
            }
          }
          opts?.onDone?.(full);
          resolve();
        } finally {
          reader.releaseLock();
        }
      } catch (error) {
        reject(error);
      }
    };

    // Use void to suppress linting error for floating promise
    void fetchData();
  });
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
      const data = await fetchJson(ENDPOINT, {
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

// Use the proxy function instead of direct OpenRouter call
export { chatStreamProxy as chatStream };

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
