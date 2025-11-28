import React from "react";

import { CONSPIRACY_SYSTEM_PROMPT } from "@/features/conspiracy/prompts";
import { DISCUSSION_SYSTEM_PROMPT } from "@/features/discussion/prompts";
import { Brain, Link2, PenSquare } from "@/lib/icons";
import { buttonVariants } from "@/ui/Button";
import { PremiumCard } from "@/ui/PremiumCard";

type QuickstartCategory =
  | "realpolitik"
  | "hypothetisch"
  | "wissenschaft"
  | "kultur"
  | "verschwörungstheorien";

interface Quickstart {
  id: string;
  title: string;
  description: string;
  icon: typeof Brain | typeof PenSquare;
  system: string;
  user: string;
  category?: QuickstartCategory;
  speculative?: boolean;
}

const CATEGORY_LABELS: Record<QuickstartCategory, { label: string; color: string }> = {
  realpolitik: { label: "Realpolitik", color: "bg-blue-500/10 text-blue-600" },
  hypothetisch: { label: "Gedankenexperiment", color: "bg-purple-500/10 text-purple-600" },
  wissenschaft: { label: "Wissenschaft", color: "bg-green-500/10 text-green-600" },
  kultur: { label: "Kultur", color: "bg-orange-500/10 text-orange-600" },
  verschwörungstheorien: {
    label: "Verschwörungstheorien",
    color: "bg-surface-3 text-text-secondary border border-surface-3",
  },
};

const QUICKSTARTS: Quickstart[] = [
  {
    id: "discussion-aliens",
    title: "Gibt es Außerirdische?",
    description: "Diskutiere Pro und Contra über außerirdisches Leben.",
    icon: Brain,
    category: "wissenschaft",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Gibt es außerirdisches Leben?",
  },
  {
    id: "discussion-ai-risk",
    title: "Wie gefährlich ist KI?",
    description: "Nutzen vs. Risiken – sachlich abwägen.",
    icon: Brain,
    category: "kultur",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Wie gefährlich ist Künstliche Intelligenz wirklich?",
  },
  {
    id: "discussion-minimum-wage",
    title: "Mindestlohn erhöhen?",
    description: "Ökonomische Vor- und Nachteile beleuchten.",
    icon: PenSquare,
    category: "realpolitik",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Macht eine starke Erhöhung des Mindestlohns Sinn?",
  },
  {
    id: "discussion-social-media",
    title: "Social Media Regulierung",
    description: "Freiheit vs. Schutz im digitalen Raum.",
    icon: Brain,
    category: "realpolitik",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Sollten soziale Medien stärker reguliert werden?",
  },
  {
    id: "discussion-nuclear-energy",
    title: "Kernenergie & Energiewende",
    description: "Pragmatischer Blick auf Atomkraft.",
    icon: Brain,
    category: "realpolitik",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Ist Kernenergie sinnvoll für die Energiewende?",
  },
  {
    id: "discussion-ai-laws",
    title: "KI als Gesetzgeber?",
    description: "Was wäre, wenn Algorithmen Gesetze schreiben?",
    icon: Brain,
    category: "hypothetisch",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Was wäre, wenn eine KI unsere Gesetze schreiben würde?",
  },
  {
    id: "discussion-simulation",
    title: "Leben wir in einer Simulation?",
    description: "Philosophisches Gedankenexperiment.",
    icon: Brain,
    category: "wissenschaft",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Die Hypothese, dass wir in einer Simulation leben.",
  },
  {
    id: "discussion-time-travel",
    title: "Sind Zeitreisen möglich?",
    description: "Physik vs. Science-Fiction Paradoxien.",
    icon: Brain,
    category: "wissenschaft",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Sind Zeitreisen theoretisch möglich?",
  },
  {
    id: "discussion-free-energy",
    title: "Szenario: Kostenlose Energie",
    description: "Was würde sich gesellschaftlich ändern?",
    icon: Brain,
    category: "hypothetisch",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Was würde passieren, wenn Energie plötzlich kostenlos wäre?",
  },
  {
    id: "discussion-car-free-city",
    title: "Autofreie Städte",
    description: "Lebensqualität vs. Mobilität.",
    icon: Brain,
    category: "hypothetisch",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Könnte eine Großstadt komplett autofrei funktionieren?",
  },
  {
    id: "discussion-tech-religion",
    title: "Technik als Religion",
    description: "Glaube an den Fortschritt vs. Spiritualität.",
    icon: Brain,
    category: "kultur",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Nimmt Technologie mittlerweile religiöse Züge an?",
  },
  {
    id: "discussion-ubi",
    title: "Bedingungsloses Grundeinkommen",
    description: "Soziales Experiment oder Notwendigkeit?",
    icon: PenSquare,
    category: "realpolitik",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Sollten wir ein bedingungsloses Grundeinkommen einführen?",
  },
  {
    id: "discussion-trends-manipulation",
    title: "Hypes & Manipulation",
    description: "Wie natürlich sind Internet-Trends?",
    icon: Brain,
    category: "kultur",
    speculative: false,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Sind kulturelle Trends echt oder manipuliert?",
  },
  {
    id: "discussion-mars-2050",
    title: "Menschen auf dem Mars",
    description: "Realismus der Raumfahrt-Pläne.",
    icon: Brain,
    category: "hypothetisch",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Werden bis 2050 Menschen dauerhaft auf dem Mars leben?",
  },
  {
    id: "discussion-fermi-paradox",
    title: "Das Fermi-Paradoxon",
    description: "Warum hören wir nichts von Aliens?",
    icon: Brain,
    category: "wissenschaft",
    speculative: true,
    system: DISCUSSION_SYSTEM_PROMPT,
    user: "Lass uns diskutieren: Das Fermi-Paradoxon – wo sind alle?",
  },

  // ============================================================================
  // VERSCHWÖRUNGSTHEORIEN
  // ============================================================================
  {
    id: "conspiracy-flat-earth",
    title: "Flache Erde",
    description: "Kritische Einordnung der Flat-Earth-Theorie.",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Die Theorie der flachen Erde.",
  },
  {
    id: "conspiracy-reptilians",
    title: "Reptiloiden",
    description: "Analyse der Theorie über Echsenmenschen.",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Die Theorie, dass Reptiloiden die Welt regieren.",
  },
  {
    id: "conspiracy-moon-landing",
    title: "Mondlandung",
    description: "Faktencheck zur angeblichen Fälschung.",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Die Theorie, dass die Mondlandung gefälscht war.",
  },
  {
    id: "conspiracy-chemtrails",
    title: "Chemtrails",
    description: "Wettermanipulation oder Kondensstreifen?",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Chemtrails.",
  },
  {
    id: "conspiracy-bermuda-triangle",
    title: "Bermuda-Dreieck",
    description: "Mythos und statistische Realität.",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Das Geheimnis des Bermuda-Dreiecks.",
  },
  {
    id: "conspiracy-ancient-aliens",
    title: "Ancient Aliens",
    description: "Pyramiden und außerirdische Besucher.",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Die Theorie der Ancient Aliens und Pyramidenbau.",
  },
  {
    id: "conspiracy-area51",
    title: "Area 51",
    description: "Was verbirgt das US-Militär wirklich?",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Verschwörungstheorien um Area 51.",
  },
  {
    id: "conspiracy-denver-airport",
    title: "Denver Airport",
    description: "Symbolik und Bunker-Theorien.",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Verschwörungstheorien zum Denver Airport.",
  },
  {
    id: "conspiracy-mkultra",
    title: "MK-Ultra",
    description: "Fakten vs. Mythen zur Gedankenkontrolle.",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Das MK-Ultra Programm.",
  },
  {
    id: "conspiracy-simulation",
    title: "Simulation-Theorie",
    description: "Leben wir in einer Matrix? (Kritischer Blick)",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: true,
    system: CONSPIRACY_SYSTEM_PROMPT,
    user: "Thema: Die Simulation-Theorie als Verschwörungsmythos.",
  },
];

const LINK_ACTIONS = [
  { label: "Modelle vergleichen", href: "/models" },
  { label: "Rollenbibliothek erkunden", href: "/roles" },
  { label: "API-Key prüfen", href: "/settings/api-data" },
];

interface QuickstartGridProps {
  onStart: (system: string, user?: string) => void;
  title?: string;
  description?: string;
}

export function QuickstartGrid({
  onStart,
  title = "Schnellstart-Flows",
  description = "Vorgefertigte Prompts für typische Aufgaben – tippe und starte direkt fokussiert.",
}: QuickstartGridProps) {
  // Accessibility helper for keyboard navigation
  const handleKeyActivate = (event: React.KeyboardEvent, system: string, user?: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onStart(system, user);
    }
  };

  // Split discussions: Regular vs. Conspiracy Theories
  const regularDiscussions = QUICKSTARTS.filter((q) => q.category !== "verschwörungstheorien");
  const conspiracyDiscussions = QUICKSTARTS.filter((q) => q.category === "verschwörungstheorien");

  // Helper: Render carousel for a given set of quickstarts
  const renderCarousel = (quickstarts: Quickstart[]) => (
    <section
      className="flex gap-4 overflow-x-auto touch-pan-x overscroll-x-contain snap-x snap-mandatory pb-3 -mx-[var(--spacing-3)] px-[var(--spacing-3)]"
      style={{
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <style>{`
        section::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {quickstarts.map((quickstart) => {
        const Icon = quickstart.icon;
        const categoryInfo = quickstart.category ? CATEGORY_LABELS[quickstart.category] : null;
        return (
          <PremiumCard
            key={quickstart.id}
            withAccentStrip={false}
            className="flex flex-col gap-3 snap-center shrink-0 w-[86vw] sm:w-[48vw] md:w-[32vw] lg:w-[300px] bg-bg-page border border-border-ink shadow-[0_10px_24px_-18px_rgba(17,24,39,0.65)] before:opacity-0 focus-visible:ring-2 focus-visible:ring-border-ink focus-visible:ring-offset-4 focus-visible:ring-offset-bg-page"
            onClick={() => onStart(quickstart.system, quickstart.user)}
            interactiveRole="button"
            onKeyDown={(event) => handleKeyActivate(event, quickstart.system, quickstart.user)}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-ink bg-surface-2 text-ink-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="text-base font-semibold text-ink-primary leading-tight">
                  {quickstart.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {categoryInfo && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border-ink/60 bg-bg-page text-ink-primary">
                      {categoryInfo.label}
                    </span>
                  )}
                  {quickstart.speculative && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-900/20 bg-amber-50 text-amber-800">
                      Hypothese
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-ink-secondary/90 flex-1 leading-relaxed">
              {quickstart.description}
            </p>
            <span className="text-xs font-semibold text-ink-primary inline-flex items-center gap-1">
              Starten
              <span className="text-ink-secondary">→</span>
            </span>
          </PremiumCard>
        );
      })}
    </section>
  );

  return (
    <div className="space-y-6">
      {(title || description) && (
        <section className="rounded-xl border border-border-ink bg-bg-page shadow-[0_18px_50px_-40px_rgba(15,23,42,0.6)] px-[var(--spacing-4)] py-[var(--spacing-4)] space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-secondary/80">
            Workflows
          </p>
          {title && <h2 className="text-2xl font-semibold text-ink-primary">{title}</h2>}
          {description && (
            <p className="max-w-2xl text-sm text-ink-secondary/90 leading-relaxed">{description}</p>
          )}
          <div className="h-px w-full bg-gradient-to-r from-border-ink/70 via-border-ink/30 to-transparent" />
        </section>
      )}

      {/* Card 1: Regular Discussions */}
      <div className="rounded-xl border border-border-ink bg-bg-page shadow-[0_18px_50px_-40px_rgba(15,23,42,0.6)] px-[var(--spacing-4)] py-[var(--spacing-4)] space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-ink-primary">Diskussionen</h3>
          <p className="text-xs text-ink-secondary/90">
            Wähle ein Thema und starte eine Diskussion mit der KI.
          </p>
        </div>
        {renderCarousel(regularDiscussions)}
      </div>

      {/* Card 2: Conspiracy Theories – Separate card below */}
      {conspiracyDiscussions.length > 0 && (
        <div className="rounded-xl border border-border-ink bg-bg-page shadow-[0_18px_50px_-40px_rgba(15,23,42,0.6)] px-[var(--spacing-4)] py-[var(--spacing-4)] space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-ink-primary flex items-center gap-2">
              Verschwörungstheorien
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-border-ink/60 bg-surface-2 text-ink-secondary/90">
                Kontrovers
              </span>
            </h3>
            <p className="text-xs text-ink-secondary/90">
              Hier kannst du kontroverse Themen kritisch mit einer KI besprechen.
            </p>
          </div>
          {renderCarousel(conspiracyDiscussions)}
        </div>
      )}

      <section className="flex flex-wrap gap-2">
        {LINK_ACTIONS.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "inline-flex items-center gap-2 text-ink-primary",
            })}
          >
            <Link2 className="h-3.5 w-3.5" />
            {action.label}
          </a>
        ))}
      </section>
    </div>
  );
}
