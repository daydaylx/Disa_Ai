import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCategoryStyle } from "@/lib/categoryColors";
import { ChevronDown, RotateCcw, Star, Users } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, Button, Card, EmptyState, PageHeader, SearchInput } from "@/ui";

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

export function EnhancedRolesInterface({ className }: EnhancedRolesInterfaceProps) {
  const { roles, activeRole, setActiveRole, rolesLoading, roleLoadError } = useRoles(); // Added roleLoadError
  const { isRoleFavorite, toggleRoleFavorite, trackRoleUsage, usage } = useFavorites();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    searchHistory: [],
    selectedCategories: [],
    excludedCategories: [],
    showFavoritesOnly: false,
    showRecentlyUsed: false,
    showBuiltInOnly: false,
    hideMatureContent: !settings.showNSFWContent,
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

  const enhancedRoles = useMemo(() => roles.map(migrateRole), [roles]);

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
      void navigate("/chat");
    },
    [setActiveRole, trackRoleUsage, navigate],
  );

  const toggleRoleExpansion = useCallback((roleId: string) => {
    setExpandedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(roleId)) next.delete(roleId);
      else next.add(roleId);
      return next;
    });
  }, []);

  const hasActiveFilters = selectedCategory || filters.showFavoritesOnly || searchQuery;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setFilters((prev) => ({ ...prev, showFavoritesOnly: false }));
  };

  // Conditional rendering for loading and error states
  if (rolesLoading) {
    return (
      <div className="flex flex-col h-full p-4 space-y-4">
        <div
          data-testid="role-card-skeleton"
          className="h-12 bg-surface-1 rounded-xl animate-pulse"
        />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              data-testid="role-card-skeleton"
              className="h-8 w-20 bg-surface-1 rounded-full animate-pulse"
            />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              data-testid="role-card-skeleton"
              className="h-24 bg-surface-1 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (roleLoadError) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <EmptyState
          icon={<Users className="h-8 w-8 text-ink-muted" />}
          title="Fehler beim Laden der Rollen"
          description={roleLoadError}
          className="bg-status-error/10 border-status-error/20 text-status-error"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header Zone - Vibrant Glass */}
      <div className="flex-none sticky top-[3.5rem] lg:top-[4rem] z-sticky-content pt-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-bg-app/80 shadow-lg backdrop-blur-xl">
          {/* Ambient Header Glow - Roles accent (Pink) */}
          <div className="absolute inset-0 bg-role-gradient opacity-90 pointer-events-none" />

          <div className="relative space-y-3 px-4 py-4">
            <PageHeader
              title="Rollen"
              description={`${filteredRoles.length} von ${roles.length} verfügbar`}
              className="mb-0"
            />

            {/* Search */}
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rolle suchen..."
              className="w-full bg-surface-2/50 border-white/10 focus:border-accent-roles/50 focus:ring-accent-roles/20"
            />

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
              {/* Favorites Toggle */}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, showFavoritesOnly: !prev.showFavoritesOnly }))
                }
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
                  filters.showFavoritesOnly
                    ? "bg-status-warning/10 border-status-warning/30 text-status-warning"
                    : "bg-surface-1 border-white/5 text-ink-secondary hover:border-white/10",
                )}
              >
                <Star className={cn("h-3.5 w-3.5", filters.showFavoritesOnly && "fill-current")} />
                Favoriten
              </button>

              <div className="w-px h-4 bg-white/10 flex-shrink-0" />

              {/* Category Filters */}
              {CATEGORY_ORDER.map((cat) => {
                const isSelected = selectedCategory === cat;
                const catTheme = getCategoryStyle(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory((prev) => (prev === cat ? null : cat))}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
                      isSelected
                        ? cn(catTheme.bg, catTheme.border, catTheme.text, catTheme.glow)
                        : "bg-surface-1 border-white/5 text-ink-secondary hover:border-white/10",
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-tertiary">
                  {filteredRoles.length} Ergebnisse
                  {selectedCategory && ` in ${selectedCategory}`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 text-xs text-ink-tertiary hover:text-ink-primary"
                >
                  <RotateCcw className="h-3 w-3 mr-1" /> Reset
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Zone - Scrollable List */}
      <div className="flex-1 overflow-y-auto pb-24 pt-4">
        {filteredRoles.length === 0 ? (
          <EmptyState
            icon={<Users className="h-8 w-8 text-ink-muted" />}
            title="Keine Rollen gefunden"
            description="Versuche es mit anderen Suchbegriffen oder Filtern."
            action={
              hasActiveFilters ? (
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Filter zurücksetzen
                </Button>
              ) : undefined
            }
            className="bg-surface-1/30 rounded-2xl border border-white/5 backdrop-blur-sm py-12"
          />
        ) : (
          <div className="space-y-3">
            {filteredRoles.map((role) => {
              const isActive = activeRole?.id === role.id;
              const isExpanded = expandedRoles.has(role.id);
              const isFavorite = isRoleFavorite(role.id);
              const theme = getCategoryStyle(role.category);

              return (
                <Card
                  key={role.id}
                  data-testid="role-card"
                  variant="interactive"
                  // accent="roles" // Removed to use dynamic theme
                  role="button"
                  onClick={() => handleActivateRole(role)}
                  aria-label={`Rolle ${role.name} auswählen`}
                  aria-pressed={isActive}
                  className={cn(
                    "relative transition-all duration-300 group overflow-hidden",
                    isActive
                      ? cn("bg-role-gradient ring-1", theme.border, theme.glow)
                      : cn(
                          "bg-role-gradient border-white/5 hover:brightness-110",
                          theme.hoverBorder,
                        ),
                  )}
                >
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    {isActive && (
                      <Badge
                        className={cn(
                          "text-[10px] px-2 h-5 shadow-sm",
                          theme.badge,
                          theme.badgeText,
                        )}
                      >
                        Aktiv
                      </Badge>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRoleFavorite(role.id);
                      }}
                      aria-pressed={isFavorite}
                      aria-label={
                        isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
                      }
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full border text-ink-tertiary transition-colors",
                        isFavorite
                          ? "border-status-warning/40 bg-status-warning/10 text-status-warning"
                          : "border-white/5 bg-surface-2/80 hover:border-white/10 hover:text-ink-primary",
                      )}
                    >
                      {" "}
                      <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
                    </button>
                  </div>

                  {/* Main Row */}
                  <div className="flex items-center gap-4 p-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                        isActive
                          ? cn(theme.iconBg, theme.iconText, "shadow-inner")
                          : cn(theme.iconBg, theme.iconText, theme.groupHoverIconBg),
                      )}
                    >
                      <Users className="h-6 w-6" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          "font-semibold text-sm truncate block",
                          isActive ? theme.text : "text-ink-primary group-hover:text-ink-primary",
                        )}
                      >
                        {role.name}
                      </span>
                      <p className="text-xs text-ink-secondary truncate mt-1">
                        {role.category || "Spezial"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 pr-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          toggleRoleExpansion(role.id);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-ink-tertiary hover:text-ink-primary transition-colors"
                        aria-expanded={isExpanded}
                        aria-controls={`role-details-${role.id}`}
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
                    <div id={`role-details-${role.id}`} className="px-4 pb-4 pt-0 animate-fade-in">
                      <div
                        className={cn(
                          "space-y-3 rounded-xl border px-4 py-4",
                          theme.bg,
                          theme.border,
                        )}
                      >
                        <p className="text-sm text-ink-secondary leading-relaxed">
                          {role.description}
                        </p>

                        {role.tags && role.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 text-ink-tertiary">
                            {role.tags.map((tag) => (
                              <Badge
                                key={tag}
                                className={cn("text-[10px] px-2 h-5", theme.badge, theme.badgeText)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {role.systemPrompt && (
                          <div className="p-3 rounded-xl bg-surface-1/50 text-xs text-ink-tertiary font-mono border border-white/5 max-h-24 overflow-y-auto">
                            {role.systemPrompt.slice(0, 200)}
                            {role.systemPrompt.length > 200 && "..."}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
