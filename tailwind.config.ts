/* eslint-disable */
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        // Modern Slate Glass - Unified Design System
        bg: {
          app: "#131314", // Deep Dark (OLED friendly but soft)
          surface: "#1E1E20", // Main Surface
        },
        surface: {
          1: "#1E1E20", // Cards / Panels
          2: "#27272A", // Inputs / Hover states
          3: "#3F3F46", // Active / Borders
          inset: "#09090B", // Deep zones (code blocks)
        },
        ink: {
          primary: "#F4F4F5", // Zinc 100 (High contrast text)
          secondary: "#A1A1AA", // Zinc 400 (Supporting text)
          tertiary: "#71717A", // Zinc 500 (Meta text)
          muted: "#52525B", // Zinc 600 (Disabled/Very subtle)
        },
        accent: {
          primary: "#6366f1", // Indigo 500 (Primary actions & CTAs)
          "primary-dim": "rgba(99, 102, 241, 0.1)", // For backgrounds
          secondary: "#8b5cf6", // Purple (Brand identity, special features)
          tertiary: "#06b6d4", // Cyan (Links, info states)
        },
        border: {
          ink: "#27272A", // Very subtle border
          DEFAULT: "rgba(255, 255, 255, 0.1)", // Standard border (more visible)
          subtle: "rgba(255, 255, 255, 0.05)", // Subtle border
          medium: "rgba(255, 255, 255, 0.15)", // Interactive borders
          strong: "rgba(255, 255, 255, 0.2)", // Focus/active borders
        },
        status: {
          error: "#ef4444", // Red 500
          success: "#22c55e", // Green 500
          warning: "#eab308", // Yellow 500
          info: "#06b6d4", // Cyan 500
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
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      borderRadius: {
        "3xl": "1.5rem", // 24px
        "2xl": "1rem", // 16px (Standard Card)
        xl: "0.75rem", // 12px (Standard Button)
        lg: "0.5rem", // 8px
        md: "0.375rem", // 6px
        sm: "0.25rem", // 4px
      },
      boxShadow: {
        // Functional shadows only, no glow
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        inset: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "logo-float": "logo-float 6s ease-in-out infinite",
        "logo-scale-pulse": "logo-scale-pulse 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "logo-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3%)" }, // Very subtle vertical movement
        },
        "logo-scale-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(0.98)" }, // Subtle breathing effect
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
        // Standardized glass effects - use sparingly
        ".glass-header": {
          "@apply bg-surface-2/90 backdrop-blur-md": {},
        },
        ".glass-overlay": {
          "@apply bg-surface-1/80 backdrop-blur-sm": {},
        },
        ".glass-subtle": {
          "@apply bg-surface-1/60": {},
        },
      });
    }),
  ],
} satisfies Config;
