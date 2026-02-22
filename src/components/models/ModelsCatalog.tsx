import { useMemo, useState } from "react";

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
  EmptyState,
  ListRow,
  PageHeader,
  PullToRefresh,
  SearchInput,
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
  const { settings, setPreferredModel } = useSettings();
  const { favorites, toggleModelFavorite, isModelFavorite } = useFavorites();
  const { models: catalog, loading, error, refresh } = useModelCatalog();
  const [search, setSearch] = useState("");
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
    const query = search.trim().toLowerCase();

    // Sort: Favorites first, then by name
    const sorted = [...catalog].sort((a, b) => {
      const favA = isModelFavorite(a.id) ? 1 : 0;
      const favB = isModelFavorite(b.id) ? 1 : 0;
      if (favA !== favB) return favB - favA;
      return (a.label || a.id).localeCompare(b.label || b.id);
    });

    if (!query) return sorted;
    return sorted.filter((entry) => {
      const haystack =
        `${entry.id} ${entry.label ?? ""} ${entry.provider ?? ""} ${entry.tags.join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [catalog, search, isModelFavorite]);

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

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header Zone - Vibrant Glass */}
      <div className="flex-none sticky top-[3.5rem] lg:top-[4rem] z-sticky-content pt-3 sm:pt-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-bg-app/80 shadow-lg backdrop-blur-xl">
          {/* Ambient Header Glow - Based on active model's provider */}
          <div
            className="absolute inset-0 opacity-90 pointer-events-none transition-all duration-500"
            style={{ background: headerTheme.roleGradient }}
          />

          <div className="relative space-y-3 px-3 py-3 sm:px-4 sm:py-4">
            <div className="flex items-start justify-between">
              <PageHeader
                title="Modelle"
                description={`${catalog?.length ?? 0} verfügbar · ${favorites.models.items.length} Favoriten`}
                className="mb-0 flex-1"
              />
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
            </div>

            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Modell suchen..."
              className={cn(
                "w-full bg-surface-2/50 border-white/10 transition-colors",
                `focus:ring-opacity-20 ${headerTheme.text.replace("text-", "focus:border-")} ${headerTheme.text.replace("text-", "focus:ring-")}`,
              )}
            />
          </div>
        </div>
      </div>

      {/* Content Zone - Scrollable List */}
      <PullToRefresh onRefresh={async () => await refresh(true)} className="flex-1 pb-24 pt-4">
        {!catalog && loading ? (
          // Loading skeletons
          <CardSkeleton count={6} />
        ) : error ? ( // Conditional rendering for error state
          <EmptyState
            icon={<Cpu className="h-8 w-8 text-ink-muted" />}
            title="Fehler beim Laden der Modelle" // More specific error title
            description={error} // Display the actual error message
            className="bg-status-error/10 border-status-error/20 text-status-error" // Error styling
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
          <div className="space-y-3">
            {filtered.map((model) => {
              const isActive = activeModelId === model.id;
              const isFavorite = isModelFavorite(model.id);
              const providerTheme = getCategoryStyle(getProviderColorTheme(model.provider));
              const ProviderIcon = getProviderIcon(model.provider);

              return (
                <ListRow
                  key={model.id}
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
                />
              );
            })}
          </div>
        )}
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
              "space-y-3 rounded-xl border px-4 py-4",
              selectedModelTheme.bg,
              selectedModelTheme.border,
            )}
          >
            <div className="grid grid-cols-2 gap-3">
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

            <div className="rounded-xl border border-white/5 bg-surface-1/50 p-3 font-mono text-xs text-ink-tertiary">
              {selectedModel.id}
            </div>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
