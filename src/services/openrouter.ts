/* eslint-disable no-empty */
import { mapError } from "../lib/errors";
import { fetchWithTimeoutAndRetry } from "../lib/net/fetchTimeout";
import { readApiKey, writeApiKey } from "../lib/openrouter/key";

const BASE = "https://openrouter.ai/api/v1";

export type ORModel = {
  id: string;
  name?: string;
  context_length?: number;
  pricing?: { prompt?: number; completion?: number };
  tags?: string[];
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
    const res = await fetchWithTimeoutAndRetry(`${BASE}/models`, {
      timeoutMs: 15000,
      maxRetries: 2,
      retryDelayMs: 1000,
      fetchOptions: {
        headers: buildHeaders(explicitKey),
      },
    });

    if (!res.ok) throw mapError(res);
    const data = await res.json().catch(() => ({}));
    const list = Array.isArray((data as any)?.data) ? ((data as any).data as ORModel[]) : [];

    try {
      localStorage.setItem(LS_MODELS, JSON.stringify(list));
      localStorage.setItem(LS_MODELS_TS, String(Date.now()));
    } catch {}

    return list;
  } catch (error) {
    // Log but don't throw - return empty array for graceful degradation
    console.warn("Failed to fetch models:", mapError(error));
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
