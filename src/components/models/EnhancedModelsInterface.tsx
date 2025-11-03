/**
 * Enhanced Models Interface - Material Design Alternative B
 *
 * Dense Information Layout with Performance-First optimizations
 * Features: Sticky Header, Quick Actions, FAB, Bottom Sheet Details
 */

import {
  ChevronDown,
  DollarSign,
  Filter,
  GitCompare,
  Search,
  Settings,
  Star,
  Zap,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { MODEL_POLICY } from "../../config/modelPolicy";
import { loadModelCatalog, type ModelEntry } from "../../config/models";
import { useFavoriteLists, useFavorites } from "../../contexts/FavoritesContext";
import type { EnhancedModel } from "../../types/enhanced-interfaces";
import { coercePrice, formatPricePerK } from "../../utils/pricing";
import { Button } from "../ui";
import { Card } from "../ui/card";
import { useToasts } from "../ui/toast/ToastsProvider";

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
function modelEntryToEnhanced(entry: ModelEntry): EnhancedModel {
  const inputPrice = coercePrice(entry.pricing?.in);
  const outputPrice = coercePrice(entry.pricing?.out);
  const isFree = inputPrice === 0 || outputPrice === 0 || entry.tags.includes("free");
  const { heuristics } = MODEL_POLICY;
  const maxTokens = entry.ctx ?? heuristics.defaultContextTokens;
  const effectiveTokens = Math.floor(maxTokens * heuristics.effectiveContextRatio);
  const performanceProfile = isFree ? heuristics.performance.free : heuristics.performance.paid;

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

    // Performance scores (estimated based on model characteristics)
    performance: {
      speed: performanceProfile.speed,
      reliability: performanceProfile.reliability,
      quality: performanceProfile.quality,
      efficiency: performanceProfile.efficiency,
    },

    // Enhanced categorization
    tags: entry.tags,
    category: categorizeModelFromTags(entry.tags, isFree),
    tier: isFree ? "free" : determineTierFromPrice(inputPrice),

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

// Helper function to categorize models based on tags
function categorizeModelFromTags(tags: string[], isFree: boolean): any {
  if (isFree && tags.includes("fast")) return "quick-free";
  if (isFree) return "strong-free";
  if (tags.includes("multimodal")) return "multimodal";
  if (tags.includes("creative")) return "creative-uncensored";
  if (tags.includes("budget")) return "budget-specialist";
  if (tags.includes("premium")) return "premium-models";
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
    primary: "bg-[var(--acc1)]",
    success: "bg-[var(--ok)]",
    warning: "bg-[var(--warn)]",
    error: "bg-[var(--err)]",
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-muted min-w-[60px]">{label}</span>
      <div className="flex-1 h-2 bg-surface-subtle rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium min-w-[30px] text-right">{Math.round(value)}</span>
    </div>
  );
}

// Enhanced Model Card for Dense Information Layout
function DenseModelCard({
  model,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onShowDetails,
}: {
  model: EnhancedModel;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onShowDetails: () => void;
}) {
  return (
    <Card
      clickable
      interactive="glow-accent"
      tone="neo-raised"
      elevation="medium"
      state={isSelected ? "selected" : "default"}
      className="p-4 transition-all duration-200"
      onCardClick={onSelect}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-text-strong truncate">{model.label}</h3>
            {model.pricing.isFree && (
              <Badge variant="success" size="sm">
                <Zap className="w-3 h-3 mr-1" />
                FREE
              </Badge>
            )}
          </div>
          <p className="text-sm text-text-muted truncate">{model.provider}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 h-auto"
            aria-label={isFavorite ? "Von Favoriten entfernen" : "Zu Favoriten hinzufügen"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Star
              className={`w-4 h-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-text-muted"}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 h-auto"
            aria-label="Modelldetails anzeigen"
            onClick={(e) => {
              e.stopPropagation();
              onShowDetails();
            }}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Performance Bars */}
      <div className="space-y-1.5 mb-3">
        <PerformanceBar label="Speed" value={model.performance.speed} color="primary" />
        <PerformanceBar label="Quality" value={model.performance.quality} color="success" />
        <PerformanceBar label="Value" value={model.performance.efficiency} color="warning" />
      </div>

      {/* Badges Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Price Info */}
        {!model.pricing.isFree && (
          <Badge variant="secondary" size="sm">
            <DollarSign className="w-3 h-3 mr-1" />
            {formatPricePerK(model.pricing.inputPrice)}
          </Badge>
        )}

        {/* Context */}
        <Badge variant="secondary" size="sm">
          {formatContext(model.context.maxTokens)}
        </Badge>

        {/* Primary Tag */}
        {model.tags[0] && (
          <Badge variant="accent" size="sm">
            {model.tags[0]}
          </Badge>
        )}

        {/* Capabilities */}
        {model.capabilities.multimodal && (
          <Badge variant="secondary" size="sm">
            🖼️
          </Badge>
        )}
        {model.capabilities.codeGeneration && (
          <Badge variant="secondary" size="sm">
            💻
          </Badge>
        )}
      </div>
    </Card>
  );
}

// Main Enhanced Models Interface Component
export function EnhancedModelsInterface({ className }: EnhancedModelsInterfaceProps) {
  const { push } = useToasts();
  const { toggleModelFavorite, isModelFavorite, trackModelUsage } = useFavorites();
  const { getFavoriteModels, favoriteCount } = useFavoriteLists();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [detailsModel, setDetailsModel] = useState<EnhancedModel | null>(null);
  const [filters, dispatchFilters] = React.useReducer(filterReducer, initialFilters);

  // Load models dynamically from OpenRouter
  const [enhancedModels, setEnhancedModels] = useState<EnhancedModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoadingModels(true);
        const modelEntries = await loadModelCatalog();
        const converted = modelEntries.map(modelEntryToEnhanced);
        setEnhancedModels(converted);
      } catch (error) {
        console.error("Failed to load models:", error);
        push({
          kind: "error",
          title: "Fehler beim Laden",
          message: "Modelle konnten nicht geladen werden",
        });
        // Fallback to empty array
        setEnhancedModels([]);
      } finally {
        setIsLoadingModels(false);
      }
    };

    void loadModels();
  }, [push]);

  // Filtered and sorted models
  const filteredModels = useMemo(() => {
    let filtered = enhancedModels;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (model) =>
          model.label.toLowerCase().includes(query) ||
          model.provider.toLowerCase().includes(query) ||
          model.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Favorites filter
    if (filters.showFavoritesOnly) {
      filtered = filtered.filter((model) => isModelFavorite(model.id));
    }

    // Free only filter
    if (filters.showFreeOnly) {
      filtered = filtered.filter((model) => model.pricing.isFree);
    }

    // Premium only filter
    if (filters.showPremiumOnly) {
      filtered = filtered.filter((model) => !model.pricing.isFree);
    }

    // Performance score filter
    if (filters.minPerformanceScore > 0) {
      filtered = filtered.filter(
        (model) => model.performance.quality >= filters.minPerformanceScore,
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
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
    });

    return sorted;
  }, [enhancedModels, searchQuery, filters, isModelFavorite]);

  // Get favorites for header section
  const favoriteModels = getFavoriteModels(enhancedModels);

  // Handlers
  const handleSelectModel = useCallback(
    (model: EnhancedModel) => {
      setSelectedModels((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(model.id)) {
          newSet.delete(model.id);
        } else {
          newSet.add(model.id);
        }
        return newSet;
      });

      // Track usage
      trackModelUsage(model.id);

      push({
        kind: "success",
        title: `${model.label} ${selectedModels.has(model.id) ? "entfernt" : "ausgewählt"}`,
      });
    },
    [selectedModels, trackModelUsage, push],
  );

  const handleToggleFavorite = useCallback(
    (model: EnhancedModel) => {
      toggleModelFavorite(model.id);
      const isFav = isModelFavorite(model.id);

      push({
        kind: "success",
        title: `${model.label} ${isFav ? "von Favoriten entfernt" : "zu Favoriten hinzugefügt"}`,
      });
    },
    [toggleModelFavorite, isModelFavorite, push],
  );

  const handleCompareModels = useCallback(() => {
    if (selectedModels.size < 2) {
      push({
        kind: "warning",
        title: "Mindestens 2 Modelle zum Vergleichen auswählen",
      });
      return;
    }

    // TODO: Implement comparison modal
    push({
      kind: "info",
      title: `${selectedModels.size} Modelle werden verglichen`,
    });
  }, [selectedModels.size, push]);

  // Show loading state while models are being loaded
  if (isLoadingModels) {
    return (
      <div className={`flex flex-col h-full bg-surface-base ${className || ""}`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-text-muted">Lade Modelle...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-surface-base ${className || ""}`}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b border-[color-mix(in_srgb,var(--color-border-focus)_30%,transparent)] bg-gradient-to-r from-[var(--acc2)]/12 via-[var(--surface-neumorphic-floating)] to-transparent backdrop-blur-lg shadow-[var(--shadow-neumorphic-sm)]">
        {/* Search & Quick Actions Row */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Modelle durchsuchen..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-base)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] shadow-[var(--shadow-inset-subtle)] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-neumorphic)] focus-visible:border-[var(--color-border-focus)] focus-visible:bg-[var(--surface-neumorphic-floating)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Action Buttons */}
            <Button
              variant={filters.showFavoritesOnly ? "accent" : "ghost"}
              size="sm"
              className="p-2.5"
              onClick={() => dispatchFilters({ type: "toggleFavorites" })}
            >
              <Star className="w-4 h-4" />
              <span className="sr-only">Favoriten</span>
            </Button>

            <Button
              variant={showFilters ? "accent" : "ghost"}
              size="sm"
              className="p-2.5"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              <span className="sr-only">Filter</span>
            </Button>

            <Button variant="brand-soft" size="sm" className="p-2.5">
              <Settings className="w-4 h-4" />
              <span className="sr-only">Einstellungen</span>
            </Button>
          </div>
        </div>

        {/* Favorites Section */}
        {favoriteModels.length > 0 && !filters.showFavoritesOnly && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-[var(--color-border-focus)]" />
              <span className="text-sm font-medium text-text-strong">
                Favoriten ({favoriteCount.models})
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {favoriteModels.slice(0, 6).map((model) => (
                <Button
                  key={model.id}
                  variant={selectedModels.has(model.id) ? "accent" : "ghost"}
                  size="sm"
                  className="flex-shrink-0 px-3 py-1.5 text-sm"
                  onClick={() => handleSelectModel(model)}
                >
                  <span className="font-medium">{model.label}</span>
                  {model.pricing.isFree && (
                    <span className="ml-1 text-xs text-emerald-600">FREE</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Controls */}
        {showFilters && (
          <div className="px-4 pb-3 border-t border-border-hairline">
            <div className="flex items-center gap-4 pt-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showFreeOnly}
                  onChange={(e) =>
                    dispatchFilters({ type: "setShowFreeOnly", value: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm">Nur kostenlose</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showPremiumOnly}
                  onChange={(e) =>
                    dispatchFilters({ type: "setShowPremiumOnly", value: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm">Nur Premium</span>
              </label>

              <select
                value={filters.sortBy}
                onChange={(e) =>
                  dispatchFilters({ type: "setSortBy", value: e.target.value as SortOption })
                }
                className="px-3 py-1.5 bg-surface-card border border-border-subtle rounded text-sm"
              >
                <option value="name">Name</option>
                <option value="performance">Performance</option>
                <option value="price">Preis</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Models List */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-text-muted">
              {filteredModels.length} Modelle gefunden
              {searchQuery && ` für "${searchQuery}"`}
            </div>
            {selectedModels.size > 0 && (
              <div className="text-sm text-text-muted">{selectedModels.size} ausgewählt</div>
            )}
          </div>

          {/* Models Grid */}
          <div className="space-y-3">
            {filteredModels.map((model) => (
              <DenseModelCard
                key={model.id}
                model={model}
                isSelected={selectedModels.has(model.id)}
                isFavorite={isModelFavorite(model.id)}
                onSelect={() => handleSelectModel(model)}
                onToggleFavorite={() => handleToggleFavorite(model)}
                onShowDetails={() => setDetailsModel(model)}
              />
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-subtle flex items-center justify-center">
                <Search className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-text-strong mb-2">Keine Modelle gefunden</h3>
              <p className="text-text-muted">
                {searchQuery
                  ? `Keine Ergebnisse für "${searchQuery}"`
                  : "Versuche es mit anderen Filtereinstellungen"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {selectedModels.size > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            variant="accent"
            className="rounded-full w-14 h-14 shadow-lg"
            onClick={handleCompareModels}
          >
            <GitCompare className="w-6 h-6" />
            <span className="sr-only">Vergleichen</span>
          </Button>
          {selectedModels.size > 1 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
              {selectedModels.size}
            </div>
          )}
        </div>
      )}

      {/* Bottom Sheet for Details (placeholder) */}
      {detailsModel && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-surface-base rounded-t-xl p-6 max-h-[70vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{detailsModel.label}</h2>
              <Button variant="ghost" size="sm" onClick={() => setDetailsModel(null)}>
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-text-muted">{detailsModel.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Performance</h4>
                  <div className="space-y-2">
                    <PerformanceBar label="Speed" value={detailsModel.performance.speed} />
                    <PerformanceBar label="Quality" value={detailsModel.performance.quality} />
                    <PerformanceBar
                      label="Reliability"
                      value={detailsModel.performance.reliability}
                    />
                    <PerformanceBar
                      label="Efficiency"
                      value={detailsModel.performance.efficiency}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>Provider: {detailsModel.provider}</div>
                    <div>Context: {formatContext(detailsModel.context.maxTokens)}</div>
                    <div>Tier: {detailsModel.tier}</div>
                    {!detailsModel.pricing.isFree && (
                      <div>Price: {formatPricePerK(detailsModel.pricing.inputPrice)}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
