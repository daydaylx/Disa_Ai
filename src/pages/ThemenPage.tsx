import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Quickstart } from "@/config/quickstarts";
import { CATEGORY_LABELS, QUICKSTARTS } from "@/config/quickstarts";
import { getCategoryStyle } from "@/lib/categoryColors";
import { AlertTriangle, Brain, ChevronDown } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, Button, Card, PageHeader } from "@/ui";

const regularDiscussions = QUICKSTARTS.filter((q) => q.category !== "verschwörungstheorien");
const conspiracyDiscussions = QUICKSTARTS.filter((q) => q.category === "verschwörungstheorien");

export default function ThemenPage() {
  const navigate = useNavigate();
  const headerTheme = getCategoryStyle("Spezial");
  const [expandedThemen, setExpandedThemen] = useState<Set<string>>(new Set());

  const handleStartQuickstart = (quickstart: Quickstart) => {
    void navigate(`/chat?quickstart=${quickstart.id}&title=Diskussion: ${quickstart.title}`);
  };

  const toggleThemaExpansion = useCallback((themaId: string) => {
    setExpandedThemen((prev) => {
      const next = new Set(prev);
      if (next.has(themaId)) next.delete(themaId);
      else next.add(themaId);
      return next;
    });
  }, []);

  const renderCard = (quickstart: Quickstart) => {
    const categoryInfo = quickstart.category ? CATEGORY_LABELS[quickstart.category] : null;
    const theme = getCategoryStyle(quickstart.category);
    const isExpanded = expandedThemen.has(quickstart.id);

    return (
      <Card
        key={quickstart.id}
        variant="roleStrong"
        notch="none"
        padding="none"
        style={{ background: theme.roleGradient }}
        className={cn(
          "relative transition-all duration-300 group overflow-hidden",
          "hover:brightness-110",
          theme.hoverBorder,
        )}
      >
        {/* Main Row - Clickable area */}
        <div
          className="flex items-center gap-4 p-4 cursor-pointer pointer-events-none"
          aria-label={`Thema ${quickstart.title} starten`}
        >
          {/* Invisible clickable overlay */}
          <div
            className="absolute inset-0 cursor-pointer pointer-events-auto z-0"
            onClick={() => handleStartQuickstart(quickstart)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStartQuickstart(quickstart);
              }
            }}
            aria-label={`Thema ${quickstart.title} starten`}
          />

          {/* Icon */}
          <div
            className={cn(
              "relative flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
              theme.iconBg,
              theme.iconText,
              theme.groupHoverIconBg,
            )}
          >
            <Brain className="h-6 w-6" />
          </div>

          {/* Info */}
          <div className="relative flex-1 min-w-0">
            <span
              className={cn(
                "font-semibold text-sm truncate block",
                "text-ink-primary group-hover:text-ink-primary",
              )}
            >
              {quickstart.title}
            </span>
            <p className="text-xs text-ink-secondary truncate mt-1">
              {categoryInfo?.label || "Diskussion"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-2 pr-10 relative z-20 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleThemaExpansion(quickstart.id);
              }}
              className="inline-flex items-center gap-1 text-xs text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Details
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-180")}
              />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div id={`thema-details-${quickstart.id}`} className="px-4 pb-4 pt-0 animate-fade-in">
            <div className={cn("space-y-3 rounded-xl border px-4 py-4", theme.bg, theme.border)}>
              {/* Full Description */}
              <div>
                <p className="text-xs text-ink-tertiary font-medium mb-1">Beschreibung</p>
                <p className="text-sm text-ink-secondary leading-relaxed">
                  {quickstart.description}
                </p>
              </div>

              {/* Tags */}
              {(categoryInfo || quickstart.speculative) && (
                <div className="flex flex-wrap gap-1.5">
                  {categoryInfo && (
                    <Badge className={cn("text-[10px] px-2 h-5", theme.badge, theme.badgeText)}>
                      {categoryInfo.label}
                    </Badge>
                  )}
                  {quickstart.speculative && (
                    <Badge variant="warning" className="text-[10px] px-2 h-5">
                      Hypothese
                    </Badge>
                  )}
                </div>
              )}

              {/* Start Button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleStartQuickstart(quickstart)}
                className="w-full"
              >
                Diskussion starten
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Zone - Vibrant Glass */}
      <div className="flex-none sticky top-[3.5rem] lg:top-[4rem] z-sticky-content pt-3 sm:pt-4 px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-bg-app/80 shadow-lg backdrop-blur-xl">
          {/* Ambient Header Glow - Chat accent for discussion topics */}
          <div
            className="absolute inset-0 opacity-90 pointer-events-none transition-all duration-500"
            style={{ background: headerTheme.roleGradient }}
          />

          <div className="relative p-3 sm:p-5">
            <PageHeader
              title="Themen & Diskussionen"
              description="Wähle ein Thema, um eine Diskussion mit Disa zu starten."
              className="mb-0"
            />
          </div>
        </div>
      </div>

      {/* Content Zone - Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6 space-y-7 sm:space-y-8">
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
            onClick={() => void navigate("/")}
            className="text-ink-secondary hover:text-ink-primary"
          >
            ← Zurück zum Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
