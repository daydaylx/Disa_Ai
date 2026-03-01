import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import {
  Badge,
  BottomSheet,
  Button,
  CardSkeleton,
  EmptyState,
  FilterSkeleton,
  HeaderSkeleton,
  ListRow,
} from "@/ui";

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
  const navigate = useNavigate();

  // Local state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

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
    "",
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

  const hasActiveFilters = selectedCategory || filters.showFavoritesOnly;
  const selectedRole = useMemo(
    () => filteredRoles.find((role) => role.id === selectedRoleId) ?? null,
    [filteredRoles, selectedRoleId],
  );

  const clearFilters = () => {
    setSelectedCategory(null);
    setFilters((prev) => ({ ...prev, showFavoritesOnly: false }));
  };

  // Conditional rendering for loading and error states
  if (rolesLoading) {
    return (
      <div className="flex flex-col h-full p-xsspace-y-xs">
        <HeaderSkeleton />
        <FilterSkeleton count={4} />
        <CardSkeleton count={6} />
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
      <div className="flex-none pt-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-bg-app/80 shadow-lg backdrop-blur-xl">
          <div
            className="absolute inset-0 opacity-90 pointer-events-none transition-all duration-500"
            style={{ background: headerTheme.roleGradient }}
          />

          <div className="relative space-y-3 px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-ink-secondary">
                {filteredRoles.length} von {roles.length} Rollen verfügbar
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 text-xs text-ink-tertiary hover:text-ink-primary"
                >
                  <RotateCcw className="h-3 w-3 mr-1" /> Reset
                </Button>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, showFavoritesOnly: !prev.showFavoritesOnly }))
                  }
                  aria-pressed={filters.showFavoritesOnly}
                  className={cn(
                    "inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                    filters.showFavoritesOnly
                      ? "bg-status-warning/10 border-status-warning/30 text-status-warning"
                      : "bg-surface-1 border-white/5 text-ink-secondary hover:border-white/10",
                  )}
                >
                  <Star
                    className={cn("h-3.5 w-3.5", filters.showFavoritesOnly && "fill-current")}
                  />
                  Favoriten
                </button>

                <div className="w-px h-4 bg-white/10 flex-shrink-0" />

                {CATEGORY_ORDER.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const catTheme = getCategoryStyle(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setSelectedCategory((prev) => (prev === cat ? null : cat))}
                      aria-pressed={isSelected}
                      className={cn(
                        "inline-flex min-h-[44px] items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
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
              <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-bg-app/90 to-transparent lg:hidden" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-bg-app/90 to-transparent lg:hidden" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Zone - Scrollable List */}
      <div className="flex-1 overflow-y-auto pb-page-bottom-safe pt-4">
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
          <div className="space-y-2xs">
            {filteredRoles.map((role) => {
              const isActive = activeRole?.id === role.id;
              const isFavorite = isRoleFavorite(role.id);
              const theme = getCategoryStyle(role.category);
              const RoleIcon = getRoleIcon(role);

              return (
                <ListRow
                  key={role.id}
                  data-testid="role-card"
                  aria-label={role.name}
                  title={role.name}
                  subtitle={role.category || "Spezial"}
                  active={isActive}
                  onPress={() => handleActivateRole(role)}
                  pressLabel={`Rolle ${role.name} auswählen`}
                  pressed={isActive}
                  accentClassName={theme.textBg}
                  className={cn(
                    isActive
                      ? cn("border-white/[0.14]", theme.border, theme.glow)
                      : "border-white/[0.08] hover:border-white/[0.14] hover:bg-surface-2/65",
                  )}
                  leading={
                    <div
                      className={cn(
                        "relative flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
                        isActive
                          ? cn(theme.iconBg, theme.iconText, "shadow-inner")
                          : cn(theme.iconBg, theme.iconText),
                      )}
                    >
                      <RoleIcon className="h-6 w-6" />
                    </div>
                  }
                  topRight={
                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <Badge
                          className={cn(
                            "h-5 px-2 text-[10px] shadow-sm",
                            theme.badge,
                            theme.badgeText,
                          )}
                        >
                          Aktiv
                        </Badge>
                      ) : null}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleRoleFavorite(role.id);
                        }}
                        aria-label={
                          isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
                        }
                        className={cn(
                          "relative flex h-11 w-11 items-center justify-center rounded-full border text-ink-tertiary transition-colors",
                          isFavorite
                            ? "border-status-warning/40 bg-status-warning/10 text-status-warning"
                            : "border-white/5 bg-surface-2/80 hover:border-white/10 hover:text-ink-primary",
                        )}
                      >
                        <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
                      </button>
                    </div>
                  }
                  trailing={
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedRoleId(role.id);
                      }}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-lg bg-transparent px-2 text-xs text-ink-tertiary transition-colors hover:bg-surface-2/70 hover:text-ink-primary"
                    >
                      Details
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      <BottomSheet
        open={!!selectedRole}
        onClose={() => setSelectedRoleId(null)}
        title={selectedRole?.name}
        description={selectedRole?.category || "Rollen-Details"}
        footer={
          selectedRole ? (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setSelectedRoleId(null)}
              >
                Schließen
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  handleActivateRole(selectedRole);
                  setSelectedRoleId(null);
                }}
              >
                {activeRole?.id === selectedRole.id ? "Aktiv" : "Aktivieren"}
              </Button>
            </div>
          ) : null
        }
      >
        {selectedRole ? (
          <div className="space-y-2xs rounded-xl border px-xspy-4">
            <p className="text-sm leading-relaxed text-ink-secondary">{selectedRole.description}</p>

            {selectedRole.tags && selectedRole.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 text-ink-tertiary">
                {selectedRole.tags.map((tag) => (
                  <Badge key={tag} className={cn("h-5 px-2 text-[10px]")}>
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}

            {selectedRole.systemPrompt ? (
              <div className="max-h-28 overflow-y-auto rounded-xl border border-white/5 bg-surface-1/50 p-2xsfont-mono text-xs text-ink-tertiary">
                {selectedRole.systemPrompt.slice(0, 220)}
                {selectedRole.systemPrompt.length > 220 ? "..." : ""}
              </div>
            ) : null}
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
