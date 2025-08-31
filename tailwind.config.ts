import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0B0E",
        foreground: "#E4E4E7",
        muted: "#1A1A22",
        border: "#262633",
        primary: { DEFAULT: "#A855F7", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#312E81", foreground: "#C7D2FE" },
        danger: { DEFAULT: "#EF4444", foreground: "#FFFFFF" },
        success: { DEFAULT: "#10B981", foreground: "#06281F" },
        warning: { DEFAULT: "#F59E0B", foreground: "#1E1303" },
      },
      borderRadius: { xl: "1rem", "2xl": "1.5rem" },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,.35)",
        glow: "0 0 24px rgba(168, 85, 247, 0.45)",
        ring: "0 0 0 3px rgba(168, 85, 247, 0.35)",
      },
      backdropBlur: { xs: "2px" },
      transitionDuration: { DEFAULT: "200ms" },
    },
  },
  plugins: [],
} satisfies Config;
