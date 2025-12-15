import type { EnhancedRole, FilterState } from "../../types/enhanced-interfaces";

// Role category order for filters and sorting
export const CATEGORY_ORDER = [
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
    case "category": {
      // Sort by defined category order
      const catA = a.category || "Spezial";
      const catB = b.category || "Spezial";

      const indexA = CATEGORY_ORDER.indexOf(catA as any);
      const indexB = CATEGORY_ORDER.indexOf(catB as any);

      // If categories have different indices, sort by index
      if (indexA !== -1 && indexB !== -1 && indexA !== indexB) {
        return direction * (indexA - indexB);
      }

      // Handle known vs unknown categories (put unknown at end)
      if (indexA !== -1 && indexB === -1) return -direction;
      if (indexA === -1 && indexB !== -1) return direction;

      // Fallback to alphabetical for same category or both unknown
      return direction * catA.localeCompare(catB);
    }
    default:
      return 0;
  }
}
