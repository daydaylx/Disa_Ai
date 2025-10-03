/* eslint-disable */
import type { Config } from "tailwindcss";
import { designTokens } from "./src/styles/design-tokens";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // Legacy colors for backward compatibility
        primary: "hsl(var(--primary))",
        "on-primary": "hsl(var(--on-primary))",
        surface: "hsl(var(--surface))",
        "on-surface": "hsl(var(--on-surface))",
        "surface-variant": "hsl(var(--surface-variant))",
        outline: "hsl(var(--outline))",
        error: "hsl(var(--error))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",

        // Design Token Colors
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
        accent: {
          300: "var(--color-accent-300)",
          500: "var(--color-accent-500)",
          700: "var(--color-accent-700)",
          subtle: "var(--color-accent-subtle)",
          low: "var(--color-accent-low)",
          outline: "var(--color-accent-outline)",
          foreground: "var(--color-accent-foreground)",
        },
        semantic: {
          danger: "var(--color-danger)",
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          info: "var(--color-info)",
          purple: "var(--color-purple)",
          mint: "var(--color-mint)",
        },
        corporate: {
          bg: {
            primary: "var(--color-corporate-bg-primary)",
            secondary: "var(--color-corporate-bg-secondary)",
            elevated: "var(--color-corporate-bg-elevated)",
            card: "var(--color-corporate-bg-card)",
            hover: "var(--color-corporate-bg-hover)",
          },
          text: {
            primary: "var(--color-corporate-text-primary)",
            secondary: "var(--color-corporate-text-secondary)",
            muted: "var(--color-corporate-text-muted)",
            accent: "var(--color-corporate-text-accent)",
          },
          border: {
            primary: "var(--color-corporate-border-primary)",
            secondary: "var(--color-corporate-border-secondary)",
            accent: "var(--color-corporate-border-accent)",
          },
          accent: {
            primary: "var(--color-corporate-accent-primary)",
            secondary: "var(--color-corporate-accent-secondary)",
            success: "var(--color-corporate-accent-success)",
            warning: "var(--color-corporate-accent-warning)",
            danger: "var(--color-corporate-accent-danger)",
            purple: "var(--color-corporate-accent-purple)",
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
    "badge",
    "badge-muted",
    "badge-accent",
    "bubble",
    "bubble-assistant",
    "bubble-user",
    "bubble-system",
    "tile",
    "tile--primary",
    "card",
    // Safe area classes
    "pb-safe-bottom",
    "pt-safe-top",
    "pl-safe-left",
    "pr-safe-right",
    "mb-safe-bottom",
    "mt-safe-top",
    "ml-safe-left",
    "mr-safe-right",
  ],
  plugins: [],
} satisfies Config;
