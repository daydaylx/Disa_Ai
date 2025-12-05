/* eslint-disable */
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        // Calm Productivity Palette
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
          primary: "#6366f1", // Indigo 500 (Calm, professional accent)
          "primary-dim": "rgba(99, 102, 241, 0.1)", // For backgrounds
          secondary: "#818CF8", // Indigo 400
        },
        border: {
          ink: "#27272A", // Very subtle border
        },
        status: {
          error: "#ef4444", // Red 500
          success: "#22c55e", // Green 500
          warning: "#eab308", // Yellow 500
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
        // Functional glass, only for sticky headers/overlays
        ".glass-blur": {
          "backdrop-filter": "blur(12px)",
          "-webkit-backdrop-filter": "blur(12px)",
        },
      });
    }),
  ],
} satisfies Config;
