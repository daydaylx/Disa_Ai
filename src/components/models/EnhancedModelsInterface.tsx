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
import React, { useCallback, useMemo, useState } from "react";

import { useFavoriteLists, useFavorites } from "../../contexts/FavoritesContext";
// Import existing models data for migration
import { MODELS } from "../../data/models";
import type { EnhancedModel, FilterState } from "../../types/enhanced-interfaces";
import { migrateModel } from "../../types/enhanced-interfaces";
import { Button } from "../ui";
import { Card } from "../ui/card";
import { useToasts } from "../ui/toast/ToastsProvider";

interface EnhancedModelsInterfaceProps {
  className?: string;
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
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
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

// Chip component for tags and badges
function Chip({
  children,
  variant = "default",
  size = "sm",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "free";
  size?: "xs" | "sm";
  onClick?: () => void;
}) {
  const baseClasses = "inline-flex items-center gap-1 rounded-full font-medium transition-colors";
  const sizeClasses = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
  };
  const variantClasses = {
    default: "bg-surface-subtle text-text-muted",
    primary: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    free: "bg-emerald-100 text-emerald-700 font-semibold",
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${onClick ? "cursor-pointer hover:opacity-80" : ""}`}
      onClick={onClick}
    >
      {children}
    </span>
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
      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      onClick={onSelect}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-text-strong truncate">{model.label}</h3>
            {model.pricing.isFree && (
              <Chip variant="free" size="xs">
                <Zap className="w-3 h-3" />
                FREE
              </Chip>
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

      {/* Chips Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Price Info */}
        {!model.pricing.isFree && (
          <Chip variant="default" size="xs">
            <DollarSign className="w-3 h-3" />${model.pricing.inputPrice.toFixed(3)}/1K
          </Chip>
        )}

        {/* Context */}
        <Chip variant="default" size="xs">
          {formatContext(model.context.maxTokens)}
        </Chip>

        {/* Primary Tag */}
        {model.tags[0] && (
          <Chip variant="primary" size="xs">
            {model.tags[0]}
          </Chip>
        )}

        {/* Capabilities */}
        {model.capabilities.multimodal && (
          <Chip variant="default" size="xs">
            🖼️
          </Chip>
        )}
        {model.capabilities.codeGeneration && (
          <Chip variant="default" size="xs">
            💻
          </Chip>
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
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    searchHistory: [],
    selectedCategories: [],
    excludedCategories: [],
    showFavoritesOnly: false,
    showRecentlyUsed: false,
    showBuiltInOnly: false,
    models: {
      showFreeOnly: false,
      showPremiumOnly: false,
      minPerformanceScore: 0,
      requiredCapabilities: [],
      maxPriceRange: [0, 1],
    },
    sortBy: "name",
    sortDirection: "asc",
  });

  // Convert legacy models to enhanced models
  const enhancedModels = useMemo(() => {
    return MODELS.map(migrateModel);
  }, []);

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
    if (filters.models.showFreeOnly) {
      filtered = filtered.filter((model) => model.pricing.isFree);
    }

    // Premium only filter
    if (filters.models.showPremiumOnly) {
      filtered = filtered.filter((model) => !model.pricing.isFree);
    }

    // Performance score filter
    if (filters.models.minPerformanceScore > 0) {
      filtered = filtered.filter(
        (model) => model.performance.quality >= filters.models.minPerformanceScore,
      );
    }

    // Sort
    filtered.sort((a, b) => {
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

    return filtered;
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

  return (
    <div className={`flex flex-col h-full bg-surface-base ${className || ""}`}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-surface-base/95 backdrop-blur-md border-b border-border-hairline">
        {/* Search & Quick Actions Row */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Modelle durchsuchen..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-card border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Action Buttons */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2.5"
              onClick={() =>
                setFilters((prev) => ({ ...prev, showFavoritesOnly: !prev.showFavoritesOnly }))
              }
            >
              <Star
                className={`w-4 h-4 ${filters.showFavoritesOnly ? "fill-yellow-400 text-yellow-400" : ""}`}
              />
              <span className="sr-only">Favoriten</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="p-2.5"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              <span className="sr-only">Filter</span>
            </Button>

            <Button variant="ghost" size="sm" className="p-2.5">
              <Settings className="w-4 h-4" />
              <span className="sr-only">Einstellungen</span>
            </Button>
          </div>
        </div>

        {/* Favorites Section */}
        {favoriteModels.length > 0 && !filters.showFavoritesOnly && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-text-strong">
                Favoriten ({favoriteCount.models})
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {favoriteModels.slice(0, 6).map((model) => (
                <button
                  key={model.id}
                  className="flex-shrink-0 px-3 py-1.5 bg-surface-card border border-border-subtle rounded-lg text-sm hover:bg-surface-raised transition-colors"
                  onClick={() => handleSelectModel(model)}
                >
                  <span className="font-medium">{model.label}</span>
                  {model.pricing.isFree && (
                    <span className="ml-1 text-xs text-emerald-600">FREE</span>
                  )}
                </button>
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
                  checked={filters.models.showFreeOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      models: { ...prev.models, showFreeOnly: e.target.checked },
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Nur kostenlose</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.models.showPremiumOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      models: { ...prev.models, showPremiumOnly: e.target.checked },
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Nur Premium</span>
              </label>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
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
          <Button className="rounded-full w-14 h-14 shadow-lg" onClick={handleCompareModels}>
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
                      <div>Price: ${detailsModel.pricing.inputPrice.toFixed(4)}/1K tokens</div>
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
