export interface ModelEntry {
  id: string;
  label: string;
  provider?: string;
  ctx?: number;
  tags?: string[];
  price?: { in: number; out: number };
  /** Abgeleitet: true, wenn Modell als „free/cheap“ markiert ist (für UI-Filter). */
  free?: boolean;
}

export interface CatalogOptions {
  apiKey?: string;
  allow?: string[] | null;
  preferFree?: boolean;
}

/** Minimal stabiler Katalog – typisiert und konsistent. */
export const MODELS: ModelEntry[] = [
  {
    id: "openrouter/auto",
    label: "OpenRouter Auto",
    provider: "openrouter",
    tags: ["meta", "auto"],
  },
  {
    id: "mistralai/mistral-small",
    label: "Mistral Small",
    provider: "mistral",
    ctx: 32_000,
    tags: ["code", "cheap"],
    price: { in: 0.1, out: 0.3 },
  },
  {
    id: "google/gemma-2-9b-it",
    label: "Gemma 2 9B Instruct",
    provider: "google",
    ctx: 8_000,
    tags: ["code", "cheap"],
    price: { in: 0.05, out: 0.1 },
  },
];

export const DEFAULT_MODEL_ID = "openrouter/auto";

/** Liefert menschenlesbaren Namen; fällt auf id zurück. */
export function labelForModel(id: string, list: ModelEntry[] = MODELS): string {
  const m = list.find((x) => x.id === id);
  return m ? m.label : id;
}

/**
 * Katalog-Lader mit:
 * - allow: Whitelist von IDs
 * - preferFree: sortiert „free/cheap“ nach vorne
 * - setzt abgeleitetes Flag `free` (benutzt von Settings.tsx)
 */
export async function loadModelCatalog(opts: CatalogOptions = {}): Promise<ModelEntry[]> {
  const { allow = null, preferFree = false } = opts;
  let list = MODELS;

  if (allow && allow.length > 0) {
    const allowSet = new Set(allow);
    list = list.filter((m) => allowSet.has(m.id));
  }

  // abgeleitetes `free`-Flag setzen
  list = list.map((m) => ({
    ...m,
    free: (m.tags?.includes("free") ?? false) || (m.tags?.includes("cheap") ?? false),
  }));

  if (preferFree) {
    list = [...list].sort((a, b) => Number(b.free) - Number(a.free));
  }

  return list;
}

/**
 * Wählt ein gültiges Default-Modell:
 * - Wenn currentId vorhanden und im Katalog: nimm das.
 * - Sonst DEFAULT_MODEL_ID, falls vorhanden.
 * - Sonst das erste im Katalog.
 */
export function chooseDefaultModel(list: ModelEntry[], currentId?: string): string {
  if (currentId && list.some((m) => m.id === currentId)) return currentId;
  if (list.some((m) => m.id === DEFAULT_MODEL_ID)) return DEFAULT_MODEL_ID;
  return list[0]?.id ?? DEFAULT_MODEL_ID;
}
