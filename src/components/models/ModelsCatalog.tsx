import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { type ModelEntry } from "@/config/models";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useModelCatalog } from "@/contexts/ModelCatalogContext";
import { useSettings } from "@/hooks/useSettings";
import { getCategoryStyle } from "@/lib/categoryColors";
import {
  Bot,
  Brain,
  ChevronDown,
  Code2,
  Cpu,
  type LucideIcon,
  RefreshCw,
  Search as SearchIcon,
  Sparkles,
  Star,
  Users,
  Waves,
  Zap,
} from "@/lib/icons";
import { coercePrice, formatPricePerK } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import {
  Badge,
  BottomSheet,
  Button,
  CardSkeleton,
  CatalogHeader,
  EmptyState,
  ListRow,
  PageHeroStat,
  PullToRefresh,
} from "@/ui";

interface ModelsCatalogProps {
  className?: string;
}

/**
 * Maps model providers to their corresponding icons
 * Similar to role icon mapping for visual consistency
 */
function getProviderIcon(provider?: string): LucideIcon {
  if (!provider) return Cpu;

  const providerLower = provider.toLowerCase();

  // Provider-specific icon mapping
  const providerIconMap: Record<string, LucideIcon> = {
    // Major AI providers
    openai: Sparkles,
    anthropic: Brain,
    google: SearchIcon,
    meta: Users,
    "meta-llama": Users,
    mistral: Waves,
    cohere: Code2,

    // Other providers
    deepseek: Brain,
    qwen: Bot,
    "01-ai": Zap,
    nvidia: Cpu,
    microsoft: Code2,
    amazon: Cpu,
    ai21: Brain,
    perplexity: SearchIcon,

    // Open source / community
    huggingfaceh4: Users,
    teknium: Bot,
    nousresearch: Brain,
    gryphe: Brain,
  };

  // Try exact match first
  if (providerIconMap[providerLower]) {
    return providerIconMap[providerLower]!;
  }

  // Try partial match
  for (const [key, icon] of Object.entries(providerIconMap)) {
    if (providerLower.includes(key)) {
      return icon;
    }
  }

  // Default fallback
  return Cpu;
}

/**
 * Maps model providers to color themes
 * Similar to role category colors for visual variety
 */
function getProviderColorTheme(provider?: string): string {
  if (!provider) return "slate";

  const providerLower = provider.toLowerCase();

  // Provider-specific color mapping
  const providerColorMap: Record<string, string> = {
    // Major AI providers - distinct colors matching their brand identity
    openai: "emerald", // Green for OpenAI
    anthropic: "amber", // Warm amber for Anthropic
    google: "indigo", // Blue for Google
    meta: "cyan", // Cyan for Meta
    "meta-llama": "cyan",
    mistral: "violet", // Purple for Mistral
    cohere: "rose", // Rose for Cohere

    // Other providers
    deepseek: "indigo",
    qwen: "violet",
    "01-ai": "pink",
    nvidia: "emerald",
    microsoft: "indigo",
    amazon: "amber",
    ai21: "cyan",
    perplexity: "rose",

    // Open source / community - varied colors
    huggingfaceh4: "amber",
    teknium: "violet",
    nousresearch: "emerald",
    gryphe: "cyan",
  };

  // Try exact match first
  if (providerColorMap[providerLower]) {
    return providerColorMap[providerLower]!;
  }

  // Try partial match
  for (const [key, color] of Object.entries(providerColorMap)) {
    if (providerLower.includes(key)) {
      return color;
    }
  }

  // Default fallback
  return "slate";
}

function getContextTokens(entry?: ModelEntry) {
  if (!entry) return 0;
  return entry.ctx ?? entry.contextTokens ?? 0;
}

function getPriceLabel(entry: ModelEntry) {
  const inputPrice = coercePrice(entry.pricing?.in, 0);
  const outputPrice = coercePrice(entry.pricing?.out, 0);
  if (inputPrice === 0 && outputPrice === 0) return "Gratis";
  return `${formatPricePerK(inputPrice)} / ${formatPricePerK(outputPrice, { currencySymbol: "" })}`;
}

export function ModelsCatalog({ className }: ModelsCatalogProps) {
  const navigate = useNavigate();
  const { settings, setPreferredModel } = useSettings();
  const { favorites, toggleModelFavorite, isModelFavorite } = useFavorites();
  const { models: catalog, loading, error, refresh } = useModelCatalog();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filtered = useMemo(() => {
    if (!catalog) return [] as ModelEntry[];

    return [...catalog].sort((a, b) => {
      const favA = isModelFavorite(a.id) ? 1 : 0;
      const favB = isModelFavorite(b.id) ? 1 : 0;
      if (favA !== favB) return favB - favA;
      return (a.label || a.id).localeCompare(b.label || b.id);
    });
  }, [catalog, isModelFavorite]);

  const activeModelId = settings.preferredModelId;
  const isLoading = loading || isRefreshing;
  const selectedModel = useMemo(
    () => catalog?.find((entry) => entry.id === selectedModelId) ?? null,
    [catalog, selectedModelId],
  );
  const selectedModelTheme = selectedModel
    ? getCategoryStyle(getProviderColorTheme(selectedModel.provider))
    : getCategoryStyle("cyan");

  // Get the active model's provider for header theming
  const activeModel = catalog?.find((m) => m.id === activeModelId);
  const headerTheme = activeModel
    ? getCategoryStyle(getProviderColorTheme(activeModel.provider))
    : getCategoryStyle("cyan"); // Default to cyan (models accent color)
  const countLabel =
    !catalog && loading
      ? "Modelle werden geladen…"
      : `${catalog?.length ?? 0} Modelle · ${favorites.models.items.length} Favoriten`;
  const highlightedModel = activeModel ?? filtered[0] ?? null;
  const HighlightedModelIcon = highlightedModel ? getProviderIcon(highlightedModel.provider) : Cpu;

  return (
    <div className={cn("relative isolate flex h-full min-h-0 flex-col overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute -top-16 left-1/2 z-0 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl motion-safe:animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.20) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
          opacity: 0.35,
        }}
        aria-hidden="true"
      />
      <PullToRefresh
        onRefresh={handleRefresh}
        disabled={isLoading}
        className="relative z-10 flex-1 min-h-0"
      >
        <div className="flex min-h-full flex-col gap-4 px-4 pb-page-bottom-safe pt-4">
          <CatalogHeader
            className="shrink-0"
            title="Modelle"
            countLabel={countLabel}
            gradientStyle={headerTheme.roleGradient}
            eyebrow="Gesprächs-Setup"
            icon={<HighlightedModelIcon className="h-5 w-5" />}
            description="Wähle das Modell, das neue Chats standardmäßig nutzt. So weißt du vor dem Start sofort, mit welcher Stärke, Geschwindigkeit und Preisstufe du arbeitest."
            meta={
              <>
                <Badge className="rounded-full border-white/10 bg-white/[0.06] text-ink-primary">
                  Neue Chats übernehmen dein aktives Modell
                </Badge>
                {highlightedModel?.provider ? (
                  <Badge
                    className={cn(
                      "rounded-full border-white/10 bg-white/[0.06]",
                      headerTheme.badgeText,
                    )}
                  >
                    Anbieter: {highlightedModel.provider}
                  </Badge>
                ) : null}
              </>
            }
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  void navigate("/chat");
                }}
                className="flex-1 sm:flex-none"
              >
                Im Chat nutzen
              </Button>
            }
            secondaryAction={
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
                className="text-ink-tertiary hover:text-ink-primary hover:bg-surface-2"
                aria-label="Modelle aktualisieren"
                title="Modelliste aktualisieren"
              >
                <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
              </Button>
            }
            highlights={
              <div className="grid gap-2 sm:grid-cols-3">
                <PageHeroStat
                  label="Aktiv"
                  value={highlightedModel ? "Bereit für neue Chats" : "Noch nicht gewählt"}
                  helper={
                    highlightedModel
                      ? `Aktuelles Modell: ${highlightedModel.label} · ${getContextTokens(highlightedModel).toLocaleString()} Tokens`
                      : "Tippe unten auf ein Modell, um es zu aktivieren."
                  }
                  icon={<HighlightedModelIcon className="h-4 w-4" />}
                />
                <PageHeroStat
                  label="Favoriten"
                  value={`${favorites.models.items.length}`}
                  helper="Favoriten bleiben oben und sind schneller wiederzufinden."
                  icon={<Star className="h-4 w-4" />}
                />
                <PageHeroStat
                  label="Preisgefühl"
                  value={highlightedModel ? getPriceLabel(highlightedModel) : "—"}
                  helper="Input / Output pro 1K Tokens"
                  icon={<Sparkles className="h-4 w-4" />}
                />
              </div>
            }
          />

          {!catalog && loading ? (
            <CardSkeleton count={6} />
          ) : error ? (
            <EmptyState
              icon={<Cpu className="h-8 w-8 text-ink-muted" />}
              title="Fehler beim Laden der Modelle"
              description={error}
              className="rounded-2xl border border-status-error/25 bg-status-error/10 text-status-error"
              action={
                <Button onClick={() => handleRefresh()} variant="outline" size="sm">
                  Erneut versuchen
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Cpu className="h-8 w-8 text-ink-muted" />}
              title="Keine Modelle gefunden"
              description="Versuche es mit anderen Suchbegriffen."
              className="bg-surface-1/30 rounded-2xl border border-white/5 backdrop-blur-sm py-12"
            />
          ) : (
            <div className="space-y-2 animate-fade-in">
              {filtered.map((model) => {
                const isActive = activeModelId === model.id;
                const isFavorite = isModelFavorite(model.id);
                const providerTheme = getCategoryStyle(getProviderColorTheme(model.provider));
                const ProviderIcon = getProviderIcon(model.provider);

                return (
                  <ListRow
                    key={model.id}
                    surfaceVariant="catalogGlass"
                    data-testid="model-card"
                    aria-label={model.label ?? model.id}
                    title={model.label ?? model.id}
                    subtitle={model.provider || "Unknown"}
                    active={isActive}
                    onPress={() => setPreferredModel(model.id)}
                    pressLabel={`Modell ${model.label ?? model.id} auswählen`}
                    pressed={isActive}
                    accentClassName={providerTheme.textBg}
                    className={cn(
                      isActive
                        ? cn("border-white/[0.14]", providerTheme.border, providerTheme.glow)
                        : "border-white/[0.08] hover:border-white/[0.14] hover:bg-surface-2/65",
                    )}
                    leading={
                      <div
                        className={cn(
                          "relative flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
                          isActive
                            ? cn(providerTheme.iconBg, providerTheme.iconText, "shadow-inner")
                            : cn(providerTheme.iconBg, providerTheme.iconText),
                        )}
                      >
                        <ProviderIcon className="h-6 w-6" />
                      </div>
                    }
                    topRight={
                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <Badge
                            className={cn(
                              "h-5 px-2 text-[10px] shadow-sm",
                              providerTheme.badge,
                              providerTheme.badgeText,
                            )}
                          >
                            Aktiv
                          </Badge>
                        ) : null}
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleModelFavorite(model.id);
                          }}
                          aria-label={
                            isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
                          }
                          className={cn(
                            "relative flex h-11 w-11 items-center justify-center rounded-full border text-ink-tertiary transition-colors",
                            isFavorite
                              ? "border-status-warning/40 bg-status-warning/10 text-status-warning"
                              : "border-white/5 bg-surface-2/80 hover:border-white/10 hover:text-ink-primary",
                          )}
                        >
                          <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
                        </button>
                      </div>
                    }
                    trailing={
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedModelId(model.id);
                        }}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-lg bg-transparent px-2 text-xs text-ink-tertiary transition-colors hover:bg-surface-2/70 hover:text-ink-primary"
                      >
                        Details
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      {model.description ? (
                        <p className="line-clamp-2 text-sm leading-relaxed text-ink-secondary">
                          {model.description}
                        </p>
                      ) : null}

                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-tertiary">
                        <span className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-1">
                          {getContextTokens(model).toLocaleString()} Tokens
                        </span>
                        <span className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-1">
                          {getPriceLabel(model)}
                        </span>
                        {model.tags?.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            size="sm"
                            className={cn(providerTheme.badge, providerTheme.badgeText)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </ListRow>
                );
              })}
            </div>
          )}
        </div>
      </PullToRefresh>

      <BottomSheet
        open={!!selectedModel}
        onClose={() => setSelectedModelId(null)}
        title={selectedModel?.label ?? selectedModel?.id}
        description={selectedModel?.provider || "Modell-Details"}
        footer={
          selectedModel ? (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setSelectedModelId(null)}
              >
                Schließen
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                disabled={activeModelId === selectedModel.id}
                onClick={() => {
                  setPreferredModel(selectedModel.id);
                  setSelectedModelId(null);
                }}
              >
                {activeModelId === selectedModel.id ? "Bereits aktiv" : "Als aktiv setzen"}
              </Button>
            </div>
          ) : null
        }
      >
        {selectedModel ? (
          <div
            className={cn(
              "space-y-3 rounded-xl border px-3 py-3",
              selectedModelTheme.bg,
              selectedModelTheme.border,
            )}
          >
            <div className="grid grid-cols-2 gap-2xs">
              <div className="space-y-1">
                <p className="text-xs font-medium text-ink-tertiary">Context Window</p>
                <p className="text-sm font-semibold text-ink-primary">
                  {getContextTokens(selectedModel).toLocaleString()} Tokens
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-ink-tertiary">Pricing</p>
                <p className="text-sm font-semibold text-ink-primary">
                  {getPriceLabel(selectedModel)}
                </p>
              </div>
            </div>

            {selectedModel.tags && selectedModel.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 text-ink-tertiary">
                {selectedModel.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className={cn(
                      "h-5 px-2 text-[10px]",
                      selectedModelTheme.badge,
                      selectedModelTheme.badgeText,
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}

            <div className="rounded-xl border border-white/5 bg-surface-1/50 p-2xs font-mono text-xs text-ink-tertiary">
              {selectedModel.id}
            </div>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
