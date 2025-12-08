/* eslint-disable */
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { spacingCssVars } from "./src/styles/tokens/spacing";

const spacingScale = Object.fromEntries(
  Object.entries(spacingCssVars.scale).map(([key, cssVar]) => [key, `var(${cssVar})`]),
);

const semanticSpacingScale = Object.fromEntries(
  Object.entries(spacingCssVars.semantic).map(([key, cssVar]) => [key, `var(${cssVar})`]),
);

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        // Vibrant Glass Theme - Deep Dark Base with Electric Accents
        bg: {
          app: "#09090B", // Zinc 950 (Deepest dark for OLED)
          surface: "#18181B", // Zinc 900 (Main content background)
        },
        surface: {
          glass: "rgba(24, 24, 27, 0.7)", // Glass effect base
          1: "#18181B", // Zinc 900 - Panels
          2: "#27272A", // Zinc 800 - Secondary/Hover
          3: "#3F3F46", // Zinc 700 - Borders/Active
          inset: "#000000", // Deep zones
        },
        brand: {
          primary: "#8b5cf6", // Violet 500 - Main Brand Color
          secondary: "#6366f1", // Indigo 500 - Secondary Accent
          tertiary: "#ec4899", // Pink 500 - Highlights
        },
        ink: {
          primary: "#FAFAFA", // Zinc 50 (Brighter White)
          secondary: "#D4D4D8", // Zinc 300 (Lighter Grey for better readability)
          tertiary: "#A1A1AA", // Zinc 400 (Meta text)
          muted: "#71717A", // Zinc 500
        },
        // Map old accent names to new brand colors for backward compatibility
        accent: {
          primary: "#8b5cf6", // Mapped to Brand Primary (Violet)
          "primary-dim": "rgba(139, 92, 246, 0.15)",
          secondary: "#6366f1", // Indigo
          tertiary: "#06b6d4", // Cyan (kept for info)

          // Semantic Page Accents
          chat: "#8b5cf6",   // Violet (Same as Brand Primary)
          models: "#0ea5e9", // Sky 500 (Cool/Tech feel)
          roles: "#ec4899",  // Pink 500 (Warm/Human feel)
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)", // Lighter, cleaner border
          subtle: "rgba(255, 255, 255, 0.04)",
          medium: "rgba(255, 255, 255, 0.12)",
          strong: "rgba(255, 255, 255, 0.2)",
          highlight: "rgba(139, 92, 246, 0.5)", // Primary colored border
        },
        status: {
          error: "#ef4444", // Red 500
          success: "#10b981", // Emerald 500 (More vibrant than Green)
          warning: "#f59e0b", // Amber 500
          info: "#0ea5e9", // Sky 500
        },
      },
      fontFamily: {
        sans: [
          '"Inter"',
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
      spacing: {
        ...spacingScale,
        ...semanticSpacingScale,
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
        header: "4rem", // Standard header height
      },
      borderRadius: {
        "3xl": "1.5rem",
        "2xl": "1rem",
        xl: "0.75rem",
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)",
        // Glow effects
        "glow-sm": "0 0 10px rgba(139, 92, 246, 0.3)", // Violet glow
        "glow-md": "0 0 20px rgba(139, 92, 246, 0.4)",
        "glow-lg": "0 0 30px rgba(139, 92, 246, 0.5)",
        "glow-text": "0 0 10px rgba(139, 92, 246, 0.5)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        blob: "blob 7s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        // Glass Utilities
        ".glass-panel": {
          "@apply bg-surface-glass backdrop-blur-xl border border-white/10 shadow-lg": {},
        },
        ".glass-header": {
          "@apply bg-bg-app/80 backdrop-blur-xl border-b border-white/5": {},
        },
        ".text-balance": {
          "text-wrap": "balance",
        },
      });
    }),
  ],
} satisfies Config;
