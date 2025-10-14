/**
 * Minimal design token definitions for the redesigned Disa AI interface.
 *
 * The tokens favour flat surfaces, high-contrast typography and a single brand accent.
 * CSS variable wiring lives in `design-tokens.css`.
 */

export const colors = {
  surface: {
    0: "#111111",
    1: "#1E1E1E",
    2: "#2C2C2C",
  },
  text: {
    strong: "#F2F2F2",
    muted: "#A8A8A8",
  },
  border: {
    subtle: "#333333",
  },
  brand: {
    base: "#007AFF",
    weak: "#007AFF40",
  },
  state: {
    success: "#34C759",
    warning: "#FFCC00",
    danger: "#FF3B30",
  },
} as const;

export type SurfaceRamp = typeof colors.surface;

// Spacing scale (4 / 8 / 12 / 16 / 24 / 32 …) - 8dp grid system
export const spacing = {
  0: "0px",
  1: "4px", // 0.5 * 8dp
  2: "8px", // 1 * 8dp - base unit
  3: "12px", // 1.5 * 8dp
  4: "16px", // 2 * 8dp
  5: "20px", // 2.5 * 8dp - non-standard, avoid
  6: "24px", // 3 * 8dp
  8: "32px", // 4 * 8dp
  10: "40px", // 5 * 8dp
  12: "48px", // 6 * 8dp - minimum touch target
  16: "64px", // 8 * 8dp
  20: "80px", // 10 * 8dp
  24: "96px", // 12 * 8dp
} as const;

// Touch targets and accessibility
export const touchTargets = {
  minimum: "44px", // iOS guideline minimum
  recommended: "48px", // Material Design recommended
  comfortable: "56px", // Comfortable for all users
  large: "64px", // Large touch targets for better UX
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

// Border radii tokens - single family (base + pill)
export const radii = {
  none: "0px",
  base: "12px",
  full: "9999px",
  pill: "999px",
} as const;

// Subtle elevation tier
export const elevation = {
  level: "0 4px 12px rgba(0, 0, 0, 0.1)",
} as const;

// Motion tokens
export const transitions = {
  fast: "150ms",
  normal: "200ms",
  slow: "250ms",
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
  touchTargets,
  typography,
  radii,
  elevation,
  transitions,
  breakpoints,
} as const;

export type DesignTokens = typeof designTokens;
