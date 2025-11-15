import { Brain, Code2, Link2, PenSquare } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";

const QUICKSTARTS = [
  {
    id: "research",
    title: "Research",
    description: "Tiefe Recherchen, Quellencheck, Pro/Contra-Analysen.",
    icon: Brain,
    system:
      "Du bist ein strukturierter Research-Assistent. Fasse Quellen, Argumente und Risiken sachlich zusammen.",
    user: "Hilf mir bei einer tiefen Recherche zu einem Thema meiner Wahl.",
  },
  {
    id: "writing",
    title: "Schreiben",
    description: "Klare Mails, Support-Texte, Social Posts auf Knopfdruck.",
    icon: PenSquare,
    system: "Du unterstützt beim Schreiben klarer, freundlicher Nachrichten und E-Mails.",
  },
  {
    id: "code",
    title: "Code & Reviews",
    description: "Erklärungen, Refactors und sichere Vorschläge für deinen Code.",
    icon: Code2,
    system:
      "Du bist ein präziser Pair-Programmer. Erkläre Code, finde Bugs und schlage Optimierungen vor.",
  },
];

const LINK_ACTIONS = [
  { label: "Modelle vergleichen", href: "/models" },
  { label: "Rollenbibliothek erkunden", href: "/roles" },
  { label: "API-Key prüfen", href: "/settings/api" },
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
  return (
    <div className="space-y-6">
      {(title || description) && (
        <section className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent/80">
            Workflows
          </p>
          {title && <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>}
          {description && <p className="max-w-2xl text-sm text-text-secondary">{description}</p>}
        </section>
      )}

      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {QUICKSTARTS.map((quickstart) => {
          const Icon = quickstart.icon;
          return (
            <Card
              key={quickstart.id}
              tone="glass-primary"
              elevation="surface"
              padding="md"
              interactive="gentle"
              clickable
              onClick={() => onStart(quickstart.system, quickstart.user)}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_12px_35px_rgba(97,231,255,0.25)]">
                  <Icon className="h-5 w-5" />
                </span>
                <CardTitle className="text-lg font-semibold">{quickstart.title}</CardTitle>
              </div>
              <p className="text-sm text-text-secondary flex-1">{quickstart.description}</p>
              <span className="text-xs font-semibold text-text-muted">Tippen zum Starten</span>
            </Card>
          );
        })}
      </section>

      <section className="flex flex-wrap gap-2">
        {LINK_ACTIONS.map((action) => (
          <Button key={action.label} asChild variant="glass-ghost" size="sm">
            <a href={action.href}>
              <Link2 className="h-3.5 w-3.5" />
              {action.label}
            </a>
          </Button>
        ))}
      </section>
    </div>
  );
}
