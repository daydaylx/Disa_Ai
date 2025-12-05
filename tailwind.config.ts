/* eslint-disable */
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        // Modern Slate Glass Palette
        bg: {
          app: "#131314", // Deep OLED-friendly dark
          page: "#131314",
          surface: "#1E1E20",
          "surface-hover": "#27272A",
        },
        surface: {
          1: "#1E1E20", // Cards
          2: "#27272A", // Hover / Inputs
          3: "#3F3F46", // Borders / Dividers
          inset: "#000000", // For distinct deep zones
        },
        ink: {
          primary: "#F4F4F5", // Zinc 100
          secondary: "#A1A1AA", // Zinc 400
          tertiary: "#71717A", // Zinc 500
          muted: "#52525B", // Zinc 600
        },
        accent: {
          primary: "#60A5FA", // Blue 400
          secondary: "#818CF8", // Indigo 400
          "primary-dim": "rgba(96, 165, 250, 0.1)",
        },
        border: {
          ink: "#3F3F46", // Zinc 700
        },
        status: {
          error: "#F87171", // Red 400
          success: "#4ADE80", // Green 400
          warning: "#FBBF24", // Amber 400
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
        "3xl": "1.5rem",
        "2xl": "1rem",
        xl: "0.75rem",
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        raise: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        raiseLg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
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
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
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
        ".glass-panel": {
          "background-color": "rgba(30, 30, 32, 0.7)",
          "backdrop-filter": "blur(12px)",
          "-webkit-backdrop-filter": "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
      });
    }),
  ],
} satisfies Config;
