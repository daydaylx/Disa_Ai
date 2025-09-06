/* eslint-disable no-empty */
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
export async function getRawModels(explicitKey?: string): Promise<ORModel[]> {
  const res = await fetch(`${BASE}/models`, { headers: buildHeaders(explicitKey) });
  if (!res.ok) return [];
  const data = await res.json().catch(() => ({}));
  return Array.isArray((data as any)?.data) ? ((data as any).data as ORModel[]) : [];
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
export { chatOnce,chatStream } from "../api/openrouter";
