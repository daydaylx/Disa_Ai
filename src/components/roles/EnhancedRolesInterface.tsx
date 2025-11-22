import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import { Search, Shield, Star, Users } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, Button, FilterChip, Input, PremiumCard, Skeleton, useToasts } from "@/ui";

import { useStudio } from "../../app/state/StudioContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useFilteredList } from "../../hooks/useFilteredList";
import { useSettings } from "../../hooks/useSettings";
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
  const { roles, activeRole, setActiveRole, rolesLoading, roleLoadError } = useStudio();
  const { isRoleFavorite, trackRoleUsage, usage } = useFavorites();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<EnhancedRole | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    searchHistory: [],
    selectedCategories: [],
    excludedCategories: [],
    showFavoritesOnly: false,
    showRecentlyUsed: false,
    showBuiltInOnly: false,
    hideMatureContent: !settings.showNSFWContent, // Respect global NSFW setting
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

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      hideMatureContent: !settings.showNSFWContent,
    }));
  }, [settings.showNSFWContent]);

  // Prevent background scroll while the role detail sheet is open
  useEffect(() => {
    if (!selectedRole) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedRole]);

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

          {/* Filter Chips Row - WCAG: Added mature content filter */}
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
            <FilterChip
              selected={filters.hideMatureContent ?? true}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  hideMatureContent: !(prev.hideMatureContent ?? true),
                }))
              }
            >
              Jugendschutz 🔞
            </FilterChip>
          </div>

          {/* Jugendschutz Hinweis */}
          {filters.hideMatureContent && (
            <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-amber-700 text-sm shadow-inset">
              <Shield className="w-4 h-4" />
              <span>Jugendschutz aktiv – NSFW-Rollen sind ausgeblendet.</span>
            </div>
          )}
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
          {(filters.showFavoritesOnly ||
            filters.showBuiltInOnly ||
            filters.hideMatureContent ||
            selectedCategory ||
            searchQuery) && (
            <div className="sticky top-0 z-30 mb-4 flex flex-wrap items-center gap-2 rounded-md border border-surface-1 bg-surface-inset/90 px-3 py-2 shadow-inset backdrop-blur">
              <span className="text-xs font-semibold text-text-secondary">Aktive Filter:</span>
              {filters.showFavoritesOnly && (
                <Badge variant="secondary" className="text-xs">
                  Favoriten
                </Badge>
              )}
              {filters.showBuiltInOnly && (
                <Badge variant="secondary" className="text-xs">
                  Standard
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="outline" className="text-xs">
                  Kategorie: {selectedCategory}
                </Badge>
              )}
              {filters.hideMatureContent && (
                <Badge variant="outline" className="text-xs">
                  Jugendschutz
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="outline" className="text-xs">
                  Suche: “{searchQuery}”
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    showFavoritesOnly: false,
                    showBuiltInOnly: false,
                    hideMatureContent: !settings.showNSFWContent,
                  }));
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
              >
                Zurücksetzen
              </Button>
            </div>
          )}

          {/* Results Header - Typography Semantic */}
          <div className="flex items-center justify-between mb-3">
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
          {activeRole && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-surface-2 bg-surface-inset px-3 py-2 text-sm text-text-secondary shadow-inset">
              <span className="font-semibold text-text-primary">Aktive Rolle:</span>
              <Badge variant="secondary" className="text-xs">
                {activeRole.name}
              </Badge>
            </div>
          )}

          {/* ROLES GRID - PREMIUM CARDS mit Aurora Spine */}
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            data-testid="role-card-grid"
          >
            {filteredRoles.map((role) => {
              const isFavorite = isRoleFavorite(role.id);
              const isActive = activeRole?.id === role.id;
              return (
                <PremiumCard
                  key={role.id}
                  className={cn(
                    "group animate-card-enter cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1",
                    isActive && "ring-2 ring-brand shadow-raiseLg",
                  )}
                  onClick={() => setSelectedRole(role)}
                >
                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Icon Container mit Brand-Akzent */}
                      <div className="w-10 h-10 rounded-md bg-brand/10 shadow-brandGlow flex items-center justify-center with-spine">
                        <Users className="w-5 h-5 text-brand" />
                      </div>
                      {/* Title */}
                      <h3 className="font-semibold text-lg text-text-primary">{role.name}</h3>
                    </div>
                    {/* Favorite Star */}
                    {isFavorite && <Star className="w-5 h-5 text-brand fill-brand" />}
                  </div>

                  {/* CARD BODY */}
                  <p className="text-sm text-text-secondary mb-4 line-clamp-3 leading-relaxed">
                    {role.description}
                  </p>

                  {/* CARD FOOTER */}
                  <div className="flex items-center justify-between pt-2 border-t border-surface-1">
                    {/* Category Badge */}
                    <span className="inline-flex items-center px-2 py-1 rounded-sm bg-surface-inset shadow-inset text-xs font-medium text-text-muted">
                      {role.category || "Spezial"}
                    </span>
                    {/* Usage indicator */}
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <Badge variant="secondary" className="text-xs bg-brand/10 text-brand">
                          Aktiv
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={isActive}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivateRole(role);
                        }}
                      >
                        {isActive ? "Aktiv" : "Aktivieren"}
                      </Button>
                    </div>
                  </div>
                </PremiumCard>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredRoles.length === 0 && !roleLoadError && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 rounded-md bg-surface-inset shadow-inset flex items-center justify-center">
                <Users className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Keine Rollen gefunden
              </h3>
              <p className="text-text-secondary">
                {searchQuery
                  ? `Keine Ergebnisse für "${searchQuery}"`
                  : selectedCategory
                    ? `Keine Rollen in "${selectedCategory}"`
                    : "Versuche es mit anderen Filtereinstellungen"}
              </p>
              <div className="mt-4 flex justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setFilters((prev) => ({
                      ...prev,
                      showFavoritesOnly: false,
                      showBuiltInOnly: false,
                      hideMatureContent: !settings.showNSFWContent,
                    }));
                  }}
                >
                  Filter zurücksetzen
                </Button>
              </div>
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
                Stelle sicher, dass{" "}
                <code className="px-2 py-1 bg-surface-inset rounded-sm shadow-inset">
                  public/persona.json
                </code>{" "}
                existiert und korrekt formatiert ist.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Role Detail Sheet (portaled so it stays visible even when scrolled deep) */}
      {selectedRole &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-6"
            role="dialog"
            aria-modal="true"
            onClick={() => setSelectedRole(null)}
          >
            <div
              className="w-full sm:max-w-2xl bg-surface-1 rounded-t-2xl sm:rounded-2xl shadow-raiseLg max-h-[90vh] overflow-y-auto border border-surface-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-surface-2 sticky top-0 bg-surface-1 z-10">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{selectedRole.name}</h3>
                  <p className="text-sm text-text-secondary">
                    {selectedRole.category || "Spezial"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRole(null)}
                    aria-label="Detail schließen"
                  >
                    Schließen
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      void navigate("/chat");
                      setSelectedRole(null);
                    }}
                  >
                    Im Chat öffnen
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleActivateRole(selectedRole);
                      setSelectedRole(null);
                    }}
                  >
                    Aktivieren
                  </Button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {selectedRole.description}
                  </p>
                  {usage.roles[selectedRole.id]?.lastUsed && (
                    <p className="text-xs text-text-muted">
                      Zuletzt genutzt:{" "}
                      {usage.roles[selectedRole.id]?.lastUsed?.toLocaleString?.() ||
                        String(usage.roles[selectedRole.id]?.lastUsed)}
                    </p>
                  )}
                  {selectedRole.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-text-primary">Zugelassene Modelle</h4>
                  {selectedRole.allowedModels?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.allowedModels.map((model) => (
                        <Badge key={model} variant="secondary" className="text-xs">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-md bg-surface-inset px-3 py-2 text-sm text-text-muted">
                      <span className="text-lg">✓</span>
                      Alle Modelle erlaubt
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {selectedRole.examples && selectedRole.examples.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-text-primary">Beispiel-Prompt</h4>
                      <div className="rounded-md bg-surface-inset shadow-inset p-3 text-sm text-text-secondary">
                        {selectedRole.examples[0]}
                      </div>
                    </div>
                  )}

                  <h4 className="text-sm font-semibold text-text-primary">System-Prompt</h4>
                  <div className="rounded-md bg-surface-inset shadow-inset p-3 text-sm text-text-secondary whitespace-pre-wrap">
                    {selectedRole.systemPrompt || "Kein Prompt hinterlegt."}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default EnhancedRolesInterface;
