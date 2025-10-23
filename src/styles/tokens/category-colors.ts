/**
 * Category Color System
 *
 * Implements a subtle, accessible category color system for card lists.
 * Uses HSL variables with low saturation (14-22%) and consistent luminance (52-58%)
 * for accessible contrast while maintaining visual hierarchy.
 *
 * Color Distribution Strategy:
 * - Hues are spread wide apart (minimum 40° separation) to avoid rainbow effect
 * - Each category gets 4 semantic tokens: base HSL + derived colors
 * - Alpha compositing for subtle surface tints and borders
 */

export const categoryColorTokens = {
  // Category Base HSL Values
  // Each category defines H, S, L separately for maximum flexibility
  alltag: {
    h: "30", // Warm amber/honey tone
    s: "18%", // Low saturation for subtlety
    l: "55%", // Balanced luminance
  },
  business: {
    h: "210", // Steel blue - professional
    s: "20%",
    l: "56%",
  },
  kreativ: {
    h: "275", // Violet - creative energy
    s: "20%",
    l: "55%",
  },
  bildung: {
    h: "195", // Cyan-blue - knowledge/learning
    s: "18%",
    l: "56%",
  },
  familie: {
    h: "5", // Coral - warm family feeling
    s: "16%",
    l: "56%",
  },
  beratung: {
    h: "145", // Green - growth/advice
    s: "18%",
    l: "55%",
  },
  "model-premium": {
    h: "230", // Indigo - premium tech
    s: "20%",
    l: "55%",
  },
  "model-alltag": {
    h: "12", // Honey - everyday utility
    s: "18%",
    l: "55%",
  },
} as const;

/**
 * Generates CSS custom properties for category colors
 * Creates semantic tokens for each category:
 * - --cat-{key}-h/s/l: Base HSL components
 * - --cat-{key}-fg: Text/icon color (darkened for contrast)
 * - --cat-{key}-border: Border color with alpha
 * - --cat-{key}-tint: Surface tint with low alpha
 */
export function generateCategoryTokens() {
  const tokens: Record<string, string> = {};

  Object.entries(categoryColorTokens).forEach(([key, { h, s, l }]) => {
    // Base HSL components
    tokens[`--cat-${key}-h`] = h;
    tokens[`--cat-${key}-s`] = s;
    tokens[`--cat-${key}-l`] = l;

    // Derived semantic tokens
    // Text/icon color: darkened for better contrast (22% darker)
    tokens[`--cat-${key}-fg`] = `hsl(${h} ${s} calc(${l} - 22%) / 0.92)`;

    // Border color: medium alpha for subtle definition
    tokens[`--cat-${key}-border`] = `hsl(${h} ${s} ${l} / 0.35)`;

    // Surface tint: very low alpha for background wash
    tokens[`--cat-${key}-tint`] = `hsl(${h} ${s} ${l} / 0.06)`;

    // Badge background: slightly higher alpha for visibility
    tokens[`--cat-${key}-badge-bg`] = `hsl(${h} ${s} ${l} / 0.18)`;

    // Focus ring: medium-high alpha for accessibility
    tokens[`--cat-${key}-focus`] = `hsl(${h} ${s} ${l} / 0.55)`;

    // Icon dot: pure saturation with transparency
    tokens[`--cat-${key}-dot`] = `hsl(${h} ${s} ${l} / 0.75)`;
  });

  return tokens;
}

/**
 * CSS Custom Properties for Dark Theme
 * All category tokens are defined here for the dark theme context
 */
export const categoryTokensCSS = `
:root[data-theme="dark"] {
${Object.entries(generateCategoryTokens())
  .map(([property, value]) => `  ${property}: ${value};`)
  .join("\n")}
}

/* Category data attribute selectors */
/* Inject HSL variables for each category */
${Object.keys(categoryColorTokens)
  .map(
    (key) => `
[data-cat="${key}"] {
  --h: var(--cat-${key}-h);
  --s: var(--cat-${key}-s);
  --l: var(--cat-${key}-l);
}`,
  )
  .join("")}

/* Base category styling utilities */
.category-border {
  border-color: hsl(var(--h) var(--s) var(--l) / 0.35);
}

.category-tint {
  background: linear-gradient(0deg, hsl(var(--h) var(--s) var(--l) / 0.06), transparent);
}

.category-badge {
  color: hsl(var(--h) var(--s) calc(var(--l) - 22%) / 0.92);
  background: hsl(var(--h) var(--s) var(--l) / 0.18);
}

.category-focus {
  outline: 2px solid hsl(var(--h) var(--s) var(--l) / 0.55);
  outline-offset: 2px;
}

.category-dot {
  background: hsl(var(--h) var(--s) var(--l) / 0.75);
}
`;

/**
 * Category Key Type
 * Union type of all available category keys for type safety
 */
export type CategoryKey = keyof typeof categoryColorTokens;

/**
 * Available category keys as constant array
 */
export const CATEGORY_KEYS = Object.keys(categoryColorTokens) as CategoryKey[];
