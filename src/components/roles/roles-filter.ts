import type { EnhancedRole, FilterState } from "../../types/enhanced-interfaces";

export function roleFilterFn(
  role: EnhancedRole,
  filters: FilterState,
  searchQuery: string,
  isRoleFavorite: (id: string) => boolean,
  usage: any,
  selectedCategory: string | null,
): boolean {
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    if (
      !role.name.toLowerCase().includes(query) &&
      !role.description?.toLowerCase().includes(query) &&
      !role.tags?.some((tag) => tag.toLowerCase().includes(query)) &&
      !role.category?.toLowerCase().includes(query)
    ) {
      return false;
    }
  }

  if (selectedCategory && role.category !== selectedCategory) {
    return false;
  }

  if (filters.showFavoritesOnly && !isRoleFavorite(role.id)) {
    return false;
  }

  if (filters.showBuiltInOnly && !role.metadata?.isBuiltIn) {
    return false;
  }

  if (filters.showRecentlyUsed && (usage.roles[role.id]?.count || 0) === 0) {
    return false;
  }

  // WCAG: Filter mature content for age-appropriate display
  if (filters.hideMatureContent) {
    const hasMatureTag = role.tags?.includes("mature");
    const hasAdultRating = (role as any).ageRating === "18+";
    if (hasMatureTag || hasAdultRating) {
      return false;
    }
  }

  return true;
}

export function roleSortFn(
  a: EnhancedRole,
  b: EnhancedRole,
  filters: FilterState,
  usage: any,
): number {
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
}
