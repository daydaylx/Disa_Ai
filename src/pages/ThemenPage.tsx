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
  PageHeroStat,
  PullToRefresh,
} from "@/ui";

type ThemaCategory = Quickstart["category"];

function getThemaIcon(category?: ThemaCategory) {
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
          "border-white/[0.08]",
          theme.hoverBorder,
          theme.hoverBg,
          theme.hoverGlow,
        )}
        style={{ "--stagger-i": Math.min(index, 5) } as CSSProperties}
        title={quickstart.title}
        subtitle={categoryInfo?.label || "Diskussion"}
        onPress={() => setSelectedThema(quickstart)}
        pressLabel={`Thema ${quickstart.title} öffnen`}
        accentClassName={theme.textBg}
        leading={
          <div
            className={cn(
              "relative flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
              theme.iconBg,
              theme.iconText,
              theme.groupHoverIconBg,
              theme.groupHoverIconText,
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
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 text-[11px] font-medium text-ink-secondary shadow-inner backdrop-blur-sm transition-colors hover:bg-white/[0.09] hover:text-ink-primary"
          >
            Details
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        }
      >
        <div className="space-y-3">
          <p className="line-clamp-2 text-sm font-medium leading-relaxed text-ink-secondary">
            {quickstart.description}
          </p>
          {quickstart.speculative || quickstart.category === "verschwörungstheorien" ? (
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-tertiary">
              {quickstart.speculative ? (
                <Badge variant="warning" size="sm">
                  Hypothese
                </Badge>
              ) : null}
              {quickstart.category === "verschwörungstheorien" ? (
                <span className="rounded-full border border-status-warning/25 bg-status-warning/10 px-2 py-1 text-status-warning">
                  Kontrovers
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </ListRow>
    );
  }, []);

  const isBusy = isLoading || isRefreshing;
  const countLabel =
    isLoading && quickstarts.length === 0
      ? "Themen werden geladen…"
      : `${quickstarts.length} Themen · ${conspiracyDiscussions.length} Kontrovers`;
  const sectionHeadingClass = "text-xs font-medium uppercase tracking-widest text-ink-secondary";

  const selectedThemaInfo = selectedThema?.category
    ? CATEGORY_LABELS[selectedThema.category]
    : null;
  const selectedThemaTheme = getCategoryStyle(selectedThema?.category);
  const featuredQuickstart = selectedThema ?? regularDiscussions[0] ?? quickstarts[0] ?? null;
  const headerTheme = getCategoryStyle(featuredQuickstart?.category ?? "Spezial");
  const FeaturedQuickstartIcon = getThemaIcon(featuredQuickstart?.category);

  return (
    <div className="relative isolate flex h-full min-h-0 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute -top-16 left-1/2 z-0 hidden h-64 w-64 -translate-x-1/2 rounded-full blur-3xl motion-safe:animate-pulse-glow sm:block"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(56,189,248,0.10) 50%, transparent 70%)",
          opacity: 0.35,
        }}
        aria-hidden="true"
      />
      <PullToRefresh
        onRefresh={handleRefresh}
        disabled={isBusy}
        className="relative z-10 flex-1 min-h-0"
      >
        <div className="flex min-h-full flex-col gap-4 px-4 pb-page-bottom-safe pt-4">
          <CatalogHeader
            className="shrink-0"
            title="Themen"
            countLabel={countLabel}
            gradientStyle={headerTheme.roleGradient}
            eyebrow="Gesprächsanstöße"
            icon={<FeaturedQuickstartIcon className="h-5 w-5" />}
            description="Starte ohne leere Eingabe direkt in ein vorbereitetes Gespräch. Themen geben dir sofort einen klaren Aufhänger für Diskussion, Analyse oder kreative Exploration."
            meta={
              <>
                <Badge className="rounded-full border-white/10 bg-white/[0.06] text-ink-primary">
                  Themen führen schnell in einen passenden Chat
                </Badge>
                {featuredQuickstart?.category ? (
                  <Badge
                    className={cn(
                      "rounded-full border-white/10 bg-white/[0.06]",
                      getCategoryStyle(featuredQuickstart.category).badgeText,
                    )}
                  >
                    Fokus: {CATEGORY_LABELS[featuredQuickstart.category]?.label ?? "Diskussion"}
                  </Badge>
                ) : null}
              </>
            }
            action={
              <Button
                variant="primary"
                size="sm"
                disabled={!featuredQuickstart}
                onClick={() => {
                  if (featuredQuickstart) {
                    handleStartQuickstart(featuredQuickstart);
                  }
                }}
                className="flex-1 sm:flex-none"
              >
                Direkt loslegen
              </Button>
            }
            secondaryAction={
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
            highlights={
              <div className="grid gap-2 sm:grid-cols-3">
                <PageHeroStat
                  label="Empfohlen"
                  value={featuredQuickstart ? "Bereit zum Start" : "Noch kein Thema gewählt"}
                  helper={
                    featuredQuickstart
                      ? `Aktuell empfohlen: ${featuredQuickstart.title}`
                      : "Wähle unten ein Thema und starte direkt in eine neue Unterhaltung."
                  }
                  icon={<FeaturedQuickstartIcon className="h-4 w-4" />}
                />
                <PageHeroStat
                  label="Diskussionen"
                  value={`${regularDiscussions.length}`}
                  helper="Allgemeine Themen für Analyse, Debatte und neue Ideen."
                  icon={<Brain className="h-4 w-4" />}
                  className="hidden sm:block"
                />
                <PageHeroStat
                  label="Kontrovers"
                  value={`${conspiracyDiscussions.length}`}
                  helper="Bewusst markiert, damit du den Charakter des Themas sofort erkennst."
                  icon={<AlertTriangle className="h-4 w-4" />}
                  className="hidden sm:block"
                />
              </div>
            }
          />

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
        </div>
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
