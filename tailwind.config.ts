import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
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
