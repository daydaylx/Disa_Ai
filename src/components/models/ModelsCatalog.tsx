import { useCallback, useMemo, useState } from "react";

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
  Button,
  Card,
  CardSkeleton,
  EmptyState,
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
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleModelExpansion = useCallback((modelId: string) => {
    setExpandedModels((prev) => {
      const next = new Set(prev);
      if (next.has(modelId)) next.delete(modelId);
      else next.add(modelId);
      return next;
    });
  }, []);

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
              const isExpanded = expandedModels.has(model.id);
              const providerTheme = getCategoryStyle(getProviderColorTheme(model.provider));
              const ProviderIcon = getProviderIcon(model.provider);

              return (
                <Card
                  key={model.id}
                  data-testid="model-card"
                  aria-label={model.label ?? model.id}
                  variant="roleStrong"
                  notch="none"
                  padding="none"
                  className={cn(
                    "relative transition-all duration-300 group overflow-hidden",
                    isActive
                      ? cn("ring-1", providerTheme.border, providerTheme.glow)
                      : cn("hover:brightness-110", providerTheme.hoverBorder),
                  )}
                  style={{ background: providerTheme.roleGradient }}
                >
                  <div className="absolute right-3 top-3 flex items-center gap-2 z-20">
                    {isActive && (
                      <Badge
                        className={cn(
                          "text-[10px] px-2 h-5 shadow-sm",
                          providerTheme.badge,
                          providerTheme.badgeText,
                        )}
                      >
                        Aktiv
                      </Badge>
                    )}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleModelFavorite(model.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleModelFavorite(model.id);
                        }
                      }}
                      aria-label={
                        isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
                      }
                      className={cn(
                        "relative flex h-11 w-11 items-center justify-center rounded-full border text-ink-tertiary transition-colors cursor-pointer pointer-events-auto",
                        isFavorite
                          ? "border-status-warning/40 bg-status-warning/10 text-status-warning"
                          : "border-white/5 bg-surface-2/80 hover:border-white/10 hover:text-ink-primary",
                      )}
                    >
                      <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
                    </div>
                  </div>

                  {/* Main Row - Clickable area */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer pointer-events-none"
                    aria-label={`Modell ${model.label ?? model.id} auswählen`}
                  >
                    {/* Invisible clickable overlay */}
                    <div
                      className="absolute inset-0 cursor-pointer pointer-events-auto z-0"
                      onClick={() => setPreferredModel(model.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setPreferredModel(model.id);
                        }
                      }}
                      aria-label={`Modell ${model.label ?? model.id} auswählen`}
                      aria-pressed={isActive}
                    />
                    {/* Icon */}
                    <div
                      className={cn(
                        "relative flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                        isActive
                          ? cn(providerTheme.iconBg, providerTheme.iconText, "shadow-inner")
                          : cn(
                              providerTheme.iconBg,
                              providerTheme.iconText,
                              providerTheme.groupHoverIconBg,
                            ),
                      )}
                    >
                      <ProviderIcon className="h-6 w-6" />
                    </div>

                    {/* Info */}
                    <div className="relative flex-1 min-w-0">
                      <span
                        className={cn(
                          "font-semibold text-sm truncate block",
                          isActive
                            ? providerTheme.text
                            : "text-ink-primary group-hover:text-ink-primary",
                        )}
                      >
                        {model.label ?? model.id}
                      </span>
                      <p className="text-xs text-ink-secondary truncate mt-1">
                        {model.provider || "Unknown"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 pr-10 relative z-20 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModelExpansion(model.id);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer bg-transparent border-none p-0"
                      >
                        Details
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div
                      id={`model-details-${model.id}`}
                      className="px-4 pb-4 pt-0 animate-fade-in"
                    >
                      <div
                        className={cn(
                          "space-y-3 rounded-xl border px-4 py-4",
                          providerTheme.bg,
                          providerTheme.border,
                        )}
                      >
                        {/* Context & Pricing Info */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <p className="text-xs text-ink-tertiary font-medium">Context Window</p>
                            <p className="text-sm text-ink-primary font-semibold">
                              {getContextTokens(model).toLocaleString()} Tokens
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-ink-tertiary font-medium">Pricing</p>
                            <p className="text-sm text-ink-primary font-semibold">
                              {getPriceLabel(model)}
                            </p>
                          </div>
                        </div>

                        {/* Tags */}
                        {model.tags && model.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 text-ink-tertiary">
                            {model.tags.map((tag) => (
                              <Badge
                                key={tag}
                                className={cn(
                                  "text-[10px] px-2 h-5",
                                  providerTheme.badge,
                                  providerTheme.badgeText,
                                )}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Model ID */}
                        <div className="p-3 rounded-xl bg-surface-1/50 text-xs text-ink-tertiary font-mono border border-white/5">
                          {model.id}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </PullToRefresh>
    </div>
  );
}
