import { Brain, Code2, Link2, PenSquare } from "@/lib/icons";
import { Button } from "@/ui/Button";
import { GlassCard } from "@/ui/GlassCard";

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

      <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {QUICKSTARTS.map((quickstart) => {
          const Icon = quickstart.icon;
          return (
            <GlassCard
              key={quickstart.id}
              className="flex flex-col gap-2.5 cursor-pointer transition-transform hover:scale-105 p-4"
              onClick={() => onStart(quickstart.system, quickstart.user)}
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_8px_24px_rgba(97,231,255,0.2)]">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="text-base font-semibold">{quickstart.title}</h3>
              </div>
              <p className="text-xs text-text-secondary flex-1 leading-relaxed">
                {quickstart.description}
              </p>
              <span className="text-xs font-medium text-accent">Tippen zum Starten →</span>
            </GlassCard>
          );
        })}
      </section>

      <section className="flex flex-wrap gap-2">
        {LINK_ACTIONS.map((action) => (
          <Button key={action.label} variant="ghost" size="sm">
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
