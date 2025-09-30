import { z } from "zod";

export interface QuickstartAction {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  icon?: string;
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
  icon: z.string().optional(),
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
    gradient: "from-fuchsia-500/70 via-purple-500/70 to-sky-500/70",
    icon: "edit-3",
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
    gradient: "from-amber-400/70 via-pink-500/70 to-purple-500/70",
    icon: "image",
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
    gradient: "from-sky-400/70 via-cyan-500/70 to-emerald-400/70",
    icon: "search-check",
    flowId: "factcheck.v1",
    autosend: false,
    prompt: "Ich möchte Fakten überprüfen. Was soll ich für dich recherchieren und verifizieren?",
    tags: ["fakten", "recherche", "validierung"],
  },
  {
    id: "email-helper",
    title: "E-Mail Assistent",
    subtitle: "Formuliere professionelle E-Mails mühelos",
    gradient: "from-blue-500/70 via-indigo-500/70 to-purple-500/70",
    icon: "mail",
    flowId: "email.v1",
    autosend: false,
    persona: "email_professional",
    prompt:
      "Lass uns eine professionelle E-Mail verfassen. Worum geht es und wer ist der Empfänger?",
    tags: ["email", "business", "kommunikation"],
  },
];

// Helper functions for loading and validation
export function getQuickstarts(): QuickstartAction[] {
  return defaultQuickstarts;
}

export async function loadQuickstarts(): Promise<QuickstartAction[]> {
  try {
    // Try to load external config first
    const response = await fetch("/quickstarts.json", {
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      const parsed = quickstartsSchema.safeParse(data);

      if (parsed.success) {
        return parsed.data;
      } else {
        console.warn("Invalid quickstarts config, falling back to defaults:", parsed.error);
      }
    }
  } catch (error) {
    console.warn("Failed to load external quickstarts, using defaults:", error);
  }

  return defaultQuickstarts;
}

export function getQuickstartById(id: string): QuickstartAction | undefined {
  return defaultQuickstarts.find((q) => q.id === id);
}

// Fix für Issue #79: Aktualisiere Fallback-Laden um externe Config zu nutzen
export async function getQuickstartsWithFallback(): Promise<QuickstartAction[]> {
  try {
    const external = await loadQuickstarts();
    if (external.length > 0) {
      return external;
    }
  } catch (error) {
    console.warn("External quickstarts not available, using defaults:", error);
  }
  return defaultQuickstarts;
}

export function validateQuickstart(data: unknown): QuickstartAction | null {
  const result = quickstartSchema.safeParse(data);
  return result.success ? result.data : null;
}
