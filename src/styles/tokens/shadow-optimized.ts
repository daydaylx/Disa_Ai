/**
 * Optimized Shadow Tokens for Disa AI
 * Reduced complexity: 12 shadow levels → 4 essential levels
 * Clean elevation system for better visual hierarchy
 */

export const optimizedShadowTokens = {
  subtle: "0 1px 3px rgba(0,0,0,0.12)",
  medium: "0 4px 6px rgba(0,0,0,0.15)",
  strong: "0 8px 25px rgba(0,0,0,0.18)",
  prominent: "0 16px 40px rgba(0,0,0,0.20)",
} as const;

export const optimizedShadowCssVars = {
  subtle: "--shadow-subtle",
  medium: "--shadow-medium",
  strong: "--shadow-strong",
  prominent: "--shadow-prominent",
} as const;
