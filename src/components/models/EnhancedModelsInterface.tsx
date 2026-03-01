/**
 * Enhanced Models Interface - Material Design Alternative B
 *
 * Dense Information Layout with Performance-First optimizations
 * Features: Sticky Header, Quick Actions, FAB, Bottom Sheet Details
 */

import React, { useCallback, useEffect, useState } from "react";

import { ChevronDown, Search, Star, Zap } from "@/lib/icons";
import { coercePrice, formatPricePerK } from "@/lib/pricing";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FilterChip,
  Input,
  Skeleton,
  useToasts,
} from "@/ui";

import { MODEL_POLICY } from "../../config/modelPolicy";
import { loadModelCatalog, type ModelEntry } from "../../config/models";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useFilteredList } from "../../hooks/useFilteredList";
import { useSettings } from "../../hooks/useSettings";
import { getCategoryStyle } from "../../lib/categoryColors";
import { cn } from "../../lib/utils";
import type { EnhancedModel, ModelCategory } from "../../types/enhanced-interfaces";

type SortOption = "name" | "performance" | "price";

type ModelFilters = {
  showFavoritesOnly: boolean;
  showFreeOnly: boolean;
  showPremiumOnly: boolean;
  minPerformanceScore: number;
  sortBy: SortOption;
  sortDirection: "asc" | "desc";
};

type FilterAction =
  | { type: "toggleFavorites" }
  | { type: "setShowFreeOnly"; value: boolean }
  | { type: "setShowPremiumOnly"; value: boolean }
  | { type: "setMinPerformanceScore"; value: number }
  | { type: "setSortBy"; value: SortOption }
  | { type: "setSortDirection"; value: "asc" | "desc" };

const initialFilters: ModelFilters = {
  showFavoritesOnly: false,
  showFreeOnly: false,
  showPremiumOnly: false,
  minPerformanceScore: 0,
  sortBy: "name",
  sortDirection: "asc",
};

function filterReducer(state: ModelFilters, action: FilterAction): ModelFilters {
  switch (action.type) {
    case "toggleFavorites":
      return { ...state, showFavoritesOnly: !state.showFavoritesOnly };
    case "setShowFreeOnly":
      return {
        ...state,
        showFreeOnly: action.value,
        showPremiumOnly: action.value ? false : state.showPremiumOnly,
      };
    case "setShowPremiumOnly":
      return {
        ...state,
        showPremiumOnly: action.value,
        showFreeOnly: action.value ? false : state.showFreeOnly,
      };
    case "setMinPerformanceScore":
      return { ...state, minPerformanceScore: action.value };
    case "setSortBy":
      return { ...state, sortBy: action.value };
    case "setSortDirection":
      return { ...state, sortDirection: action.value };
    default:
      return state;
  }
}

interface EnhancedModelsInterfaceProps {
  className?: string;
}

// Helper function to convert ModelEntry to EnhancedModel
export function modelEntryToEnhanced(entry: ModelEntry): EnhancedModel {
  const inputPrice = coercePrice(entry.pricing?.in);
  const outputPrice = coercePrice(entry.pricing?.out);
  const isFree = inputPrice === 0 || outputPrice === 0 || entry.tags.includes("free");
  const { heuristics } = MODEL_POLICY;
  const maxTokens = entry.ctx ?? entry.contextTokens ?? heuristics.defaultContextTokens;
  const contextK = entry.contextK ?? (maxTokens ? Math.round(maxTokens / 1024) : undefined);
  const effectiveTokens = Math.floor(maxTokens * heuristics.effectiveContextRatio);
  const performanceProfile = isFree ? heuristics.performance.free : heuristics.performance.paid;

  // New Score Logic
  const qualityScore = entry.qualityScore ?? 70;
  // Context score: normalized to 262K (max free context)
  const contextScore = Math.min((maxTokens / 262144) * 100, 100);
  // Openness: explicitly calculated or default
  const openness =
    entry.openness ?? (typeof entry.censorScore === "number" ? 1 - entry.censorScore / 100 : 0.5);

  return {
    // Core properties from ModelEntry
    id: entry.id,
    label: entry.label || entry.id,
    provider: entry.provider || entry.id.split("/")[0] || "unknown",
    description: entry.description || `${entry.label || entry.id} AI model`,

    // Pricing
    pricing: {
      inputPrice,
      outputPrice,
      currency: "USD",
      isFree,
    },

    // Context
    context: {
      maxTokens,
      effectiveTokens,
    },
    contextK,
    contextTokens: maxTokens,

    // Performance scores (estimated based on model characteristics)
    performance: {
      speed: performanceProfile.speed,
      reliability: performanceProfile.reliability,
      quality: qualityScore,
      efficiency: performanceProfile.efficiency,
    },
    qualityScore,
    contextScore,
    openness,
    censorScore: entry.censorScore,

    // Enhanced categorization
    tags: entry.tags,
    category: categorizeModelFromTags(entry.tags, isFree),
    tier: isFree ? "free" : determineTierFromPrice(inputPrice),
    notes: entry.notes,

    // Favorites & Usage (default values)
    isFavorite: false,
    lastUsed: null,
    usage: {
      count: 0,
      totalTokensUsed: 0,
      averageSessionTokens: 0,
      lastAccess: null,
    },

    // Capabilities (inferred from tags and id)
    capabilities: {
      multimodal: entry.tags.includes("multimodal") || entry.id.includes("vision"),
      codeGeneration: entry.tags.includes("coding") || entry.id.includes("code"),
      reasoning: entry.tags.includes("reasoning") || entry.tags.includes("advanced"),
      creative: entry.tags.includes("creative") || entry.id.includes("creative"),
      analysis: entry.tags.includes("analysis") || entry.tags.includes("reasoning"),
      translation: true, // Assume most models can translate
    },

    // Mobile optimization
    mobile: {
      recommendedForMobile: true,
      offlineCapable: false,
    },
  };
}

// Model category mapping configuration
const MODEL_CATEGORY_CONFIG: {
  free: Array<{ condition: (tags: string[], isFree: boolean) => boolean; category: ModelCategory }>;
  paid: Array<{ condition: (tags: string[], isFree: boolean) => boolean; category: ModelCategory }>;
} = {
  free: [
    {
      condition: (tags, isFree) => isFree && tags.includes("fast"),
      category: "quick-free",
    },
    {
      condition: (_tags, isFree) => isFree,
      category: "strong-free",
    },
  ],
  paid: [
    {
      condition: (tags) => tags.includes("multimodal"),
      category: "multimodal",
    },
    {
      condition: (tags) => tags.includes("creative"),
      category: "creative-uncensored",
    },
    {
      condition: (tags) => tags.includes("budget"),
      category: "budget-specialist",
    },
    {
      condition: (tags) => tags.includes("premium"),
      category: "premium-models",
    },
  ],
};

// Helper function to categorize models based on tags
export function categorizeModelFromTags(tags: string[], isFree: boolean): ModelCategory {
  // Check free model categories first
  if (isFree) {
    for (const rule of MODEL_CATEGORY_CONFIG.free) {
      if (rule.condition(tags, isFree)) {
        return rule.category;
      }
    }
  }
  // Check paid model categories
  else {
    for (const rule of MODEL_CATEGORY_CONFIG.paid) {
      if (rule.condition(tags, isFree)) {
        return rule.category;
      }
    }
  }

  // Default category
  return "chat-allrounder";
}

// Helper function to determine tier from price
function determineTierFromPrice(price: number): "free" | "budget" | "premium" | "enterprise" {
  if (price === 0) return "free";
  const { priceTiers } = MODEL_POLICY.heuristics;
  if (price <= priceTiers.budget) return "budget";
  if (price <= priceTiers.premium) return "premium";
  return "enterprise";
}

// Performance scores visualization component
function PerformanceBar({
  label,
  value,
  maxValue = 100,
  color = "primary",
}: {
  label: string;
  value: number;
  maxValue?: number;
  color?: "primary" | "success" | "warning" | "error";
}) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  const colorClasses = {
    primary: "bg-accent-models",
    success: "bg-accent-research",
    warning: "bg-accent-kultur",
    error: "bg-status-error",
  };

  // Material Design Performance Bar - Inset container with raised fill
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-text-meta min-w-[70px]">{label}</span>
      <div className="flex-1 h-2.5 bg-surface-inset rounded-full overflow-hidden shadow-inset">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300 shadow-raise`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium min-w-[35px] text-right text-text-primary">
        {Math.round(value)}
      </span>
    </div>
  );
}

// Main Enhanced Models Interface Component
export function EnhancedModelsInterface({ className }: EnhancedModelsInterfaceProps) {
  const { push } = useToasts();
  const { toggleModelFavorite, isModelFavorite, trackModelUsage } = useFavorites();
  const { settings, setPreferredModel } = useSettings();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsModel, setDetailsModel] = useState<EnhancedModel | null>(null);
  const [filters, dispatchFilters] = React.useReducer(filterReducer, initialFilters);

  // Load models dynamically from OpenRouter
  const [enhancedModels, setEnhancedModels] = useState<EnhancedModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [modelLoadError, setModelLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoadingModels(true);
        setModelLoadError(null);
        const modelEntries = await loadModelCatalog({ toasts: { push } });
        const converted = modelEntries.map(modelEntryToEnhanced);
        setEnhancedModels(converted);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Modelle konnten nicht geladen werden";
        console.error("Failed to load models:", error);
        setModelLoadError(errorMessage);
        push({
          kind: "error",
          title: "Fehler beim Laden der Modelle",
          message: errorMessage,
        });
        // Fallback to empty array
        setEnhancedModels([]);
      } finally {
        setIsLoadingModels(false);
      }
    };

    void loadModels();
  }, [push]);

  const modelFilterFn = useCallback(
    (model: EnhancedModel, filters: ModelFilters, searchQuery: string) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        if (
          !model.label.toLowerCase().includes(query) &&
          !model.provider.toLowerCase().includes(query) &&
          !model.tags.some((tag) => tag.toLowerCase().includes(query))
        ) {
          return false;
        }
      }

      if (filters.showFavoritesOnly && !isModelFavorite(model.id)) {
        return false;
      }

      if (filters.showFreeOnly && !model.pricing.isFree) {
        return false;
      }

      if (filters.showPremiumOnly && model.pricing.isFree) {
        return false;
      }

      if (
        filters.minPerformanceScore > 0 &&
        model.performance.quality < filters.minPerformanceScore
      ) {
        return false;
      }

      return true;
    },
    [isModelFavorite],
  );

  const modelSortFn = useCallback((a: EnhancedModel, b: EnhancedModel, filters: ModelFilters) => {
    const direction = filters.sortDirection === "asc" ? 1 : -1;

    switch (filters.sortBy) {
      case "name":
        return direction * a.label.localeCompare(b.label);
      case "performance":
        return direction * (b.performance.quality - a.performance.quality);
      case "price":
        return direction * (a.pricing.inputPrice - b.pricing.inputPrice);
      default:
        return 0;
    }
  }, []);

  const filteredModels = useFilteredList<EnhancedModel>(
    enhancedModels,
    filters,
    searchQuery,
    modelFilterFn,
    modelSortFn,
  );

  const [animatingFavorite, setAnimatingFavorite] = useState<string | null>(null);

  const handleToggleFavorite = useCallback(
    (model: EnhancedModel) => {
      toggleModelFavorite(model.id);
      const isFav = isModelFavorite(model.id);

      // Trigger animation
      setAnimatingFavorite(model.id);
      setTimeout(() => setAnimatingFavorite(null), 300);

      push({
        kind: "success",
        title: `${model.label} ${isFav ? "von Favoriten entfernt" : "zu Favoriten hinzugefügt"}`,
      });
    },
    [toggleModelFavorite, isModelFavorite, push],
  );

  const handleActivateModel = useCallback(
    (model: EnhancedModel) => {
      setPreferredModel(model.id);
      trackModelUsage(model.id);
      push({
        kind: "success",
        title: `${model.label} aktiviert`,
        message: "Dieses Modell wird jetzt als Standard verwendet.",
      });
    },
    [setPreferredModel, trackModelUsage, push],
  );

  // Show loading state while models are being loaded
  if (isLoadingModels) {
    return (
      <div className={`flex flex-col h-full bg-bg-base ${className || ""}`}>
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full rounded-md" /> {/* Search bar skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-sm" /> {/* Filter chip skeleton */}
            <Skeleton className="h-9 w-24 rounded-sm" />
            <Skeleton className="h-9 w-24 rounded-sm" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[180px] w-full rounded-md" /> // Model card skeleton
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-bg-base ${className || ""}`}>
      {/* Sticky Filter Header */}
      <div className="sticky top-0 z-header bg-surface-1 border-b border-white/[0.06]">
        <div className="p-4 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="w-4 h-4 text-ink-tertiary" />
            </div>
            <Input
              placeholder="Modelle durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-2 border-white/[0.08] rounded-xl text-sm"
            />
          </div>

          {/* Filter Chips Row */}
          <div className="flex gap-2">
            <FilterChip
              selected={filters.showFavoritesOnly}
              onClick={() => dispatchFilters({ type: "toggleFavorites" })}
              leading={<Star className="w-3.5 h-3.5" />}
            >
              Favoriten
            </FilterChip>
            <FilterChip
              selected={filters.showFreeOnly}
              onClick={() =>
                dispatchFilters({ type: "setShowFreeOnly", value: !filters.showFreeOnly })
              }
              leading={<Zap className="w-3.5 h-3.5" />}
            >
              Kostenlos
            </FilterChip>
          </div>
        </div>
      </div>

      {/* Results meta row */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs text-ink-tertiary">
          {filteredModels.length} Modell{filteredModels.length !== 1 ? "e" : ""}
          {searchQuery && (
            <span>
              {" "}
              für <span className="text-ink-secondary">"{searchQuery}"</span>
            </span>
          )}
        </p>
      </div>

      {/* Compact model list */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 pb-8 space-y-2">
          {filteredModels.map((model) => {
            const isActive = settings.preferredModelId === model.id;
            const isFav = isModelFavorite(model.id);
            const theme = getCategoryStyle(model.category);
            const providerInitial = model.provider.charAt(0).toUpperCase();

            return (
              <div
                key={model.id}
                className={cn(
                  "relative flex items-center gap-3 rounded-2xl border p-3 transition-all duration-200",
                  isActive
                    ? cn("bg-surface-2/70 border-white/[0.14]", theme.border)
                    : "bg-surface-card border-white/[0.08] hover:border-white/[0.14] hover:bg-surface-2/65",
                )}
              >
                {/* Left accent stripe */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-2xl",
                    theme.textBg,
                  )}
                  aria-hidden
                />

                {/* Provider avatar – tapping activates the model */}
                <button
                  type="button"
                  onClick={() => handleActivateModel(model)}
                  aria-label={`${model.label} aktivieren`}
                  className={cn(
                    "relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold transition-colors",
                    theme.iconBg,
                    theme.iconText,
                  )}
                >
                  {providerInitial}
                </button>

                {/* Name / provider */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-ink-primary truncate">
                      {model.label}
                    </span>
                    {isActive && (
                      <Badge
                        className={cn(
                          "h-5 px-2 text-[10px] flex-shrink-0",
                          theme.badge,
                          theme.badgeText,
                        )}
                      >
                        Aktiv
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-ink-secondary truncate mt-0.5">{model.provider}</p>
                </div>

                {/* Meta badges */}
                <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                  {model.pricing.isFree && (
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                      <Zap className="w-2.5 h-2.5 mr-0.5" />
                      FREE
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                    {formatContext(model.context.maxTokens)}
                  </Badge>
                </div>

                {/* Trailing actions */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(model)}
                    aria-label={isFav ? "Von Favoriten entfernen" : "Zu Favoriten hinzufügen"}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                      isFav ? "text-status-warning" : "text-ink-tertiary hover:text-ink-primary",
                    )}
                  >
                    <Star
                      className={cn(
                        "w-4 h-4",
                        isFav && "fill-current",
                        animatingFavorite === model.id && "animate-favorite-pop",
                      )}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailsModel(model)}
                    aria-label="Modelldetails anzeigen"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-tertiary transition-colors hover:text-ink-primary"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {filteredModels.length === 0 && !modelLoadError && (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-surface-2 border border-white/[0.08] flex items-center justify-center">
                <Search className="w-6 h-6 text-ink-tertiary" />
              </div>
              <h3 className="text-base font-semibold text-ink-primary mb-2">
                Keine Modelle gefunden
              </h3>
              <p className="text-sm text-ink-secondary">
                {searchQuery
                  ? `Keine Ergebnisse für "${searchQuery}"`
                  : "Versuche es mit anderen Filtereinstellungen"}
              </p>
            </div>
          )}

          {/* Error State */}
          {modelLoadError && (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-surface-2 border border-white/[0.08] flex items-center justify-center">
                <Search className="w-6 h-6 text-status-error" />
              </div>
              <h3 className="text-base font-semibold text-ink-primary mb-2">
                Modelle konnten nicht geladen werden
              </h3>
              <p className="text-sm text-ink-secondary mb-4 max-w-xs mx-auto">{modelLoadError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={!!detailsModel} onOpenChange={(isOpen) => !isOpen && setDetailsModel(null)}>
        {detailsModel && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{detailsModel.label}</DialogTitle>
              <DialogDescription>{detailsModel.description}</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <PerformanceBar
                  label="Qualität"
                  value={detailsModel.qualityScore ?? 70}
                  color="primary"
                />
                <PerformanceBar
                  label="Kontext"
                  value={detailsModel.contextScore ?? 0}
                  color="success"
                />
                <PerformanceBar
                  label="Offenheit"
                  value={(detailsModel.openness ?? 0) * 100}
                  color="warning"
                />
              </div>
              <div className="space-y-1 text-sm text-ink-secondary">
                <div>
                  Provider: <span className="text-ink-primary">{detailsModel.provider}</span>
                </div>
                <div>
                  Kontext:{" "}
                  <span className="text-ink-primary">
                    {formatContext(detailsModel.context.maxTokens)}
                  </span>
                </div>
                {!detailsModel.pricing.isFree && (
                  <div>
                    Preis:{" "}
                    <span className="text-ink-primary">
                      {formatPricePerK(detailsModel.pricing.inputPrice)}
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                disabled={settings.preferredModelId === detailsModel.id}
                onClick={() => {
                  handleActivateModel(detailsModel);
                  setDetailsModel(null);
                }}
              >
                {settings.preferredModelId === detailsModel.id ? "Aktives Modell" : "Aktivieren"}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

// Helper function to format context tokens
function formatContext(tokens: number): string {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  } else if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(0)}K`;
  }
  return tokens.toString();
}

export default EnhancedModelsInterface;
