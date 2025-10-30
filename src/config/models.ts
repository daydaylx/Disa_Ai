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
  "cognitivecomputations/dolphin3.0-mistral-24b",
  "cognitivecomputations/dolphin3.0-mistral-24b:free",
  "cognitivecomputations/dolphin3.0-r1-mistral-24b",
  "venice/uncensored:free",
  "teknium/openhermes-2.5-mistral-7b",
  "huggingfaceh4/zephyr-7b-beta",
  "undi95/toppy-m-7b",
  "pygmalionai/mythalion-13b",
  "gryphe/mythomax-l2-13b",
  "gryphe/mythomist-7b",
  "nousresearch/nous-capybara-7b",
  "jondurbin/airoboros-l2-70b",
  "undi95/remm-slerp-l2-13b",
  "sao10k/l3.3-euryale-70b",
  "sao10k/l3.1-euryale-70b",
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

/**
 * Deutsche, laienfreundliche Modellbeschreibungen
 * Überschreibt die englischen API-Beschreibungen mit verständlichen deutschen Texten
 */
const GERMAN_DESCRIPTIONS: Record<string, string> = {
  // === Cydonia ===
  "thedrummer/cydonia-24b-v4.1":
    "Kreatives Schreiben, Rollenspiel, wenig Filter. Klingt freier und fantasievoller als übliche Schulbuch-Bots.",

  // === Grok (X.AI) ===
  "x-ai/grok-4-fast":
    "Sehr lange Chats, schneller Witz + Wissen-Allrounder. Gute Wahl für viel Kontext und flotte Antworten.",
  "x-ai/grok-2-1212":
    "Große Grok-Version mit verbesserter Logik und Wissensstand. Gut für komplexe Analysen und lange Gespräche.",
  "x-ai/grok-beta":
    "Experimentelle Grok-Version mit neuesten Features. Kann instabil sein, aber oft interessante Antworten.",

  // === DeepSeek ===
  "deepseek/deepseek-chat":
    "Chinesischer Allrounder: gut bei Logik, Code und mehrsprachigen Aufgaben. Solider Preis.",
  "deepseek/deepseek-chat-v3.1":
    "Logisches Denken, lange Begründungen – denkt erst, antwortet dann. Für knifflige Fragen und mehrstufige Erklärungen stark.",
  "deepseek/deepseek-r1":
    "Reasoning-Modell mit langen Denkschritten. Zeigt seine Überlegungen transparent – ideal für komplexe Probleme.",
  "deepseek/deepseek-r1:free":
    "Kostenlose Reasoning-Version. Denkt laut mit und erklärt Schritte – perfekt zum Lernen und Nachvollziehen.",
  "deepseek/deepseek-r1-distill-llama-8b":
    "Günstiges Reasoning-Light: angenehme Plauderei mit solider Struktur, symmetrische Kosten.",
  "deepseek/deepseek-coder":
    "Spezialisiert auf Programmierung. Versteht Code-Kontext gut, erklärt und debuggt sauber.",

  // === Meta Llama ===
  "meta-llama/llama-3.3-70b-instruct":
    "Großes Llama-Modell mit 70 Milliarden Parametern. Sehr gut bei komplexen Aufgaben und langen Kontexten.",
  "meta-llama/llama-3.3-70b-instruct:free":
    "Freies 70B-Flaggschiff – sehr stabil mit großer Kontexttiefe, wenn du etwas mehr Reserven willst.",
  "meta-llama/llama-3.1-405b-instruct":
    "Riesiges Llama-Modell für anspruchsvollste Aufgaben. Erstklassige Qualität bei allen Themen.",
  "meta-llama/llama-3.1-405b-instruct:free":
    "Kostenlose 405B-Version. Top-Qualität für komplexe Analysen, kreatives Schreiben und schwere Logik.",
  "meta-llama/llama-3.1-70b-instruct":
    "Bewährtes 70B-Modell mit ausgezeichnetem Preis-Leistungs-Verhältnis. Zuverlässig und vielseitig.",
  "meta-llama/llama-3.1-8b-instruct":
    "Sehr guter Allrounder für Gespräche, stabil und vorhersehbar – Standardtipp für produktive Chats.",
  "meta-llama/llama-3.3-8b-instruct:free":
    "Kostenloses Test-Pferd für lockere Chats. Wenn es hakt, wechsel auf Llama 3.1 8B.",
  "meta-llama/llama-3.2-3b-instruct":
    "Kleines, schnelles Llama für einfache Aufgaben. Spart Kosten bei unkomplizierten Fragen.",
  "meta-llama/llama-3.2-1b-instruct":
    "Winziges Llama für Basis-Gespräche. Ultra-günstig, aber begrenzte Fähigkeiten.",

  // === Mistral ===
  "mistralai/mistral-7b-instruct":
    "Schlank und schnell – perfekt für Dialoge und leichtere Aufgaben, wenn es besonders flott gehen soll.",
  "mistralai/mistral-nemo":
    "Mittelgroßes Mistral-Modell mit gutem Kontext. Ausgewogene Wahl für die meisten Aufgaben.",
  "mistralai/mistral-nemo:free":
    "Robustes Long-Context-Modell von Mistral. Solide Qualität bei null Kosten – super Standardwahl.",
  "mistralai/mistral-small-3.2-24b-instruct":
    "Kompaktes Mistral mit 24B – schnell, präzise, gut für Analysen und strukturierte Antworten.",
  "mistralai/mistral-small-3.2-24b-instruct:free":
    "Kostenlose 24B-Version. Guter Kompromiss zwischen Geschwindigkeit und Qualität.",
  "mistralai/mistral-large-2411":
    "Großes Mistral-Flaggschiff. Exzellent bei komplexen Aufgaben, Mehrsprachigkeit und Reasoning.",
  "mistralai/mistral-medium":
    "Mittlere Mistral-Größe für anspruchsvolle Standard-Aufgaben. Solide Allrounder-Qualität.",
  "mistralai/pixtral-12b":
    "Mistral mit Bildverständnis. Kann Fotos analysieren und darüber sprechen.",

  // === Qwen (Alibaba) ===
  "qwen/qwen-2.5-7b-instruct":
    "Preiswert und wortgewandt, oft etwas direkter Ton – ideal für schnelle Brainstorms.",
  "qwen/qwen-2.5-14b-instruct":
    "Mittelgroßes Qwen mit guter Balance. Stark bei Code, Mathe und mehrsprachigen Texten.",
  "qwen/qwen-2.5-32b-instruct":
    "Großes Qwen für anspruchsvolle Aufgaben. Sehr gut bei Logik, Sprachen und technischen Themen.",
  "qwen/qwen-2.5-72b-instruct":
    "Riesiges Qwen-Modell mit Top-Performance. Exzellent bei allen komplexen Aufgaben.",
  "qwen/qwen-2.5-72b-instruct:free":
    "Kostenlose 72B-Version. Premium-Qualität ohne Kosten – einer der besten Free-Modelle.",
  "qwen/qwen-2.5-coder-32b-instruct":
    "Spezialisiertes Code-Qwen. Versteht Programmierung ausgezeichnet, erklärt und debuggt präzise.",
  "qwen/qvq-72b-preview":
    "Experimentelles Qwen mit Visual-Reasoning. Kann Bilder analysieren und logisch darüber nachdenken.",

  // === OpenAI ===
  "openai/gpt-4o":
    "Neuestes großes GPT-Modell. Sehr stark bei allem – Reasoning, Kreativität, Code, Analyse.",
  "openai/gpt-4o-mini":
    "OpenAI-Allrounder: sehr verlässlich, starker Kontext und Toolsupport – ideal, wenn es einfach laufen soll.",
  "openai/gpt-4-turbo":
    "Schnelle GPT-4-Version mit großem Kontext. Exzellente Qualität bei komplexen Aufgaben.",
  "openai/gpt-4":
    "Klassisches GPT-4. Höchste Qualität, aber langsamer und teurer als neuere Varianten.",
  "openai/gpt-3.5-turbo":
    "Bewährtes Chat-Modell. Schnell und günstig für einfache bis mittlere Aufgaben.",
  "openai/o1":
    "Reasoning-GPT mit langen Denkphasen. Zeigt Überlegungen und löst komplexe Probleme schrittweise.",
  "openai/o1-mini":
    "Kompakte Reasoning-Version. Schneller als o1, aber immer noch mit starkem logischen Denken.",
  "openai/o1-preview": "Experimentelle o1-Version. Neueste Features, kann aber instabil sein.",

  // === Anthropic Claude ===
  "anthropic/claude-3-opus":
    "Größtes Claude-Modell. Exzellent bei Kreativität, Analyse, Ethik und komplexem Reasoning.",
  "anthropic/claude-3-sonnet":
    "Mittleres Claude mit ausgezeichnetem Preis-Leistungs-Verhältnis. Vielseitig und zuverlässig.",
  "anthropic/claude-3-haiku":
    "Schnelles, günstiges Claude. Gut für einfache Aufgaben und wenn Speed wichtig ist.",
  "anthropic/claude-3-haiku-20240307":
    "Anthropic-Qualität in schnell: präzise, kaum Halluzinationen, großartig für produktive Sessions.",
  "anthropic/claude-3.5-sonnet":
    "Verbessertes Sonnet mit noch besserer Qualität. Top-Wahl für die meisten Aufgaben.",
  "anthropic/claude-3.5-haiku":
    "Schnelleres Haiku mit verbesserter Qualität. Sehr gutes Preis-Leistungs-Verhältnis.",

  // === Google Gemini ===
  "google/gemini-pro":
    "Googles großes Sprachmodell. Stark bei Wissen, mehreren Sprachen und langen Kontexten.",
  "google/gemini-pro-1.5":
    "Verbesserte Gemini-Version mit riesigem Kontext. Kann sehr lange Dokumente verarbeiten.",
  "google/gemini-flash-1.5":
    "Schnelle Gemini-Variante für einfachere Aufgaben. Gutes Preis-Leistungs-Verhältnis.",
  "google/gemini-2.0-flash-exp":
    "Experimentelles Gemini 2.0. Neueste Features, aber möglicherweise noch unfertig.",

  // === Cognitive Computations (Dolphin, Venice) ===
  "cognitivecomputations/dolphin-mistral-24b-venice-edition":
    "Uncensored Mistral-Variante. Weniger Einschränkungen bei kontroversen Themen.",
  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free":
    "Kostenlose Venice-Version. Offener bei heiklen Themen, aber keine Garantie für Qualität.",
  "cognitivecomputations/dolphin3.0-mistral-24b":
    "Dolphin 3.0 auf Mistral-Basis. Uncensored und kreativ, gut für Rollenspiele.",
  "cognitivecomputations/dolphin3.0-mistral-24b:free":
    "Kostenlose Dolphin-Version. Freier bei Inhalten, ideal für kreatives Schreiben ohne Filter.",
  "cognitivecomputations/dolphin3.0-r1-mistral-24b":
    "Dolphin mit Reasoning-Fähigkeiten. Denkt laut mit und ist dabei weniger zensiert.",

  // === Nvidia Nemotron ===
  "nvidia/llama-3.1-nemotron-70b-instruct":
    "Von Nvidia optimiertes Llama. Sehr gut bei technischen und wissenschaftlichen Aufgaben.",

  // === Nous Research ===
  "nousresearch/hermes-3-llama-3.1-405b":
    "Riesiges Hermes-Modell auf Llama-Basis. Exzellent bei allem, besonders kreativem Schreiben.",
  "nousresearch/hermes-3-llama-3.1-405b:free":
    "Kostenlose 405B-Version. Premium-Qualität ohne Kosten – Top-Wahl für anspruchsvolle Aufgaben.",

  // === Inflection AI ===
  "inflection/inflection-3-pi":
    "Persönliches KI-Modell mit empathischem Ton. Gut für Gespräche und emotionale Themen.",

  // === 01.AI (Yi) ===
  "01-ai/yi-large":
    "Großes chinesisches Modell. Stark bei mehrsprachigen Aufgaben und asiatischen Themen.",

  // === Perplexity ===
  "perplexity/llama-3.1-sonar-large-128k-online":
    "Llama mit Online-Zugang. Kann aktuelle Infos aus dem Internet holen.",
  "perplexity/llama-3.1-sonar-small-128k-online":
    "Kleineres Sonar mit Online-Zugang. Günstig für aktuelle Fragen.",

  // === Microsoft Phi ===
  "microsoft/phi-4":
    "Kleines, effizientes Microsoft-Modell. Überraschend gut trotz geringer Größe.",

  // === Sao10K (Euryale) ===
  "sao10k/l3.3-euryale-70b":
    "Spezialisiertes RP-Modell auf Llama-Basis. Sehr gut für kreative Geschichten und Rollenspiele.",
  "sao10k/l3.1-euryale-70b": "Ältere Euryale-Version. Immer noch stark bei Kreativität und RP.",

  // === Venice AI ===
  "venice/uncensored":
    "Uncensored-Modell mit wenigen Einschränkungen. Für offene Gespräche ohne Filter.",
  "venice/uncensored:free":
    "Kostenlose uncensored Version. Freie Gespräche, aber Qualität kann schwanken.",

  // === Teknium ===
  "teknium/openhermes-2.5-mistral-7b":
    "Optimiertes 7B-Modell für Gespräche. Gutes Verständnis bei geringen Kosten.",

  // === Hugging Face ===
  "huggingfaceh4/zephyr-7b-beta":
    "Community-Modell für Chats. Solide Basis-Qualität, kostenlos nutzbar.",

  // === Undi95 ===
  "undi95/toppy-m-7b":
    "Merge-Modell für Rollenspiele. Kreativ und ausdrucksstark bei RP-Szenarien.",
  "undi95/remm-slerp-l2-13b":
    "Größeres RP-Modell. Sehr gut bei emotionalen und kreativen Dialogen.",

  // === Pygmalion AI ===
  "pygmalionai/mythalion-13b":
    "Spezialisiert auf Charakterdarstellung. Ideal für immersive Rollenspiele.",

  // === Gryphe ===
  "gryphe/mythomax-l2-13b":
    "RP-Modell mit starker Charakterkonsistenz. Gut für längere Geschichten.",
  "gryphe/mythomist-7b": "Kompaktes Mythos-Modell. Kreativ bei Geschichten trotz kleiner Größe.",

  // === Nous Research (weitere) ===
  "nousresearch/nous-capybara-7b":
    "Vielseitiges 7B-Modell. Guter Allrounder für verschiedene Aufgaben.",

  // === Jondurbin ===
  "jondurbin/airoboros-l2-70b":
    "Großes Modell für komplexe Aufgaben. Stark bei Logik und Reasoning.",
};

/**
 * Gibt eine deutsche, laienfreundliche Beschreibung zurück
 * Falls keine spezielle Beschreibung existiert, wird die API-Beschreibung gekürzt
 */
function getGermanDescription(id: string, apiDescription?: string): string | undefined {
  // Zuerst: Manuelle deutsche Beschreibung
  if (GERMAN_DESCRIPTIONS[id]) {
    return GERMAN_DESCRIPTIONS[id];
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

function toEntry(m: ORModel): ModelEntry {
  const prov = deriveProvider(m.id);
  return {
    id: m.id,
    label: m.name ?? m.id,
    description: getGermanDescription(m.id, m.description),
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
  const preferred = Array.from(RECOMMENDED_MODEL_IDS);
  if (!availableModels || availableModels.length === 0) {
    return preferred;
  }

  const availableSet = new Set(availableModels.map((m) => m.id));
  const intersection = preferred.filter((id) => availableSet.has(id));
  return intersection.length > 0 ? intersection : preferred;
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
      console.warn(`[Models] Using intelligent fallback: ${intelligentFallback.length} models`);
      return intelligentFallback;
    } catch (apiError) {
      console.warn("OpenRouter API also failed, using static fallback:", apiError);

      // Layer 3: Static fallback (last resort)
      const staticFallback = Array.from(RECOMMENDED_MODEL_IDS);

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
        description:
          "Freies 70B-Flaggschiff von Meta mit großer Kontexttiefe und stabiler Performance für alle Aufgaben.",
        provider: "meta-llama",
        tags: ["free", "large"],
        safety: "free",
      },
      {
        id: "mistralai/mistral-nemo:free",
        label: "Mistral Nemo (Free)",
        description:
          "Robustes Long-Context-Modell von Mistral AI. Kostenlos und zuverlässig für Standardaufgaben.",
        provider: "mistralai",
        tags: ["free", "medium"],
        safety: "free",
      },
    ];

    console.warn(`[Models] Using emergency fallback: ${emergencyModels.length} models`);
    return emergencyModels;
  }
}
