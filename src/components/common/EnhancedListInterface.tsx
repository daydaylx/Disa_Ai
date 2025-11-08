/**
 * Generic Enhanced List Interface Component
 *
 * A reusable component that encapsulates the common logic for displaying
 * lists with search, filtering, favorites, and grid display.
 */

import { Filter, Search, Settings, Star } from "../../lib/icons";
import React, { useCallback, useMemo, useState } from "react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useToasts } from "../ui/toast/ToastsProvider";

// Type definitions
type SortDirection = "asc" | "desc";

// Legacy interface for backwards compatibility - removed unused declaration

interface BaseItem {
  id: string;
}

interface FilterState {
  searchQuery: string;
  showFavoritesOnly: boolean;
  sortBy: string;
  sortDirection: SortDirection;
  [key: string]: any; // Additional filter properties
}

interface EnhancedListProps<T extends BaseItem> {
  // Data
  items: T[];
  isLoading?: boolean;

  // Rendering
  renderItem: (item: T, props: ItemRenderProps<T>) => React.ReactNode;
  renderHeader?: (props: HeaderRenderProps<T>) => React.ReactNode;
  renderEmptyState?: (props: EmptyStateRenderProps) => React.ReactNode;

  // Configuration
  filterConfig: {
    searchableFields: (keyof T)[];
    sortableFields: string[];
    defaultSortBy: string;
    favoritesEnabled?: boolean;
    categoryFilterEnabled?: boolean;
    categories?: string[];
  };

  // Favorites
  favorites: {
    items: Set<string>;
    toggle: (id: string) => void;
    isFavorite: (id: string) => boolean;
  };

  // Selection
  selection?: {
    selectedItems: Set<string>;
    toggleSelection: (id: string) => void;
    isSelected: (id: string) => boolean;
  };

  // Callbacks
  onItemSelected?: (item: T) => void;
  onItemActivated?: (item: T) => void;

  // UI
  className?: string;
  gridCols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };

  // Mobile optimization
  isMobile?: boolean;
}

interface ItemRenderProps<T> {
  item: T;
  isFavorite: boolean;
  isSelected?: boolean;
  onToggleFavorite: () => void;
  onSelect?: () => void;
  onActivate?: () => void;
}

interface HeaderRenderProps<T> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: FilterState;
  setFilters: React.Dispatch<FilterAction>;
  favoriteItems: T[];
  selectedItemsCount: number;
}

interface EmptyStateRenderProps {
  searchQuery: string;
  hasFilters: boolean;
}

// Initial filter state
const createInitialFilters = (defaultSortBy: string): FilterState => ({
  searchQuery: "",
  showFavoritesOnly: false,
  sortBy: defaultSortBy,
  sortDirection: "asc",
});

// Generic filter reducer
type FilterAction =
  | { type: "setSearchQuery"; value: string }
  | { type: "toggleFavorites" }
  | { type: "setSortBy"; value: string }
  | { type: "setSortDirection"; value: SortDirection }
  | { type: "updateFilter"; key: string; value: any };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "setSearchQuery":
      return { ...state, searchQuery: action.value };
    case "toggleFavorites":
      return { ...state, showFavoritesOnly: !state.showFavoritesOnly };
    case "setSortBy":
      return { ...state, sortBy: action.value };
    case "setSortDirection":
      return { ...state, sortDirection: action.value };
    case "updateFilter":
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
}

// Main component
export function EnhancedListInterface<T extends BaseItem>({
  items,
  isLoading = false,
  renderItem,
  renderHeader,
  renderEmptyState,
  filterConfig,
  favorites,
  selection,
  onItemSelected,
  onItemActivated,
  className,
  gridCols = { xs: 1, sm: 1, md: 2, xl: 3 },
}: EnhancedListProps<T>) {
  const { push } = useToasts();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, dispatchFilters] = React.useReducer(
    filterReducer,
    createInitialFilters(filterConfig.defaultSortBy),
  );

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) =>
        filterConfig.searchableFields.some((field) => {
          const value = item[field];
          return typeof value === "string" && value.toLowerCase().includes(query);
        }),
      );
    }

    // Apply favorites filter
    if (filters.showFavoritesOnly) {
      result = result.filter((item) => favorites.isFavorite(item.id));
    }

    // Apply custom filters
    Object.keys(filters).forEach((key) => {
      if (key.startsWith("filter_")) {
        // Custom filter logic would go here based on the key
      }
    });

    // Apply sorting
    if (filters.sortBy && filterConfig.sortableFields.includes(filters.sortBy)) {
      result.sort((a, b) => {
        const direction = filters.sortDirection === "asc" ? 1 : -1;
        const aVal = (a as any)[filters.sortBy];
        const bVal = (b as any)[filters.sortBy];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return direction * aVal.localeCompare(bVal);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return direction * (aVal - bVal);
        }

        return 0;
      });
    }

    return result;
  }, [items, searchQuery, filters, favorites, filterConfig]);

  // Favorite items for header section
  const favoriteItems = useMemo(() => {
    if (!filterConfig.favoritesEnabled) return [];
    return items.filter((item) => favorites.isFavorite(item.id));
  }, [items, favorites, filterConfig.favoritesEnabled]);

  // Handlers
  const handleToggleFavorite = useCallback(
    (id: string) => {
      favorites.toggle(id);
      const item = items.find((i) => i.id === id);
      if (item) {
        const isFav = favorites.isFavorite(id);
        push({
          kind: "success",
          title: `${(item as any).name || (item as any).label || id} ${isFav ? "zu Favoriten hinzugefügt" : "von Favoriten entfernt"}`,
        });
      }
    },
    [favorites, items, push],
  );

  const handleSelectItem = useCallback(
    (id: string) => {
      if (selection) {
        selection.toggleSelection(id);
      }

      const item = items.find((i) => i.id === id);
      if (item) {
        onItemSelected?.(item);
      }
    },
    [selection, items, onItemSelected],
  );

  const handleActivateItem = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        onItemActivated?.(item);
      }
    },
    [items, onItemActivated],
  );

  // Render loading state
  if (isLoading) {
    return (
      <div className={cn("flex flex-col h-full bg-surface-base", className)}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-text-muted">Lade Daten...</p>
          </div>
        </div>
      </div>
    );
  }

  // Default empty state
  const defaultEmptyState = (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-subtle flex items-center justify-center">
        <Search className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-medium text-text-strong mb-2">Keine Elemente gefunden</h3>
      <p className="text-text-muted">
        {searchQuery
          ? `Keine Ergebnisse für "${searchQuery}"`
          : "Versuche es mit anderen Filtereinstellungen"}
      </p>
    </div>
  );

  // Default header
  const defaultHeader = (
    <div className="sticky top-0 z-40 border-b border-[color-mix(in_srgb,var(--color-border-focus)_30%,transparent)] bg-gradient-to-r from-[var(--acc2)]/12 via-[var(--surface-neumorphic-floating)] to-transparent shadow-[var(--shadow-neumorphic-sm)]">
      {/* Search & Quick Actions Row */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Durchsuchen..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-base)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] shadow-[var(--shadow-inset-subtle)] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-neumorphic)] focus-visible:border-[var(--color-border-focus)] focus-visible:bg-[var(--surface-neumorphic-floating)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Quick Action Buttons */}
          {filterConfig.favoritesEnabled && (
            <Button
              variant={filters.showFavoritesOnly ? "accent" : "ghost"}
              size="sm"
              className="p-2.5"
              onClick={() => dispatchFilters({ type: "toggleFavorites" })}
            >
              <Star className="w-4 h-4" />
              <span className="sr-only">Favoriten</span>
            </Button>
          )}

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
      {filterConfig.favoritesEnabled && favoriteItems.length > 0 && !filters.showFavoritesOnly && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-[var(--color-border-focus)]" />
            <span className="text-sm font-medium text-text-strong">
              Favoriten ({favoriteItems.length})
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {favoriteItems.slice(0, 6).map((item) => (
              <Button
                key={item.id}
                variant={selection?.isSelected(item.id) ? "accent" : "ghost"}
                size="sm"
                className="flex-shrink-0 px-3 py-1.5 text-sm"
                onClick={() => handleSelectItem(item.id)}
              >
                <span className="font-medium">{(item as any).name || (item as any).label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Controls */}
      {showFilters && (
        <div className="px-4 pb-3 border-t border-border-hairline">
          <div className="flex items-center gap-4 pt-3">
            <select
              value={filters.sortBy}
              onChange={(e) => dispatchFilters({ type: "setSortBy", value: e.target.value })}
              className="px-3 py-1.5 bg-surface-card border border-border-subtle rounded text-sm"
            >
              {filterConfig.sortableFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                dispatchFilters({
                  type: "setSortDirection",
                  value: filters.sortDirection === "asc" ? "desc" : "asc",
                })
              }
            >
              {filters.sortDirection === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("flex flex-col h-full bg-surface-base", className)}>
      {/* Header */}
      {renderHeader
        ? renderHeader({
            searchQuery,
            setSearchQuery,
            showFilters,
            setShowFilters,
            filters,
            setFilters: dispatchFilters,
            favoriteItems,
            selectedItemsCount: selection?.selectedItems.size || 0,
          })
        : defaultHeader}

      {/* Items List */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-text-muted">
              {filteredItems.length} Elemente gefunden
              {searchQuery && ` für "${searchQuery}"`}
            </div>
            {selection && selection.selectedItems.size > 0 && (
              <div className="text-sm text-text-muted">
                {selection.selectedItems.size} ausgewählt
              </div>
            )}
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div
              className={cn(
                "grid gap-4",
                gridCols.xs && `grid-cols-${gridCols.xs}`,
                gridCols.sm && `sm:grid-cols-${gridCols.sm}`,
                gridCols.md && `md:grid-cols-${gridCols.md}`,
                gridCols.lg && `lg:grid-cols-${gridCols.lg}`,
                gridCols.xl && `xl:grid-cols-${gridCols.xl}`,
              )}
            >
              {filteredItems.map((item) =>
                renderItem(item, {
                  item,
                  isFavorite: favorites.isFavorite(item.id),
                  isSelected: selection?.isSelected(item.id),
                  onToggleFavorite: () => handleToggleFavorite(item.id),
                  onSelect: selection ? () => handleSelectItem(item.id) : undefined,
                  onActivate: onItemActivated ? () => handleActivateItem(item.id) : undefined,
                }),
              )}
            </div>
          ) : renderEmptyState ? (
            renderEmptyState({ searchQuery, hasFilters: Object.keys(filters).length > 0 })
          ) : (
            defaultEmptyState
          )}
        </div>
      </div>
    </div>
  );
}
