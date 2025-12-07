import { resolvePublicAssetUrl } from "../lib/publicAssets";
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
  /** Beschreibungstext des Modells */
  description?: string | undefined;
  /** Anbieterpräfix (z. B. "openai" in "openai/o4-mini") */
  provider?: string | undefined;
  /** Kontextlänge (Tokens) */
  ctx?: number | undefined;
  /** Kontextlänge in K (abgeleitet) */
  contextK?: number | undefined;
  /** Rohwert der Kontextlänge in Tokens */
  contextTokens?: number | undefined;
  /** zusätzliche Tags/Hint */
  tags: string[];
  /** Preisschätzung (prompt/completion je 1k Tokens) */
  pricing?: Price | undefined;
  /** grobe Einordnung (nur für Heuristiken/Filter) */
  safety: ModelSafety;
  /** Qualitäts-Score 0-100 (kuratiert) */
  qualityScore?: number;
  /** Offenheits-Score 0-1 (kuratiert oder abgeleitet) */
  openness?: number;
  /** Censor Score 0-100 (optional) */
  censorScore?: number;
  /** Empfohlenes Modell? */
  recommended?: boolean;
  /** Tier (z.B. free, premium) aus JSON */
  tier?: string;
  /** Zusätzliche Hinweise aus JSON */
  notes?: string;
  /** Sampling Capabilities: best-effort heuristics, optional */
  capabilities?: {
    temperature?: boolean;
    top_p?: boolean;
    presence_penalty?: boolean;
  };
};

export type CatalogOptions = {
  preferOnline?: boolean;
  forceRefresh?: boolean;
};

type ModelMetadata = {
  qualityScore?: number;
  openness?: number;
  label?: string;
  description?: string;
  tags?: string[];
};

/* ---- interne Helfer ---- */

function deriveProvider(id: string): string | undefined {
  const ix = id.indexOf("/");
  return ix > 0 ? id.slice(0, ix) : undefined;
}

/** Filtert strikt nach kostenlosen Modellen */
function isFreeModel(model: ORModel): boolean {
  if (model.id.endsWith(":free")) return true;

  const promptPrice = parseFloat(String(model.pricing?.prompt ?? "0"));
  const completionPrice = parseFloat(String(model.pricing?.completion ?? "0"));

  return promptPrice === 0 && completionPrice === 0;
}

function deriveContextTokens(model: ORModel): number | undefined {
  return model.context_length ?? model.top_provider?.context_length;
}

function mergeTags(metaTags?: string[], apiTags?: string[]): string[] {
  return Array.from(new Set(["free", ...(metaTags ?? []), ...(apiTags ?? [])]));
}

function sortKnownFirst(
  metadata: Record<string, ModelMetadata>,
  a: ModelEntry,
  b: ModelEntry,
): number {
  const knownA = metadata[a.id] ? 1 : 0;
  const knownB = metadata[b.id] ? 1 : 0;
  if (knownA !== knownB) return knownB - knownA;
  return (a.label || a.id).localeCompare(b.label || b.id);
}

/* ---- Public API ---- */

/**
 * Lädt den Hybrid-Katalog: Live-Modelle von OpenRouter + kuratierte Metadaten.
 */

export async function loadModelCatalog(opts?: CatalogOptions | boolean): Promise<ModelEntry[]> {
  const forceRefresh = typeof opts === "object" ? opts?.forceRefresh : false;
  try {
    const [apiModels, metadataResponse] = await Promise.all([
      getRawModels(undefined, undefined, undefined, forceRefresh), // Live-Daten (lokal gecached im Service)
      fetch(resolvePublicAssetUrl("models_metadata.json"), { cache: "no-store" }).catch(() => null),
    ]);

    let metadata: Record<string, ModelMetadata> = {};
    if (metadataResponse?.ok) {
      metadata = (await metadataResponse.json()) as Record<string, ModelMetadata>;
    }

    const mergedModels = apiModels.filter(isFreeModel).map((apiModel) => {
      const meta = metadata[apiModel.id] ?? {};
      const contextTokens = deriveContextTokens(apiModel);

      const entry: ModelEntry = {
        id: apiModel.id,
        label: meta.label ?? apiModel.name ?? apiModel.id,
        description: meta.description ?? apiModel.description ?? "Keine Beschreibung verfügbar.",
        provider: deriveProvider(apiModel.id),
        ctx: contextTokens,
        contextTokens,
        contextK: contextTokens ? Math.round(contextTokens / 1024) : undefined,
        qualityScore: meta.qualityScore ?? 50,
        openness: meta.openness ?? 0.5,
        pricing: { in: 0, out: 0 },
        tags: mergeTags(meta.tags, apiModel.tags),
        safety: "free",
      };

      return entry;
    });

    return mergedModels.sort((a, b) => sortKnownFirst(metadata, a, b));
  } catch (error) {
    console.error("Fehler beim Laden des Hybrid-Katalogs:", error);
    return [];
  }
}
