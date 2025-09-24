import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0f0a25",
          soft: "rgba(255,255,255,0.04)",
          softer: "rgba(255,255,255,0.03)",
          line: "rgba(255,255,255,0.1)",
        },
        text: {
          primary: "rgba(255,255,255,0.95)",
          secondary: "rgba(255,255,255,0.7)",
          muted: "rgba(255,255,255,0.6)",
        },
        accent: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        danger: { 500: "#ef4444" },
      },
      borderRadius: {
        xs: "0.375rem",
        sm: "0.625rem",
        md: "0.875rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.75rem",
      },
      spacing: { 13: "3.25rem", 15: "3.75rem", 18: "4.5rem" },
      boxShadow: { glow: "0 0 20px rgba(139,92,246,0.6)", card: "0 10px 30px rgba(0,0,0,0.35)" },
      zIndex: { 1: "1", 5: "5", 60: "60", 99: "99" },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "scale-in": {
          from: { transform: "scale(.98)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "pulse-soft": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(139,92,246,0.4)" },
          "50%": { boxShadow: "0 0 40px 0 rgba(139,92,246,0.6)" },
        },
      },
      animation: {
        "fade-in": "fade-in .18s ease-out",
        "scale-in": "scale-in .18s ease-out",
        "pulse-soft": "pulse-soft 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
  safelist: [
    "shadow-[0_0_20px_rgba(139,92,246,0.6)]",
    "shadow-[0_0_40px_0_rgba(167,139,250,0.6)]",
    "bg-white/5",
    "bg-white/10",
    "border-white/15",
    "border-white/20",
    "text-white/60",
    "text-white/70",
    "text-violet-400",
    "from-violet-600/40",
    "to-fuchsia-500/30",
  ],
} satisfies Config;
