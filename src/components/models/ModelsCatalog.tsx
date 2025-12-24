import { useMemo, useState } from "react";

import { type ModelEntry } from "@/config/models";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useModelCatalog } from "@/contexts/ModelCatalogContext";
import { useSettings } from "@/hooks/useSettings";
import { getCategoryStyle } from "@/lib/categoryColors";
import {
  Bot,
  Brain,
  Check,
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
import { Button, EmptyState, PageHeader, SearchInput, useToasts } from "@/ui";

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
  const toasts = useToasts();
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh(true);
      toasts.push({
        kind: "success",
        title: "Modelle aktualisiert",
        message: `${catalog?.length ?? 0} Modelle geladen.`,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleModelSelect = (modelId: string, modelLabel?: string) => {
    setPreferredModel(modelId);
    toasts.push({
      kind: "success",
      title: "Modell ausgewählt",
      message: `${modelLabel ?? modelId} ist jetzt aktiv.`,
    });
  };

  const handleFavoriteToggle = (modelId: string, isFavorite: boolean, modelLabel?: string) => {
    toggleModelFavorite(modelId);
    toasts.push({
      kind: "info",
      title: isFavorite ? "Favorit entfernt" : "Favorit hinzugefügt",
      message: modelLabel ?? modelId,
    });
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

  // Get the active model's provider for header theming
  const activeModel = catalog?.find((m) => m.id === activeModelId);
  const headerTheme = activeModel
    ? getCategoryStyle(getProviderColorTheme(activeModel.provider))
    : getCategoryStyle("cyan"); // Default to cyan (models accent color)

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header Zone - Vibrant Glass */}
      <div className="flex-none sticky top-[3.5rem] lg:top-[4rem] z-sticky-content pt-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-bg-app/80 shadow-lg backdrop-blur-xl">
          {/* Ambient Header Glow - Based on active model's provider */}
          <div
            className="absolute inset-0 opacity-90 pointer-events-none transition-all duration-500"
            style={{ background: headerTheme.roleGradient }}
          />

          <div className="relative space-y-3 px-4 py-4">
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
      <div className="flex-1 overflow-y-auto pb-24 pt-4">
        {!catalog && loading ? (
          // Loading skeletons
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                data-testid="model-card-skeleton"
                className="h-20 rounded-2xl bg-surface-1/50 animate-pulse"
              />
            ))}
          </div>
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
                <div
                  key={model.id}
                  data-testid="model-card"
                  className={cn(
                    "relative w-full flex items-center gap-4 min-h-[84px] text-left transition-all duration-300 rounded-2xl border p-4 group overflow-hidden",
                    isActive
                      ? cn("ring-1", providerTheme.border, providerTheme.glow)
                      : cn("hover:brightness-110", providerTheme.hoverBorder),
                  )}
                  style={{ background: providerTheme.roleGradient }}
                >
                  {/* Clickable Area */}
                  <div
                    className="absolute inset-0 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleModelSelect(model.id, model.label)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleModelSelect(model.id, model.label);
                      }
                    }}
                    aria-label={`Modell ${model.label ?? model.id} auswählen`}
                    aria-current={isActive ? "true" : undefined}
                  />

                  {/* Icon */}
                  <div
                    className={cn(
                      "relative flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center transition-colors pointer-events-none",
                      isActive
                        ? cn(providerTheme.iconBg, providerTheme.iconText, "shadow-inner")
                        : cn(
                            providerTheme.iconBg,
                            providerTheme.iconText,
                            providerTheme.groupHoverIconBg,
                          ),
                    )}
                  >
                    {isFavorite ? (
                      <Star className="h-6 w-6 fill-current text-status-warning drop-shadow-sm" />
                    ) : (
                      <ProviderIcon className="h-6 w-6" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="relative flex-1 min-w-0 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-semibold text-sm truncate",
                          isActive
                            ? providerTheme.text
                            : "text-ink-primary group-hover:text-ink-primary",
                        )}
                      >
                        {model.label ?? model.id}
                      </span>
                      {isActive && (
                        <Check
                          className={cn("h-4 w-4 flex-shrink-0 drop-shadow-md", providerTheme.text)}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-ink-tertiary font-medium pointer-events-none">
                      <span className="truncate text-ink-secondary">{model.provider}</span>
                      <span className="text-ink-muted">·</span>
                      <span className="bg-surface-3/50 px-1.5 py-0.5 rounded text-[10px]">
                        {Math.round(getContextTokens(model) / 1000)}k
                      </span>
                      <span className="text-ink-muted">·</span>
                      <span>{getPriceLabel(model)}</span>
                    </div>
                  </div>

                  {/* Favorite Toggle */}
                  <div
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "flex-shrink-0 h-11 w-11 transition-colors flex items-center justify-center rounded-lg cursor-pointer",
                      isFavorite
                        ? "text-status-warning hover:text-status-warning/80"
                        : "text-ink-muted hover:text-ink-primary",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteToggle(model.id, isFavorite, model.label);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFavoriteToggle(model.id, isFavorite, model.label);
                      }
                    }}
                    aria-label={isFavorite ? "Favorit entfernen" : "Zu Favoriten hinzufügen"}
                  >
                    <Star className={cn("h-5 w-5", isFavorite && "fill-current")} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
