import { type CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CATEGORY_LABELS, getQuickstartsWithFallback, type Quickstart } from "@/config/quickstarts";
import { getCategoryStyle } from "@/lib/categoryColors";
import { AlertTriangle, Brain, ChevronDown, RefreshCw } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, Button, Card, CardSkeleton, CatalogHeader, EmptyState, InfoBanner } from "@/ui";

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

  const renderCard = (quickstart: Quickstart, index: number) => {
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
          "stagger-item relative group overflow-hidden border-white/[0.10] hover:border-white/[0.14] hover:bg-surface-2/65",
        )}
        style={{ "--stagger-i": Math.min(index, 5) } as CSSProperties}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-[3px] rounded-l-2xl",
            theme.textBg,
          )}
          aria-hidden
        />
        {/* Main Row - Clickable area */}
        <div className="flex items-center gap-4 cursor-pointer pointer-events-none">
          <button
            type="button"
            className="absolute inset-0 z-content cursor-pointer rounded-none bg-transparent pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40 focus-visible:ring-inset"
            onClick={() => handleStartQuickstart(quickstart)}
            aria-label={`Thema ${quickstart.title} starten`}
          />

          {/* Icon */}
          <div
            className={cn(
              "relative flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
              theme.iconBg,
              theme.iconText,
            )}
          >
            <Brain className="h-5 w-5" />
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
          <div className="flex flex-col items-end gap-2 pr-10 relative z-sticky-header pointer-events-auto">
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
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border-none bg-transparent text-ink-tertiary transition-colors hover:bg-surface-2/70 hover:text-ink-primary"
            >
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
              />
            </button>
          </div>
        </div>

        {/* Expanded Details - animated via CSS grid height technique */}
        <div
          className="accordion-panel"
          data-open={isExpanded ? "true" : "false"}
          aria-hidden={!isExpanded}
        >
          <div className="accordion-inner">
            <div id={`thema-details-${quickstart.id}`} className="px-4 pb-4 pt-0">
              <div className={cn("space-y-3 rounded-xl border px-3 py-3", theme.bg, theme.border)}>
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
                      <Badge size="sm" className={cn(theme.badge, theme.badgeText)}>
                        {categoryInfo.label}
                      </Badge>
                    )}
                    {quickstart.speculative && (
                      <Badge variant="warning" size="sm">
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
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <CatalogHeader
        title="Themen"
        countLabel={isLoading ? "Themen werden geladen…" : `${quickstarts.length} Themen verfügbar`}
        gradientStyle={headerTheme.roleGradient}
        action={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsLoading(true);
              void loadQuickstarts();
            }}
            disabled={isLoading}
            className="text-ink-tertiary hover:text-ink-primary hover:bg-surface-2"
            aria-label="Themen aktualisieren"
            title="Themen neu laden"
          >
            <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
          </Button>
        }
      />

      {/* Content Zone - Scrollable List */}
      <div className="flex-1 overflow-y-auto pb-page-bottom-safe pt-4 px-4 space-y-6">
        {isLoading ? (
          <section className="space-y-2">
            <h2 className="text-xs font-medium text-ink-muted uppercase tracking-widest px-1">
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
              <section className="space-y-2">
                <h2 className="text-xs font-medium text-ink-muted uppercase tracking-widest px-1">
                  Diskussionen
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {regularDiscussions.map(renderCard)}
                </div>
              </section>
            )}

            {/* Conspiracy Theories Section */}
            {conspiracyDiscussions.length > 0 && (
              <section className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <AlertTriangle className="h-4 w-4 text-status-warning" />
                  <h2 className="text-xs font-medium text-ink-muted uppercase tracking-widest">
                    Verschwörungstheorien
                  </h2>
                  <Badge
                    variant="outline"
                    className="ml-auto border-status-warning/30 text-status-warning"
                    size="sm"
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
