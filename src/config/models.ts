import { getRawModels, type ORModel } from "../services/openrouter";

/** Policy-Typ (wird von rolePolicy/roleStore/Settings importiert) */
export type Safety = "any" | "moderate" | "strict" | "loose";

/** Interne Einstufung für Modelle (hier darf "free" vorkommen) */
export type ModelSafety = "free" | "moderate" | "strict" | "any";

export type Price = {
  in?: number | undefined;
  out?: number | undefined;
};

export type ModelEntry = {
  id: string;
  /** Anzeigename; falls leer, id verwenden */
  label?: string | undefined;
  /** Anbieterpräfix (z. B. "openai" in "openai/o4-mini") */
  provider?: string | undefined;
  /** Kontextlänge (Tokens) */
  ctx?: number | undefined;
  /** zusätzliche Tags/Hint */
  tags: string[];
  /** Preisschätzung (prompt/completion je 1k Tokens) */
  pricing?: Price | undefined;
  /** grobe Einordnung (nur für Heuristiken/Filter) */
  safety: ModelSafety;
};

export type CatalogOptions = {
  preferOnline?: boolean;
};

/* ---- interne Helfer ---- */

function deriveProvider(id: string): string | undefined {
  const ix = id.indexOf("/");
  return ix > 0 ? id.slice(0, ix) : undefined;
}

function deriveModelSafety(m: ORModel): ModelSafety {
  const id = m.id.toLowerCase();
  const tags = (m.tags ?? []).map((t) => t.toLowerCase());
  if (tags.includes("free") || /:free$/.test(id)) return "free";
  if (tags.includes("strict")) return "strict";
  return "moderate";
}

function toEntry(m: ORModel): ModelEntry {
  const prov = deriveProvider(m.id);
  return {
    id: m.id,
    label: m.name ?? m.id,
    ...(prov ? { provider: prov } : {}),
    ctx: m.context_length,
    pricing: {
      in: m.pricing?.prompt,
      out: m.pricing?.completion,
    },
    tags: m.tags ?? [],
    safety: deriveModelSafety(m),
  };
}

function byLabel(a: ModelEntry, b: ModelEntry) {
  const A = (a.label ?? a.id).toLowerCase();
  const B = (b.label ?? b.id).toLowerCase();
  return A.localeCompare(B);
}

/* ---- Public API ---- */

/** Sammelt alle erlaubten Modell-IDs aus styles.json */
async function getAllowedModelIds(): Promise<string[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch("/styles.json", {
      signal: controller.signal,
      cache: "force-cache", // Aggressive caching für statische Datei
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const stylesData = await response.json();
    const allowed = new Set<string>();

    if (stylesData?.styles && Array.isArray(stylesData.styles)) {
      for (const style of stylesData.styles) {
        if (style.allow && Array.isArray(style.allow)) {
          style.allow.forEach((modelId: string) => allowed.add(modelId));
        }
      }
    }

    return Array.from(allowed);
  } catch (error) {
    console.warn("Failed to load allowed models from styles.json:", error);
    // Fallback: Erlaube alle populären Modelle wenn styles.json nicht lädt
    return [
      "meta-llama/llama-3.3-70b-instruct:free",
      "meta-llama/llama-3.1-8b-instruct:free",
      "mistralai/mistral-7b-instruct:free",
      "openai/gpt-4o-mini",
      "openai/o1-mini",
      "anthropic/claude-3.5-haiku",
      "google/gemini-flash-1.5",
    ];
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Lädt und transformiert das OpenRouter-Model-Listing, gefiltert nach erlaubten Modellen. */
export async function loadModelCatalog(_opts?: CatalogOptions | boolean): Promise<ModelEntry[]> {
  const [data, allowedIds] = await Promise.all([getRawModels(), getAllowedModelIds()]);

  const list: ORModel[] = Array.isArray(data) ? data : [];

  // Filtere nur die Modelle, die in styles.json erlaubt sind
  const filtered = list.filter((model) => allowedIds.includes(model.id));

  return filtered.map(toEntry).sort(byLabel);
}

/** Wählt ein Default-Modell aus der Liste. */
export function chooseDefaultModel(
  list: ModelEntry[],
  opts?: { allow?: string[] | null; preferFree?: boolean },
): string | null {
  if (!list || list.length === 0) return null;

  // 1) allow-Liste hat Vorrang
  const allow = opts?.allow && opts.allow.length ? opts.allow : null;
  if (allow) {
    const match = list.find((m) => allow.includes(m.id));
    if (match) return match.id;
  }

  // 2) Free bevorzugen
  if (opts?.preferFree) {
    const free = list.find((m) => m.safety === "free");
    if (free) return free.id;
  }

  // 3) Heuristik über gängige Kandidaten
  const preferred = list.find((m) =>
    /gpt-4o|o4-mini|mistral|mistralai|gemma|qwen|phi|llama/i.test(m.id),
  );
  if (preferred) return preferred.id;

  // 4) Fallback
  return list[0]!.id;
}

/** Einfache Label-Funktion (alte Signatur beibehalten). */
export function labelForModel(id: string, preferredLabel?: string): string {
  return preferredLabel && preferredLabel.trim().length > 0 ? preferredLabel : id;
}
