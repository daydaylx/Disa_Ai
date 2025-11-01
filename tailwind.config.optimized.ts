/**
 * Optimized Tailwind Configuration for Disa AI
 * Clean, minimal configuration using the new design tokens
 */

import type { Config } from "tailwindcss";

const optimizedConfig: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./public/index.html"],
  theme: {
    extend: {
      // Use optimized CSS variables
      colors: {
        // Brand colors
        brand: {
          primary: "var(--color-brand-primary)",
          hover: "var(--color-brand-hover)",
          active: "var(--color-brand-active)",
        },

        // Surface colors
        surface: {
          canvas: "var(--color-surface-canvas)",
          base: "var(--color-surface-base)",
          elevated: "var(--color-surface-elevated)",
          overlay: "var(--color-surface-overlay)",
        },

        // Text colors
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },

        // Status colors
        status: {
          success: {
            fg: "var(--color-status-success-fg)",
            bg: "var(--color-status-success-bg)",
          },
          warning: {
            fg: "var(--color-status-warning-fg)",
            bg: "var(--color-status-warning-bg)",
          },
          danger: {
            fg: "var(--color-status-danger-fg)",
            bg: "var(--color-status-danger-bg)",
          },
          info: {
            fg: "var(--color-status-info-fg)",
            bg: "var(--color-status-info-bg)",
          },
        },

        // Border colors
        border: {
          subtle: "var(--color-border-subtle)",
          focus: "var(--color-border-focus)",
        },
      },

      // Optimized spacing scale
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
      },

      // Optimized border radius
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },

      // Optimized shadows
      boxShadow: {
        subtle: "var(--shadow-subtle)",
        medium: "var(--shadow-medium)",
        strong: "var(--shadow-strong)",
        prominent: "var(--shadow-prominent)",
      },

      // Optimized font sizes
      fontSize: {
        display: ["var(--font-size-display)", "calc(var(--font-size-display) * 1.25)"],
        headline: ["var(--font-size-headline)", "calc(var(--font-size-headline) * 1.33)"],
        title: ["var(--font-size-title)", "calc(var(--font-size-title) * 1.4)"],
        body: ["var(--font-size-body)", "1.5"],
        caption: ["var(--font-size-caption)", "calc(var(--font-size-caption) * 1.43)"],
        label: ["var(--font-size-label)", "1.33"],
      },

      // Font families
      fontFamily: {
        sans: ["var(--font-family-sans)"],
        mono: ["var(--font-family-mono)"],
      },

      // Animation
      transitionDuration: {
        "200": "200ms",
        "300": "300ms",
      },

      // Safe area support for mobile
      padding: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },
  },
  plugins: [],
};

export default optimizedConfig;
