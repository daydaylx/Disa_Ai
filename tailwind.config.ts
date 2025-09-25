import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic Colors
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",

        // Surface Colors
        "bg-base": "var(--bg-base)",
        "bg-elevated": "var(--bg-elevated)",

        // Text Colors
        "text-default": "var(--text-default)",
        "text-muted": "var(--text-muted)",
        "text-inverted": "var(--text-inverted)",

        // Border Colors
        "border-default": "var(--border-default)",
        "border-muted": "var(--border-muted)",

        // Glass/Aurora effect colors
        "aurora-violet": "var(--aurora-violet-glow)",
        "aurora-purple": "var(--aurora-purple-glow)",
        "glass-bg-subtle": "var(--glass-bg-subtle)",
        "glass-bg-soft": "var(--glass-bg-soft)",
        "glass-bg-medium": "var(--glass-bg-medium)",
        "glass-bg-strong": "var(--glass-bg-strong)",
        "glass-border-subtle": "var(--glass-border-subtle)",
        "glass-border-soft": "var(--glass-border-soft)",
        "glass-border-medium": "var(--glass-border-medium)",
        "glass-border-strong": "var(--glass-border-strong)",
        "glass-text-muted": "var(--glass-text-muted)",
        "glass-text-medium": "var(--glass-text-medium)",

        // Gradient Colors
        "gradient-violet-start": "var(--gradient-violet-start)",
        "gradient-fuchsia-end": "var(--gradient-fuchsia-end)",
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

        // Aurora glow effects using CSS variables
        "aurora-violet": "0 0 20px var(--aurora-violet-glow)",
        "aurora-purple": "0 0 40px var(--aurora-purple-glow)",
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
} satisfies Config;
