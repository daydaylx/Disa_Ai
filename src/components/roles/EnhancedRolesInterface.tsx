import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Check, ChevronDown, RotateCcw, Star, Users } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, Button, EmptyState, PageHeader, SearchInput } from "@/ui";

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
  const { roles, activeRole, setActiveRole, rolesLoading } = useRoles();
  const { isRoleFavorite, trackRoleUsage, usage } = useFavorites();
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

  if (rolesLoading) {
    return (
      <div className="flex flex-col h-full p-4 space-y-4">
        <div className="h-12 bg-surface-1 rounded-xl animate-pulse" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-surface-1 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-surface-1 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header & Filters */}
      <div className="flex-none px-4 py-4 space-y-4">
        <PageHeader
          title="Rollen"
          description={`${filteredRoles.length} von ${roles.length} verfügbar`}
        />

        {/* Search */}
        <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Rolle suchen..." />

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
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
          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory((prev) => (prev === cat ? null : cat))}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary"
                  : "bg-surface-1 border-white/5 text-ink-secondary hover:border-white/10",
              )}
            >
              {cat}
            </button>
          ))}
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

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {filteredRoles.length === 0 ? (
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="Keine Rollen gefunden"
            description="Versuche es mit anderen Suchbegriffen oder Filtern."
            action={
              hasActiveFilters ? (
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Filter zurücksetzen
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-2">
            {filteredRoles.map((role) => {
              const isActive = activeRole?.id === role.id;
              const isExpanded = expandedRoles.has(role.id);

              return (
                <div
                  key={role.id}
                  className={cn(
                    "rounded-2xl border bg-surface-1 transition-all",
                    isActive ? "border-accent-primary/30" : "border-white/5",
                  )}
                >
                  {/* Main Row */}
                  <div className="flex items-center gap-3 p-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center",
                        isActive
                          ? "bg-accent-primary/10 text-accent-primary"
                          : "bg-surface-2 text-ink-tertiary",
                      )}
                    >
                      <Users className="h-5 w-5" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-medium text-sm truncate",
                            isActive ? "text-accent-primary" : "text-ink-primary",
                          )}
                        >
                          {role.name}
                        </span>
                        {isActive && (
                          <Check className="h-4 w-4 text-accent-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-ink-tertiary truncate mt-0.5">
                        {role.category || "Spezial"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleRoleExpansion(role.id)}
                        className="p-2 text-ink-tertiary hover:text-ink-primary transition-colors"
                        aria-label="Details anzeigen"
                      >
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
                        />
                      </button>
                      <Button
                        size="sm"
                        variant={isActive ? "secondary" : "primary"}
                        className="h-8 px-3 text-xs"
                        onClick={() => handleActivateRole(role)}
                      >
                        {isActive ? "Aktiv" : "Wählen"}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 space-y-3 border-t border-white/5 mt-0 animate-fade-in">
                      <p className="text-sm text-ink-secondary leading-relaxed pt-3">
                        {role.description}
                      </p>

                      {role.tags && role.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {role.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-2 h-5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {role.systemPrompt && (
                        <div className="p-3 rounded-xl bg-surface-2/50 text-xs text-ink-tertiary font-mono border border-white/5 max-h-24 overflow-y-auto">
                          {role.systemPrompt.slice(0, 200)}
                          {role.systemPrompt.length > 200 && "..."}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
