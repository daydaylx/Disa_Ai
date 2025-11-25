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

  // Primary: Lila/Violet Brand
  primary: {
    50: "var(--color-primary-50)",
    100: "var(--color-primary-100)",
    200: "var(--color-primary-200)",
    300: "var(--color-primary-300)",
    400: "var(--color-primary-400)",
    500: "var(--accent-primary)", // #8b5cf6 - Lila Brand
    600: "var(--accent-hover)", // #7c3aed
    700: "var(--accent-active)", // #6d28d9
    800: "var(--color-primary-800)",
    900: "var(--color-primary-900)",
    950: "var(--color-primary-950)",
    DEFAULT: "var(--accent-primary)",
  },

  // Brand Colors (Signature)
  brand: {
    DEFAULT: "var(--accent-primary)",
    hover: "var(--accent-hover)",
    active: "var(--accent-active)",
    bright: "var(--accent-bright)",
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

// Border radius from design-tokens.css (STRICT 3-TIER SYSTEM)
const radii = {
  none: "0px",
  sm: "var(--r-sm)", // 8px - Small controls (Chips, Badges)
  md: "var(--r-md)", // 12px - Standard (Cards, Buttons)
  lg: "var(--r-lg)", // 16px - Hero (Large Cards, Panels)
  full: "9999px",
};

// Neumorphism Shadow System (STRICT 3-TYPE SYSTEM)
const boxShadows = {
  raise: "var(--shadow-soft-raise)", // Standard UI elements
  raiseLg: "var(--shadow-strong-raise)", // Hero/focal elements
  inset: "var(--shadow-inset)", // Pressed/input fields
  accentGlow: "var(--shadow-accent-glow)", // Active state glow
  accentGlowLg: "var(--shadow-accent-glow-strong)", // Strong glow
  brandGlow: "var(--shadow-brand-glow)", // Brand Lila glow
  brandGlowLg: "var(--shadow-brand-glow-strong)", // Strong brand glow
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

// Physical Feedback Motion System
const motionDurations = {
  instant: "var(--motion-instant)", // 80ms
  fast: "var(--motion-fast)", // 120ms
  medium: "var(--motion-medium)", // 200ms
  slow: "var(--motion-slow)", // 300ms
};

const motionEasings = {
  "in-out": "var(--ease-in-out)",
  out: "var(--ease-out)",
  spring: "var(--ease-spring)",
  bounce: "var(--ease-bounce)",
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
      backgroundImage: {
        "brand-gradient": "var(--brand-gradient)",
        "brand-gradient-soft": "var(--brand-gradient-soft)",
        "metric-gradient": "var(--metric-gradient)",
        "bevel-highlight": "var(--bevel-highlight)",
        "bevel-highlight-strong": "var(--bevel-highlight-strong)",
      },
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
 * PREMIUM MATERIAL STUDIO - DESIGN SYSTEM INTEGRATION
 *
 * This Tailwind config maps to the "Premium Material Studio" design system
 * in design-tokens-consolidated.css
 *
 * BRAND IDENTITY: Lila/Violet (#8b5cf6) - Disa AI Signature
 *
 * Key mappings:
 * - Colors: Material palette with Lila Brand accent
 * - Spacing: 8px grid system (--spacing-0 to --spacing-10)
 * - Typography: Mobile-first font sizes and line heights
 * - Shadows: STRICT 3-type system (raise, raiseLg, inset) + brandGlow
 * - Radii: STRICT 3-tier system (sm: 8px, md: 12px, lg: 16px)
 * - Gradients: Brand gradient, Metric gradient, Bevel highlights
 *
 * SIGNATURE ELEMENTS:
 * - Accent-Strip Cards (Lila top-strip + Bevel-Highlight)
 * - Unified Lila Metric Gradients
 * - Brand Glow on interactive elements
 *
 * RULES:
 * - NO backdrop-blur
 * - NO borders (only shadows for depth)
 * - ONLY 3 shadow types + brand glow
 * - ONLY 3 radii sizes
 * - CONSISTENT Lila brand accent everywhere
 *
 * ALL COMPONENTS MUST USE THIS SYSTEM!
 */
