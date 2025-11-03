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
import { cn } from "../../lib/utils";
import type { EnhancedRole, FilterState } from "../../types/enhanced-interfaces";
import { migrateRole } from "../../types/enhanced-interfaces";
import { Badge, Button } from "../ui";
import { Card } from "../ui/card";
import { useToasts } from "../ui/toast/ToastsProvider";

interface EnhancedRolesInterfaceProps {
  className?: string;
}

// Category mapping for consistent theming
type CategoryPalette = {
  bg: string;
  border: string;
  text: string;
  hoverBg?: string;
  activeBg?: string;
  activeBorder?: string;
  activeText?: string;
};

const createPalette = (slug: string): CategoryPalette => ({
  bg: `bg-[var(--role-accent-${slug}-chip-bg)]`,
  border: `border-[var(--role-accent-${slug}-chip-border)]`,
  text: `text-[var(--role-accent-${slug}-chip-text)]`,
  hoverBg: `hover:bg-[var(--role-accent-${slug}-bg-hover)]`,
  activeBg: `bg-[var(--role-accent-${slug}-bg-subtle)]`,
  activeBorder: `border-[var(--role-accent-${slug}-border-strong)]`,
  activeText: `text-[var(--role-accent-${slug}-text)]`,
});

const CATEGORY_PALETTES: Record<string, CategoryPalette> = {
  Alltag: createPalette("alltag"),
  "Business & Karriere": createPalette("business"),
  "Kreativ & Unterhaltung": createPalette("kreativ"),
  "Lernen & Bildung": createPalette("bildung"),
  "Leben & Familie": createPalette("familie"),
  "Experten & Beratung": createPalette("beratung"),
};

const DEFAULT_CATEGORY_PALETTE: CategoryPalette = {
  bg: "bg-[var(--surface-neumorphic-raised)]",
  border: "border-[var(--border-neumorphic-subtle)]",
  text: "text-[var(--color-text-secondary)]",
  hoverBg: "hover:bg-[var(--surface-neumorphic-base)]",
  activeBg: "bg-[var(--surface-neumorphic-floating)]",
  activeBorder: "border-[var(--border-neumorphic-light)]",
  activeText: "text-[var(--color-text-primary)]",
};

const getCategoryPalette = (category: string): CategoryPalette => {
  return CATEGORY_PALETTES[category] ?? DEFAULT_CATEGORY_PALETTE;
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
    <div className="flex items-center gap-1 text-[12px] text-[var(--color-text-secondary)]">
      <TrendingUp className="h-3 w-3 text-[var(--color-brand-primary)]" />
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
  const palette = getCategoryPalette(category);

  return (
    <button
      type="button"
      className={cn(
        "group inline-flex min-w-[132px] snap-start items-center gap-3 rounded-2xl border border-[var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--surface-neumorphic-floating)_78%,transparent)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] shadow-[var(--shadow-depth-1)] transition-all duration-150 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
        isSelected
          ? cn(
              "border-[var(--color-brand-primary)] text-[var(--color-text-primary)] shadow-[var(--shadow-depth-2)]",
              palette.activeBorder,
            )
          : "hover:-translate-y-0.5 hover:shadow-[var(--shadow-depth-2)]",
      )}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <span
        aria-hidden="true"
        className={cn("h-2.5 w-2.5 flex-shrink-0 rounded-full", palette.bg)}
      />
      <span className="flex-1 truncate">{category}</span>
      <span
        className={cn(
          "rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors",
          "border-[var(--color-border-hairline)] bg-[color-mix(in_srgb,var(--surface-neumorphic-floating)_65%,transparent)] text-[var(--color-text-tertiary)]",
          isSelected && cn("border-[var(--color-border-subtle)]", palette.text),
        )}
      >
        {count}
      </span>
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
  const categoryPalette = getCategoryPalette(role.category || "Spezial");

  return (
    <Card
      tone="neo-subtle"
      elevation="subtle"
      className={cn(
        "rounded-2xl border-[var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--surface-neumorphic-floating)_84%,transparent)] p-4 shadow-[var(--shadow-depth-1)] transition-transform duration-150",
        isActive
          ? "border-[var(--color-brand-primary)] shadow-[var(--shadow-depth-2)]"
          : "hover:-translate-y-0.5 hover:shadow-[var(--shadow-depth-2)]",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          data-testid={`role-card-${role.id}`}
          aria-pressed={isActive}
          className="flex-1 text-left focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] focus-visible:ring-0"
          onClick={onSelect}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect();
            }
          }}
        >
          <div className="mb-2 flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-[var(--color-text-primary)]">
              {role.name}
            </h3>
            {isActive && (
              <div className="rounded-full border border-[var(--color-brand-primary)] bg-[color-mix(in_srgb,var(--color-brand-subtle)_70%,var(--surface-neumorphic-floating))] px-2 py-0.5 text-[11px] font-medium text-[var(--color-brand-primary)]">
                Aktiv
              </div>
            )}
          </div>

          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-1 text-xs transition-colors",
                categoryPalette.border,
                categoryPalette.text,
              )}
              style={{
                background:
                  "color-mix(in srgb, var(--surface-neumorphic-floating) 75%, transparent)",
              }}
            >
              {role.category}
            </span>
            {role.tags?.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="neumorphic"
                size="sm"
                className="normal-case rounded-full border border-[var(--color-border-hairline)] bg-[color-mix(in_srgb,var(--surface-neumorphic-floating)_70%,transparent)] px-2 py-[2px] text-[11px] font-medium tracking-[0.02em] text-[var(--color-text-secondary)]"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {role.description || "Spezialisierte KI-Rolle für verschiedene Anwendungsfälle"}
          </p>
        </button>

        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto rounded-full p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            aria-label={
              isFavorite
                ? `${role.name} aus Favoriten entfernen`
                : `${role.name} zu Favoriten hinzufügen`
            }
            onClick={onToggleFavorite}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorite
                  ? "fill-[var(--color-brand-primary)] text-[var(--color-brand-primary)]"
                  : "text-[var(--color-text-muted)]",
              )}
            />
          </Button>

          {!isActive && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-3 py-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              onClick={onActivate}
            >
              Aktivieren
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[12px] text-[var(--color-text-secondary)]">
        <UsageIndicator count={usageCount} />

        <div className="flex items-center gap-2">
          {role.allowedModels && (
            <span className="whitespace-nowrap">{role.allowedModels.length} Modelle</span>
          )}
          <span className="h-1 w-1 rounded-full bg-current" />
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
      <div className="sticky top-0 z-40 border-b border-[color-mix(in_srgb,var(--color-border-focus)_30%,transparent)] bg-gradient-to-r from-[var(--acc2)]/12 via-[var(--surface-neumorphic-floating)] to-transparent backdrop-blur-lg shadow-[var(--shadow-neumorphic-sm)]">
        {/* Search & Quick Actions Row */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Rollen durchsuchen..."
                className="w-full rounded-lg border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-base)] pl-10 pr-4 py-2.5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] shadow-[var(--shadow-inset-subtle)] transition-all duration-200 focus-visible:outline-none focus-visible:border-[var(--color-border-focus)] focus-visible:bg-[var(--surface-neumorphic-floating)] focus-visible:shadow-[var(--shadow-focus-neumorphic)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Action Buttons */}
            <Button
              variant={filters.showFavoritesOnly ? "accent" : "ghost"}
              size="sm"
              className="p-2.5"
              onClick={() =>
                setFilters((prev) => ({ ...prev, showFavoritesOnly: !prev.showFavoritesOnly }))
              }
            >
              <Star className="w-4 h-4" />
              <span className="sr-only">Favoriten</span>
            </Button>

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

        {/* Active Role Banner */}
        {activeRole && (
          <div className="px-4 pb-3">
            <Card
              tone="neo-floating"
              padding="sm"
              interactive={false}
              intent="accent"
              className="flex items-center gap-3 rounded-[var(--radius-xl)] border-[var(--color-accent-border)] bg-[var(--color-accent-surface)] shadow-[var(--shadow-glow-accent-subtle)]"
            >
              <Users className="w-5 h-5 text-[var(--color-border-focus)]" />
              <div className="flex-1">
                <div className="font-medium text-[var(--color-text-on-accent)]">
                  Aktive Rolle: {activeRole.name}
                </div>
                <div className="text-sm text-[var(--color-text-on-accent)]/80">
                  {activeRole.category}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveRole(null)}
                className="text-[var(--color-text-on-accent)] hover:bg-[var(--color-accent-surface-strong)]"
              >
                Deaktivieren
              </Button>
            </Card>
          </div>
        )}

        {/* Favorites Section */}
        {favoriteRoles.length > 0 && !filters.showFavoritesOnly && (
          <div className="px-4 pb-3">
            <div className="mb-2 flex items-center gap-2 text-[var(--color-text-secondary)]">
              <Star className="h-4 w-4 text-[var(--color-border-focus)]" />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                Favoriten ({favoriteCount.roles})
              </span>
            </div>
            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {favoriteRoles.slice(0, 4).map((role) => (
                <Button
                  key={role.id}
                  variant={activeRole?.id === role.id ? "accent" : "ghost"}
                  className="min-w-[160px] snap-start flex-shrink-0 flex-col items-start px-3 py-2 text-left text-sm shadow-[var(--shadow-depth-1)] transition-all duration-150 hover:-translate-y-0.5"
                  onClick={() => handleActivateRole(role)}
                >
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {role.name}
                  </span>
                  <span className="text-[12px] text-[var(--color-text-secondary)]">
                    {role.category}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Category Pills */}
        {!selectedCategory && (
          <div className="px-4 pb-3">
            <div className="mb-2 flex items-center gap-2 text-[var(--color-text-secondary)]">
              <Hash className="h-4 w-4 text-[var(--color-text-secondary)]" />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                Kategorien
              </span>
            </div>
            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="role-card-grid">
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
