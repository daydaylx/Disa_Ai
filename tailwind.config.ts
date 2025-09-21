import type { Config } from "tailwindcss";
import {
  spacing,
  borderRadius,
  typography,
  shadows,
  transitions,
  breakpoints,
} from "./src/design-tokens";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Design token-based spacing scale
    spacing,

    // Design token-based border radius
    borderRadius,

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
        DEFAULT: "var(--accent-500)",
        hover: "var(--accent-600)",
        active: "var(--accent-700)",
        disabled: "var(--accent-disabled)",
        foreground: "var(--accent-foreground)",
        outline: "var(--accent-outline)",
        subtle: "var(--accent-subtle)",
        low: "var(--accent-low)",
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
      danger: "var(--danger-500)",
      success: "var(--success-500)",
      warning: "var(--warning-500)",
      info: "var(--info-500)",

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
      none: "none",
      1: shadows[1], // elev1
      2: shadows[2], // elev2
      3: shadows[3], // elev3
      // Legacy support
      elev1: shadows[1],
      elev2: shadows[2],
    },

    // Breakpoints from design tokens
    screens: breakpoints,

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
