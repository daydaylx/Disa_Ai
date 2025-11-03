import { getRawModels, type ORModel } from "../services/openrouter";
import { normalizePrice } from "../utils/pricing";
import type { ModelDescriptionMap } from "./modelDescriptions";
import { MODEL_POLICY } from "./modelPolicy";

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

let descriptionCache: ModelDescriptionMap | null = null;

const descriptionPromise: Promise<ModelDescriptionMap> = import("./modelDescriptions")
  .then((module) => {
    descriptionCache = module.GERMAN_DESCRIPTIONS;
    return descriptionCache;
  })
  .catch((error) => {
    console.warn("[Models] Failed to load German descriptions, using API fallbacks.", error);
    descriptionCache = {} as ModelDescriptionMap;
    return descriptionCache;
  });

async function ensureModelDescriptions(): Promise<ModelDescriptionMap> {
  return descriptionCache ?? (await descriptionPromise);
}

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

/**
 * Deutsche, laienfreundliche Modellbeschreibungen
 * Überschreibt die englischen API-Beschreibungen mit verständlichen deutschen Texten
 */

/**
 * Gibt eine deutsche, laienfreundliche Beschreibung zurück
 * Falls keine spezielle Beschreibung existiert, wird die API-Beschreibung gekürzt
 */
function getGermanDescription(
  id: string,
  apiDescription: string | undefined,
  descriptions: ModelDescriptionMap,
): string | undefined {
  // Zuerst: Manuelle deutsche Beschreibung
  if (descriptions[id]) {
    return descriptions[id];
  }

  // Zweite Option: API-Beschreibung kürzen (falls vorhanden)
  if (apiDescription && apiDescription.length > 0) {
    // Kürze auf erste 120 Zeichen + "..."
    const trimmed = apiDescription.trim();
    if (trimmed.length > 140) {
      return trimmed.slice(0, 137) + "...";
    }
    return trimmed;
  }

  // Fallback: keine Beschreibung
  return undefined;
}

function toEntry(m: ORModel, descriptions: ModelDescriptionMap): ModelEntry {
  const prov = deriveProvider(m.id);
  const normalizedPrompt = normalizePrice(m.pricing?.prompt);
  const normalizedCompletion = normalizePrice(m.pricing?.completion);
  let pricing: Price | undefined;

  if (normalizedPrompt !== undefined || normalizedCompletion !== undefined) {
    pricing = {};
    if (normalizedPrompt !== undefined) {
      pricing.in = normalizedPrompt;
    }
    if (normalizedCompletion !== undefined) {
      pricing.out = normalizedCompletion;
    }
  }

  return {
    id: m.id,
    label: m.name ?? m.id,
    description: getGermanDescription(m.id, m.description, descriptions),
    ...(prov ? { provider: prov } : {}),
    ctx: m.context_length,
    ...(pricing ? { pricing } : {}),
    tags: m.tags ?? [],
    safety: deriveModelSafety(m),
  };
}

function byLabel(a: ModelEntry, b: ModelEntry) {
  const A = (a.label ?? a.id).toLowerCase();
  const B = (b.label ?? b.id).toLowerCase();
  return A.localeCompare(B);
}

function uniqueIds(values: Iterable<string>): string[] {
  return Array.from(new Set(values));
}

function normalizeModelId(id: string): string {
  return id.replace(/:free$/, "");
}

/**
 * Generates dynamic fallback models based on OpenRouter API response
 * This creates a more resilient fallback that adapts to available models
 */
function generateIntelligentFallback(availableModels: ORModel[]): string[] {
  const preferred = Array.from(MODEL_POLICY.recommendedModelIds);
  if (!availableModels || availableModels.length === 0) {
    return preferred;
  }

  const availableSet = new Set(availableModels.map((m) => m.id));
  const intersection = preferred.filter((id) => availableSet.has(id));
  if (intersection.length > 0) {
    return intersection;
  }

  const freeCandidates = availableModels
    .filter((model) => model.id.includes(":free"))
    .slice(0, MODEL_POLICY.fallback.maxFreeFallback)
    .map((model) => model.id);

  return freeCandidates.length > 0 ? freeCandidates : preferred;
}

async function loadAllowedIdsFromStyles(): Promise<string[] | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), MODEL_POLICY.fallback.stylesTimeoutMs);

  try {
    const response = await fetch("/styles.json", {
      signal: controller.signal,
      cache: "default",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const stylesData = await response.json();
    const allowed = new Set<string>(MODEL_POLICY.recommendedModelIds);

    if (stylesData?.styles && Array.isArray(stylesData.styles)) {
      for (const style of stylesData.styles) {
        if (style.allow && Array.isArray(style.allow)) {
          for (const modelId of style.allow) {
            allowed.add(modelId);
          }
        }
      }
    }

    const result = Array.from(allowed);
    if (result.length > 0) {
      console.warn(`[Models] Loaded ${result.length} models from styles.json`);
      return result;
    }

    return null;
  } catch (error) {
    console.warn("[Models] Unable to load styles.json allow-list, falling back.", error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function loadAllowedIdsFromApi(): Promise<string[] | null> {
  try {
    const availableModels = await getRawModels(undefined, MODEL_POLICY.fallback.apiCacheTtlMs);
    const intelligentFallback = generateIntelligentFallback(availableModels);

    if (intelligentFallback.length > 0) {
      console.warn(
        `[Models] Using intelligent fallback based on API models: ${intelligentFallback.length}`,
      );
      return uniqueIds(intelligentFallback);
    }

    return null;
  } catch (error) {
    console.warn("[Models] Unable to build fallback from OpenRouter API.", error);
    return null;
  }
}

function pickAllowedModels(list: ORModel[], allowedIds: string[]): ORModel[] {
  if (!allowedIds.length) return [];
  const allowedSet = new Set(allowedIds);
  return list.filter((model) => allowedSet.has(model.id));
}

function pickByBaseId(list: ORModel[], allowedIds: string[]): ORModel[] {
  if (!allowedIds.length) return [];
  const normalizedAllowed = allowedIds.map(normalizeModelId);
  return list.filter((model) => normalizedAllowed.includes(normalizeModelId(model.id)));
}

function pickFreeModels(list: ORModel[]): ORModel[] {
  return list
    .filter((model) => model.id.includes(":free"))
    .slice(0, MODEL_POLICY.fallback.maxFreeFallback);
}

/* ---- Public API ---- */

/** Multi-layer resilient model ID retrieval with intelligent fallbacks */
async function getAllowedModelIds(): Promise<string[]> {
  const styleIds = await loadAllowedIdsFromStyles();
  if (styleIds?.length) {
    return uniqueIds(styleIds);
  }

  const apiIds = await loadAllowedIdsFromApi();
  if (apiIds?.length) {
    return uniqueIds(apiIds);
  }

  console.warn("[Models] Falling back to static recommended model list.");
  return Array.from(MODEL_POLICY.recommendedModelIds);
}

/** Enhanced model catalog loading with resilient fallback handling */
export async function loadModelCatalog(
  _opts?: CatalogOptions | boolean,
  toasts?: Parameters<typeof getRawModels>[2],
): Promise<ModelEntry[]> {
  try {
    const [data, allowedIds, descriptions] = await Promise.all([
      getRawModels(undefined, undefined, toasts),
      getAllowedModelIds(),
      ensureModelDescriptions(),
    ]);

    const list: ORModel[] = Array.isArray(data) ? data : [];

    const allowedMatches = pickAllowedModels(list, allowedIds);
    if (allowedMatches.length > 0) {
      console.warn(`[Models] Loaded ${allowedMatches.length} configured models from API.`);
      return allowedMatches.map((model) => toEntry(model, descriptions)).sort(byLabel);
    }

    const baseMatches = pickByBaseId(list, allowedIds);
    if (baseMatches.length > 0) {
      console.warn(`[Models] Using ${baseMatches.length} base-ID matches as fallback.`);
      return baseMatches.map((model) => toEntry(model, descriptions)).sort(byLabel);
    }

    const freeFallback = pickFreeModels(list);
    if (freeFallback.length > 0) {
      console.warn(`[Models] Falling back to ${freeFallback.length} free models from API.`);
      return freeFallback.map((model) => toEntry(model, descriptions)).sort(byLabel);
    }

    throw new Error("Empty API response - triggering emergency fallback");
  } catch (error) {
    console.error("[Models] Failed to load model catalog:", error);

    // Emergency fallback: Return minimal model set
    const emergencyModels: ModelEntry[] = MODEL_POLICY.fallback.emergencyModels.map((entry) => ({
      id: entry.id,
      label: entry.label,
      description: entry.description,
      provider: entry.provider,
      tags: entry.tags,
      safety: entry.safety,
    }));

    console.warn(`[Models] Using emergency fallback: ${emergencyModels.length} models`);
    return emergencyModels;
  }
}
