import type { Config } from "tailwindcss";
import { neonGlassPlugin } from "./src/styles/plugins/neon";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  safelist: [
    // Existing component classes
    "card-solid",
    "card-glass",
    "surface-glass",
    "btn",
    "btn-primary",
    "btn-ghost",
    "btn-danger",
    "bubble",
    "bubble-user",
    "bubble-assistant",
    // Dynamic chat UI classes - prefer data-attributes over string concatenation
    // Text colors for status/feedback
    "text-red-500",
    "text-red-600",
    "text-green-500",
    "text-green-600",
    "text-yellow-500",
    "text-yellow-600",
    // Background colors for dark theme surfaces
    "bg-slate-800",
    "bg-slate-900",
    "bg-zinc-800",
    "bg-zinc-900",
    // Border colors for dividers/containers
    "border-slate-700",
    "border-slate-800",
    "border-zinc-700",
    "border-zinc-800",
    // Border radius for dynamic sizing
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    // Shadows for elevation states
    "shadow-sm",
    "shadow-md",
  ],
  // Note: For dynamic variants, prefer data-attributes in HTML:
  // <div data-status="error" class="data-[status=error]:text-red-500">
  // instead of string concatenation: `text-${status}-500`
  theme: {
    extend: {
      saturate: {
        106: "1.06",
        110: "1.1",
        115: "1.15",
      },
      colors: {
        // Aurora palette (used by gradients/effects)
        aurora: {
          pink: "#FF85E1",
          magenta: "#BF5AF2",
          violet: "#7C4DFF",
          blue: "#5B8CFF",
          cyan: "#22D3EE",
        },
        // Legacy tokens still referenced in styles
        bg: "var(--bg)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        // Shadcn-style semantic tokens (HSL variables)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Extra surface/border tokens used by glass styles
        "surface-glass": "var(--surface-glass)",
        "border-glass": "var(--border-glass)",
        // Neon theme colors
        "bg-primary": "var(--bg-primary)",
        "bg-surface": "var(--bg-surface)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "accent-1": "var(--accent-1)",
        "accent-2": "var(--accent-2)",
        "accent-3": "var(--accent-3)",
      },
      borderRadius: {
        lg: "16px",
        md: "14px",
        sm: "12px",
        full: "9999px",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        glow: "var(--glow-primary)",
        // Used by components and utilities in CSS via @apply
        card: "var(--shadow-soft)",
        ring: "0 0 0 2px hsl(var(--ring))",
      },
      backgroundImage: {
        "grad-primary": "var(--grad-primary)",
        "grad-card": "var(--grad-card)",
        "orb-radial": "var(--orb-radial)",
        // Neon theme gradients
        "brand-gradient": "var(--brand-gradient)",
      },
    },
  },
  plugins: [neonGlassPlugin],
};

export default config;
