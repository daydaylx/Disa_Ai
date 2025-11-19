// Main Enhanced Roles Interface Component
export function EnhancedRolesInterface({ className }: EnhancedRolesInterfaceProps) {
  const { push } = useToasts();
  const { roles, activeRole, setActiveRole } = useStudio();
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

  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // Convert legacy roles to enhanced roles
  const enhancedRoles = useMemo(() => {
    return roles.map(migrateRole);
  }, [roles]);

  useEffect(() => {
    if (roles.length > 0) {
      setIsLoadingRoles(false);
    }
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

  if (isLoadingRoles) {
    return (
      <div className={`flex flex-col h-full bg-bg-1 ${className || ""}`}>
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full rounded-full" /> {/* Search bar skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-full" /> {/* Filter chip skeleton */}
            <Skeleton className="h-9 w-24 rounded-full" /> {/* Filter chip skeleton */}
            <Skeleton className="h-9 w-24 rounded-full" /> {/* Filter chip skeleton */}
          </div>
          <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-full" /> // Category pill skeleton
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[180px] w-full" /> // Role card skeleton
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-surface-base ${className || ""}`}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b border-line bg-surface-glass/80 backdrop-blur-md">
        <div className="p-4 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <Input
              placeholder="Rollen durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-transparent bg-surface-muted/70 pl-11 pr-4 py-3 text-base focus:bg-surface-base focus:border-accent"
            />
          </div>

          {/* Filter Chips */}
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

        {/* Category Pills */}
        <div className="px-4 pb-4 pt-2">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORY_ORDER.filter((cat) => (categoryCounts[cat] || 0) > 0).map((category) => (
              <FilterChip
                key={category}
                selected={selectedCategory === category}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      {/* Roles List */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
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
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            data-testid="role-card-grid"
          >
            {filteredRoles.map((role) => (
              <GlassCard
                key={role.id}
                className="p-4 transition-all duration-200 min-h-[180px]"
                onClick={() => handleActivateRole(role)}
              >
                <h3 className="font-semibold text-text-primary text-base flex-1 min-w-0 pr-2">
                  <span className="truncate inline-block max-w-full" title={role.name}>
                    {role.name}
                  </span>
                </h3>
                <p className="text-sm text-text-secondary" title={role.description}>
                  {role.description}
                </p>
              </GlassCard>
            ))}
          </div>

          {filteredRoles.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface-muted flex items-center justify-center">
                <Users className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-3">Keine Rollen gefunden</h3>
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
