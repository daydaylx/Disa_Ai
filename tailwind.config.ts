/* eslint-disable */
import type { Config } from "tailwindcss";

const colorTokens = {
  // Aurora Backgrounds
  bg: {
    0: "var(--bg-0)", // #0a0e1a
    1: "var(--bg-1)", // #0f172a
    2: "var(--bg-2)", // #1a1f2e
  },

  // Aurora Surfaces
  surface: {
    DEFAULT: "var(--surface)", // #1e293b
    soft: "var(--surface-soft)", // #1a1f2e
    card: "var(--surface-card)", // #0f172a
    overlay: "var(--surface-overlay)", // rgba(10,14,26,0.88)
  },

  // Boosted Text
  text: {
    DEFAULT: "var(--text-primary)",
    primary: "var(--text-primary)", // #f8fafc
    secondary: "var(--text-secondary)", // #d1d5db boosted
    muted: "var(--text-muted)", // #94a3b8
    disabled: "var(--text-disabled)", // #64748b
  },

  // Primary: Indigo-Violet
  primary: {
    50: "var(--color-primary-50)",
    100: "var(--color-primary-100)",
    200: "var(--color-primary-200)",
    300: "var(--color-primary-300)",
    400: "var(--color-primary-400)",
    500: "var(--color-primary-500)", // #6366f1
    600: "var(--color-primary-600)",
    700: "var(--color-primary-700)",
    800: "var(--color-primary-800)",
    900: "var(--color-primary-900)",
    950: "var(--color-primary-950)",
    DEFAULT: "var(--color-primary-500)",
  },

  // Aurora Accents
  auroraGreen: {
    DEFAULT: "var(--accent-aurora-green)", // #10b981
  },
  lila: {
    DEFAULT: "var(--accent-lila)", // #8b5cf6
  },
  yellow: {
    DEFAULT: "var(--accent-yellow)", // #facc15 kept
  },

  // Status (updated success to aurora-green)
  success: {
    DEFAULT: "var(--color-success-500)", // #10b981
  },
  warning: { DEFAULT: "var(--color-warning-500)" },
  error: { DEFAULT: "var(--color-error-500)" },

  neutral: {
    950: "var(--color-neutral-950)",
  },
};

// Spacing scale from design-tokens.css (8px grid)
const spacingScale = {
  0: "var(--spacing-0)", // 0
  1: "var(--spacing-1)", // 4px
  2: "var(--spacing-2)", // 8px
  3: "var(--spacing-3)", // 12px
  4: "var(--spacing-4)", // 16px
  5: "var(--spacing-5)", // 20px
  6: "var(--spacing-6)", // 24px
  7: "var(--spacing-7)", // 32px
  8: "var(--spacing-8)", // 40px
  9: "var(--spacing-9)", // 48px
  10: "var(--spacing-10)", // 64px
};

// Border radius from design-tokens.css
const radii = {
  none: "0px",
  xs: "var(--radius-xs)", // 6px
  sm: "var(--radius-sm)", // 10px
  md: "var(--radius-md)", // 14px
  lg: "var(--radius-lg)", // 18px
  xl: "var(--radius-xl)", // 24px
  full: "9999px",
};

// Aurora Glow Shadows
const boxShadows = {
  light: "var(--shadow-light)",
  heavy: "var(--shadow-heavy)",
  elevated: "var(--shadow-elevated)",
  floating: "var(--shadow-floating)",
  glowPrimary: "var(--shadow-glow-primary)",
  glowGreen: "var(--shadow-glow-green)",
  glowLila: "var(--shadow-glow-lila)",
  glowSubtle: "var(--shadow-glow-subtle)",
};

// Font sizes from design-tokens.css typography tokens
const fontSizes = {
  xs: ["var(--text-xs)", { lineHeight: "var(--leading-normal)" }], // 12px
  sm: ["var(--text-sm)", { lineHeight: "var(--leading-normal)" }], // 14px
  base: ["var(--text-base)", { lineHeight: "var(--leading-normal)" }], // 16px
  lg: ["var(--text-lg)", { lineHeight: "var(--leading-normal)" }], // 18px
  xl: ["var(--text-xl)", { lineHeight: "var(--leading-normal)" }], // 20px
  "2xl": ["var(--text-2xl)", { lineHeight: "var(--leading-tight)" }], // 24px
  "3xl": ["var(--text-3xl)", { lineHeight: "var(--leading-tight)" }], // 30px
  "4xl": ["var(--text-4xl)", { lineHeight: "var(--leading-tight)" }], // 36px
};

// Aurora Motion (elastic added)
const motionDurations = {
  fast: "var(--motion-duration-fast)", // 100ms
  1: "var(--motion-duration-1)", // 150ms
  medium: "var(--motion-duration-medium)", // 200ms
  slow: "var(--motion-duration-slow)", // 300ms
};

const motionEasings = {
  elastic: "var(--motion-ease-elastic)",
  out: "var(--motion-ease-out)",
  standard: "var(--motion-ease-standard)",
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
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
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
      backdropBlur: {
        subtle: "var(--backdrop-blur-subtle)", // 4px
        medium: "var(--backdrop-blur-medium)", // 8px
        strong: "var(--backdrop-blur-strong)", // 12px
      },
      boxShadow: {
        glowPrimary: "var(--shadow-glow-primary)",
        glowGreen: "var(--shadow-glow-green)",
        glowLila: "var(--shadow-glow-lila)",
        glowSubtle: "var(--shadow-glow-subtle)",
      },
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

/*
 * DESIGN SYSTEM INTEGRATION
 *
 * This Tailwind config now maps directly to design-tokens.css variables,
 * ensuring consistent design token usage across the entire application.
 *
 * Key mappings:
 * - Colors: design-tokens.css primary/neutral/status color scales
 * - Spacing: 8px grid system (--spacing-0 to --spacing-10)
 * - Typography: Font sizes and line heights from design-tokens.css
 * - Shadows: Light/heavy/elevated/floating shadow system
 * - Radii: 6px to 24px border radius scale
 *
 * ALL NEW COMPONENTS MUST USE DESIGN-TOKENS.CSS SYSTEM ONLY!
 */
