import { useNavigate } from "react-router-dom";

import type { Quickstart } from "@/config/quickstarts";
import { CATEGORY_LABELS, QUICKSTARTS } from "@/config/quickstarts";
import { getCategoryStyle } from "@/lib/categoryColors";
import { AlertTriangle, ArrowRight, Brain } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, Button, Card, PageHeader } from "@/ui";

const regularDiscussions = QUICKSTARTS.filter((q) => q.category !== "verschwörungstheorien");
const conspiracyDiscussions = QUICKSTARTS.filter((q) => q.category === "verschwörungstheorien");

export default function ThemenPage() {
  const navigate = useNavigate();
  const headerTheme = getCategoryStyle("Spezial");

  const handleStartQuickstart = (quickstart: Quickstart) => {
    void navigate(`/chat?quickstart=${quickstart.id}&title=Diskussion: ${quickstart.title}`);
  };

  const renderCard = (quickstart: Quickstart) => {
    const categoryInfo = quickstart.category ? CATEGORY_LABELS[quickstart.category] : null;
    const theme = getCategoryStyle(quickstart.category);

    return (
      <Card
        key={quickstart.id}
        variant="interactive"
        role="button"
        onClick={() => handleStartQuickstart(quickstart)}
        style={{ background: theme.roleGradient }}
        className={cn(
          "group relative flex items-start gap-4 p-4 transition-all duration-300 shadow-sm overflow-hidden",
          "border-white/5 hover:brightness-110",
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
    <div className="flex flex-col h-full">
      {/* Header Zone - Vibrant Glass */}
      <div className="flex-none sticky top-[3.5rem] lg:top-[4rem] z-sticky-content pt-4 px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-bg-app/80 shadow-lg backdrop-blur-xl">
          {/* Ambient Header Glow - Chat accent for discussion topics */}
          <div
            className="absolute inset-0 opacity-90 pointer-events-none transition-all duration-500"
            style={{ background: headerTheme.roleGradient }}
          />

          <div className="relative p-4 sm:p-5">
            <PageHeader
              title="Themen & Diskussionen"
              description="Wähle ein Thema, um eine Diskussion mit Disa zu starten."
              className="mb-0"
            />
          </div>
        </div>
      </div>

      {/* Content Zone - Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-8">
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
  );
}
