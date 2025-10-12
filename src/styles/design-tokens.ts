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
  darkGlass: {
    background: "#0b0f14",
    surface: "#10151b",
    surfaceElevated: "#131a21",
    text: {
      primary: "#e0e0e0",
      secondary: "#b8bec4",
      muted: "#9aa0a6",
    },
    accent: {
      teal: "#26c6da",
      violet: "#7c4dff",
      pink: "#ff4d8b",
    },
    border: {
      soft: "rgba(255, 255, 255, 0.12)",
      strong: "rgba(255, 255, 255, 0.18)",
      ultra: "rgba(255, 255, 255, 0.32)",
    },
    overlay: {
      weak: "rgba(255, 255, 255, 0.04)",
      soft: "rgba(255, 255, 255, 0.08)",
      strong: "rgba(255, 255, 255, 0.16)",
    },
    shadow: {
      base: "0 28px 80px -32px rgba(5, 9, 15, 0.75)",
      soft: "0 18px 48px -24px rgba(5, 9, 15, 0.55)",
    },
  },
  corporate: {
    background: {
      primary: "#000711",
      secondary: "#0a0f1c",
      elevated: "#0f1729",
      card: "#141b2e",
      hover: "#1a2235",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
      accent: "#60a5fa",
      // WCAG AAA contrast-compliant text colors
      onViolet: "#ffffff", // 100% white on violet for 7:1 contrast
      onBlue: "#ffffff", // 100% white on blue for 7:1 contrast
      onTeal: "#000000", // Black on teal for optimal contrast
      onAccent: "#ffffff", // White on accent colors
      onDark: "#ffffff", // White on dark backgrounds
      onLight: "#0f172a", // Dark slate on light backgrounds
      onSurface: "#f1f5f9", // Very light text on glass surfaces
      muted: "#94a3b8", // Muted text (4.52:1 on dark)
      subtle: "#64748b", // Subtle text (3.1:1 on dark) - use sparingly
    },
    border: {
      primary: "#1e293b",
      secondary: "#334155",
      accent: "#475569",
    },
    accent: {
      primary: "#3b82f6",
      secondary: "#1d4ed8",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444",
      purple: "#8b5cf6",
      // High contrast accent colors for accessibility
      purpleHC: "#a855f7", // Higher contrast purple
      blueHC: "#60a5fa", // Higher contrast blue
      tealHC: "#06b6d4", // Higher contrast teal
    },
    glow: {
      blue: "0 0 20px rgba(59, 130, 246, 0.3)",
      purple: "0 0 20px rgba(139, 92, 246, 0.3)",
      green: "0 0 20px rgba(16, 185, 129, 0.3)",
    },
  },
} as const;

export type ColorRamp = typeof colors.neutral;
export type AccentRamp = typeof colors.accent;

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
  // Material Design minimum touch targets
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

// Border radii tokens
export const radii = {
  none: "0px",
  sm: "6px",
  md: "10px",
  lg: "14px",
  full: "9999px",
} as const;

// Elevation tokens (0 / 1 / 2 / 3)
export const elevation = {
  0: "none",
  1: "0 8px 20px -12px rgba(5, 11, 20, 0.55)",
  2: "0 20px 48px -18px rgba(5, 11, 20, 0.55)",
  3: "0 32px 64px -24px rgba(5, 11, 20, 0.65)",
} as const;

// Glassmorphism tokens
export const glassmorphism = {
  blur: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "40px",
  },
  background: {
    subtle: "rgba(255, 255, 255, 0.05)",
    soft: "rgba(255, 255, 255, 0.08)",
    medium: "rgba(255, 255, 255, 0.12)",
    strong: "rgba(255, 255, 255, 0.16)",
  },
  border: {
    subtle: "rgba(255, 255, 255, 0.08)",
    soft: "rgba(255, 255, 255, 0.12)",
    medium: "rgba(255, 255, 255, 0.16)",
    strong: "rgba(255, 255, 255, 0.24)",
  },
  overlay: {
    weak: "rgba(255, 255, 255, 0.05)", // Sehr subtil
    soft: "rgba(255, 255, 255, 0.10)", // Subtil
    medium: "rgba(255, 255, 255, 0.15)", // Moderat
    strong: "rgba(255, 255, 255, 0.20)", // Stark
    intense: "rgba(255, 255, 255, 0.30)", // Sehr stark
  },
  tint: {
    cyan: "rgba(34, 211, 238, 0.1)",
    purple: "rgba(168, 85, 247, 0.1)",
    mint: "rgba(110, 231, 183, 0.1)",
    warm: "rgba(255, 183, 77, 0.1)",
  },
  glow: {
    subtle: "0 0 20px rgba(34, 211, 238, 0.15)",
    soft: "0 0 30px rgba(34, 211, 238, 0.2)",
    medium: "0 0 40px rgba(34, 211, 238, 0.25)",
    strong: "0 0 60px rgba(34, 211, 238, 0.3)",
  },
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
  touchTargets,
  typography,
  radii,
  elevation,
  glassmorphism,
  transitions,
  breakpoints,
} as const;

export type DesignTokens = typeof designTokens;
