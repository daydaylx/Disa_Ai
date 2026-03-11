import { type CSSProperties, useCallback, useMemo, useState } from "react";
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
  RefreshCw,
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
  CatalogHeader,
  EmptyState,
  ListRow,
  PullToRefresh,
} from "@/ui";

import { useFavorites } from "../../contexts/FavoritesContext";
import { useRoles } from "../../contexts/RolesContext";
import { useFilteredList } from "../../hooks/useFilteredList";
import { type EnhancedRole, type FilterState, migrateRole } from "../../types/enhanced-interfaces";
import { CATEGORY_ORDER, roleFilterFn, roleSortFn } from "./roles-filter";

interface EnhancedRolesInterfaceProps {
  className?: string;
}

function getRoleIcon(role: EnhancedRole): LucideIcon {
  const roleIconMap: Record<string, LucideIcon> = {
    neutral: Users,
    email_professional: MessageSquare,
    sarcastic_direct: Smile,
    therapist_expert: Heart,
    fitness_nutrition_coach: Activity,
    sexuality_educator: Heart,
    legal_generalist: Scale,
    productivity_helper: TrendingUp,
    career_advisor: Briefcase,
    education_guide: GraduationCap,
    personality_trainer: Zap,
    ebay_coach: Tag,
    language_teacher: BookOpenCheck,
    uncensored_expert: Unlock,
    nsfw_roleplay: Theater,
    erotic_creative_author: Feather,
    poet_lyricist: Feather,
    songwriter: Music,
    erotic_author: Feather,
    adult_roleplay_open: Theater,
    coach_life: Zap,
    coach_crisis: Shield,
    senior_advisor: Heart,
    parent_advisor: Users,
    neighbor_helper: Home,
    chef_foodie: Utensils,
    movie_tv_expert: Film,
    art_coach: Palette,
    relationship_advisor_open: HeartHandshake,
    fetish_kink_guide: Lock,
  };

  const specificIcon = roleIconMap[role.id];
  if (specificIcon) {
    return specificIcon;
  }

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
      return Users;
  }
}

export function EnhancedRolesInterface({ className }: EnhancedRolesInterfaceProps) {
  const { roles, activeRole, setActiveRole, rolesLoading, roleLoadError, refreshRoles } =
    useRoles();
  const { isRoleFavorite, toggleRoleFavorite, trackRoleUsage, usage } = useFavorites();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    searchHistory: [],
    selectedCategories: [],
    excludedCategories: [],
    showFavoritesOnly: false,
    showRecentlyUsed: false,
    showBuiltInOnly: false,
    hideMatureContent: false,
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

  const enhancedRoles = useMemo(() => roles.map(migrateRole), [roles]);

  const filterFnCallback = useCallback(
    (role: EnhancedRole, currentFilters: FilterState, searchQuery: string) =>
      roleFilterFn(role, currentFilters, searchQuery, isRoleFavorite, usage, selectedCategory),
    [isRoleFavorite, usage, selectedCategory],
  );

  const sortFnCallback = useCallback(
    (a: EnhancedRole, b: EnhancedRole, currentFilters: FilterState) =>
      roleSortFn(a, b, currentFilters, usage),
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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshRoles();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshRoles]);

  const hasActiveFilters = !!selectedCategory || filters.showFavoritesOnly;
  const isLoading = rolesLoading || isRefreshing;

  const selectedRole = useMemo(
    () => filteredRoles.find((role) => role.id === selectedRoleId) ?? null,
    [filteredRoles, selectedRoleId],
  );

  const clearFilters = () => {
    setSelectedCategory(null);
    setFilters((prev) => ({ ...prev, showFavoritesOnly: false }));
  };

  const headerTheme = selectedCategory
    ? getCategoryStyle(selectedCategory)
    : getCategoryStyle(activeRole?.category ?? "Entertainment");

  const countLabel =
    rolesLoading && roles.length === 0
      ? "Rollen werden geladen…"
      : `${filteredRoles.length} von ${roles.length} Rollen verfügbar`;
  const highlightedRole = selectedRole ?? (activeRole ? migrateRole(activeRole) : null);
  const HighlightedRoleIcon = highlightedRole ? getRoleIcon(highlightedRole) : Users;

  return (
    <div className={cn("relative isolate flex h-full min-h-0 flex-col overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute -top-16 left-1/2 z-0 hidden h-64 w-64 -translate-x-1/2 rounded-full blur-3xl motion-safe:animate-pulse-glow sm:block"
        style={{
          background:
            "radial-gradient(circle, rgba(244,114,182,0.20) 0%, rgba(139,92,246,0.10) 50%, transparent 70%)",
          opacity: 0.35,
        }}
        aria-hidden="true"
      />
      <PullToRefresh
        onRefresh={handleRefresh}
        disabled={isLoading}
        className="relative z-10 flex-1 min-h-0"
      >
        <div className="flex min-h-full flex-col gap-4 px-4 pb-page-bottom-safe pt-4">
          <CatalogHeader
            className="shrink-0"
            title="Rollen & Personas"
            countLabel={countLabel}
            gradientStyle={headerTheme.roleGradient}
            eyebrow="Ton & Persönlichkeit"
            icon={<HighlightedRoleIcon className="h-5 w-5" />}
            description="Lege fest, wie Disa antwortet: sachlich, kreativ, direkt oder empathisch. Die aktive Rolle gibt neuen Gesprächen sofort einen klaren Stil."
            meta={
              <>
                <Badge className="rounded-full border-white/10 bg-white/[0.06] text-ink-primary">
                  Rollen prägen Stil, Tiefe und Tonfall
                </Badge>
                {activeRole?.category ? (
                  <Badge
                    className={cn(
                      "rounded-full border-white/10 bg-white/[0.06]",
                      getCategoryStyle(activeRole.category).badgeText,
                    )}
                  >
                    Aktiv: {activeRole.category}
                  </Badge>
                ) : null}
              </>
            }
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  void navigate("/chat");
                }}
                className="flex-1 sm:flex-none"
              >
                Mit Rolle chatten
              </Button>
            }
            secondaryAction={
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    void handleRefresh();
                  }}
                  disabled={isLoading}
                  className="text-ink-tertiary hover:text-ink-primary hover:bg-surface-2"
                  aria-label="Rollen aktualisieren"
                  title="Rollen neu laden"
                >
                  <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
                </Button>

                {hasActiveFilters ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="min-h-[44px] px-3 text-xs text-ink-tertiary hover:text-ink-primary"
                  >
                    <RotateCcw className="mr-1 h-3 w-3" /> Reset
                  </Button>
                ) : null}
              </div>
            }
            filterRow={
              <div className="relative">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        showFavoritesOnly: !prev.showFavoritesOnly,
                      }))
                    }
                    aria-pressed={filters.showFavoritesOnly}
                    className={cn(
                      "inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap active:scale-[0.96] active:translate-y-px",
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
                          "inline-flex min-h-[44px] items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap active:scale-[0.96] active:translate-y-px",
                          isSelected
                            ? cn(catTheme.bg, catTheme.border, catTheme.text)
                            : "bg-surface-1 border-white/5 text-ink-secondary hover:border-white/10",
                        )}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
                <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-bg-app/90 to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-bg-app/90 to-transparent" />
              </div>
            }
          />

          {rolesLoading && roles.length === 0 ? (
            <CardSkeleton count={6} />
          ) : roleLoadError ? (
            <EmptyState
              icon={<Users className="h-8 w-8 text-ink-muted" />}
              title="Fehler beim Laden der Rollen"
              description={roleLoadError}
              className="rounded-2xl border border-status-error/25 bg-status-error/10 text-status-error"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void handleRefresh();
                  }}
                >
                  Erneut versuchen
                </Button>
              }
            />
          ) : filteredRoles.length === 0 ? (
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
            <div className="space-y-2 animate-fade-in">
              {filteredRoles.map((role, index) => {
                const isActive = activeRole?.id === role.id;
                const isFavorite = isRoleFavorite(role.id);
                const theme = getCategoryStyle(role.category);
                const RoleIcon = getRoleIcon(role);

                return (
                  <ListRow
                    key={role.id}
                    surfaceVariant="catalogGlass"
                    className={cn(
                      "stagger-item",
                      isActive
                        ? cn("border-white/[0.18]", theme.border, theme.bg, theme.glow)
                        : cn(
                            "border-white/[0.08]",
                            theme.hoverBorder,
                            theme.hoverBg,
                            theme.hoverGlow,
                          ),
                    )}
                    style={{ "--stagger-i": Math.min(index, 5) } as CSSProperties}
                    data-testid="role-card"
                    aria-label={role.name}
                    title={role.name}
                    wrapTitle={true}
                    subtitle={role.category || "Spezial"}
                    active={isActive}
                    onPress={() => handleActivateRole(role)}
                    pressLabel={`Rolle ${role.name} auswählen`}
                    pressed={isActive}
                    accentClassName={theme.textBg}
                    leading={
                      <div
                        className={cn(
                          "relative flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
                          isActive
                            ? cn(theme.iconBg, theme.iconText, "shadow-inner")
                            : cn(
                                theme.iconBg,
                                theme.iconText,
                                theme.groupHoverIconBg,
                                theme.groupHoverIconText,
                              ),
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
                              "h-6 rounded-full border px-2.5 text-[10px] font-semibold shadow-[0_14px_28px_-20px_rgba(255,255,255,0.55)] backdrop-blur-sm",
                              theme.badge,
                              theme.badgeText,
                              theme.border,
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
                            "relative flex h-11 w-11 items-center justify-center rounded-full border text-ink-tertiary shadow-inner backdrop-blur-sm transition-colors",
                            isFavorite
                              ? "border-status-warning/40 bg-status-warning/10 text-status-warning"
                              : "border-white/[0.06] bg-black/20 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-ink-primary",
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
                        aria-label={`Details zu ${role.name} anzeigen`}
                        title={`Details zu ${role.name} anzeigen`}
                        className="inline-flex min-h-[48px] min-w-[120px] shrink-0 items-center justify-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.07] px-4 text-xs font-semibold text-ink-primary shadow-[0_12px_26px_-20px_rgba(0,0,0,0.82)] backdrop-blur-sm transition-all hover:border-white/[0.18] hover:bg-white/[0.12] active:scale-[0.98] active:translate-y-px"
                      >
                        Details
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      <p className="line-clamp-2 text-sm font-medium leading-relaxed text-ink-secondary">
                        {role.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-tertiary">
                        {role.tags?.length ? (
                          <span
                            className={cn(
                              "rounded-full border px-2 py-1",
                              theme.border,
                              theme.badgeText,
                            )}
                          >
                            {role.tags.slice(0, 2).join(" · ")}
                          </span>
                        ) : null}
                        {role.allowedModels?.length ? (
                          <span className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-1">
                            {role.allowedModels[0] === "*" ? "Alle Modelle" : "Modelle begrenzt"}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </ListRow>
                );
              })}
            </div>
          )}
        </div>
      </PullToRefresh>

      <BottomSheet
        open={!!selectedRole}
        onClose={() => setSelectedRoleId(null)}
        title={selectedRole?.name}
        wrapTitle={true}
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
          <div className="space-y-4 rounded-2xl border px-4 py-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-tertiary">
                Überblick
              </p>
              <p className="text-sm leading-relaxed text-ink-secondary">
                {selectedRole.description}
              </p>
            </div>

            {selectedRole.category ? (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-tertiary">
                  Kategorie
                </p>
                <p className="text-sm text-ink-secondary">{selectedRole.category}</p>
              </div>
            ) : null}

            {selectedRole.tags && selectedRole.tags.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-tertiary">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2 text-ink-tertiary">
                  {selectedRole.tags.map((tag) => (
                    <Badge key={tag} size="sm" className="min-h-[28px] rounded-full px-2.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedRole.allowedModels?.length ? (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-tertiary">
                  Verfügbare Modelle
                </p>
                <p className="text-sm text-ink-secondary">
                  {selectedRole.allowedModels[0] === "*"
                    ? "Alle Modelle verfügbar"
                    : `${selectedRole.allowedModels.length} Modell${selectedRole.allowedModels.length !== 1 ? "e" : ""} verfügbar`}
                </p>
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-tertiary">
                System Prompt
              </p>
              {selectedRole.systemPrompt ? (
                <div className="max-h-72 overflow-y-auto rounded-xl border border-white/5 bg-surface-1/50 px-3 py-3 font-mono text-xs leading-relaxed text-ink-secondary whitespace-pre-wrap break-words">
                  {selectedRole.systemPrompt}
                </div>
              ) : (
                <p className="text-sm italic text-ink-tertiary">
                  Für diese Rolle ist kein Systemprompt hinterlegt.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
