/**
 * Liquid Intelligence Color Tokens
 *
 * Defines the color palette for the "Liquid Intelligence" branding concept.
 * These colors represent fluidity, depth, and dynamic interaction.
 */

export const liquidColorTokens = {
  // Primary Liquid Colors
  liquidBlue: {
    h: "220",
    s: "60%",
    l: "40%",
  },
  liquidTurquoise: {
    h: "180",
    s: "65%",
    l: "55%",
  },
  liquidPurple: {
    h: "260",
    s: "70%",
    l: "50%",
  },

  // Secondary Liquid Colors
  liquidIndigo: {
    h: "240",
    s: "65%",
    l: "45%",
  },
  liquidTeal: {
    h: "190",
    s: "70%",
    l: "40%",
  },
  liquidMagenta: {
    h: "300",
    s: "60%",
    l: "50%",
  },

  // Surface Colors
  liquidSurface: {
    h: "220",
    s: "30%",
    l: "95%",
  },
  liquidSurfaceHover: {
    h: "220",
    s: "25%",
    l: "90%",
  },
};

/**
 * Generates CSS custom properties for Liquid Intelligence colors
 */
export function generateLiquidColorTokens(): Record<string, string> {
  const tokens: Record<string, string> = {};

  // Generate HSL color tokens
  for (const [key, value] of Object.entries(liquidColorTokens)) {
    tokens[`--${key}`] = `${value.h} ${value.s} ${value.l}`;
  }

  // Generate semantic color tokens
  tokens["--liquid-blue"] =
    `hsl(${liquidColorTokens.liquidBlue.h} ${liquidColorTokens.liquidBlue.s} ${liquidColorTokens.liquidBlue.l})`;
  tokens["--liquid-turquoise"] =
    `hsl(${liquidColorTokens.liquidTurquoise.h} ${liquidColorTokens.liquidTurquoise.s} ${liquidColorTokens.liquidTurquoise.l})`;
  tokens["--liquid-purple"] =
    `hsl(${liquidColorTokens.liquidPurple.h} ${liquidColorTokens.liquidPurple.s} ${liquidColorTokens.liquidPurple.l})`;
  tokens["--liquid-indigo"] =
    `hsl(${liquidColorTokens.liquidIndigo.h} ${liquidColorTokens.liquidIndigo.s} ${liquidColorTokens.liquidIndigo.l})`;
  tokens["--liquid-teal"] =
    `hsl(${liquidColorTokens.liquidTeal.h} ${liquidColorTokens.liquidTeal.s} ${liquidColorTokens.liquidTeal.l})`;
  tokens["--liquid-magenta"] =
    `hsl(${liquidColorTokens.liquidMagenta.h} ${liquidColorTokens.liquidMagenta.s} ${liquidColorTokens.liquidMagenta.l})`;

  // Generate surface tokens
  tokens["--liquid-surface"] =
    `hsl(${liquidColorTokens.liquidSurface.h} ${liquidColorTokens.liquidSurface.s} ${liquidColorTokens.liquidSurface.l})`;
  tokens["--liquid-surface-hover"] =
    `hsl(${liquidColorTokens.liquidSurfaceHover.h} ${liquidColorTokens.liquidSurfaceHover.s} ${liquidColorTokens.liquidSurfaceHover.l})`;

  return tokens;
}
