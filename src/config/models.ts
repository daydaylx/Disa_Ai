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

const RECOMMENDED_MODEL_IDS = [
  "meta-llama/llama-3.1-8b-instruct",
  "mistralai/mistral-7b-instruct",
  "deepseek/deepseek-r1-distill-llama-8b",
  "qwen/qwen-2.5-7b-instruct",
  "meta-llama/llama-3.3-8b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "mistralai/mistral-nemo:free",
  "openai/gpt-4o-mini",
] as const;

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

/**
 * Generates dynamic fallback models based on OpenRouter API response
 * This creates a more resilient fallback that adapts to available models
 */
function generateIntelligentFallback(availableModels: ORModel[]): string[] {
  if (!availableModels || availableModels.length === 0) {
    // Ultimate fallback - known stable models (updated as of 2025)
    return [
      "meta-llama/llama-3.3-70b-instruct:free",
      "mistralai/mistral-nemo:free",
      "qwen/qwen-2.5-72b-instruct:free",
    ];
  }

  const fallbackModels: string[] = [];
  const priorities = [
    // High priority: Free models from major providers
    { pattern: /^meta-llama\/.*:free$/, limit: 2 },
    { pattern: /^mistralai\/.*:free$/, limit: 2 },
    { pattern: /^qwen\/.*:free$/, limit: 2 },
    { pattern: /^cognitivecomputations\/.*:free$/, limit: 1 },

    // Medium priority: Affordable commercial models
    { pattern: /^openai\/gpt-4o-mini/, limit: 1 },
    { pattern: /^anthropic\/claude-3/, limit: 1 },
    { pattern: /^google\/gemini/, limit: 1 },
  ];

  // Select models based on priority patterns
  for (const priority of priorities) {
    const matching = availableModels
      .filter((model) => priority.pattern.test(model.id))
      .slice(0, priority.limit)
      .map((model) => model.id);

    fallbackModels.push(...matching);
  }

  // If still not enough models, add top-rated free models
  if (fallbackModels.length < 5) {
    const additionalFree = availableModels
      .filter((model) => model.id.includes(":free") && !fallbackModels.includes(model.id))
      .slice(0, 5 - fallbackModels.length)
      .map((model) => model.id);

    fallbackModels.push(...additionalFree);
  }

  return fallbackModels.length > 0
    ? fallbackModels
    : [
        // Last resort hardcoded fallback
        "meta-llama/llama-3.3-70b-instruct:free",
      ];
}

/** Multi-layer resilient model ID retrieval with intelligent fallbacks */
async function getAllowedModelIds(): Promise<string[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced timeout

  try {
    // Layer 1: Try to load styles.json
    const response = await fetch("/styles.json", {
      signal: controller.signal,
      cache: "default", // Allow fresher data
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

    RECOMMENDED_MODEL_IDS.forEach((id) => allowed.add(id));

    const styleBasedModels = Array.from(allowed);

    // Validate that we have reasonable model coverage
    if (styleBasedModels.length > 0) {
      console.warn(`[Models] Loaded ${styleBasedModels.length} models from styles.json`);
      return styleBasedModels;
    } else {
      throw new Error("No models found in styles.json");
    }
  } catch (error) {
    console.warn("Failed to load styles.json, attempting dynamic fallback:", error);

    // Layer 2: Try to get dynamic fallback from OpenRouter API
    try {
      const availableModels = await getRawModels(undefined, 5000); // 5s timeout for API
      const intelligentFallback = generateIntelligentFallback(availableModels);
      const combined = Array.from(
        new Set<string>([...intelligentFallback, ...RECOMMENDED_MODEL_IDS]),
      );

      console.warn(`[Models] Using intelligent fallback: ${combined.length} models`);
      return combined;
    } catch (apiError) {
      console.warn("OpenRouter API also failed, using static fallback:", apiError);

      // Layer 3: Static fallback (last resort)
      const staticFallback = [
        "meta-llama/llama-3.3-70b-instruct:free",
        "mistralai/mistral-nemo:free",
        "qwen/qwen-2.5-72b-instruct:free",
        "meta-llama/llama-3.1-405b-instruct:free",
        ...RECOMMENDED_MODEL_IDS,
      ];

      const uniqueStatic = Array.from(new Set(staticFallback));

      console.warn(`[Models] Using static fallback: ${uniqueStatic.length} models`);
      return uniqueStatic;
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Enhanced model catalog loading with resilient fallback handling */
export async function loadModelCatalog(
  _opts?: CatalogOptions | boolean,
  toasts?: Parameters<typeof getRawModels>[2],
): Promise<ModelEntry[]> {
  try {
    const [data, allowedIds] = await Promise.all([
      getRawModels(undefined, undefined, toasts),
      getAllowedModelIds(),
    ]);

    const list: ORModel[] = Array.isArray(data) ? data : [];

    // Filter models that are both available in API and allowed by configuration
    const availableAllowed = list.filter((model) => allowedIds.includes(model.id));

    if (availableAllowed.length > 0) {
      console.warn(`[Models] Successfully loaded ${availableAllowed.length} available models`);
      return availableAllowed.map(toEntry).sort(byLabel);
    }

    // If no configured models are available, try intelligent intersection
    console.warn("[Models] No configured models available, attempting intelligent matching");

    const intelligentMatches = list.filter((model) => {
      // Match common patterns from allowedIds
      return allowedIds.some((allowedId) => {
        const allowedBase = allowedId.replace(/:free$/, "");
        const modelBase = model.id.replace(/:free$/, "");
        return (
          allowedBase === modelBase ||
          allowedId.includes(model.id) ||
          model.id.includes(allowedBase)
        );
      });
    });

    if (intelligentMatches.length > 0) {
      console.warn(`[Models] Found ${intelligentMatches.length} intelligent matches`);
      return intelligentMatches.map(toEntry).sort(byLabel);
    }

    // If still no matches, return the top available free models
    const fallbackModels = list.filter((model) => model.id.includes(":free")).slice(0, 10); // Limit to prevent overwhelming UI

    if (fallbackModels.length > 0) {
      console.warn(`[Models] Using ${fallbackModels.length} fallback free models`);
      return fallbackModels.map(toEntry).sort(byLabel);
    }

    // If API returned empty or no free models, use emergency fallback
    console.warn("[Models] No models available from API, using emergency fallback");
    throw new Error("Empty API response - triggering emergency fallback");
  } catch (error) {
    console.error("[Models] Failed to load model catalog:", error);

    // Emergency fallback: Return minimal model set
    const emergencyModels: ModelEntry[] = [
      {
        id: "meta-llama/llama-3.3-70b-instruct:free",
        label: "Llama 3.3 70B (Free)",
        provider: "meta-llama",
        tags: ["free", "large"],
        safety: "free",
      },
      {
        id: "mistralai/mistral-nemo:free",
        label: "Mistral Nemo (Free)",
        provider: "mistralai",
        tags: ["free", "medium"],
        safety: "free",
      },
    ];

    console.warn(`[Models] Using emergency fallback: ${emergencyModels.length} models`);
    return emergencyModels;
  }
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
