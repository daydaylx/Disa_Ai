import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CATEGORY_LABELS, getQuickstartsWithFallback, type Quickstart } from "@/config/quickstarts";
import { getCategoryStyle } from "@/lib/categoryColors";
import { AlertTriangle, Brain, ChevronDown } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, Button, Card, CardSkeleton, EmptyState, InfoBanner, PageHeader } from "@/ui";

export default function ThemenPage() {
  const navigate = useNavigate();
  const headerTheme = getCategoryStyle("Spezial");
  const [expandedThemen, setExpandedThemen] = useState<Set<string>>(new Set());
  const [quickstarts, setQuickstarts] = useState<Quickstart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  const regularDiscussions = useMemo(
    () => quickstarts.filter((q) => q.category !== "verschwörungstheorien"),
    [quickstarts],
  );
  const conspiracyDiscussions = useMemo(
    () => quickstarts.filter((q) => q.category === "verschwörungstheorien"),
    [quickstarts],
  );

  const handleStartQuickstart = (quickstart: Quickstart) => {
    void navigate(`/chat?quickstart=${quickstart.id}&title=Diskussion: ${quickstart.title}`);
  };

  const loadQuickstarts = useCallback(async () => {
    setLoadError(null);
    setFallbackNotice(null);

    try {
      let fallbackReason: string | null = null;

      const loadedQuickstarts = await getQuickstartsWithFallback({
        onFallback: (info) => {
          fallbackReason = info.reason;
        },
      });

      setQuickstarts(loadedQuickstarts);

      if (loadedQuickstarts.length === 0) {
        if (fallbackReason === "error") {
          setLoadError("Themen konnten nicht geladen werden.");
        }
        return;
      }

      if (fallbackReason === "error") {
        setFallbackNotice(
          "Externe Themen konnten nicht geladen werden. Standardthemen werden angezeigt.",
        );
      } else if (fallbackReason === "empty") {
        setFallbackNotice("Externe Themenliste ist leer. Standardthemen werden angezeigt.");
      }
    } catch (error) {
      console.error("Failed to load quickstarts", error);
      setQuickstarts([]);
      setLoadError("Themen konnten nicht geladen werden.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuickstarts();
  }, [loadQuickstarts]);

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
        variant="surface"
        interactive
        notch="none"
        padding="none"
        className={cn(
          "relative group overflow-hidden border-white/[0.08] hover:border-white/[0.14] hover:bg-surface-2/65",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-2xl",
            theme.textBg,
          )}
          aria-hidden
        />
        {/* Main Row - Clickable area */}
        <div className="flex items-center gap-4 p-4 cursor-pointer pointer-events-none">
          <button
            type="button"
            className="absolute inset-0 z-10 cursor-pointer rounded-none bg-transparent pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40 focus-visible:ring-inset"
            onClick={() => handleStartQuickstart(quickstart)}
            aria-label={`Thema ${quickstart.title} starten`}
          />

          {/* Icon */}
          <div
            className={cn(
              "relative flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
              theme.iconBg,
              theme.iconText,
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
              aria-expanded={isExpanded}
              aria-controls={`thema-details-${quickstart.id}`}
              aria-label={
                isExpanded
                  ? `Details zu ${quickstart.title} einklappen`
                  : `Details zu ${quickstart.title} ausklappen`
              }
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-lg border-none bg-transparent px-2 text-xs text-ink-tertiary transition-colors hover:bg-surface-2/70 hover:text-ink-primary"
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
        {isLoading ? (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider px-1">
              Diskussionen
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <CardSkeleton count={6} />
            </div>
          </section>
        ) : loadError && quickstarts.length === 0 ? (
          <EmptyState
            icon={<AlertTriangle className="h-6 w-6" />}
            title="Themen konnten nicht geladen werden"
            description={loadError}
            className="rounded-2xl border border-status-error/25 bg-status-error/10"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLoading(true);
                  void loadQuickstarts();
                }}
              >
                Erneut versuchen
              </Button>
            }
          />
        ) : quickstarts.length === 0 ? (
          <EmptyState
            icon={<Brain className="h-6 w-6" />}
            title="Keine Themen verfügbar"
            description="Derzeit sind keine Diskussionsthemen hinterlegt."
            className="rounded-2xl border border-white/10 bg-surface-1/40"
          />
        ) : (
          <>
            {fallbackNotice ? (
              <InfoBanner
                icon={<AlertTriangle className="h-4 w-4" />}
                variant="warning"
                className="rounded-2xl"
              >
                {fallbackNotice}
              </InfoBanner>
            ) : null}

            {/* Regular Discussions */}
            {regularDiscussions.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider px-1">
                  Diskussionen
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {regularDiscussions.map(renderCard)}
                </div>
              </section>
            )}

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
          </>
        )}
      </div>
    </div>
  );
}
