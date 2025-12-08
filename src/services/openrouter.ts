/* eslint-disable no-empty */
import { buildOpenRouterUrl, OPENROUTER_MODELS_PATH } from "../../shared/openrouter";
import { getEnvConfigSafe } from "../config/env";
import { mapError } from "../lib/errors";
import { fetchJson } from "../lib/http";
import { readApiKey, writeApiKey } from "../lib/openrouter/key";
import { safeWarn } from "../lib/utils/production-logger";

interface ToastItem {
  kind: "error" | "success" | "warning" | "info";
  title: string;
  message: string;
  actions?: Array<{ label: string; onClick: () => void }>;
}

interface ToastsArray {
  push: (toast: ToastItem) => void;
}

// Use environment configuration for API base URL
function getApiBase(): string {
  const config = getEnvConfigSafe();
  return config.VITE_OPENROUTER_BASE_URL;
}

function getModelsEndpoint(): string {
  return buildOpenRouterUrl(getApiBase(), OPENROUTER_MODELS_PATH);
}

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

export function getApiKey(): string | null {
  try {
    return readApiKey();
  } catch {
    return null;
  }
}

export function setApiKey(v: string) {
  try {
    writeApiKey(v);
  } catch {}
}

function buildHeaders(explicitKey?: string) {
  const key = explicitKey ?? getApiKey() ?? "";
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (key) h["Authorization"] = `Bearer ${key}`;
  return h;
}

/** Rohes Model-Listing (für config/models.ts) */
const LS_MODELS = "disa:or:models:v1";
const LS_MODELS_TS = "disa:or:models:ts";
const DEFAULT_TTL_MS = 20 * 60 * 1000; // 20 Minuten

// Static fallback list of known free models (used when API is unavailable)
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
];

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
    } catch {}
    return null;
  };

  // Try to return fresh cache first (if not forcing refresh)
  if (!forceRefresh) {
    try {
      const tsRaw = localStorage.getItem(LS_MODELS_TS);
      const ts = tsRaw ? Number(tsRaw) : 0;
      if (ts && Date.now() - ts < ttlMs) {
        const cached = getCachedData();
        if (cached) return cached;
      }
    } catch {}
  }

  // Try to fetch from API
  try {
    const data = await fetchJson(getModelsEndpoint(), {
      headers: buildHeaders(explicitKey),
      timeoutMs: 15000,
      retries: 2,
    });
    const list = Array.isArray((data as any)?.data) ? ((data as any).data as ORModel[]) : [];

    // Save to cache
    try {
      localStorage.setItem(LS_MODELS, JSON.stringify(list));
      localStorage.setItem(LS_MODELS_TS, String(Date.now()));
    } catch {}

    return list;
  } catch (error) {
    // API failed - try to use stale cache as fallback
    safeWarn("Failed to fetch models from API:", mapError(error));

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

// Konsolidierung: Chat-Streaming/-Once lebt in src/api/openrouter.ts
export { chatOnce, chatStream } from "../api/openrouter";
