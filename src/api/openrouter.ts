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
import { safeWarn } from "../lib/utils/production-logger";
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
const DEFAULT_MODELS_ENDPOINT = buildOpenRouterUrl(
  DEFAULT_OPENROUTER_BASE_URL,
  OPENROUTER_MODELS_PATH,
);

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
    return localStorage.getItem(MODEL_KEY) || "nvidia/nemotron-3-nano-30b-a3b:free";
  } catch {
    return "nvidia/nemotron-3-nano-30b-a3b:free";
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

// ============================================================================
// Model Fetching & Caching (merged from src/services/openrouter.ts)
// ============================================================================

export type ORModel = {
  id: string;
  name?: string;
  description?: string;
  architecture?: {
    modality?: string;
    tokenizer?: string;
    instruct_type?: string;
  };
  context_length?: number;
  pricing?: { prompt?: number; completion?: number };
  tags?: string[];
  top_provider?: {
    context_length?: number;
    max_completion_tokens?: number;
    is_moderated?: boolean;
  };
};

interface ToastItem {
  kind: "error" | "success" | "warning" | "info";
  title: string;
  message: string;
  actions?: Array<{ label: string; onClick: () => void }>;
}

interface ToastsArray {
  push: (toast: ToastItem) => void;
}

const LS_MODELS = "disa:or:models:v1";
const LS_MODELS_TS = "disa:or:models:ts";
const DEFAULT_TTL_MS = 20 * 60 * 1000; // 20 Minuten
const MIN_EXPECTED_MODELS = 10;
const MAX_MODELS_PAGES = 20;

// Static fallback list of known free models (used when API is unavailable)
// Updated 2025-12-19 with latest free models from OpenRouter
const FALLBACK_FREE_MODELS: ORModel[] = [
  {
    id: "meta-llama/llama-3.2-3b-instruct:free",
    name: "Meta: Llama 3.2 3B Instruct (free)",
    description:
      "Llama 3.2 3B is a 3-billion-parameter multilingual large language model, optimized for multilingual dialogue use cases.",
    context_length: 131072,
    pricing: { prompt: 0, completion: 0 },
    tags: ["free"],
  },
  {
    id: "meta-llama/llama-3.1-8b-instruct:free",
    name: "Meta: Llama 3.1 8B Instruct (free)",
    description:
      "Llama 3.1 8B is an 8-billion-parameter multilingual large language model, optimized for dialogue use cases.",
    context_length: 131072,
    pricing: { prompt: 0, completion: 0 },
    tags: ["free"],
  },
  {
    id: "google/gemma-2-9b-it:free",
    name: "Google: Gemma 2 9B (free)",
    description:
      "Gemma 2 9B by Google is a high-performing and efficient model in the Gemma family.",
    context_length: 8192,
    pricing: { prompt: 0, completion: 0 },
    tags: ["free"],
  },
  {
    id: "microsoft/phi-3-mini-128k-instruct:free",
    name: "Phi-3 Mini 128K Instruct (free)",
    description: "Phi-3 Mini is a powerful 3.8B parameter model by Microsoft.",
    context_length: 128000,
    pricing: { prompt: 0, completion: 0 },
    tags: ["free"],
  },
  {
    id: "mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B Instruct (free)",
    description: "A 7B parameter model by Mistral AI, fine-tuned for following instructions.",
    context_length: 32768,
    pricing: { prompt: 0, completion: 0 },
    tags: ["free"],
  },
  {
    id: "qwen/qwen-2-7b-instruct:free",
    name: "Qwen 2 7B Instruct (free)",
    description: "Qwen2 7B is the latest series of large language models from Alibaba group.",
    context_length: 32768,
    pricing: { prompt: 0, completion: 0 },
    tags: ["free"],
  },
  {
    id: "allenai/olmo-3.1-32b-think:free",
    name: "AllenAI: Olmo 3.1 32B Think (free)",
    description:
      "Olmo 3.1 32B Think is a large language model from AllenAI with advanced reasoning.",
    context_length: 32768,
    pricing: { prompt: 0, completion: 0 },
    tags: ["free"],
  },
  {
    id: "xiaomi/mimo-v2-flash:free",
    name: "Xiaomi: MiMo-V2-Flash (free)",
    description: "MiMo-V2-Flash is Xiaomi's efficient flash model for quick responses.",
    context_length: 8192,
    pricing: { prompt: 0, completion: 0 },
    tags: ["free", "fast"],
  },
  {
    id: "nvidia/nemotron-3-nano-30b-a3b:free",
    name: "NVIDIA: Nemotron 3 Nano 30B A3B (free)",
    description: "NVIDIA Nemotron 3 Nano 30B is a powerful free model from NVIDIA.",
    context_length: 32768,
    pricing: { prompt: 0, completion: 0 },
    tags: ["free"],
  },
  {
    id: "mistralai/devstral-2512:free",
    name: "Mistral: Devstral 2512 (free)",
    description: "Devstral 2512 is Mistral's free model optimized for development tasks.",
    context_length: 32768,
    pricing: { prompt: 0, completion: 0 },
    tags: ["free", "coding"],
  },
  {
    id: "arcee-ai/trinity-mini:free",
    name: "Arcee AI: Trinity Mini (free)",
    description: "Trinity Mini is Arcee AI's compact free model.",
    context_length: 16384,
    pricing: { prompt: 0, completion: 0 },
    tags: ["free"],
  },
  {
    id: "allenai/olmo-3-32b-think:free",
    name: "AllenAI: Olmo 3 32B Think (free)",
    description: "Olmo 3 32B Think is the latest version from AllenAI.",
    context_length: 32768,
    pricing: { prompt: 0, completion: 0 },
    tags: ["free"],
  },
];

function buildModelsHeaders(explicitKey?: string) {
  const key = explicitKey ?? readApiKey() ?? "";
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (key) h["Authorization"] = `Bearer ${key}`;
  return h;
}

type ModelsPageResponse = {
  data?: ORModel[];
  next?: string;
  next_cursor?: string;
  cursor?: string;
  pagination?: {
    next?: string;
    cursor?: string;
  };
};

function resolveNextModelsUrl(currentUrl: string, nextValue?: string | null): string | null {
  if (!nextValue) return null;
  if (nextValue.startsWith("http://") || nextValue.startsWith("https://")) {
    return nextValue;
  }

  try {
    const url = new URL(currentUrl);
    url.searchParams.set("cursor", nextValue);
    return url.toString();
  } catch {
    return null;
  }
}

async function fetchModelsWithPagination(
  endpoint: string,
  headers: Record<string, string>,
): Promise<ORModel[]> {
  let currentUrl = endpoint;
  const collected: ORModel[] = [];
  const seen = new Set<string>();

  for (let page = 0; page < MAX_MODELS_PAGES; page += 1) {
    const response = (await fetchJson(currentUrl, {
      headers,
      timeoutMs: 15000,
      retries: 2,
    })) as ModelsPageResponse;
    const list = Array.isArray(response?.data) ? response.data : [];

    for (const model of list) {
      if (!model?.id || seen.has(model.id)) continue;
      seen.add(model.id);
      collected.push(model);
    }

    const nextCursor =
      response?.next ??
      response?.next_cursor ??
      response?.cursor ??
      response?.pagination?.next ??
      response?.pagination?.cursor;
    const nextUrl = resolveNextModelsUrl(currentUrl, nextCursor ?? null);
    if (!nextUrl) break;
    currentUrl = nextUrl;
  }

  return collected;
}

export async function getRawModels(
  explicitKey?: string,
  ttlMs = DEFAULT_TTL_MS,
  toasts?: ToastsArray,
  forceRefresh = false,
): Promise<ORModel[]> {
  // Helper to get cached data regardless of age
  const getCachedData = (): ORModel[] | null => {
    try {
      const dataRaw = localStorage.getItem(LS_MODELS);
      if (dataRaw) {
        const parsed = JSON.parse(dataRaw) as unknown;
        if (Array.isArray(parsed)) return parsed as ORModel[];
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  };

  // Try to return fresh cache first (if not forcing refresh)
  if (!forceRefresh) {
    try {
      const tsRaw = localStorage.getItem(LS_MODELS_TS);
      const ts = tsRaw ? Number(tsRaw) : 0;
      if (ts && Date.now() - ts < ttlMs) {
        const cached = getCachedData();
        if (cached && (isTestEnv() || cached.length >= MIN_EXPECTED_MODELS)) return cached;
      }
    } catch {
      // Ignore cache read errors
    }
  }

  // Try to fetch from API
  // NOTE: OpenRouter's /models endpoint is public and doesn't require authentication
  // We still pass the API key if available for potential rate limit benefits
  try {
    const headers = buildModelsHeaders(explicitKey);
    let list = await fetchModelsWithPagination(MODELS_ENDPOINT, headers);
    if (list.length < MIN_EXPECTED_MODELS && MODELS_ENDPOINT !== DEFAULT_MODELS_ENDPOINT) {
      const fallbackList = await fetchModelsWithPagination(DEFAULT_MODELS_ENDPOINT, headers);
      if (fallbackList.length > list.length) {
        list = fallbackList;
      }
    }

    // Save to cache
    try {
      localStorage.setItem(LS_MODELS, JSON.stringify(list));
      localStorage.setItem(LS_MODELS_TS, String(Date.now()));
    } catch {
      // Ignore storage errors
    }

    return list;
  } catch (error) {
    // API failed - try to use stale cache as fallback
    safeWarn("Failed to fetch models from API", mapError(error));

    const staleCache = getCachedData();
    if (staleCache && staleCache.length > 0) {
      safeWarn("Using stale cached models as fallback");
      if (toasts) {
        toasts.push({
          kind: "warning",
          title: "Verbindung zu OpenRouter fehlgeschlagen",
          message:
            "Verwende zwischengespeicherte Modelle. Die Liste ist möglicherweise nicht aktuell.",
        });
      }
      return staleCache;
    }

    // No cache available - use static fallback
    safeWarn("No cache available, using static fallback models");
    if (toasts) {
      toasts.push({
        kind: "warning",
        title: "OpenRouter API nicht erreichbar",
        message:
          "Verwende statische Fallback-Modelle. Einige Modelle sind möglicherweise nicht verfügbar.",
      });
    }
    return FALLBACK_FREE_MODELS;
  }
}

/** Einfacher Verfügbarkeits-Check */
export async function pingOpenRouter(): Promise<boolean> {
  try {
    const list = await getRawModels();
    return Array.isArray(list);
  } catch {
    return false;
  }
}
