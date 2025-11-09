/* eslint-disable no-empty */
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

export async function getRawModels(
  explicitKey?: string,
  ttlMs = DEFAULT_TTL_MS,
  toasts?: ToastsArray,
): Promise<ORModel[]> {
  try {
    const tsRaw = localStorage.getItem(LS_MODELS_TS);
    const dataRaw = localStorage.getItem(LS_MODELS);
    const ts = tsRaw ? Number(tsRaw) : 0;
    if (dataRaw && ts && Date.now() - ts < ttlMs) {
      const parsed = JSON.parse(dataRaw) as unknown;
      if (Array.isArray(parsed)) return parsed as ORModel[];
    }
  } catch {}

  try {
    const data = await fetchJson(`${getApiBase()}/models`, {
      headers: buildHeaders(explicitKey),
      timeoutMs: 15000,
      retries: 2,
    });
    const list = Array.isArray((data as any)?.data) ? ((data as any).data as ORModel[]) : [];

    try {
      localStorage.setItem(LS_MODELS, JSON.stringify(list));
      localStorage.setItem(LS_MODELS_TS, String(Date.now()));
    } catch {}

    return list;
  } catch (error) {
    // Log but don't throw - return empty array for graceful degradation
    safeWarn("Failed to fetch models:", mapError(error));
    if (toasts) {
      toasts.push({
        kind: "error",
        title: "Fehler beim Laden der Modelle",
        message: "Die Modelle konnten nicht geladen werden. Bitte versuche es erneut.",
        actions: [
          {
            label: "Erneut versuchen",
            onClick: () => getRawModels(explicitKey, ttlMs, toasts),
          },
        ],
      });
    }
    return [];
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
