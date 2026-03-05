import { type CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CATEGORY_LABELS, getQuickstartsWithFallback, type Quickstart } from "@/config/quickstarts";
import { getCategoryStyle } from "@/lib/categoryColors";
import {
  AlertTriangle,
  Brain,
  ChevronDown,
  Landmark,
  Microscope,
  RefreshCw,
  Sparkles,
  Theater,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  Badge,
  BottomSheet,
  Button,
  CardSkeleton,
  CatalogHeader,
  EmptyState,
  InfoBanner,
  ListRow,
  PullToRefresh,
} from "@/ui";

type ThemaCategory = Quickstart["category"];

function getThemaIcon(category: ThemaCategory) {
  switch (category) {
    case "realpolitik":
      return Landmark;
    case "hypothetisch":
      return Sparkles;
    case "wissenschaft":
      return Microscope;
    case "kultur":
      return Theater;
    case "verschwörungstheorien":
      return AlertTriangle;
    default:
      return Brain;
  }
}

export default function ThemenPage() {
  const navigate = useNavigate();

  const [selectedThema, setSelectedThema] = useState<Quickstart | null>(null);
  const [quickstarts, setQuickstarts] = useState<Quickstart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  const headerTheme = getCategoryStyle(selectedThema?.category ?? "Spezial");

  const regularDiscussions = useMemo(
    () => quickstarts.filter((q) => q.category !== "verschwörungstheorien"),
    [quickstarts],
  );
  const conspiracyDiscussions = useMemo(
    () => quickstarts.filter((q) => q.category === "verschwörungstheorien"),
    [quickstarts],
  );

  const handleStartQuickstart = useCallback(
    (quickstart: Quickstart) => {
      void navigate(`/chat?quickstart=${quickstart.id}&title=Diskussion: ${quickstart.title}`);
    },
    [navigate],
  );

  const loadQuickstarts = useCallback(async (options?: { showLoadingState?: boolean }) => {
    const shouldShowLoading = options?.showLoadingState ?? true;
    if (shouldShowLoading) {
      setIsLoading(true);
    }

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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadQuickstarts({ showLoadingState: false });
    } finally {
      setIsRefreshing(false);
    }
  }, [loadQuickstarts]);

  const renderQuickstartRow = useCallback((quickstart: Quickstart, index: number) => {
    const categoryInfo = quickstart.category ? CATEGORY_LABELS[quickstart.category] : null;
    const theme = getCategoryStyle(quickstart.category);
    const ThemaIcon = getThemaIcon(quickstart.category);

    return (
      <ListRow
        key={quickstart.id}
        surfaceVariant="catalogGlass"
        className={cn(
          "stagger-item",
          "border-white/[0.08] hover:border-white/[0.14] hover:bg-surface-2/65",
        )}
        style={{ "--stagger-i": Math.min(index, 5) } as CSSProperties}
        title={quickstart.title}
        subtitle={categoryInfo?.label || "Diskussion"}
        onPress={() => setSelectedThema(quickstart)}
        pressLabel={`Details zu ${quickstart.title} anzeigen`}
        accentClassName={theme.textBg}
        leading={
          <div
            className={cn(
              "relative flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
              theme.iconBg,
              theme.iconText,
            )}
          >
            <ThemaIcon className="h-6 w-6" />
          </div>
        }
        topRight={
          quickstart.speculative ? (
            <Badge variant="warning" className="h-5 px-2 text-[10px] shadow-sm">
              Hypothese
            </Badge>
          ) : undefined
        }
        trailing={
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedThema(quickstart);
            }}
            aria-label={`Details zu ${quickstart.title} anzeigen`}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-lg bg-transparent px-2 text-xs text-ink-tertiary transition-colors hover:bg-surface-2/70 hover:text-ink-primary"
          >
            Details
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        }
      />
    );
  }, []);

  const isBusy = isLoading || isRefreshing;
  const countLabel =
    isLoading && quickstarts.length === 0
      ? "Themen werden geladen…"
      : `${quickstarts.length} Themen · ${conspiracyDiscussions.length} Kontrovers`;
  const sectionHeadingClass = "text-xs font-medium uppercase tracking-widest text-ink-muted";

  const selectedThemaInfo = selectedThema?.category
    ? CATEGORY_LABELS[selectedThema.category]
    : null;
  const selectedThemaTheme = getCategoryStyle(selectedThema?.category);

  return (
    <div className="relative isolate flex flex-col h-full overflow-hidden">
      <div
        className="pointer-events-none absolute -top-16 left-1/2 z-0 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl motion-safe:animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(56,189,248,0.10) 50%, transparent 70%)",
          opacity: 0.35,
        }}
        aria-hidden="true"
      />
      <CatalogHeader
        className="relative z-10"
        title="Themen"
        countLabel={countLabel}
        gradientStyle={headerTheme.roleGradient}
        action={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              void handleRefresh();
            }}
            disabled={isBusy}
            className="text-ink-tertiary hover:text-ink-primary hover:bg-surface-2"
            aria-label="Themen aktualisieren"
            title="Themen neu laden"
          >
            <RefreshCw className={cn("h-5 w-5", isBusy && "animate-spin")} />
          </Button>
        }
      />

      <PullToRefresh
        onRefresh={handleRefresh}
        disabled={isBusy}
        className="relative z-10 flex-1 min-h-0 pb-page-bottom-safe pt-4 px-4"
      >
        {isLoading && quickstarts.length === 0 ? (
          <CardSkeleton count={6} />
        ) : loadError && quickstarts.length === 0 ? (
          <EmptyState
            icon={<AlertTriangle className="h-8 w-8 text-ink-muted" />}
            title="Themen konnten nicht geladen werden"
            description={loadError}
            className="rounded-2xl border border-status-error/25 bg-status-error/10 text-status-error"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void handleRefresh();
                }}
              >
                Erneut versuchen
              </Button>
            }
          />
        ) : quickstarts.length === 0 ? (
          <EmptyState
            icon={<Brain className="h-8 w-8 text-ink-muted" />}
            title="Keine Themen verfügbar"
            description="Derzeit sind keine Diskussionsthemen hinterlegt."
            className="bg-surface-1/30 rounded-2xl border border-white/5 backdrop-blur-sm py-12"
          />
        ) : (
          <div className="space-y-5">
            {fallbackNotice ? (
              <InfoBanner
                icon={<AlertTriangle className="h-4 w-4" />}
                variant="warning"
                className="rounded-2xl"
              >
                {fallbackNotice}
              </InfoBanner>
            ) : null}

            {regularDiscussions.length > 0 ? (
              <section className="space-y-3">
                <h2 className={cn("px-1", sectionHeadingClass)}>Diskussionen</h2>
                <div className="space-y-2 animate-fade-in">
                  {regularDiscussions.map(renderQuickstartRow)}
                </div>
              </section>
            ) : null}

            {conspiracyDiscussions.length > 0 ? (
              <section className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <AlertTriangle className="h-4 w-4 text-status-warning" />
                  <h2 className={sectionHeadingClass}>Verschwörungstheorien</h2>
                  <Badge
                    variant="outline"
                    className="ml-auto border-status-warning/30 text-status-warning"
                    size="sm"
                  >
                    Kontrovers
                  </Badge>
                </div>
                <div className="space-y-2 animate-fade-in">
                  {conspiracyDiscussions.map((quickstart, index) =>
                    renderQuickstartRow(quickstart, regularDiscussions.length + index),
                  )}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </PullToRefresh>

      <BottomSheet
        open={selectedThema !== null}
        onClose={() => setSelectedThema(null)}
        title={selectedThema?.title}
        description={selectedThemaInfo?.label || "Diskussion"}
        className={selectedThema ? selectedThemaTheme.bg : undefined}
        footer={
          selectedThema ? (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedThema(null)}
                className="min-h-[44px] flex-1"
              >
                Schließen
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const thema = selectedThema;
                  setSelectedThema(null);
                  handleStartQuickstart(thema);
                }}
                className="min-h-[44px] flex-1"
              >
                Diskussion starten
              </Button>
            </div>
          ) : null
        }
      >
        {selectedThema ? (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-ink-secondary">
              {selectedThema.description}
            </p>

            {(selectedThemaInfo ||
              selectedThema.speculative ||
              selectedThema.category === "verschwörungstheorien") && (
              <div className="flex flex-wrap gap-1.5">
                {selectedThemaInfo ? (
                  <Badge
                    size="sm"
                    className={cn(selectedThemaTheme.badge, selectedThemaTheme.badgeText)}
                  >
                    {selectedThemaInfo.label}
                  </Badge>
                ) : null}
                {selectedThema.speculative ? (
                  <Badge variant="warning" size="sm">
                    Hypothese
                  </Badge>
                ) : null}
                {selectedThema.category === "verschwörungstheorien" ? (
                  <Badge
                    variant="outline"
                    size="sm"
                    className="border-status-warning/30 text-status-warning"
                  >
                    Kontrovers
                  </Badge>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
