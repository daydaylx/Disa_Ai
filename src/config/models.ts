import { resolvePublicAssetUrl } from "../lib/publicAssets";

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
  /** Beschreibungstext des Modells */
  description?: string | undefined;
  /** Anbieterpräfix (z. B. "openai" in "openai/o4-mini") */
  provider?: string | undefined;
  /** Kontextlänge (Tokens) */
  ctx?: number | undefined;
  /** Kontextlänge in K (aus JSON abgeleitet) */
  contextK?: number | undefined;
  /** Rohwert der Kontextlänge in Tokens (aus JSON) */
  contextTokens?: number | undefined;
  /** zusätzliche Tags/Hint */
  tags: string[];
  /** Preisschätzung (prompt/completion je 1k Tokens) */
  pricing?: Price | undefined;
  /** grobe Einordnung (nur für Heuristiken/Filter) */
  safety: ModelSafety;
  /** Qualitäts-Score 0-100 aus JSON */
  qualityScore?: number;
  /** Offenheits-Score 0-1 (oder abgeleitet aus censor_score) */
  openness?: number;
  /** Censor Score 0-100 (optional) */
  censorScore?: number;
  /** Empfohlenes Modell? */
  recommended?: boolean;
  /** Tier (z.B. free, premium) aus JSON */
  tier?: string;
  /** Zusätzliche Hinweise aus JSON */
  notes?: string;
  /** Sampling Capabilities: best-effort heuristics, optional in JSON */
  capabilities?: {
    temperature?: boolean;
    top_p?: boolean;
    presence_penalty?: boolean;
  };
};

export type CatalogOptions = {
  preferOnline?: boolean;
};

/* ---- JSON Model Type ---- */
type JsonModel = {
  id: string;
  name: string;
  desc: string;
  price_in: number;
  price_out: number;
  context_tokens?: number;
  context_k?: number;
  quality_score?: number;
  censor_score?: number;
  openness?: number;
  tags?: string[];
  recommended?: boolean;
  tier?: string;
  notes?: string;
  capabilities?: {
    temperature?: boolean;
    top_p?: boolean;
    presence_penalty?: boolean;
  };
};

/* ---- interne Helfer ---- */

function deriveProvider(id: string): string | undefined {
  const ix = id.indexOf("/");
  return ix > 0 ? id.slice(0, ix) : undefined;
}

function deriveModelSafety(model: JsonModel): ModelSafety {
  const id = model.id.toLowerCase();
  // Wenn beide Preise 0 sind oder :free im Namen → "free"
  if ((model.price_in === 0 && model.price_out === 0) || /:free$/.test(id)) {
    return "free";
  }
  return "moderate";
}

function deriveTags(model: JsonModel): string[] {
  const tags = new Set<string>(model.tags ?? []);
  if (model.price_in === 0 && model.price_out === 0) {
    tags.add("free");
  }
  if (/:free$/.test(model.id)) {
    tags.add("free");
  }
  return Array.from(tags);
}

function jsonModelToEntry(m: JsonModel): ModelEntry {
  const prov = deriveProvider(m.id);
  let pricing: Price | undefined;

  // Nur Pricing setzen wenn nicht beide 0 sind
  if (m.price_in !== 0 || m.price_out !== 0) {
    pricing = {
      in: m.price_in,
      out: m.price_out,
    };
  }

  const contextTokens =
    m.context_tokens ?? (m.context_k ? Math.round(m.context_k * 1024) : undefined);
  const openness =
    m.openness ?? (typeof m.censor_score === "number" ? 1 - m.censor_score / 100 : undefined);

  return {
    id: m.id,
    label: m.name,
    description: m.desc,
    ctx: contextTokens,
    contextTokens,
    contextK: m.context_k,
    qualityScore: m.quality_score,
    openness,
    censorScore: m.censor_score,
    recommended: m.recommended,
    tier: m.tier,
    notes: m.notes,
    ...(prov ? { provider: prov } : {}),
    ...(pricing ? { pricing } : {}),
    tags: deriveTags(m),
    safety: deriveModelSafety(m),
    ...(m.capabilities ? { capabilities: m.capabilities } : {}),
  };
}

function byLabel(a: ModelEntry, b: ModelEntry) {
  const A = (a.label ?? a.id).toLowerCase();
  const B = (b.label ?? b.id).toLowerCase();
  return A.localeCompare(B);
}

/* ---- Public API ---- */

/**
 * Lädt Modelle aus /public/models.json
 */
export async function loadModelCatalog(_opts?: CatalogOptions | boolean): Promise<ModelEntry[]> {
  const url = resolvePublicAssetUrl("models.json");

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `models.json konnte nicht geladen werden (HTTP ${response.status}: ${response.statusText})`,
      );
    }

    const data: JsonModel[] = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("models.json ist leer oder ungültig (public/models.json)");
    }

    const models = data.map(jsonModelToEntry).sort(byLabel);
    return models;
  } catch (error) {
    console.error(`[Models] Failed to load ${url}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Model-Katalog konnte nicht geladen werden (public/models.json)");
  }
}
