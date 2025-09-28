/* eslint-disable */
import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        "on-primary": "hsl(var(--on-primary))",
        surface: "hsl(var(--surface))",
        "on-surface": "hsl(var(--on-surface))",
        "surface-variant": "hsl(var(--surface-variant))",
        outline: "hsl(var(--outline))",
        error: "hsl(var(--error))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  safelist: [
    "badge",
    "badge-muted",
    "badge-accent",
    "bubble",
    "bubble-assistant",
    "bubble-user",
    "bubble-system",
  ],
  plugins: [],
} satisfies Config;
