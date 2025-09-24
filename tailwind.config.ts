import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        "bg-base": "var(--bg-base)",
        "bg-elevated": "var(--bg-elevated)",
        "text-default": "var(--text-default)",
        "text-muted": "var(--text-muted)",
        "text-inverted": "var(--text-inverted)",
        danger: "#ef4444",
      },
      spacing: {
        "0": "0",
        "0.5": "0.125rem",
        "1": "0.25rem",
        "1.5": "0.375rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "6": "1.5rem",
        "8": "2rem",
        "12": "3rem",
      },
      borderRadius: {
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        elevated: "0 10px 30px -10px var(--color-primary-shadow, rgba(0,0,0,0.2))",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "scale-in": {
          from: { transform: "scale(.98)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in .18s ease-out",
        "scale-in": "scale-in .18s ease-out",
        "spin-slow": "spin-slow 3s linear infinite",
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
