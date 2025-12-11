import type { EnhancedRole, FilterState } from "../../types/enhanced-interfaces";

// Category order for consistent grouping (matching CATEGORY_ORDER in EnhancedRolesInterface.tsx)
const CATEGORY_ORDER = [
  "Alltag",
  "Business & Karriere",
  "Kreativ & Unterhaltung",
  "Lernen & Bildung",
  "Leben & Familie",
  "Experten & Beratung",
  "Erwachsene",
  "Spezial",
] as const;

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
    const tags = (role.tags || []).map((t) => t.toLowerCase());
    const nsfwTags = ["mature", "nsfw", "adult", "erotic", "kink", "fetish", "18+", "bdsm"]; // conservative blocklist
    const hasBlockedTag = tags.some((tag) => nsfwTags.includes(tag));
    const hasAdultRating =
      typeof (role as any).ageRating === "string" &&
      ((role as any).ageRating as string).toLowerCase().includes("18");
    if (hasBlockedTag || hasAdultRating) {
      return false;
    }
  }

  return true;
}

// Helper function to get category order index
function getCategoryIndex(category: string | undefined): number {
  if (!category) return CATEGORY_ORDER.length; // Put uncategorized items at the end
  const index = CATEGORY_ORDER.indexOf(category as any);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

export function roleSortFn(
  a: EnhancedRole,
  b: EnhancedRole,
  filters: FilterState,
  usage: any,
): number {
  const direction = filters.sortDirection === "asc" ? 1 : -1;

  switch (filters.sortBy) {
    case "name": {
      // First sort by category, then by name within each category
      const categoryComparison = getCategoryIndex(a.category) - getCategoryIndex(b.category);
      if (categoryComparison !== 0) return categoryComparison;
      return direction * a.name.localeCompare(b.name);
    }
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
    case "category": {
      // Sort by category order, then by name within each category
      const categoryComparison = getCategoryIndex(a.category) - getCategoryIndex(b.category);
      if (categoryComparison !== 0) return direction * categoryComparison;
      return a.name.localeCompare(b.name);
    }
    default:
      return 0;
  }
}
