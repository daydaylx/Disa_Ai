import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChevronDown, RotateCcw, Search, Star, Users } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, Button, Card } from "@/ui";

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
      void navigate("/chat"); // Added void to ignore the promise
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

  if (rolesLoading) {
    return (
      <div className="flex flex-col h-full p-4 space-y-4 animate-pulse">
        <div className="h-12 bg-surface-2 rounded-xl w-full" />
        <div className="flex gap-2 overflow-hidden">
          <div className="h-8 w-20 bg-surface-2 rounded-full" />
          <div className="h-8 w-20 bg-surface-2 rounded-full" />
          <div className="h-8 w-20 bg-surface-2 rounded-full" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="h-40 bg-surface-2 rounded-2xl" />
          <div className="h-40 bg-surface-2 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-bg-app", className)}>
      {/* Header & Filters */}
      <div className="flex-none px-4 py-4 bg-bg-app/95 backdrop-blur-sm z-10 space-y-3 border-b border-white/5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-tertiary" />
          <input
            type="text"
            placeholder="Suche nach Rollen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-surface-2 rounded-xl pl-10 pr-4 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() =>
              setFilters((prev) => ({ ...prev, showFavoritesOnly: !prev.showFavoritesOnly }))
            }
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
              filters.showFavoritesOnly
                ? "bg-accent-warning/10 border-accent-warning/30 text-accent-warning"
                : "bg-surface-1 border-white/10 text-ink-secondary hover:border-white/20",
            )}
          >
            <Star className={cn("h-3.5 w-3.5", filters.showFavoritesOnly && "fill-current")} />
            Favoriten
          </button>

          <div className="w-px h-4 bg-white/10 mx-1 flex-shrink-0" />

          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory((prev) => (prev === cat ? null : cat))}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary"
                  : "bg-surface-1 border-white/10 text-ink-secondary hover:border-white/20",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20">
        {/* Active Filters Summary */}
        {(selectedCategory || filters.showFavoritesOnly || searchQuery) && (
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs text-ink-secondary">
              {filteredRoles.length} Ergebnisse
              {selectedCategory && ` in ${selectedCategory}`}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setFilters((prev) => ({ ...prev, showFavoritesOnly: false }));
              }}
              className="h-6 text-xs text-ink-tertiary hover:text-ink-primary"
            >
              <RotateCcw className="h-3 w-3 mr-1" /> Reset
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredRoles.map((role) => {
            const isActive = activeRole?.id === role.id;
            const isExpanded = expandedRoles.has(role.id);

            return (
              <Card
                key={role.id}
                variant={isActive ? "interactive" : "default"}
                padding="sm"
                className={cn(
                  "group transition-all duration-200",
                  isActive && "ring-1 ring-accent-primary/50 bg-surface-1/80",
                )}
              >
                <div className="flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-surface-2 flex items-center justify-center text-ink-secondary group-hover:text-ink-primary transition-colors">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-ink-primary leading-tight">
                          {role.name}
                        </h3>
                        <span className="text-xs text-ink-tertiary">
                          {role.category || "Spezial"}
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <Badge variant="default" className="text-[10px] h-5 px-1.5">
                        Aktiv
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <div className="text-sm text-ink-secondary leading-relaxed">
                    <p className={cn(!isExpanded && "line-clamp-2")}>{role.description}</p>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                    <button
                      onClick={() => toggleRoleExpansion(role.id)}
                      className="text-xs font-medium text-ink-tertiary hover:text-ink-primary flex items-center gap-1"
                    >
                      {isExpanded ? "Weniger" : "Details"}
                      <ChevronDown
                        className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-180")}
                      />
                    </button>

                    <Button
                      size="sm"
                      variant={isActive ? "secondary" : "primary"}
                      className="h-8 px-4 text-xs"
                      onClick={() => handleActivateRole(role)}
                    >
                      {isActive ? "Im Chat" : "Wählen"}
                    </Button>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="pt-2 space-y-2 animate-slide-up">
                      {role.tags && role.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {role.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-[10px] px-1.5 h-5 bg-surface-2 text-ink-tertiary border-none"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {role.systemPrompt && (
                        <div className="mt-2 p-2 rounded-lg bg-surface-2/50 text-xs text-ink-secondary font-mono border border-white/5">
                          {role.systemPrompt.slice(0, 150)}...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {filteredRoles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-surface-2 flex items-center justify-center text-ink-tertiary mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-ink-primary">Keine Rollen gefunden</h3>
            <p className="text-sm text-ink-secondary mt-1 max-w-xs">
              Versuche es mit anderen Suchbegriffen oder Filtern.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
