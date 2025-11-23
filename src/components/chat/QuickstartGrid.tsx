import React from "react";

import { Brain, Link2, PenSquare } from "@/lib/icons";
import { buttonVariants } from "@/ui/Button";
import { PremiumCard } from "@/ui/PremiumCard";

const QUICKSTARTS = [
  {
    id: "discussion-aliens",
    title: "Gibt es Außerirdische?",
    description:
      "Diskutiere prägnant, max. 5–6 Sätze pro Antwort. Argumentiere offen pro/contra, ohne so zu tun als gäbe es eine sichere Lösung.",
    icon: Brain,
    system:
      "Wir führen eine lockere, argumentierende Diskussion. Du gibst ausgewogene Pro- und Contra-Punkte, fragst nach meiner Sicht und reagierst darauf. Keine Fachvorträge, eher Alltagslogik. Wenn etwas unklar ist, sag das offen.",
    user: "Gibt es Außerirdische? Wie siehst du das?",
  },
  {
    id: "discussion-ai-risk",
    title: "Wie gefährlich ist KI wirklich?",
    description:
      "Keine Panikmache, keine Verharmlosung. Diskutiere Nutzen vs. Risiken, mit echten Gegenargumenten.",
    icon: Brain,
    system:
      "Diskutiere mit mir wie in einem normalen Gespräch. Erst kurze Einordnung, dann Pro- und Contra-Argumente, dann eine Rückfrage an mich. Nutze einfache Beispiele statt Fachjargon. Ziel: echtes Abwägen, kein Predigen.",
    user: "Wie gefährlich ist KI deiner Meinung nach?",
  },
  {
    id: "discussion-minimum-wage",
    title: "Macht eine Mindestlohn-Erhöhung Sinn?",
    description: "Abwägen statt Parolen: Vorteile, Nachteile, wer gewinnt, wer verliert.",
    icon: PenSquare,
    system:
      "Führe eine ausgewogene Diskussion. Liefere je 2–3 klare Argumente pro und contra, erwähne Unsicherheiten, und frag mich nach meiner Position. Keine Zahlen-Wüste, sondern nachvollziehbare Logik.",
    user: "Sollte der Mindestlohn steigen?",
  },
  {
    id: "discussion-social-media",
    title: "Sollten soziale Medien stärker reguliert werden?",
    description: "Freiheit vs. Schutz: Wo zieht man Grenzen? Diskutiere beides fair.",
    icon: Brain,
    system:
      "Diskutiere fair und nicht zu technisch. Bring Argumente beider Seiten, zeig Graubereiche, stell mir am Ende eine offene Frage zur Einschätzung.",
    user: "Wie stark sollten soziale Medien reguliert sein?",
  },
  {
    id: "discussion-nuclear-energy",
    title: "Ist Kernenergie sinnvoll für die Energiewende?",
    description: "Pragmatisch diskutieren: Klima, Kosten, Risiken, Realität.",
    icon: Brain,
    system:
      "Kurze, alltagsnahe Diskussion mit echten Gegenargumenten. Kein Experten-Gelaber. Pro/contra, dann Rückfrage an mich. Erkenne an, dass es mehrere vernünftige Sichtweisen gibt.",
    user: "Sollte Kernenergie Teil der Energiewende sein?",
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
  const handleKeyActivate = (event: React.KeyboardEvent, system: string, user?: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onStart(system, user);
    }
  };

  return (
    <div className="space-y-6">
      {(title || description) && (
        <section className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand/80">Workflows</p>
          {title && <h2 className="text-2xl font-bold text-text-primary">{title}</h2>}
          {description && (
            <p className="max-w-2xl text-sm text-text-secondary leading-relaxed">{description}</p>
          )}
        </section>
      )}

      <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {QUICKSTARTS.map((quickstart) => {
          const Icon = quickstart.icon;
          return (
            <PremiumCard
              key={quickstart.id}
              className="flex flex-col gap-3 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
              onClick={() => onStart(quickstart.system, quickstart.user)}
              interactiveRole="button"
              onKeyDown={(event) => handleKeyActivate(event, quickstart.system, quickstart.user)}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand shadow-brandGlow">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-text-primary">{quickstart.title}</h3>
              </div>
              <p className="text-sm text-text-secondary flex-1 leading-relaxed">
                {quickstart.description}
              </p>
              <span className="text-xs font-semibold text-brand flex items-center gap-1">
                Starten
                <span className="text-brand-bright">→</span>
              </span>
            </PremiumCard>
          );
        })}
      </section>

      <section className="flex flex-wrap gap-2">
        {LINK_ACTIONS.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "inline-flex items-center gap-2",
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
