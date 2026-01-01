import { useNavigate } from "react-router-dom";

import type { Quickstart } from "@/config/quickstarts";
import { CATEGORY_LABELS, QUICKSTARTS } from "@/config/quickstarts";
import { SCENARIOS } from "@/features/registry";
import { getCategoryStyle } from "@/lib/categoryColors";
import { AlertTriangle, ArrowRight, Brain, Briefcase, Swords } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, Button, Card, PageHeader } from "@/ui";

import { PageLayout } from "../components/layout/PageLayout";

const regularDiscussions = QUICKSTARTS.filter((q) => q.category !== "verschwörungstheorien");
const conspiracyDiscussions = QUICKSTARTS.filter((q) => q.category === "verschwörungstheorien");

export default function ThemenPage() {
  const navigate = useNavigate();

  const handleStartQuickstart = (quickstart: Quickstart) => {
    void navigate(`/chat?quickstart=${quickstart.id}&title=Diskussion: ${quickstart.title}`);
  };

  const handleStartScenario = (scenarioId: string) => {
    void navigate(`/game/${scenarioId}`);
  };

  const renderScenarioCard = (
    scenario: (typeof SCENARIOS)["ground-zero"],
    icon: React.ReactNode,
    gradient: string,
  ) => {
    return (
      <Card
        key={scenario.id}
        variant="roleStrong"
        notch="none"
        role="button"
        onClick={() => handleStartScenario(scenario.id)}
        style={{ background: gradient }}
        className={cn(
          "group relative flex items-start gap-4 p-4 transition-all duration-300 shadow-sm overflow-hidden cursor-pointer",
          "hover:brightness-110 border-white/10 hover:border-white/20",
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
            "bg-black/20 text-white shadow-inner",
          )}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold truncate text-white">{scenario.title}</h3>
            <ArrowRight className="h-4 w-4 text-white/70 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </div>

          <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
            {scenario.description}
          </p>

          <Badge
            variant="outline"
            className="mt-2 text-[10px] h-5 border-white/20 text-white/90 bg-black/10"
          >
            Interaktiv
          </Badge>
        </div>
      </Card>
    );
  };

  const renderCard = (quickstart: Quickstart) => {
    const categoryInfo = quickstart.category ? CATEGORY_LABELS[quickstart.category] : null;
    const theme = getCategoryStyle(quickstart.category);

    return (
      <Card
        key={quickstart.id}
        variant="roleStrong"
        notch="none"
        role="button"
        onClick={() => handleStartQuickstart(quickstart)}
        style={{ background: theme.roleGradient }}
        className={cn(
          "group relative flex items-start gap-4 p-4 transition-all duration-300 shadow-sm overflow-hidden cursor-pointer",
          "hover:brightness-110",
          theme.hoverBorder,
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
            "bg-surface-2/80 text-ink-secondary",
            theme.groupHoverIconBg,
            theme.groupHoverIconText,
          )}
        >
          <Brain className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={cn(
                "text-sm font-semibold truncate transition-colors",
                theme.groupHoverText,
                "text-ink-primary",
              )}
            >
              {quickstart.title}
            </h3>
            <ArrowRight
              className={cn(
                "h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0",
                theme.text,
              )}
            />
          </div>

          <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
            {quickstart.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {categoryInfo && (
              <Badge
                className={cn("text-[10px] px-2 h-5 border-white/5", theme.badge, theme.badgeText)}
              >
                {categoryInfo.label}
              </Badge>
            )}
            {quickstart.speculative && (
              <Badge variant="warning" className="text-[10px] px-2 h-5">
                Hypothese
              </Badge>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <PageLayout accentColor="chat">
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <PageHeader
          title="Themen & Diskussionen"
          description="Wähle ein Thema, um eine Diskussion mit Disa zu starten."
        />

        {/* Content Zone - Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-8">
          {/* Interactive Scenarios */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider px-1">
              Interaktive Szenarien
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SCENARIOS["ground-zero"] &&
                renderScenarioCard(
                  SCENARIOS["ground-zero"],
                  <Swords className="h-5 w-5" />,
                  "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)",
                )}
              {SCENARIOS["interview"] &&
                renderScenarioCard(
                  SCENARIOS["interview"],
                  <Briefcase className="h-5 w-5" />,
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)",
                )}
            </div>
          </section>

          {/* Regular Discussions */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider px-1">
              Diskussionen
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {regularDiscussions.map(renderCard)}
            </div>
          </section>

          {/* Conspiracy Theories Section */}
          {conspiracyDiscussions.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <AlertTriangle className="h-4 w-4 text-status-warning" />
                <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider">
                  Verschwörungstheorien
                </h2>
                <Badge
                  variant="outline"
                  className="ml-auto border-status-warning/30 text-status-warning text-[10px] h-5"
                >
                  Kontrovers
                </Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {conspiracyDiscussions.map(renderCard)}
              </div>
            </section>
          )}

          {/* Back to Chat Action */}
          <div className="pt-8 pb-4 flex justify-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-ink-secondary hover:text-ink-primary"
            >
              ← Zurück zum Chat
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
