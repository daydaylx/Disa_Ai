import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import { Check, Search, Shield, Star, Users } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, Button, FilterChip, Input, PremiumCard, Skeleton, useToasts } from "@/ui";

import { useFavorites } from "../../contexts/FavoritesContext";
import { useRoles } from "../../contexts/RolesContext";
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
  const { roles, activeRole, setActiveRole, rolesLoading, roleLoadError } = useRoles();
  const { isRoleFavorite, trackRoleUsage, usage } = useFavorites();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());
  const detailRefs = useRef<Record<string, HTMLDivElement | null>>({});
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

  const toggleRoleExpansion = useCallback((roleId: string) => {
    setExpandedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(roleId)) {
        next.delete(roleId);
      } else {
        next.add(roleId);
      }
      return next;
    });
  }, []);

  const toggleRoleDetails = useCallback((roleId: string) => {
    setSelectedRoleId((prev) => (prev === roleId ? null : roleId));
  }, []);

  useEffect(() => {
    if (!selectedRoleId) return;
    const el = detailRefs.current[selectedRoleId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedRoleId]);

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
            data-testid="roles-grid"
          >
            {filteredRoles.map((role) => {
              const isFavorite = isRoleFavorite(role.id);
              const isActive = activeRole?.id === role.id;
              const isExpanded = expandedRoles.has(role.id);
              const isSelected = selectedRoleId === role.id;
              return (
                <div key={role.id} className="space-y-2">
                  <PremiumCard
                    className={cn(
                      "group animate-card-enter cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1",
                      isActive && "ring-2 ring-brand shadow-raiseLg",
                    )}
                    onClick={() => toggleRoleDetails(role.id)}
                    interactiveRole="group"
                    focusable={false}
                  >
                    {isActive && (
                      <div className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-sm bg-brand/10 px-2 py-1 text-[11px] font-semibold text-brand shadow-inset">
                        <Check className="h-3.5 w-3.5" />
                        Aktiv
                      </div>
                    )}
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
                    <div className="mb-4">
                      <p
                        className={cn(
                          "text-sm text-text-secondary leading-relaxed transition-all duration-300 ease-in-out motion-reduce:transition-none",
                          !isExpanded && "line-clamp-3",
                        )}
                      >
                        {role.description}
                      </p>
                    </div>
                  </PremiumCard>

                  <div className="flex items-center justify-between gap-2 px-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-sm bg-surface-inset shadow-inset text-xs font-medium text-text-muted">
                      {role.category || "Spezial"}
                    </span>
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <Badge variant="secondary" className="text-xs bg-brand/10 text-brand">
                          Aktiv
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          if (isActive) {
                            setActiveRole(null);
                          } else {
                            handleActivateRole(role);
                          }
                        }}
                      >
                        {isActive ? "Deaktivieren" : "Aktivieren"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => toggleRoleExpansion(role.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1 rounded-sm px-2 py-1.5 min-h-[32px] touch-manipulation"
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
                      >
                        <span>{isExpanded ? "Weniger" : "Mehr anzeigen"}</span>
                        <svg
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-300 ease-in-out motion-reduce:transition-none",
                            isExpanded && "rotate-180",
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      ref={(el) => {
                        detailRefs.current[role.id] = el;
                      }}
                      className="rounded-lg border border-surface-2 bg-surface-1 shadow-raise p-4 space-y-4 animate-[fadeIn_180ms_ease]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-text-primary">{role.name}</h3>
                          <p className="text-xs text-text-secondary">
                            {role.category || "Spezial"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRoleDetails(role.id)}
                          >
                            Schließen
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              void navigate("/chat");
                              toggleRoleDetails(role.id);
                            }}
                          >
                            Im Chat öffnen
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              handleActivateRole(role);
                              toggleRoleDetails(role.id);
                            }}
                          >
                            Aktivieren
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-text-secondary leading-relaxed">
                        <p>{role.description}</p>
                        {usage.roles[role.id]?.lastUsed && (
                          <p className="text-xs text-text-muted">
                            Zuletzt genutzt:{" "}
                            {usage.roles[role.id]?.lastUsed?.toLocaleString?.() ||
                              String(usage.roles[role.id]?.lastUsed)}
                          </p>
                        )}
                        {role.tags?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {role.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-[11px]">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-text-primary">
                          Empfohlene Modelle
                        </h4>
                        {role.allowedModels?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {role.allowedModels.map((model) => (
                              <Badge key={model} variant="secondary" className="text-xs">
                                {model}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 rounded-md bg-surface-inset px-3 py-2 text-sm text-text-muted">
                            <span className="text-lg">✓</span>
                            Keine Empfehlung – alle Modelle möglich
                          </div>
                        )}
                      </div>

                      {role.examples && role.examples.length > 0 && (
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-text-primary">
                            Beispiel-Prompt
                          </h4>
                          <div className="rounded-md bg-surface-inset shadow-inset p-3 text-sm text-text-secondary">
                            {role.examples[0]}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-text-primary">System-Prompt</h4>
                        <div className="rounded-md bg-surface-inset shadow-inset p-3 text-sm text-text-secondary whitespace-pre-wrap">
                          {role.systemPrompt || "Kein Prompt hinterlegt."}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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

      {/* Always-visible active role pill (helps when far down the list) */}
      {activeRole &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-full bg-surface-1/95 px-4 py-2 shadow-raiseLg border border-surface-2">
            <span className="text-xs font-semibold text-text-secondary">Aktive Rolle</span>
            <Badge variant="secondary" className="text-xs">
              {activeRole.name}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs"
              onClick={() => setActiveRole(null)}
            >
              Zurücksetzen
            </Button>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default EnhancedRolesInterface;
