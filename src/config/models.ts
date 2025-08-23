export interface ModelEntry {
  id: string;
  label: string;
  free?: boolean;
  context?: number;
  provider?: string;
}

export const DEFAULTS: ModelEntry[] = [
  { id: "mistralai/mistral-nemo:free", label: "Mistral Nemo (free)", free: true },
  { id: "qwen/qwen-2.5-7b-instruct:free", label: "Qwen 2.5 7B (free)", free: true },
  { id: "nousresearch/hermes-3-llama-3.1-8b:free", label: "Hermes 3 8B (free)", free: true },
  { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B (free)", free: true }
];

export const DEFAULT_MODEL_ID: string =
  (DEFAULTS[0] ?? { id: "meta-llama/llama-3.3-70b-instruct:free" }).id;

/** optionaler OpenRouter-Fetch (wenn API-Key vorhanden) */
export async function fetchOpenRouterModels(apiKey?: string, signal?: AbortSignal): Promise<ModelEntry[]> {
  if (!apiKey) return [];
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: signal ?? null,
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data?.data) ? data.data : [];
    return items.map((m: any) => {
      const id = String(m.id ?? "");
      const label = String(m.name ?? m.id ?? "");
      const free = !!(m.pricing?.prompt === 0 && m.pricing?.completion === 0) || /:free$/.test(id);
      const context = typeof m.context_length === "number" ? m.context_length : undefined;
      const provider = typeof m.provider === "string" ? m.provider : undefined;
      return { id, label, free, context, provider } as ModelEntry;
    }).filter((m: ModelEntry) => m.id && m.label);
  } catch {
    return [];
  }
}

/** Merge: defaults + online; optional Allow-Filter; Sortierung: free → alpha */
export async function loadModelCatalog(opts?: {
  apiKey?: string;
  allow?: string[] | null;
  preferFree?: boolean;
  signal?: AbortSignal;
}): Promise<ModelEntry[]> {
  const online = await fetchOpenRouterModels(opts?.apiKey, opts?.signal);
  const merged: Record<string, ModelEntry> = {};
  for (const m of [...DEFAULTS, ...online]) merged[m.id] = m;

  let list = Object.values(merged);
  const allow = Array.isArray(opts?.allow) ? opts!.allow! : null;
  if (allow && allow.length) {
    const set = new Set(allow);
    const filtered = list.filter(m => set.has(m.id));
    if (filtered.length) list = filtered;
  }
  list.sort((a, b) => (Number(!!b.free) - Number(!!a.free)) || a.label.localeCompare(b.label));
  return list;
}

export function chooseDefaultModel(list: ModelEntry[], preferFree = true): string {
  const nonEmpty = list.length ? list : DEFAULTS;
  const chosen = preferFree
    ? (nonEmpty.find(m => m.free) ?? nonEmpty[0] ?? DEFAULTS[0])
    : (nonEmpty[0] ?? DEFAULTS[0]);
  return chosen.id;
}

export function labelForModel(id: string, catalog: ModelEntry[]): string {
  return (catalog.find(m => m.id === id) ?? DEFAULTS.find(m => m.id === id) ?? { label: id }).label;
}

/** Legacy-Export, falls irgendwo noch referenziert */
export const MODELS = DEFAULTS;
