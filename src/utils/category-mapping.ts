/**
 * Category Mapping Utility
 *
 * Provides robust normalization from category labels to color keys.
 * Handles various input formats: German labels, English variants, legacy keys.
 * Designed to be fault-tolerant with fallback to 'alltag' for unmapped categories.
 */

import type { CategoryKey } from "../styles/tokens/category-colors";

/**
 * Primary category mapping from display labels to normalized keys
 * Supports both German and English variants for international compatibility
 */
export const CATEGORY_MAP = {
  // German labels (primary)
  Alltag: "alltag",
  "Business & Karriere": "business",
  Business: "business",
  Karriere: "business",
  "Kreativ & Unterhaltung": "kreativ",
  Kreativ: "kreativ",
  Unterhaltung: "kreativ",
  Entertainment: "kreativ",
  "Lernen & Bildung": "bildung",
  Lernen: "bildung",
  Bildung: "bildung",
  Education: "bildung",
  "Leben & Familie": "familie",
  Leben: "familie",
  Familie: "familie",
  Family: "familie",
  Life: "familie",
  Beratung: "beratung",
  "Beratung & Experten": "beratung",
  Experten: "beratung",
  Consulting: "beratung",
  Expert: "beratung",
  Advice: "beratung",

  // Model categories
  "Modell: Premium": "model-premium",
  Premium: "model-premium",
  "Premium Models": "model-premium",
  "Modell: Alltag": "model-alltag",
  Standard: "model-alltag",
  "Standard Models": "model-alltag",
  Basic: "model-alltag",

  // English variants for international use
  Daily: "alltag",
  Everyday: "alltag",
  Creative: "kreativ",
  "Creative & Entertainment": "kreativ",
  Learning: "bildung",
  "Learning & Education": "bildung",
  "Business & Career": "business",
  Professional: "business",

  // Existing discussion categories (maintain compatibility)
  curiosity: "bildung", // Maps to education/learning
  future: "kreativ", // Maps to creative
  society: "beratung", // Maps to consulting/advice
  general: "alltag", // Maps to everyday

  // Technical/development categories
  Tech: "model-premium",
  Technology: "model-premium",
  Development: "model-premium",
  AI: "model-premium",
  Programming: "model-premium",
} as const;

/**
 * Inverse mapping for getting display labels from keys
 * Used for displaying human-readable category names
 */
export const KEY_TO_LABEL_MAP = {
  alltag: "Alltag",
  business: "Business & Karriere",
  kreativ: "Kreativ & Unterhaltung",
  bildung: "Lernen & Bildung",
  familie: "Leben & Familie",
  beratung: "Beratung",
  "model-premium": "Modell: Premium",
  "model-alltag": "Modell: Alltag",
} as const;

/**
 * Category icons mapping for visual representation
 * Provides contextual emoji icons for each category
 */
export const CATEGORY_ICONS = {
  alltag: "🏠",
  business: "💼",
  kreativ: "🎨",
  bildung: "📚",
  familie: "👨‍👩‍👧‍👦",
  beratung: "💡",
  "model-premium": "⭐",
  "model-alltag": "🔧",
} as const;

/**
 * Normalizes a category label to a category key
 * Performs case-insensitive matching with trimming and fallback
 *
 * @param category - The category label to normalize (can be undefined/null)
 * @returns CategoryKey - Always returns a valid category key
 *
 * @example
 * normalizeCategoryKey('Business & Karriere') // 'business'
 * normalizeCategoryKey('creative') // 'kreativ'
 * normalizeCategoryKey('Unknown Category') // 'alltag' (fallback)
 * normalizeCategoryKey(null) // 'alltag' (fallback)
 */
export function normalizeCategoryKey(category: string | undefined | null): CategoryKey {
  if (!category) {
    return "alltag";
  }

  // Trim whitespace and normalize
  const normalizedInput = category.trim();

  // Direct key match (if already normalized)
  if (isValidCategoryKey(normalizedInput)) {
    return normalizedInput as CategoryKey;
  }

  // Case-insensitive label mapping
  const mappedKey = Object.entries(CATEGORY_MAP).find(
    ([label]) => label.toLowerCase() === normalizedInput.toLowerCase(),
  )?.[1];

  return (mappedKey as CategoryKey) || "alltag";
}

/**
 * Type guard to check if a string is a valid CategoryKey
 *
 * @param key - String to check
 * @returns boolean - True if key is valid
 */
export function isValidCategoryKey(key: string): key is CategoryKey {
  return key in KEY_TO_LABEL_MAP;
}

/**
 * Gets the display label for a category key
 *
 * @param key - CategoryKey to get label for
 * @returns string - Human readable label
 *
 * @example
 * getCategoryLabel('business') // 'Business & Karriere'
 * getCategoryLabel('alltag') // 'Alltag'
 */
export function getCategoryLabel(key: CategoryKey): string {
  return KEY_TO_LABEL_MAP[key];
}

/**
 * Gets the icon for a category key
 *
 * @param key - CategoryKey to get icon for
 * @returns string - Emoji icon
 *
 * @example
 * getCategoryIcon('business') // '💼'
 * getCategoryIcon('kreativ') // '🎨'
 */
export function getCategoryIcon(key: CategoryKey): string {
  return CATEGORY_ICONS[key];
}

/**
 * Gets category data for a given input
 * Combines normalization with icon and label lookup
 *
 * @param category - Category input (any format)
 * @returns Object with key, label, and icon
 *
 * @example
 * getCategoryData('Business & Karriere')
 * // { key: 'business', label: 'Business & Karriere', icon: '💼' }
 */
export function getCategoryData(category: string | undefined | null) {
  const key = normalizeCategoryKey(category);
  return {
    key,
    label: getCategoryLabel(key),
    icon: getCategoryIcon(key),
  };
}

/**
 * Hook for category data with normalization
 * React hook version for component usage
 *
 * @param category - Category input
 * @returns Object with normalized category data
 */
export function useCategoryData(category: string | undefined | null) {
  return getCategoryData(category);
}

/**
 * Validates and suggests similar categories for typos/partial matches
 * Useful for debugging and form validation
 *
 * @param input - User input category
 * @returns Object with isValid flag and suggestions
 */
export function validateCategory(input: string) {
  const normalized = normalizeCategoryKey(input);
  const isExactMatch = input.trim() !== "" && normalized !== "alltag";

  // Simple similarity check for suggestions
  const suggestions = Object.keys(CATEGORY_MAP)
    .filter(
      (label) =>
        label.toLowerCase().includes(input.toLowerCase()) ||
        input.toLowerCase().includes(label.toLowerCase()),
    )
    .slice(0, 3);

  return {
    isValid: isExactMatch,
    normalizedKey: normalized,
    suggestions,
  };
}

/**
 * Available category keys as constant array for iteration
 */
export const CATEGORY_KEYS: readonly CategoryKey[] = [
  "alltag",
  "business",
  "kreativ",
  "bildung",
  "familie",
  "beratung",
  "model-premium",
  "model-alltag",
] as const;
