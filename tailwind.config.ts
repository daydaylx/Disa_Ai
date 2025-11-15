/* eslint-disable */
import type { Config } from "tailwindcss";

const colorTokens = {
  // Background colors from design-tokens.css
  bg: {
    0: "var(--bg-0)", // #050814 - Haupt-Hintergrund
    1: "var(--bg-1)", // #0b1020 - Page-Container
    2: "var(--bg-2)", // #070b12 - Alternative Ecke
  },

  // Surface colors from design-tokens.css
  surface: {
    DEFAULT: "var(--surface)", // #111827 - Haupt-Surface
    soft: "var(--surface-soft)", // #141b2b - Weichere Surface
    card: "var(--surface-card)", // #1a2332 - Card-Surface
    overlay: "var(--surface-overlay)", // rgba(17, 24, 39, 0.85) - Dialoge, Modals
  },

  // Text colors from design-tokens.css
  text: {
    DEFAULT: "var(--text-primary)",
    primary: "var(--text-primary)", // #f9fafb - Haupttext
    secondary: "var(--text-secondary)", // #9ca3af - Sekundärtext
    muted: "var(--text-muted)", // #6b7280 - Gedämpfter Text
    disabled: "var(--text-disabled)", // #4b5563 - Deaktivierter Text
  },

  // Primary color scale from design-tokens.css
  primary: {
    50: "var(--color-primary-50)", // #eff6ff
    100: "var(--color-primary-100)", // #dbeafe
    200: "var(--color-primary-200)", // #bfdbfe
    300: "var(--color-primary-300)", // #93c5fd
    400: "var(--color-primary-400)", // #60a5fa
    500: "var(--color-primary-500)", // #3b82f6 - Primary CTA
    600: "var(--color-primary-600)", // #2563eb
    700: "var(--color-primary-700)", // #1d4ed8
    800: "var(--color-primary-800)", // #1e40af
    900: "var(--color-primary-900)", // #1e3a8a
    950: "var(--color-primary-950)", // #172554
    DEFAULT: "var(--color-primary-500)",
  },

  // Accent colors from design-tokens.css
  green: {
    DEFAULT: "var(--accent-green)", // #22c55e - für Speed/Quality Bars
  },
  yellow: {
    DEFAULT: "var(--accent-yellow)", // #facc15 - für Value Bars
  },

  // Status colors from design-tokens.css
  success: {
    50: "var(--color-success-50)",
    100: "var(--color-success-100)",
    200: "var(--color-success-200)",
    300: "var(--color-success-300)",
    400: "var(--color-success-400)",
    500: "var(--color-success-500)",
    600: "var(--color-success-600)",
    700: "var(--color-success-700)",
    800: "var(--color-success-800)",
    900: "var(--color-success-900)",
    DEFAULT: "var(--color-success-500)",
  },
  warning: {
    50: "var(--color-warning-50)",
    100: "var(--color-warning-100)",
    200: "var(--color-warning-200)",
    300: "var(--color-warning-300)",
    400: "var(--color-warning-400)",
    500: "var(--color-warning-500)",
    600: "var(--color-warning-600)",
    700: "var(--color-warning-700)",
    800: "var(--color-warning-800)",
    900: "var(--color-warning-900)",
    DEFAULT: "var(--color-warning-500)",
  },
  error: {
    50: "var(--color-error-50)",
    100: "var(--color-error-100)",
    200: "var(--color-error-200)",
    300: "var(--color-error-300)",
    400: "var(--color-error-400)",
    500: "var(--color-error-500)",
    600: "var(--color-error-600)",
    700: "var(--color-error-700)",
    800: "var(--color-error-800)",
    900: "var(--color-error-900)",
    DEFAULT: "var(--color-error-500)",
  },

  // Neutral colors from design-tokens.css
  neutral: {
    50: "var(--color-neutral-50)",
    100: "var(--color-neutral-100)",
    200: "var(--color-neutral-200)",
    300: "var(--color-neutral-300)",
    400: "var(--color-neutral-400)",
    500: "var(--color-neutral-500)",
    600: "var(--color-neutral-600)",
    700: "var(--color-neutral-700)",
    800: "var(--color-neutral-800)",
    900: "var(--color-neutral-900)",
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

// Box shadows from design-tokens.css
const boxShadows = {
  light: "var(--shadow-light)", // 0 2px 8px rgba(0,0,0,0.16)
  heavy: "var(--shadow-heavy)", // 0 8px 24px rgba(0,0,0,0.32)
  elevated: "var(--shadow-elevated)", // 0 12px 32px rgba(0,0,0,0.25)
  floating: "var(--shadow-floating)", // 0 16px 40px rgba(0,0,0,0.3)
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

// Motion tokens from design-tokens.css
const motionDurations = {
  1: "var(--motion-duration-1)", // 120ms
  2: "var(--motion-duration-2)", // 180ms
  3: "var(--motion-duration-3)", // 240ms
  fast: "var(--motion-duration-fast)", // 120ms
  medium: "var(--motion-duration-medium)", // 180ms
  slow: "var(--motion-duration-slow)", // 240ms
};

const motionEasings = {
  1: "var(--motion-ease-1)", // cubic-bezier(0.23, 1, 0.32, 1)
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
      backdropBlur: {
        subtle: "var(--backdrop-blur-subtle)", // 8px
        medium: "var(--backdrop-blur-medium)", // 12px
        strong: "var(--backdrop-blur-strong)", // 16px
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
