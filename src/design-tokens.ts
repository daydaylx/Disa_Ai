/**
 * Design Tokens for Disa AI
 *
 * Central source of truth for all design decisions.
 * Referenced by Tailwind config and CSS custom properties.
 */

// Color Palette: Neutral + Single Accent
export const colors = {
  // Dark theme neutrals
  neutral: {
    900: "#05070d", // bg-900
    800: "#0b1118", // bg-800
    700: "#111a26", // surface-100
    600: "#172231", // surface-200
    500: "#1d2b3c", // surface-300
    400: "#2d3b50", // border-strong
    300: "#1b2735", // border-subtle
    200: "#95a4bb", // text-muted
    100: "#c6cfde", // text-secondary
    50: "#f4f7fb", // text-primary
  },

  // Single accent color (cyan)
  accent: {
    700: "#0a8aae",
    600: "#0fb5d0",
    500: "#22d3ee", // Primary accent
    400: "#38bdf8",
    300: "#7dd3fc",
    100: "rgba(34, 211, 238, 0.16)", // bg-accent/low
    50: "rgba(34, 211, 238, 0.08)", // bg-accent/subtle
  },

  // Semantic colors
  semantic: {
    danger: "#ef4444",
    success: "#22c55e",
    warning: "#f59e0b",
    info: "#3b82f6",
    purple: "#8b5cf6", // Settings theme color
  },

  // Low opacity backgrounds for badges and chips
  background: {
    "success-subtle": "rgba(34, 197, 94, 0.12)", // green badge
    "purple-subtle": "rgba(192, 132, 252, 0.12)", // purple badge
    "danger-subtle": "rgba(239, 68, 68, 0.12)", // error states
    "accent-subtle": "rgba(34, 211, 238, 0.08)", // accent/low
    "accent-low": "rgba(34, 211, 238, 0.16)", // accent backgrounds
  },

  // Chat bubble specific colors
  bubble: {
    assistant: {
      bg: "rgba(33, 45, 61, 0.9)",
      "bg-secondary": "rgba(23, 32, 45, 0.95)",
      border: "rgba(98, 123, 153, 0.35)",
      text: "#f4f7fb",
    },
    user: {
      bg: "rgba(73, 119, 252, 0.95)",
      "bg-secondary": "rgba(58, 99, 225, 0.9)",
      text: "#03141c",
      "text-meta": "rgba(255, 255, 255, 0.7)",
    },
    typing: {
      bg: "rgba(25, 35, 51, 0.85)",
      border: "rgba(98, 123, 153, 0.25)",
    },
    error: {
      bg: "rgba(83, 23, 27, 0.9)",
      border: "rgba(255, 99, 132, 0.45)",
      text: "#ffe7eb",
    },
  },

  // Model picker and chips
  model: {
    chip: {
      bg: "rgba(26, 38, 55, 0.6)",
      border: "rgba(98, 123, 153, 0.4)",
      text: "rgba(185, 205, 230, 0.9)",
    },
    favorite: {
      bg: "rgba(255, 199, 103, 0.1)",
      border: "rgba(255, 199, 103, 0.6)",
      text: "#ffd27d",
    },
    free: {
      bg: "rgba(102, 212, 140, 0.15)",
      border: "rgba(102, 212, 140, 0.6)",
      text: "#6fd08f",
    },
    code: {
      bg: "rgba(127, 160, 255, 0.15)",
      border: "rgba(127, 160, 255, 0.5)",
      text: "#9caeff",
    },
    cost: {
      bg: "rgba(255, 255, 255, 0.06)",
      border: "rgba(255, 255, 255, 0.2)",
      text: "rgba(255, 255, 255, 0.8)",
    },
    banner: {
      bg: "rgba(255, 176, 31, 0.12)",
      border: "rgba(255, 176, 31, 0.4)",
      "bg-muted": "rgba(19, 27, 40, 0.5)",
      "border-muted": "rgba(98, 123, 153, 0.35)",
    },
    empty: {
      bg: "rgba(19, 27, 40, 0.6)",
      border: "rgba(112, 138, 170, 0.4)",
    },
  },
} as const;

// Spacing Scale (4px base, following 4/8/12/16/24/32/48)
export const spacing = {
  0: "0",
  1: "4px", // 0.25rem
  2: "8px", // 0.5rem
  3: "12px", // 0.75rem
  4: "16px", // 1rem
  6: "24px", // 1.5rem
  8: "32px", // 2rem
  12: "48px", // 3rem
  16: "64px", // 4rem
  20: "80px", // 5rem
} as const;

// Border Radius Scale
export const borderRadius = {
  none: "0",
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "18px",
  full: "9999px",
} as const;

// Typography Scale
export const typography = {
  h1: {
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  h2: {
    fontSize: "20px",
    lineHeight: "24px",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: "18px",
    lineHeight: "24px",
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

// Shadow Levels (3 levels)
export const shadows = {
  1: "0 8px 20px -12px rgba(5, 11, 20, 0.55)", // elev1
  2: "0 20px 48px -18px rgba(5, 11, 20, 0.55)", // elev2
  3: "0 32px 64px -24px rgba(5, 11, 20, 0.65)", // elev3
} as const;

// Touch Targets (minimum 44px per WCAG AA)
export const touchTargets = {
  minimum: "44px", // 44×44 CSS pixels
  comfortable: "48px", // Android recommendation (~9mm)
  roomy: "56px", // Extra comfort
} as const;

// Transition Durations
export const transitions = {
  fast: "150ms", // Micro-interactions
  normal: "200ms", // Standard interactions
  slow: "300ms", // Sheets, modals
} as const;

// Breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;
