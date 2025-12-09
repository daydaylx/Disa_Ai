import type { LucideIcon } from "lucide-react";

import { CONSPIRACY_SYSTEM_PROMPT } from "@/features/conspiracy/prompts";
import { DISCUSSION_SYSTEM_PROMPT } from "@/features/discussion/prompts";

export type QuickstartCategory =
  | "realpolitik"
  | "hypothetisch"
  | "wissenschaft"
  | "kultur"
  | "verschwörungstheorien";

export interface Quickstart {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon | null;
  system: string;
  user: string;
  category?: QuickstartCategory;
  speculative?: boolean;
}

export const CATEGORY_LABELS: Record<QuickstartCategory, { label: string; color: string }> = {
  realpolitik: {
    label: "Realpolitik",
    color: "bg-accent-realpolitik-dim text-accent-realpolitik border-accent-realpolitik-border",
  },
  hypothetisch: {
    label: "Gedankenexperiment",
    color: "bg-accent-hypothetisch-dim text-accent-hypothetisch border-accent-hypothetisch-border",
  },
  wissenschaft: {
    label: "Wissenschaft",
    color: "bg-accent-wissenschaft-dim text-accent-wissenschaft border-accent-wissenschaft-border",
  },
  kultur: {
    label: "Kultur",
    color: "bg-accent-kultur-dim text-accent-kultur border-accent-kultur-border",
  },
  verschwörungstheorien: {
    label: "Verschwörungstheorien",
    color: "bg-accent-verschwörung-dim text-accent-verschwörung border-accent-verschwörung-border",
  },
};

export const QUICKSTARTS: Quickstart[] = [
  {
    id: "discussion-aliens",
    title: "Gibt es Außerirdische?",
    description: "Diskutiere Pro und Contra über außerirdisches Leben.",
    icon: null, // Placeholder: Import icons as needed
    category: "wissenschaft",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Gibt es außerirdisches Leben?",
  },
  {
    id: "discussion-ai-risk",
    title: "Wie gefährlich ist KI?",
    description: "Nutzen vs. Risiken – sachlich abwägen.",
    icon: null,
    category: "kultur",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Wie gefährlich ist Künstliche Intelligenz wirklich?",
  },
  {
    id: "discussion-minimum-wage",
    title: "Mindestlohn erhöhen?",
    description: "Ökonomische Vor- und Nachteile beleuchten.",
    icon: null,
    category: "realpolitik",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Macht eine starke Erhöhung des Mindestlohns Sinn?",
  },
  {
    id: "discussion-social-media",
    title: "Social Media Regulierung",
    description: "Freiheit vs. Schutz im digitalen Raum.",
    icon: null,
    category: "realpolitik",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Sollten soziale Medien stärker reguliert werden?",
  },
  {
    id: "discussion-nuclear-energy",
    title: "Kernenergie & Energiewende",
    description: "Pragmatischer Blick auf Atomkraft.",
    icon: null,
    category: "realpolitik",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Ist Kernenergie sinnvoll für die Energiewende?",
  },
  {
    id: "discussion-ai-laws",
    title: "KI als Gesetzgeber?",
    description: "Was wäre, wenn Algorithmen Gesetze schreiben?",
    icon: null,
    category: "hypothetisch",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Was wäre, wenn eine KI unsere Gesetze schreiben würde?",
  },
  {
    id: "discussion-simulation",
    title: "Leben wir in einer Simulation?",
    description: "Philosophisches Gedankenexperiment.",
    icon: null,
    category: "wissenschaft",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Die Hypothese, dass wir in einer Simulation leben.",
  },
  {
    id: "discussion-time-travel",
    title: "Sind Zeitreisen möglich?",
    description: "Physik vs. Science-Fiction Paradoxien.",
    icon: null,
    category: "wissenschaft",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Sind Zeitreisen theoretisch möglich?",
  },
  {
    id: "discussion-free-energy",
    title: "Szenario: Kostenlose Energie",
    description: "Was würde sich gesellschaftlich ändern?",
    icon: null,
    category: "hypothetisch",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Was würde passieren, wenn Energie plötzlich kostenlos wäre?",
  },
  {
    id: "discussion-car-free-city",
    title: "Autofreie Städte",
    description: "Lebensqualität vs. Mobilität.",
    icon: null,
    category: "hypothetisch",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Könnte eine Großstadt komplett autofrei funktionieren?",
  },
  {
    id: "discussion-tech-religion",
    title: "Technik als Religion",
    description: "Glaube an den Fortschritt vs. Spiritualität.",
    icon: null,
    category: "kultur",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Nimmt Technologie mittlerweile religiöse Züge an?",
  },
  {
    id: "discussion-ubi",
    title: "Bedingungsloses Grundeinkommen",
    description: "Soziales Experiment oder Notwendigkeit?",
    icon: null,
    category: "realpolitik",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Sollten wir ein bedingungsloses Grundeinkommen einführen?",
  },
  {
    id: "discussion-trends-manipulation",
    title: "Hypes & Manipulation",
    description: "Wie natürlich sind Internet-Trends?",
    icon: null,
    category: "kultur",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Sind kulturelle Trends echt oder manipuliert?",
  },
  {
    id: "discussion-mars-2050",
    title: "Menschen auf dem Mars",
    description: "Realismus der Raumfahrt-Pläne.",
    icon: null,
    category: "hypothetisch",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Werden bis 2050 Menschen dauerhaft auf dem Mars leben?",
  },
  {
    id: "discussion-fermi-paradox",
    title: "Das Fermi-Paradoxon",
    description: "Warum hören wir nichts von Aliens?",
    icon: null,
    category: "wissenschaft",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Das Fermi-Paradoxon – wo sind alle?",
  },
  // VERSCHWÖRUNGSTHEORIEN
  {
    id: "conspiracy-flat-earth",
    title: "Flache Erde",
    description: "Kritische Einordnung der Flat-Earth-Theorie.",
    icon: null,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Die Theorie der flachen Erde.",
  },
  {
    id: "conspiracy-reptilians",
    title: "Reptiloiden",
    description: "Analyse der Theorie über Echsenmenschen.",
    icon: null,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Die Theorie, dass Reptiloiden die Welt regieren.",
  },
  {
    id: "conspiracy-moon-landing",
    title: "Mondlandung",
    description: "Faktencheck zur angeblichen Fälschung.",
    icon: null,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Die Theorie, dass die Mondlandung gefälscht war.",
  },
  {
    id: "conspiracy-chemtrails",
    title: "Chemtrails",
    description: "Wettermanipulation oder Kondensstreifen?",
    icon: null,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Chemtrails.",
  },
  {
    id: "conspiracy-bermuda-triangle",
    title: "Bermuda-Dreieck",
    description: "Mythos und statistische Realität.",
    icon: null,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Das Geheimnis des Bermuda-Dreiecks.",
  },
  {
    id: "conspiracy-ancient-aliens",
    title: "Ancient Aliens",
    description: "Pyramiden und außerirdische Besucher.",
    icon: null,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Die Theorie der Ancient Aliens und Pyramidenbau.",
  },
  {
    id: "conspiracy-area51",
    title: "Area 51",
    description: "Was verbirgt das US-Militär wirklich?",
    icon: null,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Verschwörungstheorien um Area 51.",
  },
  {
    id: "conspiracy-denver-airport",
    title: "Denver Airport",
    description: "Symbolik und Bunker-Theorien.",
    icon: null,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Verschwörungstheorien zum Denver Airport.",
  },
  {
    id: "conspiracy-mkultra",
    title: "MK-Ultra",
    description: "Fakten vs. Mythen zur Gedankenkontrolle.",
    icon: null,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Das MK-Ultra Programm.",
  },
  {
    id: "conspiracy-simulation",
    title: "Simulation-Theorie",
    description: "Leben wir in einer Matrix? (Kritischer Blick)",
    icon: null,
    category: "verschwörungstheorien",
    speculative: true,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Die Simulation-Theorie als Verschwörungsmythos.",
  },
];

// Helper functions for working with quickstarts
export const defaultQuickstarts = QUICKSTARTS;

export function getQuickstarts(): Quickstart[] {
  return QUICKSTARTS;
}

export function getQuickstartById(id: string): Quickstart | undefined {
  return QUICKSTARTS.find((q) => q.id === id);
}

export function validateQuickstart(quickstart: any): Quickstart | null {
  if (!quickstart || typeof quickstart !== "object") {
    return null;
  }

  // Check required fields exist (allowing for null values like icon)
  const requiredFields = ["id", "title", "description", "system", "user"];
  for (const field of requiredFields) {
    if (!quickstart[field]) {
      return null;
    }
  }

  // Only check that 'icon' property exists, but allow it to be null
  if (!("icon" in quickstart)) {
    return null;
  }

  return quickstart as Quickstart;
}

export async function loadQuickstarts(): Promise<any[]> {
  try {
    const response = await fetch("/quickstarts.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Quickstarts request failed with status ${response.status}`);
    }

    const externalConfig = await response.json();

    if (!Array.isArray(externalConfig)) {
      throw new Error("Invalid quickstarts config format");
    }

    // Validate each quickstart
    const validated = externalConfig.filter((item) => validateQuickstart(item) !== null);

    if (validated.length === 0 && externalConfig.length > 0) {
      throw new Error("No valid quickstarts found in external config");
    }

    return validated;
  } catch (error) {
    console.warn("Failed to load external quickstarts, using defaults:", error);
    throw error;
  }
}

export async function getQuickstartsWithFallback(
  options: { onFallback?: (info: { reason: string; error?: Error }) => void } = {},
): Promise<Quickstart[]> {
  try {
    const external = await loadQuickstarts();

    if (external.length > 0) {
      return external;
    } else {
      options.onFallback?.({ reason: "empty" });
      return defaultQuickstarts;
    }
  } catch (error) {
    options.onFallback?.({ reason: "error", error: error as Error });
    return defaultQuickstarts;
  }
}
