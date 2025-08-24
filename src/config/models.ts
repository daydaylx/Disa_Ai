/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export type Price = { in: number; out: number } | null;

export interface ModelEntry {
  id: string;
  label: string;
  provider: string;
  ctx: number;
  tags: string[];   // z.B. ["chat","code","free"]
  price: Price;     // null oder {in,out} in USD / 1M Tokens (nur grob)
  free: boolean;    // abgeleitet aus price==0 oder Tag "free"
}

export interface LoadOptions {
  apiKey?: string;
  allow?: string[];
  preferFree?: boolean;
}

const DEFAULTS: Readonly<ModelEntry[]> = Object.freeze([
  // 1
  {
    id: "mistral/mistral-7b-instruct",
    label: "Mistral 7B Instruct",
    provider: "Mistral",
    ctx: 32768,
    tags: ["chat", "code", "free"],
    price: null,
    free: true,
  },
  // 2
  {
    id: "meta-llama/llama-3.1-8b-instruct",
    label: "Llama 3.1 8B Instruct",
    provider: "Meta",
    ctx: 128000,
    tags: ["chat", "code", "free"],
    price: null,
    free: true,
  },
  // 3
  {
    id: "google/gemma-2-9b-it",
    label: "Gemma 2 9B IT",
    provider: "Google",
    ctx: 8192,
    tags: ["chat", "free"],
    price: null,
    free: true,
  },
  // 4
  {
    id: "deepseek/deepseek-coder",
    label: "DeepSeek Coder",
    provider: "DeepSeek",
    ctx: 16000,
    tags: ["code", "free"],
    price: { in: 0, out: 0 },
    free: true,
  },
  // 5
  {
    id: "deepseek/deepseek-chat",
    label: "DeepSeek Chat",
    provider: "DeepSeek",
    ctx: 16000,
    tags: ["chat", "free"],
    price: { in: 0, out: 0 },
    free: true,
  },
  // 6
  {
    id: "qwen/qwen2.5-7b-instruct",
    label: "Qwen2.5 7B Instruct",
    provider: "Alibaba",
    ctx: 32768,
    tags: ["chat", "code", "free"],
    price: null,
    free: true,
  },
  // 7
  {
    id: "qwen/qwen2.5-coder-7b",
    label: "Qwen2.5 Coder 7B",
    provider: "Alibaba",
    ctx: 32768,
    tags: ["code", "free"],
    price: null,
    free: true,
  },
  // 8
  {
    id: "microsoft/phi-3-mini-128k-instruct",
    label: "Phi-3 Mini 128k Instruct",
    provider: "Microsoft",
    ctx: 128000,
    tags: ["chat", "code", "free"],
    price: null,
    free: true,
  },
  // 9 (sehr günstig)
  {
    id: "microsoft/phi-3-medium-128k-instruct",
    label: "Phi-3 Medium 128k Instruct",
    provider: "Microsoft",
    ctx: 128000,
    tags: ["chat"],
    price: { in: 0.05, out: 0.2 },
    free: false,
  },
  // 10
  {
    id: "huggingfaceh4/zephyr-7b-beta",
    label: "Zephyr 7B Beta",
    provider: "HuggingFaceH4",
    ctx: 8192,
    tags: ["chat", "free"],
    price: null,
    free: true,
  },
  // 11
  {
    id: "stabilityai/stablelm-2-1_6b",
    label: "StableLM 2 1.6B",
    provider: "StabilityAI",
    ctx: 8192,
    tags: ["chat", "free"],
    price: null,
    free: true,
  },
  // 12
  {
    id: "tiiuae/falcon-7b-instruct",
    label: "Falcon 7B Instruct",
    provider: "TII UAE",
    ctx: 8192,
    tags: ["chat", "free"],
    price: null,
    free: true,
  },
  // 13
  {
    id: "bigcode/starcoder2-7b",
    label: "StarCoder2 7B",
    provider: "BigCode",
    ctx: 8192,
    tags: ["code", "free"],
    price: null,
    free: true,
  },
  // 14
  {
    id: "codellama/codellama-7b-instruct",
    label: "CodeLlama 7B Instruct",
    provider: "Meta",
    ctx: 8192,
    tags: ["code", "free"],
    price: null,
    free: true,
  },
  // 15
  {
    id: "teknium/openhermes-2.5-mistral-7b",
    label: "OpenHermes 2.5 (Mistral 7B)",
    provider: "Teknium",
    ctx: 32768,
    tags: ["chat", "free"],
    price: null,
    free: true,
  },
  // 16
  {
    id: "nousresearch/hermes-2-mistral-7b",
    label: "Hermes 2 (Mistral 7B)",
    provider: "NousResearch",
    ctx: 32768,
    tags: ["chat", "code", "free"],
    price: null,
    free: true,
  },
  // 17 (günstig)
  {
    id: "upstage/solar-10.7b-instruct",
    label: "Solar 10.7B Instruct",
    provider: "Upstage",
    ctx: 32768,
    tags: ["chat"],
    price: { in: 0.1, out: 0.1 },
    free: false,
  },
  // 18
  {
    id: "openchat/openchat-3.5-7b",
    label: "OpenChat 3.5 7B",
    provider: "OpenChat",
    ctx: 8192,
    tags: ["chat", "free"],
    price: null,
    free: true,
  },
  // 19
  {
    id: "01-ai/yi-1.5-9b-chat",
    label: "Yi 1.5 9B Chat",
    provider: "01.AI",
    ctx: 32768,
    tags: ["chat", "free"],
    price: null,
    free: true,
  },
  // 20
  {
    id: "mosaicml/mpt-7b-instruct",
    label: "MPT 7B Instruct",
    provider: "MosaicML",
    ctx: 8192,
    tags: ["chat", "free"],
    price: null,
    free: true,
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

  // Optionaler Online-Fetch (best effort – niemals Build brechen)
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
                  toNumberSafe(m?.context_length ?? m?.ctx ?? 0, 0) || 32768;
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
