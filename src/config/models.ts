export type ModelInfo = {
  id: string;
  label: string;
  free: boolean;
  ctx?: number | null;
  price?: number | null; // Preis pro 1M tokens prompt (falls verfügbar)
};

const KEY_NAME = "disa_api_key";

/** Sehr günstige / freie Defaults (funktionieren ohne Online-Fetch) */
const DEFAULTS: ModelInfo[] = [
  { id: "mistralai/mistral-nemo:free",          label: "Mistral Nemo (Free)",            free: true,  ctx: 131072, price: 0 },
  { id: "qwen/qwen-2.5-7b-instruct:free",       label: "Qwen 2.5 7B (Free)",             free: true,  ctx: 131072, price: 0 },
  { id: "nousresearch/hermes-3-llama-3.1-8b:free", label: "Hermes 3 L3.1 8B (Free)",     free: true,  ctx: 131072, price: 0 },
  { id: "meta-llama/llama-3.3-70b-instruct:free",  label: "Llama 3.3 70B (Free)",        free: true,  ctx: 131072, price: 0 },
];

function humanizeModel(id: string): string {
  try {
    const core = id.split(":")[0] ?? id;
    const tag = id.includes(":free") ? " (Free)" : "";
    // netter Name
    return core
      .replace("meta-llama/", "Llama ")
      .replace("mistralai/", "Mistral ")
      .replace("qwen/", "Qwen ")
      .replace("nousresearch/", "Hermes ")
      .replace(/[-_/]+/g, " ")
      .replace(/\bllama 3\.1\b/gi, "Llama 3.1")
      .replace(/\bllama 3\.3\b/gi, "Llama 3.3")
      .replace(/\bqwen 2\.5\b/gi, "Qwen 2.5")
      + tag;
  } catch { return id; }
}

function getApiKey(): string | null {
  try { return localStorage.getItem(KEY_NAME)?.replace(/^"+|"+$/g, "") ?? null; } catch { return null; }
}

export async function fetchOpenRouterModels(): Promise<ModelInfo[]> {
  const key = getApiKey();
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "HTTP-Referer": location.origin,
    "X-Title": "Disa AI",
  };
  if (key) headers["Authorization"] = `Bearer ${key}`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", { headers });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data?.models) ? data.models : []);
    const mapped: ModelInfo[] = list.map((m: any) => {
      const id: string = m.id ?? m.name ?? "";
      if (!id) return null;
      const price = (m.pricing?.prompt ?? m.pricing?.input ?? null) as number | null;
      const free = String(id).includes(":free") || price === 0;
      const ctx = (m.context_length ?? m.topology?.contextLength ?? null) as number | null;
      return { id, label: humanizeModel(id), free, ctx, price };
    }).filter(Boolean);
    return mapped;
  } catch {
    return [];
  }
}

export async function loadModelCatalog(opts?: { allow?: string[] | null }): Promise<ModelInfo[]> {
  const online = await fetchOpenRouterModels().catch(() => []);
  // Merge + Dedupe
  const byId = new Map<string, ModelInfo>();
  for (const m of [...DEFAULTS, ...online]) {
    if (!m || !m.id) continue;
    if (!byId.has(m.id)) byId.set(m.id, m);
  }
  let out = Array.from(byId.values());

  // Optionaler allow-Filter (vom gewählten Stil)
  const allow = opts?.allow?.map(x => x.toLowerCase()) ?? null;
  if (allow && allow.length) {
    const allowSet = new Set(allow);
    const filtered = out.filter(m => allowSet.has(m.id.toLowerCase()));
    if (filtered.length > 0) out = filtered; // nur filtern, wenn es Ergebnisse gibt
  }

  // Sortierung: Free zuerst, dann Label
  out.sort((a, b) => {
    const freeScore = (Number(b.free) - Number(a.free));
    if (freeScore !== 0) return freeScore;
    return a.label.localeCompare(b.label);
  });

  return out;
}

export function chooseDefaultModel(list: ModelInfo[]): string {
  if (!list.length) return DEFAULTS[0].id;
  const free = list.find(m => m.free);
  return (free ?? list[0]).id;
}

export function labelForModel(id: string): string {
  const found = [...DEFAULTS].find(m => m.id === id);
  return found?.label ?? humanizeModel(id);
}
