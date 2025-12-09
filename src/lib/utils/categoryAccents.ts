/**
 * Category-to-Accent Color Mapping
 *
 * Provides type-safe mapping of role and theme categories to Tailwind accent colors.
 * All accent colors defined in tailwind.config.ts
 */

import type { QuickstartCategory } from "@/config/quickstarts";
import { ACCENT_VARIANTS } from "@/styles/theme-variants";

// ============================================================================
// ROLE CATEGORY TYPES
// ============================================================================

export type RoleCategory =
  | "Assistance"
  | "Creative"
  | "Technical"
  | "Analysis"
  | "Research"
  | "Education"
  | "Business"
  | "Entertainment"
  | "Spezial";

// ============================================================================
// ACCENT NAME TYPES
// ============================================================================

export type AccentName =
  | "chat"
  | "models"
  | "roles"
  | "settings"
  | "wissenschaft"
  | "realpolitik"
  | "hypothetisch"
  | "kultur"
  | "verschwörung"
  | "technical"
  | "business"
  | "creative"
  | "assistance"
  | "analysis"
  | "research"
  | "education"
  | "entertainment";

// ============================================================================
// ROLE CATEGORY MAPPING
// ============================================================================

const ROLE_CATEGORY_ACCENT_MAP: Record<RoleCategory, AccentName> = {
  Assistance: "assistance",
  Creative: "creative",
  Technical: "technical",
  Analysis: "analysis",
  Research: "research",
  Education: "education",
  Business: "business",
  Entertainment: "entertainment",
  Spezial: "roles", // Fallback to generic roles accent
};

/**
 * Maps a role category to its corresponding accent color name
 * @param category - Role category (e.g., "Technical", "Creative")
 * @returns Accent name for use in Tailwind classes
 *
 * @example
 * const accent = getRoleCategoryAccent("Technical");
 * // Returns: "technical"
 * // Use in className: `bg-accent-${accent}-surface`
 */
export function getRoleCategoryAccent(category?: string): AccentName {
  if (!category) return "roles";
  return ROLE_CATEGORY_ACCENT_MAP[category as RoleCategory] || "roles";
}

// ============================================================================
// THEME CATEGORY MAPPING
// ============================================================================

const THEME_CATEGORY_ACCENT_MAP: Record<QuickstartCategory, AccentName> = {
  wissenschaft: "wissenschaft",
  realpolitik: "realpolitik",
  hypothetisch: "hypothetisch",
  kultur: "kultur",
  verschwörungstheorien: "verschwörung",
};

/**
 * Maps a theme/discussion category to its corresponding accent color name
 * @param category - Theme category (e.g., "wissenschaft", "realpolitik")
 * @returns Accent name for use in Tailwind classes
 *
 * @example
 * const accent = getThemeCategoryAccent("wissenschaft");
 * // Returns: "wissenschaft"
 * // Use in className: `bg-accent-${accent}-dim`
 */
export function getThemeCategoryAccent(category?: QuickstartCategory): AccentName {
  if (!category) return "chat";
  return THEME_CATEGORY_ACCENT_MAP[category] || "chat";
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates Tailwind classes for a category-specific card
 * @param category - Category name (role or theme)
 * @param type - Type of category ('role' | 'theme')
 * @returns Object with pre-composed Tailwind class strings
 *
 * @example
 * const classes = getCategoryCardClasses("Technical", "role");
 * // Returns:
 * // {
 * //   surface: "bg-accent-technical-surface",
 * //   border: "border-accent-technical-border",
 * //   glow: "shadow-glow-technical",
 * //   text: "text-accent-technical"
 * // }
 */
export function getCategoryCardClasses(
  category: string | undefined,
  type: "role" | "theme",
): {
  surface: string;
  border: string;
  glow: string;
  text: string;
  dim: string;
} {
  const accent =
    type === "role"
      ? getRoleCategoryAccent(category)
      : getThemeCategoryAccent(category as QuickstartCategory);

  const variants = ACCENT_VARIANTS[accent] || ACCENT_VARIANTS.chat;

  return {
    surface: variants.surface,
    border: variants.border,
    glow: variants.glow,
    text: variants.text,
    dim: variants.dim,
  };
}

/**
 * Gets the primary accent color name for a category
 * Works for both role and theme categories
 * @param category - Category string
 * @param fallback - Fallback accent if category not found
 * @returns Accent name
 */
export function getCategoryAccent(
  category: string | undefined,
  fallback: AccentName = "chat",
): AccentName {
  if (!category) return fallback;

  // Try role category first
  if (category in ROLE_CATEGORY_ACCENT_MAP) {
    return ROLE_CATEGORY_ACCENT_MAP[category as RoleCategory];
  }

  // Try theme category
  if (category in THEME_CATEGORY_ACCENT_MAP) {
    return THEME_CATEGORY_ACCENT_MAP[category as QuickstartCategory];
  }

  return fallback;
}

/**
 * Gets the full accent variant object for a given accent name.
 * Safe to use for static analysis as it relies on the static ACCENT_VARIANTS map.
 */
export function getAccentVariants(accent: AccentName) {
  return ACCENT_VARIANTS[accent] || ACCENT_VARIANTS.chat;
}
