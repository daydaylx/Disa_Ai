/**
 * Central design token definitions for Disa AI.
 *
 * Exports are consumed by Tailwind and other build tooling.
 * CSS variables are mapped in `design-tokens.css`.
 */

// Neutral palette with clear stops for backgrounds, borders and text
export const colors = {
  neutral: {
    950: "#05070d",
    900: "#0b1118",
    800: "#111a26",
    700: "#172231",
    600: "#1d2b3c",
    500: "#24344a",
    400: "#2d3b50",
    300: "#40526b",
    200: "#95a4bb",
    100: "#c6cfde",
    50: "#f4f7fb",
  },
  accent: {
    700: "#0a8aae",
    500: "#22d3ee",
    300: "#7dd3fc",
    subtle: "rgba(34, 211, 238, 0.08)",
    low: "rgba(34, 211, 238, 0.16)",
    outline: "rgba(34, 211, 238, 0.38)",
    foreground: "#03141c",
  },
  semantic: {
    danger: "#ef4444",
    success: "#22c55e",
    warning: "#f59e0b",
    info: "#3b82f6",
    purple: "#8b5cf6",
    mint: "#6ee7b7",
  },
} as const;

export type ColorRamp = typeof colors.neutral;
export type AccentRamp = typeof colors.accent;

// Spacing scale (4 / 8 / 12 / 16 / 24 / 32 …)
export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
} as const;

// Typography scale
export const typography = {
  h1: {
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  h2: {
    fontSize: "20px",
    lineHeight: "28px",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: "18px",
    lineHeight: "26px",
    fontWeight: "500",
  },
  body: {
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "400",
  },
  label: {
    fontSize: "13px",
    lineHeight: "18px",
    fontWeight: "500",
  },
  mono: {
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: "400",
    fontFamily: "ui-monospace, 'SF Mono', 'Monaco', 'Inconsolata', monospace",
  },
} as const;

// Border radii tokens
export const radii = {
  none: "0px",
  sm: "6px",
  md: "10px",
  lg: "14px",
  full: "9999px",
} as const;

// Elevation tokens (0 / 1 / 2)
export const elevation = {
  0: "none",
  1: "0 8px 20px -12px rgba(5, 11, 20, 0.55)",
  2: "0 20px 48px -18px rgba(5, 11, 20, 0.55)",
} as const;

// Motion tokens
export const transitions = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
} as const;

// Reference breakpoints (mobile first focus)
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;

export const designTokens = {
  colors,
  spacing,
  typography,
  radii,
  elevation,
  transitions,
  breakpoints,
} as const;

export type DesignTokens = typeof designTokens;
