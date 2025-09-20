import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Unified spacing scale (4 / 8 / 12 / 16 / 24 / 32 / 48)
    spacing: {
      "0": "0",
      "1": "4px",
      "2": "8px",
      "3": "12px",
      "4": "16px",
      "6": "24px",
      "8": "32px",
      "12": "48px",
    },

    // Consistent border radius system (6 / 10 / 14)
    borderRadius: {
      none: "0",
      sm: "6px",
      DEFAULT: "10px",
      md: "10px",
      lg: "14px",
      xl: "18px",
      full: "9999px",
    },

    // Typography scale with consistent line heights
    fontSize: {
      xs: ["12px", "16px"], // Meta text
      sm: ["13px", "18px"], // Small text
      base: ["16px", "24px"], // Body text
      lg: ["18px", "24px"], // Section headings
      xl: ["20px", "24px"], // Page titles
      "2xl": ["24px", "32px"], // Display text
    },

    // Simplified color system - zinc neutral + one accent
    colors: {
      transparent: "transparent",
      current: "currentColor",
      accent: {
        DEFAULT: "var(--accent-500)",
        hover: "var(--accent-600)",
        active: "var(--accent-700)",
        disabled: "var(--accent-disabled)",
      },
      surface: {
        100: "var(--color-surface-100)",
        200: "var(--color-surface-200)",
        300: "var(--color-surface-300)",
      },
      border: {
        subtle: "var(--color-border-subtle)",
        strong: "var(--color-border-strong)",
      },
      text: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        muted: "var(--color-text-muted)",
      },
      danger: "var(--danger-500)",
      success: "var(--success-500)",
      warning: "var(--warning-500)",
      background: "var(--color-bg-800)",
    },

    boxShadow: {
      none: "none",
      elev1: "var(--elevation-1)",
      elev2: "var(--elevation-2)",
    },

    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
    },

    extend: {
      transitionDuration: {
        fast: "140ms",
        normal: "200ms",
      },
    },
  },
  plugins: [],
};

export default config;
