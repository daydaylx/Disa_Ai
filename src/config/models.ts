/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export type Price = { in: number; out: number } | null;

export interface ModelEntry {
  id: string;
  label: string;
  provider: string;
  ctx: number;
  tags: string[];
  price: Price;
  /** abgeleitet: true, wenn Pricing 0/0 oder Tag "free" */
  free: boolean;
}

export interface LoadOptions {
  apiKey?: string;
  allow?: string[];
  preferFree?: boolean;
}

const DEFAULTS: Readonly<ModelEntry[]> = Object.freeze([
  {
    id: "mistral/mistral-7b-instruct",
    label: "Mistral 7B Instruct",
    provider: "Mistral",
    ctx: 32768,
    tags: ["chat", "code", "free"],
    price: null,
    free: true,
  },
  {
    id: "meta-llama/llama-3.1-8b-instruct",
    label: "Llama 3.1 8B Instruct",
    provider: "Meta",
    ctx: 128000,
    tags: ["chat", "code", "free"],
    price: null,
    free: true,
  },
  {
    id: "google/gemma-2-9b-it",
    label: "Gemma 2 9B IT",
    provider: "Google",
    ctx: 8192,
    tags: ["chat", "free"],
    price: null,
    free: true,
  },
  {
    id: "deepseek/deepseek-coder",
    label: "DeepSeek Coder",
    provider: "DeepSeek",
    ctx: 16000,
    tags: ["code"],
    price: { in: 0, out: 0 },
    free: true,
  },
  {
    id: "anthropic/claude-3-haiku",
    label: "Claude 3 Haiku",
    provider: "Anthropic",
    ctx: 200000,
    tags: ["chat"],
    price: { in: 0.25, out: 1.25 },
    free: false,
  },
]);

/** interner Katalog-Cache, wird von loadModelCatalog() aktualisiert */
let _catalogCache: ModelEntry[] = [...DEFAULTS];

export const MODELS: Readonly<ModelEntry[]> = DEFAULTS;

const FALLBACK_DEFAULT_ID = "mistral/mistral-7b-instruct";
export const DEFAULT_MODEL_ID: string = MODELS[0]?.id ?? FALLBACK_DEFAULT_ID;

function toNumberSafe(v: unknown, d = 0): number {
  const n = typeof v === "string" ? parseFloat(v) : (typeof v === "number" ? v : NaN);
  return Number.isFinite(n) ? n : d;
}

function normalize(e: Omit<ModelEntry, "free"> & Partial<Pick<ModelEntry, "free">>): ModelEntry {
  const price = e.price ?? null;
  const freeFromPrice =
    price !== null && toNumberSafe(price.in, 0) === 0 && toNumberSafe(price.out, 0) === 0;
  const freeFromTags = Array.isArray(e.tags) && e.tags.includes("free");
  return {
    ...e,
    tags: Array.isArray(e.tags) ? [...e.tags] : [],
    price,
    free: e.free !== undefined ? e.free : (freeFromPrice || freeFromTags || false),
  };
}

export async function loadModelCatalog(opts: LoadOptions = {}): Promise<ModelEntry[]> {
  const { apiKey, allow, preferFree } = opts;
  let list: ModelEntry[] = MODELS.map(normalize);

  // Optionaler Online-Fetch (best effort, niemals Build brechen lassen)
  if (apiKey) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) {
        const json: any = await res.json();
        const apiModels: ModelEntry[] = Array.isArray(json?.data)
          ? json.data
              .filter((m: any) => typeof m?.id === "string")
              .map((m: any) => {
                const pricing = m?.pricing ?? {};
                const pin = toNumberSafe(pricing?.prompt ?? pricing?.input ?? 0, 0);
                const pout = toNumberSafe(pricing?.completion ?? pricing?.output ?? 0, 0);
                const ctx =
                  toNumberSafe(m?.context_length ?? m?.ctx ?? 0, 0) ||
                  32768; // defensiver Default
                const provider =
                  typeof m?.id === "string" && m.id.includes("/") ? m.id.split("/")[0] : "unknown";
                const tags: string[] = Array.isArray(m?.tags) ? m.tags : [];
                return normalize({
                  id: m.id as string,
                  label: (m?.name as string) || (m?.display_name as string) || (m.id as string),
                  provider,
                  ctx,
                  tags,
                  price: { in: pin, out: pout },
                });
              })
          : [];
        // API-Version bevorzugen, Defaults als Fallback behalten
        const byId = new Map<string, ModelEntry>();
        [...apiModels, ...list].forEach((m) => byId.set(m.id, m));
        list = [...byId.values()];
      }
    } catch {
      // bewusst schlucken – Katalog bleibt nutzbar
    }
  }

  if (allow && allow.length > 0) {
    const allowSet = new Set(allow);
    list = list.filter((m) => allowSet.has(m.id));
  }

  list.sort((a, b) => {
    if (preferFree) {
      const freeCmp = Number(b.free) - Number(a.free);
      if (freeCmp !== 0) return freeCmp;
    }
    return a.label.localeCompare(b.label);
  });

  _catalogCache = list;
  return list;
}

export function getCatalogCache(): ModelEntry[] {
  return _catalogCache;
}

export function labelForModel(id: string, list?: ModelEntry[]): string {
  const src = list ?? _catalogCache;
  const found = src.find((m) => m.id === id) || MODELS.find((m) => m.id === id);
  return found?.label ?? id;
}

export function chooseDefaultModel(
  opts: LoadOptions & { list?: ModelEntry[] } = {}
): string {
  const src = (opts.list && opts.list.length > 0 ? opts.list : _catalogCache).slice();
  if (src.length === 0) return DEFAULT_MODEL_ID;

  let pool = src;
  if (opts.allow && opts.allow.length > 0) {
    const allowSet = new Set(opts.allow);
    pool = pool.filter((m) => allowSet.has(m.id));
    if (pool.length === 0) pool = src; // Fallback
  }

  if (opts.preferFree) {
    const free = pool.find((m) => m.free);
    if (free) return free.id;
  }

  const defaultInPool = pool.find((m) => m.id === DEFAULT_MODEL_ID);
  if (defaultInPool) return defaultInPool.id;
  return pool[0]?.id ?? DEFAULT_MODEL_ID;
}
