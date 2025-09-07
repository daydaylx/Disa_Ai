import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,html}",
    "./tests/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New Aurora Palette
        aurora: {
          pink: "#FF85E1",
          magenta: "#BF5AF2",
          violet: "#7C4DFF",
          blue: "#5B8CFF",
          cyan: "#22D3EE",
        },
        // Base colors mapped to CSS variables
        bg: "var(--bg)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        // States
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
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
      },
      backgroundImage: {
        "grad-primary": "var(--grad-primary)",
        "grad-card": "var(--grad-card)",
        "orb-radial": "var(--orb-radial)",
      },
    },
  },
  plugins: [],
};

export default config;
