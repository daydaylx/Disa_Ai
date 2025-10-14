/* eslint-disable */
import type { Config } from "tailwindcss";
import { designTokens } from "./src/styles/design-tokens";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--surface-1)",
          0: "var(--surface-0)",
          1: "var(--surface-1)",
          2: "var(--surface-2)",
        },
        text: {
          DEFAULT: "var(--text-0)",
          strong: "var(--text-0)",
          muted: "var(--text-1)",
          subtle: "var(--text-2)",
          0: "var(--text-0)",
          1: "var(--text-1)",
          2: "var(--text-2)",
        },
        border: {
          DEFAULT: "var(--surface-border)",
          subtle: "var(--surface-border)",
          strong: "var(--surface-border-strong)",
        },
        brand: {
          DEFAULT: "rgb(var(--brand-rgb) / <alpha-value>)",
          base: "rgb(var(--brand-rgb) / <alpha-value>)",
          strong: "rgb(var(--brand-strong-rgb) / <alpha-value>)",
          weak: "rgb(var(--brand-rgb) / 0.18)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
          base: "rgb(var(--accent-rgb) / <alpha-value>)",
          weak: "rgb(var(--accent-rgb) / 0.2)",
        },
        success: "rgb(var(--success-rgb) / <alpha-value>)",
        warning: "rgb(var(--warning-rgb) / <alpha-value>)",
        danger: "rgb(var(--danger-rgb) / <alpha-value>)",
        state: {
          success: "rgb(var(--success-rgb) / <alpha-value>)",
          warning: "rgb(var(--warning-rgb) / <alpha-value>)",
          danger: "rgb(var(--danger-rgb) / <alpha-value>)",
        },
      },
      spacing: {
        0: "var(--spacing-0)",
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
        "touch-min": "var(--touch-minimum)",
        "touch-rec": "var(--touch-recommended)",
        "touch-com": "var(--touch-comfortable)",
        "touch-lg": "var(--touch-large)",
      },
      borderRadius: {
        none: "0px",
        base: "var(--surface-radius)",
        lg: "var(--surface-radius-lg)",
        full: "var(--surface-radius-full)",
        pill: "var(--surface-radius-pill)",
      },
      boxShadow: {
        level: "var(--surface-shadow)",
      },
      transitionDuration: {
        fast: "var(--transition-fast)",
        normal: "var(--transition-normal)",
        slow: "var(--transition-slow)",
      },
      height: {
        "screen-dynamic": "var(--vh, 100dvh)",
        "screen-small": "100svh",
        "screen-large": "100lvh",
      },
      minHeight: {
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
        "accordion-down": "accordion-down 0.18s ease-out",
        "accordion-up": "accordion-up 0.18s ease-out",
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
  safelist: [
    "pb-safe-bottom",
    "pt-safe-top",
    {
      pattern: /(grid|flex|gap|items|justify)-(.*)/,
    },
  ],
  plugins: [],
} satisfies Config;
