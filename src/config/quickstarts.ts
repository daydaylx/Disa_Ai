import { z } from "zod";

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

// Validation schema
const quickstartSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  gradient: z.string().min(1),
  glow: z.string().optional(),
  icon: z.string().optional(),
  tone: z.enum(["warm", "cool", "fresh", "sunset", "violet", "default"] as const).optional(),
  flowId: z.string().min(1),
  autosend: z.boolean(),
  persona: z.string().optional(),
  model: z.string().optional(),
  prompt: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

const quickstartsSchema = z.array(quickstartSchema);

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
    const parsed = quickstartsSchema.safeParse(data);

    if (!parsed.success) {
      const validationError = new Error("Invalid quickstarts config");
      (validationError as Error & { issues?: unknown }).issues = parsed.error;
      throw validationError;
    }

    return parsed.data;
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
  const result = quickstartSchema.safeParse(data);
  return result.success ? result.data : null;
}
