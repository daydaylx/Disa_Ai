/* Central model catalog types & helpers for Disa_Ai.
   - Strict TypeScript, no placeholders.
   - Robust mapping for OpenRouter models with a safe local fallback.
   - SWR cache to avoid hammering the API and speed up UI.
*/
import { swrGet, swrSet, swrClear } from "@/utils/swrCache";

export type ProviderInfo = { name: string };
export type Price = { in: number; out: number };

export type ModelEntry = {
  id: string;
  label: string;
  provider: ProviderInfo;
  ctx?: number;
  tags?: string[];
  price?: Price;
};

export const DEFAULT_MODEL_ID = "openrouter/auto";

const FALLBACK_MODELS: ModelEntry[] = [
  { id: "openrouter/auto", label: "Auto (OpenRouter)", provider: { name: "openrouter" }, ctx: 128_000, tags: ["auto"] },
  { id: "qwen/qwen-2.5-coder-32b-instruct", label: "Qwen 2.5 Coder 32B (Instruct)", provider: { name: "qwen" }, ctx: 128_000, tags: ["code"] },
  { id: "mistral/mistral-small-latest", label: "Mistral Small (latest)", provider: { name: "mistral" }, ctx: 32_000, tags: ["general"] }
];

type OpenRouterWire = {
  data: Array<{
    id: string;
    name?: string;
    context_length?: number;
    pricing?: { prompt?: number; completion?: number };
  }>;
};

export type LoadCatalogOptions = {
  apiKey?: string;
  allow?: string[] | null;
  preferFree?: boolean;
  timeoutMs?: number;
  maxAgeMs?: number;
  backend?: "local" | "session";
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/models";
const CACHE_KEY_RAW = "disa:models:raw:v1";

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit & { timeoutMs?: number } = {}) {
  const { timeoutMs = 10_000, ...rest } = init;
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(input, { ...rest, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function withRetry<T>(fn: () => Promise<T>, tries = 2, delayMs = 400): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); }
    catch (e) { lastErr = e; if (i < tries - 1) await new Promise(r => setTimeout(r, delayMs * (i + 1))); }
  }
  throw lastErr;
}

function providerFromId(id: string): ProviderInfo {
  const vendor = id.split("/")[0] || "openrouter";
  return { name: vendor.toLowerCase() };
}

function tagsFrom(id: string, pricing?: { prompt?: number; completion?: number }): string[] {
  const tags = new Set<string>();
  if (/coder|code|deepseek-coder|qwen.*coder/i.test(id)) tags.add("code");
  if (/auto/.test(id)) tags.add("auto");
  if (pricing?.prompt === 0 || pricing?.completion === 0) tags.add("free");
  return Array.from(tags);
}

function mapWire(m: NonNullable<OpenRouterWire["data"]>[number]): ModelEntry {
  const base = {
    id: m.id,
    label: m.name ?? m.id,
    provider: providerFromId(m.id),
    tags: tagsFrom(m.id, m.pricing),
  };
  const price = (typeof m.pricing?.prompt === "number" || typeof m.pricing?.completion === "number")
    ? { in: m.pricing?.prompt ?? NaN, out: m.pricing?.completion ?? NaN }
    : undefined;

  return {
    ...base,
    ...(typeof m.context_length === "number" ? { ctx: m.context_length } : {}),
    ...(price ? { price } : {}),
  };
}

function filterAndSort(list: ModelEntry[], allow?: string[] | null, preferFree?: boolean): ModelEntry[] {
  let out = list.slice();
  if (Array.isArray(allow) && allow.length > 0) {
    const allowSet = new Set(allow);
    out = out.filter(m => allowSet.has(m.id));
  }
  out.sort((a, b) => {
    if (preferFree) {
      const af = a.tags?.includes("free") ? 1 : 0;
      const bf = b.tags?.includes("free") ? 1 : 0;
      if (af !== bf) return bf - af;
    }
    return a.label.localeCompare(b.label);
  });
  return out;
}

async function fetchLiveCatalog(apiKey: string, timeoutMs: number): Promise<ModelEntry[]> {
  const res = await fetchWithTimeout(OPENROUTER_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    timeoutMs,
  });
  if (!res.ok) throw new Error(`OpenRouter responded ${res.status}`);
  const wire = (await res.json()) as OpenRouterWire;
  if (!wire?.data || !Array.isArray(wire.data)) throw new Error("Unexpected model catalog shape");
  return wire.data.map(mapWire);
}

export async function loadModelCatalog(opts: LoadCatalogOptions = {}): Promise<ModelEntry[]> {
  const {
    apiKey,
    allow = null,
    preferFree = false,
    timeoutMs = 10_000,
    maxAgeMs = 10 * 60 * 1000,
    backend = "local",
  } = opts;

  const cached = swrGet<ModelEntry[]>(CACHE_KEY_RAW, maxAgeMs, backend);
  const hasCache = Array.isArray(cached.value) && cached.value.length > 0;

  if (!apiKey) {
    const base = cached.fresh && hasCache ? cached.value! : FALLBACK_MODELS;
    return filterAndSort(base, allow, preferFree);
  }

  if (cached.fresh && hasCache) {
    return filterAndSort(cached.value!, allow, preferFree);
  }

  try {
    const live = await withRetry(() => fetchLiveCatalog(apiKey, timeoutMs), 2, 500);
    swrSet(CACHE_KEY_RAW, live, backend);
    return filterAndSort(live, allow, preferFree);
  } catch {
    if (hasCache) return filterAndSort(cached.value!, allow, preferFree);
    return filterAndSort(FALLBACK_MODELS, allow, preferFree);
  }
}

export function chooseDefaultModel(list: ModelEntry[], preferFree = false): string {
  if (!Array.isArray(list) || list.length === 0) return DEFAULT_MODEL_ID;
  if (preferFree) {
    const free = list.find(m => m.tags?.includes("free"));
    if (free) return free.id;
  }
  const auto = list.find(m => m.id === DEFAULT_MODEL_ID);
  if (auto) return auto.id;
  return list[0]!.id;
}

export function labelForModel(id: string, list: ModelEntry[]): string {
  const hit = list.find(m => m.id === id);
  return hit ? hit.label : id;
}

export function clearModelCatalogCache(): void {
  swrClear(CACHE_KEY_RAW, "local");
}
