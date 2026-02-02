import { useCallback, useEffect, useMemo, useState } from "react";

import { getCategoryStyle } from "@/lib/categoryColors";
import type { LucideIcon } from "@/lib/icons";
import {
  Activity,
  Book,
  BookOpenCheck,
  Bot,
  Brain,
  Briefcase,
  ChevronDown,
  Code2,
  DollarSign,
  Feather,
  Film,
  GraduationCap,
  Heart,
  HeartHandshake,
  Home,
  Lock,
  MessageSquare,
  Music,
  Palette,
  RotateCcw,
  Scale,
  Shield,
  Smile,
  Sparkles,
  Star,
  Tag,
  Theater,
  TrendingUp,
  Unlock,
  User,
  Users,
  Utensils,
  Zap,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, Button, EmptyState, PageHeader, SearchInput } from "@/ui";

import { useFavorites } from "../../contexts/FavoritesContext";
import { useRoles } from "../../contexts/RolesContext";
import { useFilteredList } from "../../hooks/useFilteredList";
import { useSettings } from "../../hooks/useSettings";
import { type EnhancedRole, type FilterState, migrateRole } from "../../types/enhanced-interfaces";
import { CATEGORY_ORDER, roleFilterFn, roleSortFn } from "./roles-filter";

interface EnhancedRolesInterfaceProps {
  className?: string;
}

function getRoleIcon(role: EnhancedRole): LucideIcon {
  // Role-specific mapping for unique visual identity
  // Each role gets its own icon based on its purpose and characteristics
  const roleIconMap: Record<string, LucideIcon> = {
    // Standard & General
    neutral: Users,

    // Communication & Business
    email_professional: MessageSquare,

    // Personality & Humor
    sarcastic_direct: Smile,

    // Therapy & Health
    therapist_expert: Heart,
    fitness_nutrition_coach: Activity,
    sexuality_educator: Heart,

    // Legal & Professional
    legal_generalist: Scale,

    // Productivity & Career
    productivity_helper: TrendingUp,
    career_advisor: Briefcase,
    education_guide: GraduationCap,
    personality_trainer: Zap,

    // Sales & Commerce
    ebay_coach: Tag,

    // Education
    language_teacher: BookOpenCheck,

    // Expert & Uncensored
    uncensored_expert: Unlock,

    // Creative & Writing
    nsfw_roleplay: Theater,
    erotic_creative_author: Feather,
    poet_lyricist: Feather,
    songwriter: Music,
    "eternia-dm": RotateCcw,
    erotic_author: Feather,
    adult_roleplay_open: Theater,

    // Coaching & Support
    coach_life: Zap,
    coach_crisis: Shield,

    // Family & Community
    senior_advisor: Heart,
    parent_advisor: Users,
    neighbor_helper: Home,

    // Food & Lifestyle
    chef_foodie: Utensils,

    // Arts & Entertainment
    movie_tv_expert: Film,
    art_coach: Palette,

    // Relationships & Intimacy
    relationship_advisor_open: HeartHandshake,
    fetish_kink_guide: Lock,
  };

  // Try role-specific icon first
  const specificIcon = roleIconMap[role.id];
  if (specificIcon) {
    return specificIcon;
  }

  // Fallback to category-based mapping for unknown roles
  switch (role.category) {
    case "Creative":
      return Sparkles;
    case "Technical":
      return Code2;
    case "Analysis":
      return Brain;
    case "Research":
      return Book;
    case "Education":
      return BookOpenCheck;
    case "Business":
      return DollarSign;
    case "Entertainment":
      return Smile;
    case "Assistance":
      return User;
    case "Spezial":
      return Bot;
    default:
      return Users; // Universal fallback
  }
}

export function EnhancedRolesInterface({ className }: EnhancedRolesInterfaceProps) {
  const { roles, activeRole, setActiveRole, rolesLoading, roleLoadError } = useRoles(); // Added roleLoadError
  const { isRoleFavorite, toggleRoleFavorite, trackRoleUsage, usage } = useFavorites();
  const { settings } = useSettings();

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
    sortBy: "category",
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

  const handleSelectRole = useCallback(
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
    },
    [setActiveRole, trackRoleUsage],
  );

  // const handleStartChat = useCallback(() => {
  //   void navigate("/chat");
  // }, [navigate]);

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

  const headerTheme = selectedCategory
    ? getCategoryStyle(selectedCategory)
    : getCategoryStyle("Entertainment"); // Use "Entertainment" (Pink) as default since it matches "accent-roles"

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header Zone - Vibrant Glass */}
      <div className="flex-none sticky top-0 z-sticky-content pt-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-bg-app/80 shadow-lg backdrop-blur-xl">
          {/* Ambient Header Glow - Roles accent (Pink) or Selected Category */}
          <div
            className="absolute inset-0 opacity-90 pointer-events-none transition-all duration-500"
            style={{ background: headerTheme.roleGradient }}
          />

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
              <div
                onClick={() =>
                  setFilters((prev) => ({ ...prev, showFavoritesOnly: !prev.showFavoritesOnly }))
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFilters((prev) => ({ ...prev, showFavoritesOnly: !prev.showFavoritesOnly }));
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer",
                  filters.showFavoritesOnly
                    ? "bg-status-warning/10 border-status-warning/30 text-status-warning"
                    : "bg-surface-1 border-white/5 text-ink-secondary hover:border-white/10",
                )}
              >
                <Star className={cn("h-3.5 w-3.5", filters.showFavoritesOnly && "fill-current")} />
                Favoriten
              </div>

              <div className="w-px h-4 bg-white/10 flex-shrink-0" />

              {/* Category Filters */}
              {CATEGORY_ORDER.map((cat) => {
                const isSelected = selectedCategory === cat;
                const catTheme = getCategoryStyle(cat);
                return (
                  <div
                    key={cat}
                    onClick={() => setSelectedCategory((prev) => (prev === cat ? null : cat))}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedCategory((prev) => (prev === cat ? null : cat));
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer",
                      isSelected
                        ? cn(catTheme.bg, catTheme.border, catTheme.text, catTheme.glow)
                        : "bg-surface-1 border-white/5 text-ink-secondary hover:border-white/10",
                    )}
                  >
                    {cat}
                  </div>
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
          <div className="space-y-2">
            {filteredRoles.map((role) => {
              const isActive = activeRole?.id === role.id;
              const isExpanded = expandedRoles.has(role.id);
              const isFavorite = isRoleFavorite(role.id);
              const theme = getCategoryStyle(role.category);
              const RoleIcon = getRoleIcon(role);

              return (
                <div
                  key={role.id}
                  data-testid="role-card"
                  className={cn(
                    "rounded-xl border transition-all duration-200",
                    "bg-surface-1/60 border-white/8 hover:bg-surface-2/50 hover:border-white/12",
                    isActive && cn("border-accent-roles bg-accent-roles/10", theme.glow),
                  )}
                >
                  {/* Main Row */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => handleSelectRole(role)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectRole(role);
                      }
                    }}
                    aria-label={`Rolle ${role.name} auswählen`}
                    aria-pressed={isActive}
                  >
                    {/* Icon/Avatar */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                        isFavorite ? "bg-status-warning/20 text-status-warning" : theme.iconBg,
                      )}
                    >
                      {isFavorite ? (
                        <Star className="w-5 h-5 fill-current" />
                      ) : (
                        <RoleIcon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Title & Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={cn(
                            "font-medium text-ink-primary truncate text-base",
                            isActive && theme.text,
                          )}
                          title={role.name}
                        >
                          {role.name}
                        </h3>
                        {isActive && (
                          <Badge
                            variant="secondary"
                            className={cn("text-[10px]", theme.badge, theme.badgeText)}
                          >
                            Aktiv
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-ink-secondary truncate" title={role.category}>
                        {role.category || "Spezial"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        aria-label={
                          isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRoleFavorite(role.id);
                        }}
                      >
                        <Star
                          className={cn(
                            "w-4 h-4",
                            isFavorite && "fill-current text-status-warning",
                            !isFavorite && "text-ink-secondary",
                          )}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-9 w-9 transition-transform", isExpanded && "rotate-180")}
                        aria-label="Details anzeigen"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRoleExpansion(role.id);
                        }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-3">
                      <p className="text-sm text-ink-secondary">{role.description}</p>
                      {role.tags && role.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {role.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
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
