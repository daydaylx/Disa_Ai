import { useCallback, useEffect, useMemo, useState } from "react";

import { Search, Star, Users } from "@/lib/icons";
import { Button, FilterChip, GlassCard, Input, Skeleton, useToasts } from "@/ui";

import { useStudio } from "../../app/state/StudioContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useFilteredList } from "../../hooks/useFilteredList";
import { type EnhancedRole, type FilterState, migrateRole } from "../../types/enhanced-interfaces";
import { roleFilterFn, roleSortFn } from "./roles-filter";

// Role category order for filters
const CATEGORY_ORDER = [
  "Assistance",
  "Creative",
  "Technical",
  "Analysis",
  "Research",
  "Education",
  "Business",
  "Entertainment",
  "Spezial",
] as const;

interface EnhancedRolesInterfaceProps {
  className?: string;
}

// Main Enhanced Roles Interface Component
export function EnhancedRolesInterface({ className }: EnhancedRolesInterfaceProps) {
  const { push } = useToasts();
  const { roles, activeRole: _activeRole, setActiveRole, rolesLoading, roleLoadError } =
    useStudio();
  const { isRoleFavorite, trackRoleUsage, usage } = useFavorites();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  // Show error toast when role loading fails
  useEffect(() => {
    if (roleLoadError) {
      push({
        kind: "error",
        title: "Fehler beim Laden der Rollen",
        message: roleLoadError,
      });
    }
  }, [roleLoadError, push]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    enhancedRoles.forEach((role) => {
      const category = role.category || "Spezial";
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  }, [enhancedRoles]);

  const filterFnCallback = useCallback(
    (role: EnhancedRole, filters: FilterState, searchQuery: string) =>
      roleFilterFn(role, filters, searchQuery, isRoleFavorite, usage, selectedCategory),
    [isRoleFavorite, usage, selectedCategory],
  );

  const sortFnCallback = useCallback(
    (a: EnhancedRole, b: EnhancedRole, filters: FilterState) => roleSortFn(a, b, filters, usage),
    [usage],
  );

  const filteredRoles = useFilteredList<EnhancedRole>(
    enhancedRoles,
    filters,
    searchQuery,
    filterFnCallback,
    sortFnCallback,
  );

  // Handlers
  const handleActivateRole = useCallback(
    (role: EnhancedRole) => {
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

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  }, []);

  // Show loading skeleton while roles are loading
  if (rolesLoading) {
    return (
      <div className={`flex flex-col h-full bg-bg-base ${className || ""}`}>
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full rounded-md" /> {/* Search bar skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-sm" /> {/* Filter chip skeleton */}
            <Skeleton className="h-9 w-24 rounded-sm" /> {/* Filter chip skeleton */}
            <Skeleton className="h-9 w-24 rounded-sm" /> {/* Filter chip skeleton */}
          </div>
          <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-sm" /> // Category pill skeleton
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-md" /> // Role card skeleton
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-bg-base ${className || ""}`}>
      {/* MATERIAL INSET HEADER PANEL */}
      <div className="sticky top-0 z-40 bg-surface-inset shadow-inset pb-2">
        <div className="p-4 space-y-4">
          {/* Search Input - Material Style */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-surface-inset rounded-sm p-1.5 shadow-inset z-10">
              <Search className="w-4 h-4 text-text-muted" />
            </div>
            <Input
              placeholder="Rollen durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-6 text-base"
            />
          </div>

          {/* Filter Chips Row */}
          <div className="flex gap-3">
            <FilterChip
              selected={filters.showFavoritesOnly}
              onClick={() =>
                setFilters((prev) => ({ ...prev, showFavoritesOnly: !prev.showFavoritesOnly }))
              }
              leading={<Star className="w-4 h-4" />}
            >
              Favoriten
            </FilterChip>
            <FilterChip
              selected={filters.showBuiltInOnly}
              onClick={() =>
                setFilters((prev) => ({ ...prev, showBuiltInOnly: !prev.showBuiltInOnly }))
              }
              leading={<Users className="w-4 h-4" />}
            >
              Standard
            </FilterChip>
          </div>
        </div>

        {/* CATEGORY PILLS - INSET CONTAINER */}
        <div className="mx-4 mb-4 rounded-md bg-surface-inset shadow-inset p-3">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORY_ORDER.filter((cat: string) => (categoryCounts[cat] || 0) > 0).map(
              (category: string) => (
                <FilterChip
                  key={category}
                  selected={selectedCategory === category}
                  onClick={() => handleCategorySelect(category)}
                  count={categoryCounts[category]}
                >
                  {category}
                </FilterChip>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Roles List */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Results Header - Typography Semantic */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-text-secondary">
              {filteredRoles.length} Rollen gefunden
              {searchQuery && <span className="text-text-accent"> für "{searchQuery}"</span>}
              {selectedCategory && <span className="text-text-accent"> in {selectedCategory}</span>}
            </h2>
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

          {/* ROLES GRID - MATERIAL CARDS */}
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            data-testid="role-card-grid"
          >
            {filteredRoles.map((role) => {
              const isFavorite = isRoleFavorite(role.id);
              return (
                <GlassCard
                  key={role.id}
                  variant="raised"
                  className="cursor-pointer hover:shadow-raiseLg transition-all duration-fast group animate-card-enter"
                  onClick={() => handleActivateRole(role)}
                >
                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Icon Container - Inset */}
                      <div className="w-10 h-10 rounded-sm bg-surface-inset shadow-inset flex items-center justify-center">
                        <Users className="w-5 h-5 text-text-accent" />
                      </div>
                      {/* Title */}
                      <h3 className="font-semibold text-xl text-text-on-raised">
                        {role.name}
                      </h3>
                    </div>
                    {/* Favorite Star */}
                    {isFavorite && (
                      <Star className="w-5 h-5 text-accent-primary fill-accent-primary" />
                    )}
                  </div>

                  {/* CARD BODY */}
                  <p className="text-sm text-text-secondary mb-4 line-clamp-3">
                    {role.description}
                  </p>

                  {/* CARD FOOTER */}
                  <div className="flex items-center justify-between pt-4 mt-1">
                    {/* Category Badge */}
                    <span className="inline-flex items-center px-2 py-1 rounded-sm bg-surface-inset shadow-inset text-xs font-medium text-text-meta">
                      {role.category || "Spezial"}
                    </span>
                    {/* Usage indicator */}
                    {usage[role.id] && (
                      <span className="text-xs text-text-meta">
                        {usage[role.id].count}× verwendet
                      </span>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredRoles.length === 0 && !roleLoadError && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 rounded-md bg-surface-inset shadow-inset flex items-center justify-center">
                <Users className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Keine Rollen gefunden</h3>
              <p className="text-text-secondary">
                {searchQuery
                  ? `Keine Ergebnisse für "${searchQuery}"`
                  : selectedCategory
                    ? `Keine Rollen in "${selectedCategory}"`
                    : "Versuche es mit anderen Filtereinstellungen"}
              </p>
            </div>
          )}

          {/* Error State */}
          {roleLoadError && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 rounded-md bg-surface-inset shadow-inset flex items-center justify-center">
                <Users className="w-8 h-8 text-accent-danger" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Rollen konnten nicht geladen werden
              </h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">{roleLoadError}</p>
              <p className="text-sm text-text-meta">
                Stelle sicher, dass <code className="px-2 py-1 bg-surface-inset rounded-sm shadow-inset">public/persona.json</code> existiert und korrekt formatiert ist.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnhancedRolesInterface;
