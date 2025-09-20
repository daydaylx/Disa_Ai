import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Strict 4pt spacing grid - no exceptions
    spacing: {
      "0": "0",
      "1": "4px", // 4pt
      "2": "8px", // 8pt
      "3": "12px", // 12pt
      "4": "16px", // 16pt
      "5": "20px", // 20pt
      "6": "24px", // 24pt
      "8": "32px", // 32pt
      "10": "40px", // 40pt
      "12": "48px", // 48pt
      "16": "64px", // 64pt
      "20": "80px", // 80pt
    },

    // Consistent border radius system
    borderRadius: {
      none: "0",
      sm: "8px",
      DEFAULT: "12px",
      lg: "16px",
      xl: "20px",
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
      // Core neutrals (zinc-based)
      neutral: {
        50: "#fafafa",
        100: "#f4f4f5",
        200: "#e4e4e7",
        300: "#d4d4d8",
        600: "#52525b",
        900: "#18181b",
      },

      // Single accent (cyan for neon theme)
      accent: {
        500: "#22d3ee",
        600: "#0891b2",
      },

      // Semantic colors
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",

      // Dark theme surface colors
      surface: {
        primary: "#0a0a0a",
        secondary: "#111111",
        glass: "rgba(17, 22, 31, 0.55)",
      },

      // Legacy CSS custom properties (keep for existing styles)
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: "hsl(var(--primary))",
      "primary-foreground": "hsl(var(--primary-foreground))",
    },

    // Single shadow for elevation
    boxShadow: {
      none: "none",
      DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.12)",
      glow: "0 0 20px rgba(34, 211, 238, 0.3)",
    },

    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
    },

    extend: {
      // Glass effect utilities
      backdropBlur: {
        glass: "18px",
      },

      // Animation timing
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
        "250": "250ms",
      },
    },
  },
  plugins: [],
};

export default config;
