import { Brain, Code2, Link2, PenSquare } from "@/lib/icons";
import { Button } from "@/ui/Button";
import { PremiumCard } from "@/ui/PremiumCard";

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
              className="flex flex-col gap-3"
              onClick={() => onStart(quickstart.system, quickstart.user)}
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
