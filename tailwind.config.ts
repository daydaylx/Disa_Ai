import type { Config } from "tailwindcss";
import {
  spacing,
  radii,
  typography,
  elevation,
  transitions,
  breakpoints,
} from "./src/styles/design-tokens";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Design token-based spacing scale
    spacing,

    // Design token-based border radius
    borderRadius: radii,

    // Typography scale from design tokens
    fontSize: {
      xs: ["12px", "16px"], // Meta text
      sm: [typography.label.fontSize, typography.label.lineHeight], // Labels
      base: [typography.body.fontSize, typography.body.lineHeight], // Body
      lg: [typography.subtitle.fontSize, typography.subtitle.lineHeight], // Subtitle
      xl: [typography.h2.fontSize, typography.h2.lineHeight], // H2
      "2xl": [typography.h1.fontSize, typography.h1.lineHeight], // H1
    },

    // Color system using CSS custom properties
    colors: {
      transparent: "transparent",
      current: "currentColor",

      // Accent colors
      accent: {
        DEFAULT: "var(--color-accent-500)",
        hover: "var(--accent-600)",
        active: "var(--color-accent-700)",
        disabled: "var(--accent-disabled)",
        foreground: "var(--color-accent-foreground)",
        outline: "var(--color-accent-outline)",
        subtle: "var(--color-accent-subtle)",
        low: "var(--color-accent-low)",
      },

      // Surface colors
      surface: {
        100: "var(--color-surface-100)",
        200: "var(--color-surface-200)",
        300: "var(--color-surface-300)",
      },

      // Border colors
      border: {
        subtle: "var(--color-border-subtle)",
        strong: "var(--color-border-strong)",
      },

      // Text colors
      text: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        muted: "var(--color-text-muted)",
      },

      // Semantic colors
      danger: "var(--color-danger-500)",
      success: "var(--color-success-500)",
      warning: "var(--color-warning-500)",
      info: "var(--color-info-500)",

      // Background colors
      background: "var(--color-bg-800)",
      "background-deep": "var(--color-bg-900)",

      // Subtle background variants
      "bg-success-subtle": "var(--bg-success-subtle)",
      "bg-purple-subtle": "var(--bg-purple-subtle)",
      "bg-danger-subtle": "var(--bg-danger-subtle)",
      "bg-accent-subtle": "var(--bg-accent-subtle)",
      "bg-accent-low": "var(--bg-accent-low)",
    },

    // Shadow system from design tokens
    boxShadow: {
      none: elevation[0],
      0: elevation[0],
      1: elevation[1],
      2: elevation[2],
      // Legacy support
      elev1: elevation[1],
      elev2: elevation[2],
    },

    // Mobile-first only - no desktop breakpoints
    screens: {
      // Samsung Android specific breakpoints
      xs: "375px", // Galaxy S series
      sm: "390px", // Galaxy S21+
      md: "428px", // Galaxy S22 Ultra
    },

    extend: {
      // Transition durations from design tokens
      transitionDuration: {
        fast: transitions.fast,
        normal: transitions.normal,
        slow: transitions.slow,
      },

      // Touch target utilities
      minWidth: {
        touch: "44px", // Minimum touch target
        "touch-comfortable": "48px", // Comfortable touch target
        "touch-roomy": "56px", // Roomy touch target
      },
      minHeight: {
        touch: "44px",
        "touch-comfortable": "48px",
        "touch-roomy": "56px",
      },

      // Font families
      fontFamily: {
        mono: ["ui-monospace", "SF Mono", "Monaco", "Inconsolata", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
