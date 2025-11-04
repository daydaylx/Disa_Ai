/**
 * Category Tonal Scales
 *
 * Implements subtle, accessible tonal scales for category colors.
 * Creates HSL-based scales from 50 (lightest) to 900 (darkest) for each category.
 * Uses carefully calculated luminance values to ensure accessibility while
 * maintaining visual distinction between categories.
 *
 * Each category gets a scale that:
 * - Maintains low saturation (12-20%) to avoid "rainbow soup"
 * - Provides sufficient contrast for text readability (AA compliance)
 * - Has harmonious relationships between light/dark variants
 * - Preserves hue consistency across the scale
 */

export const categoryTonalScales = {
  // Alltag (Everyday) - Warm amber
  alltag: {
    50: { h: 30, s: "12%", l: "96%" }, // Very light amber
    100: { h: 30, s: "14%", l: "92%" }, // Light amber
    200: { h: 30, s: "16%", l: "85%" }, // Lighter amber
    300: { h: 30, s: "18%", l: "75%" }, // Light-amber
    400: { h: 30, s: "20%", l: "65%" }, // Mid-light amber
    500: { h: 30, s: "18%", l: "55%" }, // Base amber
    600: { h: 30, s: "20%", l: "45%" }, // Mid-dark amber
    700: { h: 30, s: "22%", l: "38%" }, // Darker amber
    800: { h: 30, s: "24%", l: "30%" }, // Dark amber
    900: { h: 30, s: "26%", l: "22%" }, // Very dark amber
  },

  // Business (Professional) - Steel blue
  business: {
    50: { h: 210, s: "12%", l: "96%" }, // Very light blue
    100: { h: 210, s: "14%", l: "92%" }, // Light blue
    200: { h: 210, s: "16%", l: "85%" }, // Lighter blue
    300: { h: 210, s: "18%", l: "75%" }, // Light-blue
    400: { h: 210, s: "20%", l: "65%" }, // Mid-light blue
    500: { h: 210, s: "18%", l: "56%" }, // Base blue
    600: { h: 210, s: "20%", l: "46%" }, // Mid-dark blue
    700: { h: 210, s: "22%", l: "38%" }, // Darker blue
    800: { h: 210, s: "24%", l: "30%" }, // Dark blue
    900: { h: 210, s: "26%", l: "22%" }, // Very dark blue
  },

  // Kreativ (Creative) - Violet
  kreativ: {
    50: { h: 275, s: "12%", l: "96%" }, // Very light violet
    100: { h: 275, s: "14%", l: "92%" }, // Light violet
    200: { h: 275, s: "16%", l: "85%" }, // Lighter violet
    300: { h: 275, s: "18%", l: "75%" }, // Light-violet
    400: { h: 275, s: "20%", l: "65%" }, // Mid-light violet
    500: { h: 275, s: "20%", l: "55%" }, // Base violet
    600: { h: 275, s: "22%", l: "45%" }, // Mid-dark violet
    700: { h: 275, s: "24%", l: "38%" }, // Darker violet
    800: { h: 275, s: "26%", l: "30%" }, // Dark violet
    900: { h: 275, s: "28%", l: "22%" }, // Very dark violet
  },

  // Bildung (Education) - Cyan-blue
  bildung: {
    50: { h: 195, s: "12%", l: "96%" }, // Very light cyan-blue
    100: { h: 195, s: "14%", l: "92%" }, // Light cyan-blue
    200: { h: 195, s: "16%", l: "85%" }, // Lighter cyan-blue
    300: { h: 195, s: "18%", l: "75%" }, // Light-cyan-blue
    400: { h: 195, s: "20%", l: "65%" }, // Mid-light cyan-blue
    500: { h: 195, s: "18%", l: "56%" }, // Base cyan-blue
    600: { h: 195, s: "20%", l: "46%" }, // Mid-dark cyan-blue
    700: { h: 195, s: "22%", l: "38%" }, // Darker cyan-blue
    800: { h: 195, s: "24%", l: "30%" }, // Dark cyan-blue
    900: { h: 195, s: "26%", l: "22%" }, // Very dark cyan-blue
  },

  // Familie (Family) - Warm coral
  familie: {
    50: { h: 5, s: "12%", l: "96%" }, // Very light coral
    100: { h: 5, s: "14%", l: "92%" }, // Light coral
    200: { h: 5, s: "16%", l: "85%" }, // Lighter coral
    300: { h: 5, s: "18%", l: "75%" }, // Light-coral
    400: { h: 5, s: "20%", l: "65%" }, // Mid-light coral
    500: { h: 5, s: "16%", l: "56%" }, // Base coral
    600: { h: 5, s: "18%", l: "46%" }, // Mid-dark coral
    700: { h: 5, s: "20%", l: "38%" }, // Darker coral
    800: { h: 5, s: "22%", l: "30%" }, // Dark coral
    900: { h: 5, s: "24%", l: "22%" }, // Very dark coral
  },

  // Beratung (Consulting) - Soft green
  beratung: {
    50: { h: 145, s: "12%", l: "96%" }, // Very light green
    100: { h: 145, s: "14%", l: "92%" }, // Light green
    200: { h: 145, s: "16%", l: "85%" }, // Lighter green
    300: { h: 145, s: "18%", l: "75%" }, // Light-green
    400: { h: 145, s: "20%", l: "65%" }, // Mid-light green
    500: { h: 145, s: "18%", l: "55%" }, // Base green
    600: { h: 145, s: "20%", l: "45%" }, // Mid-dark green
    700: { h: 145, s: "22%", l: "38%" }, // Darker green
    800: { h: 145, s: "24%", l: "30%" }, // Dark green
    900: { h: 145, s: "26%", l: "22%" }, // Very dark green
  },

  // Model Premium - Indigo
  "model-premium": {
    50: { h: 230, s: "12%", l: "96%" }, // Very light indigo
    100: { h: 230, s: "14%", l: "92%" }, // Light indigo
    200: { h: 230, s: "16%", l: "85%" }, // Lighter indigo
    300: { h: 230, s: "18%", l: "75%" }, // Light-indigo
    400: { h: 230, s: "20%", l: "65%" }, // Mid-light indigo
    500: { h: 230, s: "20%", l: "55%" }, // Base indigo
    600: { h: 230, s: "22%", l: "45%" }, // Mid-dark indigo
    700: { h: 230, s: "24%", l: "38%" }, // Darker indigo
    800: { h: 230, s: "26%", l: "30%" }, // Dark indigo
    900: { h: 230, s: "28%", l: "22%" }, // Very dark indigo
  },

  // Model Alltag - Honey
  "model-alltag": {
    50: { h: 12, s: "12%", l: "96%" }, // Very light honey
    100: { h: 12, s: "14%", l: "92%" }, // Light honey
    200: { h: 12, s: "16%", l: "85%" }, // Lighter honey
    300: { h: 12, s: "18%", l: "75%" }, // Light-honey
    400: { h: 12, s: "20%", l: "65%" }, // Mid-light honey
    500: { h: 12, s: "18%", l: "55%" }, // Base honey
    600: { h: 12, s: "20%", l: "45%" }, // Mid-dark honey
    700: { h: 12, s: "22%", l: "38%" }, // Darker honey
    800: { h: 12, s: "24%", l: "30%" }, // Dark honey
    900: { h: 12, s: "26%", l: "22%" }, // Very dark honey
  },
} as const;

/**
 * Generates CSS custom properties for category tonal scales
 * Creates semantic tokens for each category at each scale level (50-900)
 */
export function generateCategoryTonalTokens() {
  const tokens: Record<string, string> = {};

  Object.entries(categoryTonalScales).forEach(([categoryKey, scale]) => {
    Object.entries(scale).forEach(([level, { h, s, l }]) => {
      // Create HSL color tokens
      tokens[`--role-accent-${categoryKey}-${level}`] = `hsl(${h} ${s} ${l})`;
      // Create HSLA variants (for alpha channels)
      tokens[`--role-accent-${categoryKey}-${level}-a50`] = `hsl(${h} ${s} ${l} / 0.5)`;
      tokens[`--role-accent-${categoryKey}-${level}-a30`] = `hsl(${h} ${s} ${l} / 0.3)`;
      tokens[`--role-accent-${categoryKey}-${level}-a20`] = `hsl(${h} ${s} ${l} / 0.2)`;
      tokens[`--role-accent-${categoryKey}-${level}-a10`] = `hsl(${h} ${s} ${l} / 0.1)`;
    });
  });

  return tokens;
}

/**
 * Semantic aliases for common usage patterns
 * Provides named tokens for specific purposes (backgrounds, text, borders)
 */
export function generateCategorySemanticTokens() {
  const tokens: Record<string, string> = {};

  Object.keys(categoryTonalScales).forEach((categoryKey) => {
    // Text colors (use contrast-appropriate shades)
    tokens[`--role-accent-${categoryKey}-text`] = `var(--role-accent-${categoryKey}-900)`;
    tokens[`--role-accent-${categoryKey}-text-on`] = `var(--role-accent-${categoryKey}-50)`;

    // Background colors (use lighter, subtle shades)
    tokens[`--role-accent-${categoryKey}-bg`] = `var(--role-accent-${categoryKey}-100)`;
    tokens[`--role-accent-${categoryKey}-bg-hover`] = `var(--role-accent-${categoryKey}-200)`;
    tokens[`--role-accent-${categoryKey}-bg-subtle`] = `var(--role-accent-${categoryKey}-50)`;

    // Border colors (use mid-range shades)
    tokens[`--role-accent-${categoryKey}-border`] = `var(--role-accent-${categoryKey}-300)`;
    tokens[`--role-accent-${categoryKey}-border-strong`] = `var(--role-accent-${categoryKey}-400)`;

    // Chip/badge specific tokens
    tokens[`--role-accent-${categoryKey}-chip-bg`] = `var(--role-accent-${categoryKey}-100)`;
    tokens[`--role-accent-${categoryKey}-chip-text`] = `var(--role-accent-${categoryKey}-800)`;
    tokens[`--role-accent-${categoryKey}-chip-border`] = `var(--role-accent-${categoryKey}-200)`;
  });

  return tokens;
}

/**
 * CSS Custom Properties for Dark Theme
 * All category tonal scale tokens are defined here for the dark theme context
 */

function generateDarkThemeOverrides() {
  return Object.entries({ ...generateCategoryTonalTokens(), ...generateCategorySemanticTokens() })
    .map(([property]) => {
      // For dark theme, we need to adjust the token names to use darker variants for backgrounds
      // and lighter variants for text to ensure contrast
      if (property.includes("-bg") || property.includes("-chip-bg")) {
        // Use darker backgrounds in dark theme (darker scale)
        const category = property.split("-")[2]; // gets the category name
        if (property.includes("-subtle")) {
          return `  ${property}: var(--role-accent-${category}-900);`;
        } else {
          return `  ${property}: var(--role-accent-${category}-800);`;
        }
      } else if (property.includes("-text") || property.includes("-chip-text")) {
        // Use lighter text in dark theme
        const category = property.split("-")[2]; // gets the category name
        if (property.includes("-on")) {
          return `  ${property}: var(--role-accent-${category}-900);`;
        } else {
          return `  ${property}: var(--role-accent-${category}-50);`;
        }
      } else {
        const category = property.split("-")[2]; // gets the category name
        return `  ${property}: var(--role-accent-${category}-300);`;
      }
    })
    .join("\n");
}

export const categoryTonalTokensCSS = `
/* Category tonal scales - Light theme defaults */
:root {
${Object.entries({ ...generateCategoryTonalTokens(), ...generateCategorySemanticTokens() })
  .map(([property, value]) => `  ${property}: ${value};`)
  .join("\n")}
}

/* Category tonal scales - Dark theme overrides */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${generateDarkThemeOverrides()}
  }
}

[data-theme="dark"] {
${generateDarkThemeOverrides()}
}

/* Category data attribute selectors for easy usage */
${Object.keys(categoryTonalScales)
  .map(
    (key) => `
[data-cat="${key}"] {
  --role-accent: var(--role-accent-${key}-500);
  --role-accent-light: var(--role-accent-${key}-300);
  --role-accent-dark: var(--role-accent-${key}-700);
}`,
  )
  .join("")}
`;

/**
 * Category Key Type
 * Union type of all available category keys for type safety
 */
export type CategoryKey = keyof typeof categoryTonalScales;

/**
 * Available category keys as constant array
 */
export const CATEGORY_KEYS = Object.keys(categoryTonalScales) as CategoryKey[];

/**
 * Available tonal levels as constant array
 */
export const TONAL_LEVELS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type TonalLevel = (typeof TONAL_LEVELS)[number];
