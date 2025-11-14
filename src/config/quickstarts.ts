export interface QuickstartAction {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  glow?: string;
  icon?: string;
  tone?: "warm" | "cool" | "fresh" | "sunset" | "violet" | "default";
  flowId: string;
  autosend: boolean;
  persona?: string;
  model?: string;
  prompt: string;
  tags?: string[];
}

const QUICKSTART_TONES = new Set(["warm", "cool", "fresh", "sunset", "violet", "default"] as const);

function isNonEmptyString(value: unknown, maxLength = Infinity): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

function normalizeTags(tags: unknown): string[] | undefined {
  if (!Array.isArray(tags)) return undefined;
  const normalized = tags
    .filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
    .map((tag) => tag.trim());
  return normalized.length > 0 ? normalized : undefined;
}

// Default quickstart configurations
export const defaultQuickstarts: QuickstartAction[] = [
  {
    id: "text-writer",
    title: "AI Text Writer",
    subtitle: "Skizziere blitzschnell perfekte Antworten",
    gradient: "from-amber-400/80 via-yellow-300/65 to-orange-400/70",
    glow: "shadow-[0_25px_70px_rgba(250,204,21,0.28)]",
    icon: "edit-3",
    tone: "warm",
    flowId: "writer.v1",
    autosend: false,
    persona: "creative_writer",
    prompt: "Hilf mir beim Schreiben eines kreativen Textes. Welches Thema interessiert dich?",
    tags: ["text", "kreativ", "schreiben"],
  },
  {
    id: "image-idea",
    title: "Bildidee",
    subtitle: "Beschreibe Visionen für dein nächstes Artwork",
    gradient: "from-sky-500/80 via-blue-500/65 to-indigo-500/70",
    glow: "shadow-[0_25px_70px_rgba(56,189,248,0.32)]",
    icon: "image",
    tone: "cool",
    flowId: "image.v1",
    autosend: false,
    prompt:
      "Ich möchte eine kreative Bildidee entwickeln. Beschreibe mir ein faszinierendes visuelles Konzept!",
    tags: ["kunst", "bild", "kreativ"],
  },
  {
    id: "fact-check",
    title: "Faktencheck",
    subtitle: "Validiere Zahlen und Quellen in Sekunden",
    gradient: "from-emerald-400/75 via-teal-500/60 to-lime-500/60",
    glow: "shadow-[0_25px_70px_rgba(34,197,94,0.3)]",
    icon: "search-check",
    tone: "fresh",
    flowId: "factcheck.v1",
    autosend: false,
    prompt: "Ich möchte Fakten überprüfen. Was soll ich für dich recherchieren und verifizieren?",
    tags: ["fakten", "recherche", "validierung"],
  },
];

// Helper functions for loading and validation
export function getQuickstarts(): QuickstartAction[] {
  return defaultQuickstarts;
}

export async function loadQuickstarts(): Promise<QuickstartAction[]> {
  try {
    const response = await fetch("/quickstarts.json", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Quickstarts request failed with status ${response.status ?? "unknown"}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Quickstarts payload is not an array");
    }

    const parsed: QuickstartAction[] = [];
    for (const entry of data) {
      const validated = validateQuickstart(entry);
      if (!validated) {
        throw new Error("Invalid quickstarts config");
      }
      parsed.push(validated);
    }

    return parsed;
  } catch (error) {
    console.warn("Failed to load external quickstarts, using defaults:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export function getQuickstartById(id: string): QuickstartAction | undefined {
  return defaultQuickstarts.find((q) => q.id === id);
}

type QuickstartFallbackReason = "empty" | "error";

interface QuickstartFallbackEvent {
  reason: QuickstartFallbackReason;
  error?: unknown;
}

export async function getQuickstartsWithFallback(options?: {
  onFallback?: (event: QuickstartFallbackEvent) => void;
}): Promise<QuickstartAction[]> {
  try {
    const external = await loadQuickstarts();
    if (external.length > 0) {
      return external;
    }
    options?.onFallback?.({ reason: "empty" });
  } catch (error) {
    options?.onFallback?.({ reason: "error", error });
    console.warn("External quickstarts not available, using defaults:", error);
  }
  return defaultQuickstarts;
}

export function validateQuickstart(data: unknown): QuickstartAction | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const candidate = data as Record<string, unknown>;

  if (
    !isNonEmptyString(candidate.id, 64) ||
    !isNonEmptyString(candidate.title, 128) ||
    !isNonEmptyString(candidate.subtitle, 256) ||
    !isNonEmptyString(candidate.gradient, 256) ||
    !isNonEmptyString(candidate.flowId, 128) ||
    typeof candidate.autosend !== "boolean" ||
    !isNonEmptyString(candidate.prompt, 8000)
  ) {
    return null;
  }

  if (
    candidate.tone !== undefined &&
    (typeof candidate.tone !== "string" || !QUICKSTART_TONES.has(candidate.tone as any))
  ) {
    return null;
  }

  const quickstart: QuickstartAction = {
    id: candidate.id.trim(),
    title: candidate.title.trim(),
    subtitle: candidate.subtitle.trim(),
    gradient: candidate.gradient.trim(),
    flowId: candidate.flowId.trim(),
    autosend: candidate.autosend,
    prompt: candidate.prompt.trim(),
  };

  if (isNonEmptyString(candidate.glow, 512)) {
    quickstart.glow = candidate.glow.trim();
  }
  if (isNonEmptyString(candidate.icon, 64)) {
    quickstart.icon = candidate.icon.trim();
  }
  if (candidate.tone) {
    quickstart.tone = candidate.tone as QuickstartAction["tone"];
  }
  if (isNonEmptyString(candidate.persona, 128)) {
    quickstart.persona = candidate.persona.trim();
  }
  if (isNonEmptyString(candidate.model, 128)) {
    quickstart.model = candidate.model.trim();
  }
  const tags = normalizeTags(candidate.tags);
  if (tags) {
    quickstart.tags = tags;
  }

  return quickstart;
}
