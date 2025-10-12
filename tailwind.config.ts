/* eslint-disable */
import type { Config } from "tailwindcss";
import { designTokens } from "./src/styles/design-tokens";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // Core colors only - keeping most used tokens
        primary: "hsl(var(--primary))",
        surface: "hsl(var(--surface))",
        outline: "hsl(var(--outline))",
        error: "hsl(var(--error))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",

        // Most used neutral variants only
        neutral: {
          200: "var(--color-neutral-200)",
          500: "var(--color-neutral-500)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
          950: "var(--color-neutral-950)",
        },

        // Core accent colors
        accent: {
          300: "var(--color-accent-300)",
          400: "var(--color-accent-400)", // Keeping this as it's used
          500: "var(--color-accent-500)",
        },

        // Minimal semantic colors
        semantic: {
          danger: "var(--color-danger)",
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          purple: "var(--color-purple)",
        },

        // Reduced corporate colors - keeping only frequently used
        corporate: {
          bg: {
            primary: "var(--color-corporate-bg-primary)",
            secondary: "var(--color-corporate-bg-secondary)",
            hover: "var(--color-corporate-bg-hover)",
          },
          text: {
            primary: "var(--color-corporate-text-primary)",
            secondary: "var(--color-corporate-text-secondary)",
            muted: "var(--color-corporate-text-muted)",
          },
          accent: {
            primary: "var(--color-corporate-accent-primary)",
            danger: "var(--color-corporate-accent-danger)",
          },
        },
      },
      spacing: {
        1: "var(--spacing-1)",
        2: "var(--spacing-2)",
        3: "var(--spacing-3)",
        4: "var(--spacing-4)",
        5: "var(--spacing-5)",
        6: "var(--spacing-6)",
        8: "var(--spacing-8)",
        10: "var(--spacing-10)",
        12: "var(--spacing-12)",
        16: "var(--spacing-16)",
        20: "var(--spacing-20)",
        24: "var(--spacing-24)",
        // Touch target sizes
        "touch-min": "var(--touch-minimum)",
        "touch-rec": "var(--touch-recommended)",
        "touch-com": "var(--touch-comfortable)",
        "touch-lg": "var(--touch-large)",
      },
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        none: "var(--shadow-0)",
        sm: "var(--shadow-1)",
        md: "var(--shadow-2)",
        lg: "var(--shadow-3)",
        "glass-subtle": "var(--glass-glow-subtle)",
        "glass-soft": "var(--glass-glow-soft)",
        "glass-medium": "var(--glass-glow-medium)",
        "glass-strong": "var(--glass-glow-strong)",
      },
      backgroundColor: {
        // Glass overlay variants
        "glass-overlay-weak": "var(--glass-overlay-weak)",
        "glass-overlay-soft": "var(--glass-overlay-soft)",
        "glass-overlay-medium": "var(--glass-overlay-medium)",
        "glass-overlay-strong": "var(--glass-overlay-strong)",
        "glass-overlay-intense": "var(--glass-overlay-intense)",
      },
      backdropBlur: {
        sm: "var(--blur-sm)",
        md: "var(--blur-md)",
        lg: "var(--blur-lg)",
        xl: "var(--blur-xl)",
        "2xl": "var(--blur-2xl)",
      },
      transitionDuration: {
        fast: "var(--transition-fast)",
        normal: "var(--transition-normal)",
        slow: "var(--transition-slow)",
      },
      height: {
        // Mobile viewport units
        "screen-dynamic": "var(--vh, 100dvh)",
        "screen-small": "100svh",
        "screen-large": "100lvh",
      },
      minHeight: {
        // Mobile viewport units
        "screen-dynamic": "var(--vh, 100dvh)",
        "screen-small": "100svh",
        "screen-large": "100lvh",
      },
      fontFamily: {
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "token-h1": designTokens.typography.h1.fontSize,
        "token-h2": designTokens.typography.h2.fontSize,
        "token-subtitle": designTokens.typography.subtitle.fontSize,
        "token-body": designTokens.typography.body.fontSize,
        "token-label": designTokens.typography.label.fontSize,
        "token-mono": designTokens.typography.mono.fontSize,
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // Safe area insets for mobile devices
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
  safelist: [
    // Core component classes only
    "badge",
    "badge-muted",
    "bubble",
    "bubble-assistant",
    "bubble-user",
    "tile",
    "card",
    // Essential safe area classes
    "pb-safe-bottom",
    "pt-safe-top",
    // Only keep commonly used gradient color variants
    {
      pattern: /(from|via|to)-(rose|orange|amber|emerald|cyan)-(200|300|400|500)/,
    },
  ],
  plugins: [],
} satisfies Config;
