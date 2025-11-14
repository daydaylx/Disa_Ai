/**
 * Enhanced Models Interface - Material Design Alternative B
 *
 * Dense Information Layout with Performance-First optimizations
 * Features: Sticky Header, Quick Actions, FAB, Bottom Sheet Details
 */

import { ChevronDown, DollarSign, GitCompare, Search, Star, Zap } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { MODEL_POLICY } from "../../config/modelPolicy";
import { loadModelCatalog, type ModelEntry } from "../../config/models";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useFilteredList } from "../../hooks/useFilteredList";
import type { EnhancedModel, ModelCategory } from "../../types/enhanced-interfaces";
import { coercePrice, formatPricePerK } from "../../utils/pricing";
import { Badge, Button, Input } from "../ui";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/Dialog";
import { FilterChip } from "../ui/FilterChip";
import { Skeleton } from "../ui/skeleton";
import { useToasts } from "../ui/toast/ToastsProvider";
import { ModelComparisonTable } from "./ModelComparisonTable";

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
    primary: "bg-accent",
    success: "bg-status-success",
    warning: "bg-status-warning",
    error: "bg-status-danger",
  };

  // Using the design system for the bar - could use a progress bar component if available
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-fg-muted min-w-[60px]">{label}</span>
      <div className="flex-1 h-2 bg-surface-base rounded-full overflow-hidden border border-line shadow-1">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300 shadow-[inset_0_0_4px_rgba(0,0,0,0.2)]`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium min-w-[30px] text-right text-fg">
        {Math.round(value)}
      </span>
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
      className="p-4 transition-all duration-200 min-h-[180px]"
      onCardClick={onSelect}
    >
      {/* Header Row */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-fg flex-1 min-w-0 pr-2">
            <span className="truncate inline-block max-w-full" title={model.label}>
              {model.label}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            {model.pricing.isFree && (
              <Badge variant="success" size="sm" className="whitespace-nowrap">
                <Zap className="w-3 h-3 mr-1" />
                FREE
              </Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-fg-muted" title={model.provider}>
          {model.provider}
        </p>
      </div>

      {/* Performance Bars */}
      <div className="space-y-1.5 mb-3">
        <PerformanceBar label="Speed" value={model.performance.speed} color="primary" />
        <PerformanceBar label="Quality" value={model.performance.quality} color="success" />
        <PerformanceBar label="Value" value={model.performance.efficiency} color="warning" />
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap gap-2">
        {/* Price Info */}
        {!model.pricing.isFree && (
          <Badge variant="secondary" size="sm">
            <DollarSign className="w-3 h-3 mr-1" />
            {formatPricePerK(model.pricing.inputPrice)}
          </Badge>
        )}

        {/* Context */}
        <Badge variant="secondary" size="sm">
          {formatContext(model.context.maxTokens)} context
        </Badge>

        {/* Primary Tag */}
        {model.tags[0] && (
          <Badge
            variant="accent"
            size="sm"
            className="max-w-[100px] truncate"
            title={model.tags[0]}
          >
            {model.tags[0]}
          </Badge>
        )}

        {/* Capabilities */}
        {model.capabilities.multimodal && (
          <Badge variant="secondary" size="sm" title="Multimodal">
            🖼️
          </Badge>
        )}
        {model.capabilities.codeGeneration && (
          <Badge variant="secondary" size="sm" title="Code Generation">
            💻
          </Badge>
        )}
      </div>

      {/* Action buttons row at bottom */}
      <div className="flex justify-end gap-1 mt-3">
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
            className={`w-4 h-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-fg-muted"}`}
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
    </Card>
  );
}

// Main Enhanced Models Interface Component
export function EnhancedModelsInterface({ className }: EnhancedModelsInterfaceProps) {
  const { push } = useToasts();
  const { toggleModelFavorite, isModelFavorite, trackModelUsage } = useFavorites();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [detailsModel, setDetailsModel] = useState<EnhancedModel | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareModels, setCompareModels] = useState<EnhancedModel[]>([]);
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

    // Get the selected models for comparison
    const modelsToCompare = enhancedModels.filter((model) => selectedModels.has(model.id));
    setCompareModels(modelsToCompare);
    setIsCompareOpen(true);
  }, [selectedModels, enhancedModels, push]);

  // Show loading state while models are being loaded
  if (isLoadingModels) {
    return (
      <div className={`flex flex-col h-full bg-bg-1 ${className || ""}`}>
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[180px] w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-bg-1 ${className || ""}`}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b border-line bg-surface-glass/80 backdrop-blur-md">
        <div className="p-4 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <Input
              placeholder="Modelle durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-transparent bg-surface-muted/70 pl-11 pr-4 py-2.5 text-base focus:bg-surface-base focus:border-accent"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2">
            <FilterChip
              selected={filters.showFavoritesOnly}
              onClick={() => dispatchFilters({ type: "toggleFavorites" })}
              leading={<Star className="w-4 h-4" />}
            >
              Favoriten
            </FilterChip>
            <FilterChip
              selected={filters.showFreeOnly}
              onClick={() =>
                dispatchFilters({ type: "setShowFreeOnly", value: !filters.showFreeOnly })
              }
              leading={<Zap className="w-4 h-4" />}
            >
              Kostenlos
            </FilterChip>
            <FilterChip
              selected={filters.showPremiumOnly}
              onClick={() =>
                dispatchFilters({
                  type: "setShowPremiumOnly",
                  value: !filters.showPremiumOnly,
                })
              }
              leading={<DollarSign className="w-4 h-4" />}
            >
              Premium
            </FilterChip>
          </div>
        </div>
      </div>

      {/* Models List */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-fg-muted">
              {filteredModels.length} Modelle gefunden
              {searchQuery && ` für "${searchQuery}"`}
            </div>
            {selectedModels.size > 0 && (
              <div className="text-sm text-fg-muted">{selectedModels.size} ausgewählt</div>
            )}
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
                <Search className="w-8 h-8 text-fg-muted" />
              </div>
              <h3 className="text-lg font-medium text-fg mb-2">Keine Modelle gefunden</h3>
              <p className="text-fg-muted">
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
        <div className="fixed bottom-6 right-6 z-popover">
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

      {/* Comparison Dialog */}
      <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modellvergleich</DialogTitle>
            <DialogDescription>
              Vergleich von {compareModels.length} ausgewählten Modellen
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {compareModels.length > 0 && <ModelComparisonTable models={compareModels} />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!detailsModel} onOpenChange={(isOpen) => !isOpen && setDetailsModel(null)}>
        {detailsModel && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{detailsModel.label}</DialogTitle>
              <DialogDescription>{detailsModel.description}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <h4 className="font-medium mb-2 text-sm text-fg-muted">Performance</h4>
                <div className="space-y-2">
                  <PerformanceBar label="Speed" value={detailsModel.performance.speed} />
                  <PerformanceBar label="Quality" value={detailsModel.performance.quality} />
                  <PerformanceBar
                    label="Reliability"
                    value={detailsModel.performance.reliability}
                  />
                  <PerformanceBar label="Efficiency" value={detailsModel.performance.efficiency} />
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-sm text-fg-muted">Details</h4>
                <div className="space-y-1 text-sm text-fg">
                  <div>Provider: {detailsModel.provider}</div>
                  <div>Context: {formatContext(detailsModel.context.maxTokens)}</div>
                  <div>Tier: {detailsModel.tier}</div>
                  {!detailsModel.pricing.isFree && (
                    <div>Price: {formatPricePerK(detailsModel.pricing.inputPrice)}</div>
                  )}
                </div>
              </div>
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
