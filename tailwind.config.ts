/* eslint-disable */
import type { Config } from "tailwindcss";

const colorTokens = {
  bg: {
    0: "var(--bg0)",
    1: "var(--bg1)",
    2: "var(--bg2)",
  },
  surface: {
    canvas: "var(--surface-bg)",
    base: "var(--surface-base)",
    muted: "var(--surface-muted)",
    card: "var(--surface-card)",
    overlay: "var(--surface-overlay)",
    ghost: "var(--surface-ghost)",
  },
  text: {
    DEFAULT: "var(--fg)",
    muted: "var(--fg-muted)",
    subtle: "var(--fg-subtle)",
    inverse: "var(--accent-contrast)",
    accent: "var(--color-text-on-accent)",
  },
  accent: {
    DEFAULT: "var(--accent)",
    weak: "var(--accent-weak)",
    contrast: "var(--accent-contrast)",
  },
  line: {
    DEFAULT: "var(--line)",
    subtle: "var(--border-hairline)",
    strong: "var(--border-strong)",
  },
  status: {
    info: "var(--info)",
    "info-soft": "var(--info-soft)",
    success: "var(--success)",
    "success-soft": "var(--success-soft)",
    warning: "var(--warning)",
    "warning-soft": "var(--warning-soft)",
    danger: "var(--danger)",
    "danger-soft": "var(--danger-soft)",
  },
};

const spacingScale = {
  "3xs": "var(--space-3xs)",
  "2xs": "var(--space-2xs)",
  xs: "var(--space-xs)",
  sm: "var(--space-sm)",
  md: "var(--space-md)",
  lg: "var(--space-lg)",
  xl: "var(--space-xl)",
  "2xl": "var(--space-2xl)",
  "3xl": "var(--space-3xl)",
  "4xl": "var(--space-4xl)",
  gutter: "var(--page-padding-x)",
  "touch-compact": "var(--size-touch-compact)",
  "touch-comfortable": "var(--size-touch-comfortable)",
  "touch-relaxed": "var(--size-touch-relaxed)",
  "touch-spacious": "var(--size-touch-spacious)",
};

const radii = {
  none: "0px",
  xs: "var(--radius-xs)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  pill: "var(--radius-pill)",
  full: "999px",
};

const boxShadows = {
  // Primary shadow hierarchy (2 levels)
  surface: "var(--shadow-surface)",
  elevated: "var(--shadow-elevated)",

  // Legacy/compatibility
  card: "var(--shadow-card)",
  overlay: "var(--shadow-overlay)",
  ring: "var(--shadow-ring)",

  // Inset shadows
  "inset-subtle": "var(--shadow-inset-subtle)",
  "inset-medium": "var(--shadow-inset-medium)",

  // Glow effects
  "glow-brand": "var(--shadow-glow-brand)",
  "glow-brand-subtle": "var(--shadow-glow-brand-subtle)",
  "glow-success": "var(--shadow-glow-success)",
  "glow-warning": "var(--shadow-glow-warning)",
  "glow-error": "var(--shadow-glow-error)",
};

const fontSizes = {
  xs: ["12px", { lineHeight: "16px", fontWeight: "500" }],
  sm: ["14px", { lineHeight: "20px", fontWeight: "500" }],
  base: ["16px", { lineHeight: "24px", fontWeight: "500" }],
  md: ["18px", { lineHeight: "26px", fontWeight: "500" }],
  lg: ["20px", { lineHeight: "28px", fontWeight: "600" }],
  xl: ["24px", { lineHeight: "32px", fontWeight: "600" }],
  "2xl": ["32px", { lineHeight: "40px", fontWeight: "600" }],
};

const motionDurations = {
  quick: "var(--motion-duration-quick)",
  base: "var(--motion-duration-base)",
  slow: "var(--motion-duration-slow)",
};

const motionEasings = {
  standard: "var(--motion-ease-standard)",
  emphasized: "var(--motion-ease-emphasized)",
  accelerate: "var(--motion-ease-accelerate)",
  decelerate: "var(--motion-ease-decelerate)",
};

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: colorTokens,
      spacing: spacingScale,
      borderRadius: radii,
      boxShadow: boxShadows,
      fontFamily: {
        sans: ["var(--font-family-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-family-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: fontSizes,
      minHeight: {
        ...spacingScale,
        "screen-dynamic": "var(--vh, 100dvh)",
        "screen-small": "100svh",
        "screen-large": "100lvh",
      },
      height: {
        ...spacingScale,
        "screen-dynamic": "var(--vh, 100dvh)",
        "screen-small": "100svh",
        "screen-large": "100lvh",
      },
      transitionDuration: motionDurations,
      transitionTimingFunction: motionEasings,
      padding: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      margin: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },
  },
  plugins: [],
} satisfies Config;

/* Notes: Tailwind now maps directly to the new CSS variables (colors, spacing, radii, shadows, motion) so components consume the design tokens consistently. */
