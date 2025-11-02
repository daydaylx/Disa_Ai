/**
 * Enhanced Roles Interface - Material Design Alternative B
 *
 * Dense Information Layout with Performance-First optimizations
 * Features: Sticky Header, Category Pills, Usage Analytics, Quick Actions
 */

import { Filter, Hash, Search, Settings, Star, TrendingUp, Users } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { useStudio } from "../../app/state/StudioContext";
import { useFavoriteLists, useFavorites } from "../../contexts/FavoritesContext";
import type { EnhancedRole, FilterState } from "../../types/enhanced-interfaces";
import { migrateRole } from "../../types/enhanced-interfaces";
import { Button } from "../ui";
import { Card } from "../ui/card";
import { useToasts } from "../ui/toast/ToastsProvider";

interface EnhancedRolesInterfaceProps {
  className?: string;
}

// Category mapping for consistent theming
const CATEGORY_COLORS: Record<string, string> = {
  Alltag: "bg-blue-100 text-blue-700",
  "Business & Karriere": "bg-purple-100 text-purple-700",
  "Kreativ & Unterhaltung": "bg-pink-100 text-pink-700",
  "Lernen & Bildung": "bg-cyan-100 text-cyan-700",
  "Leben & Familie": "bg-green-100 text-green-700",
  "Experten & Beratung": "bg-red-100 text-red-700",
  Erwachsene: "bg-yellow-100 text-yellow-700",
  Spezial: "bg-gray-100 text-gray-700",
};

const CATEGORY_ORDER = [
  "Alltag",
  "Business & Karriere",
  "Kreativ & Unterhaltung",
  "Lernen & Bildung",
  "Leben & Familie",
  "Experten & Beratung",
  "Erwachsene",
  "Spezial",
];

// Usage indicator component
function UsageIndicator({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-text-secondary">
      <TrendingUp className="w-3 h-3" />
      <span>{count}x genutzt</span>
    </div>
  );
}

// Category pill component
function CategoryPill({
  category,
  isSelected,
  count,
  onClick,
}: {
  category: string;
  isSelected: boolean;
  count: number;
  onClick: () => void;
}) {
  const colorClass = CATEGORY_COLORS[category] || "bg-gray-100 text-gray-700";

  return (
    <button
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        isSelected
          ? `${colorClass} ring-2 ring-offset-2 ring-current`
          : `${colorClass} opacity-70 hover:opacity-100`
      }`}
      onClick={onClick}
    >
      <span>{category}</span>
      <span className="text-xs bg-white/30 px-1.5 py-0.5 rounded-full">{count}</span>
    </button>
  );
}

// Enhanced Role Card for Dense Information Layout
function DenseRoleCard({
  role,
  isActive,
  isFavorite,
  usageCount,
  onSelect,
  onToggleFavorite,
  onActivate,
}: {
  role: EnhancedRole;
  isActive: boolean;
  isFavorite: boolean;
  usageCount: number;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onActivate: () => void;
}) {
  const categoryColor = CATEGORY_COLORS[role.category || "Spezial"] || "bg-gray-100 text-gray-700";

  return (
    <Card
      className={`p-4 transition-all duration-200 hover:shadow-md ${
        isActive ? "ring-2 ring-[var(--color-brand-primary)] ring-offset-2" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          data-testid={`role-card-${role.id}`}
          aria-pressed={isActive}
          className="flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
          onClick={onSelect}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect();
            }
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-text-strong truncate">{role.name}</h3>
            {isActive && (
              <div className="px-2 py-0.5 rounded-full border border-[var(--color-brand-primary)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-strong)] text-xs font-medium">
                AKTIV
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded-full ${categoryColor}`}>
              {role.category}
            </span>
            {role.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-surface-subtle text-text-secondary rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {role.description || "Spezialisierte KI-Rolle für verschiedene Anwendungsfälle"}
          </p>
        </button>

        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 h-auto"
            aria-label={
              isFavorite
                ? `${role.name} aus Favoriten entfernen`
                : `${role.name} zu Favoriten hinzufügen`
            }
            onClick={onToggleFavorite}
          >
            <Star
              className={`w-4 h-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-text-muted"}`}
            />
          </Button>

          {!isActive && (
            <Button variant="ghost" size="sm" className="px-2 py-1 text-xs" onClick={onActivate}>
              Aktivieren
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <UsageIndicator count={usageCount} />

        <div className="flex items-center gap-2 text-text-secondary">
          {role.allowedModels && <span>{role.allowedModels.length} Modelle</span>}
          <span className="w-1 h-1 bg-current rounded-full" />
          <span>{role.metadata?.isBuiltIn ? "Standard" : "Benutzerdefiniert"}</span>
        </div>
      </div>
    </Card>
  );
}

// Main Enhanced Roles Interface Component
export function EnhancedRolesInterface({ className }: EnhancedRolesInterfaceProps) {
  const { push } = useToasts();
  const { roles, activeRole, setActiveRole } = useStudio();
  const { toggleRoleFavorite, isRoleFavorite, trackRoleUsage, usage } = useFavorites();
  const { getFavoriteRoles, favoriteCount } = useFavoriteLists();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
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

  // Convert legacy roles to enhanced roles
  const enhancedRoles = useMemo(() => {
    return roles.map(migrateRole);
  }, [roles]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    enhancedRoles.forEach((role) => {
      const category = role.category || "Spezial";
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  }, [enhancedRoles]);

  // Filtered and sorted roles
  const filteredRoles = useMemo(() => {
    let filtered = enhancedRoles;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (role) =>
          role.name.toLowerCase().includes(query) ||
          role.description?.toLowerCase().includes(query) ||
          role.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          role.category?.toLowerCase().includes(query),
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((role) => role.category === selectedCategory);
    }

    // Favorites filter
    if (filters.showFavoritesOnly) {
      filtered = filtered.filter((role) => isRoleFavorite(role.id));
    }

    // Built-in only filter
    if (filters.showBuiltInOnly) {
      filtered = filtered.filter((role) => role.metadata?.isBuiltIn);
    }

    // Recently used filter
    if (filters.showRecentlyUsed) {
      filtered = filtered.filter((role) => (usage.roles[role.id]?.count || 0) > 0);
    }

    // Sort
    filtered.sort((a, b) => {
      const direction = filters.sortDirection === "asc" ? 1 : -1;

      switch (filters.sortBy) {
        case "name":
          return direction * a.name.localeCompare(b.name);
        case "usage": {
          const aUsage = usage.roles[a.id]?.count || 0;
          const bUsage = usage.roles[b.id]?.count || 0;
          return direction * (bUsage - aUsage);
        }
        case "lastUsed": {
          const aLastUsed = usage.roles[a.id]?.lastUsed?.getTime() || 0;
          const bLastUsed = usage.roles[b.id]?.lastUsed?.getTime() || 0;
          return direction * (bLastUsed - aLastUsed);
        }
        case "category":
          return direction * (a.category || "").localeCompare(b.category || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [enhancedRoles, searchQuery, selectedCategory, filters, isRoleFavorite, usage]);

  // Get favorites for header section
  const favoriteRoles = getFavoriteRoles(enhancedRoles);

  // Handlers
  const handleActivateRole = useCallback(
    (role: EnhancedRole) => {
      // Convert enhanced role back to legacy format for setActiveRole
      const legacyRole = {
        id: role.id,
        name: role.name,
        description: role.description,
        systemPrompt: role.systemPrompt,
        allowedModels: role.allowedModels,
        tags: role.tags,
        category: role.category,
        styleHints: role.styleHints,
      };

      setActiveRole(legacyRole);
      trackRoleUsage(role.id);

      push({
        kind: "success",
        title: `${role.name} aktiviert`,
        message: "Diese Rolle ist jetzt aktiv für neue Chats",
      });
    },
    [setActiveRole, trackRoleUsage, push],
  );

  const handleToggleFavorite = useCallback(
    (role: EnhancedRole) => {
      toggleRoleFavorite(role.id);
      const isFav = isRoleFavorite(role.id);

      push({
        kind: "success",
        title: `${role.name} ${isFav ? "von Favoriten entfernt" : "zu Favoriten hinzugefügt"}`,
      });
    },
    [toggleRoleFavorite, isRoleFavorite, push],
  );

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  }, []);

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
                placeholder="Rollen durchsuchen..."
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

        {/* Active Role Banner */}
        {activeRole && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium text-primary">Aktive Rolle: {activeRole.name}</div>
                <div className="text-sm text-primary/80">{activeRole.category}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveRole(null)}
                className="text-primary hover:bg-primary/10"
              >
                Deaktivieren
              </Button>
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favoriteRoles.length > 0 && !filters.showFavoritesOnly && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-text-strong">
                Favoriten ({favoriteCount.roles})
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {favoriteRoles.slice(0, 4).map((role) => (
                <button
                  key={role.id}
                  className="flex-shrink-0 px-3 py-1.5 bg-surface-card border border-border-subtle rounded-lg text-sm hover:bg-surface-raised transition-colors"
                  onClick={() => handleActivateRole(role)}
                >
                  <span className="font-medium">{role.name}</span>
                  <span className="ml-1 text-xs text-text-secondary">{role.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Pills */}
        {!selectedCategory && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-text-muted" />
              <span className="text-sm font-medium text-text-strong">Kategorien</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORY_ORDER.filter((cat) => (categoryCounts[cat] || 0) > 0).map((category) => (
                <CategoryPill
                  key={category}
                  category={category}
                  isSelected={selectedCategory === category}
                  count={categoryCounts[category] || 0}
                  onClick={() => handleCategorySelect(category)}
                />
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
                  checked={filters.showRecentlyUsed}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, showRecentlyUsed: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Kürzlich verwendet</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showBuiltInOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, showBuiltInOnly: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Nur Standard-Rollen</span>
              </label>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="px-3 py-1.5 bg-surface-card border border-border-subtle rounded text-sm"
              >
                <option value="name">Name</option>
                <option value="category">Kategorie</option>
                <option value="usage">Nutzung</option>
                <option value="lastUsed">Zuletzt verwendet</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Roles List */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-text-secondary">
              {filteredRoles.length} Rollen gefunden
              {searchQuery && ` für "${searchQuery}"`}
              {selectedCategory && ` in ${selectedCategory}`}
            </div>
            {selectedCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="text-sm"
              >
                Alle anzeigen
              </Button>
            )}
          </div>

          {/* Roles Grid */}
          <div className="space-y-3" data-testid="role-card-grid">
            {filteredRoles.map((role) => (
              <DenseRoleCard
                key={role.id}
                role={role}
                isActive={activeRole?.id === role.id}
                isFavorite={isRoleFavorite(role.id)}
                usageCount={usage.roles[role.id]?.count || 0}
                onSelect={() => handleActivateRole(role)}
                onToggleFavorite={() => handleToggleFavorite(role)}
                onActivate={() => handleActivateRole(role)}
              />
            ))}
          </div>

          {filteredRoles.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-subtle flex items-center justify-center">
                <Users className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-lg font-medium text-text-strong mb-2">Keine Rollen gefunden</h3>
              <p className="text-text-secondary">
                {searchQuery
                  ? `Keine Ergebnisse für "${searchQuery}"`
                  : selectedCategory
                    ? `Keine Rollen in "${selectedCategory}"`
                    : "Versuche es mit anderen Filtereinstellungen"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnhancedRolesInterface;
