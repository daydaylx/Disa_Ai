/* eslint-disable */
import type { Config } from "tailwindcss";

// "DIGITAL SLATE" THEME KONFIGURATION

const slateColors = {
  stone: {
    base: "#1a1b1e", // Dunkles Anthrazit (Hintergrund)
    surface: "#25262b", // Etwas hellerer Stein (Cards)
    highlight: "#2c2e33", // Für Hover-Effekte
  },
  chalk: {
    white: "#f4f4f0", // Haupttext (Gebrochenes Weiß)
    dim: "rgba(244, 244, 240, 0.6)", // Sekundärtext
    yellow: "#facc15", // Akzent Gelb
    blue: "#a5d8ff", // Akzent Blau (Pastell)
    pink: "#fcc2d7", // Akzent Pink (Pastell)
  },
};

const colorTokens = {
  bg: {
    app: slateColors.stone.base,
    page: slateColors.stone.base,
    surface: slateColors.stone.surface,
  },
  ink: {
    primary: slateColors.chalk.white,
    secondary: slateColors.chalk.dim,
    tertiary: "rgba(244, 244, 240, 0.4)",
    onAccent: slateColors.stone.base,
  },
  text: {
    DEFAULT: slateColors.chalk.white,
    primary: slateColors.chalk.white,
    secondary: slateColors.chalk.dim,
    muted: slateColors.chalk.dim,
    disabled: "rgba(244, 244, 240, 0.2)",
  },
  accent: {
    DEFAULT: slateColors.chalk.yellow,
    hover: "#eab308",
    secondary: slateColors.chalk.blue,
  },
  primary: {
    DEFAULT: slateColors.chalk.blue,
    50: slateColors.stone.highlight,
    100: slateColors.stone.surface,
    500: slateColors.chalk.blue,
    600: "#74c0fc",
  },
  brand: {
    DEFAULT: slateColors.chalk.blue,
    hover: "#74c0fc",
  },
  success: { DEFAULT: "#b2f2bb" },
  warning: { DEFAULT: "#ffec99" },
  error: { DEFAULT: "#ffc9c9" },
  surface: {
    DEFAULT: slateColors.stone.surface,
    soft: slateColors.stone.surface,
    card: slateColors.stone.surface,
    overlay: "rgba(26, 27, 30, 0.95)",
    base: slateColors.stone.base,
    inset: "rgba(0, 0, 0, 0.2)",
  },
  slate: slateColors.stone,
  chalk: slateColors.chalk,
  input: slateColors.chalk.dim,
  ring: slateColors.chalk.blue,
  background: slateColors.stone.base,
  foreground: slateColors.chalk.white,
  muted: {
    DEFAULT: slateColors.stone.highlight,
    foreground: slateColors.chalk.dim,
  },
};

const fontSizes = {
  xs: ["12px", { lineHeight: "1.5" }],
  sm: ["14px", { lineHeight: "1.5" }],
  base: ["18px", { lineHeight: "1.6" }],
  lg: ["20px", { lineHeight: "1.5" }],
  xl: ["24px", { lineHeight: "1.3" }],
  "2xl": ["30px", { lineHeight: "1.2" }],
  "3xl": ["36px", { lineHeight: "1.2" }],
};

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    screens: {
      xs: "360px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: colorTokens,
      fontFamily: {
        sans: [
          '"Inter"',
          '"IBM Plex Sans"',
          '"Space Grotesk"',
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "sans-serif",
        ],
        serif: ["Lora", "serif"],
        hand: ['"Patrick Hand"', "cursive"],
      },
      fontSize: fontSizes,
      backgroundImage: {
        "granite-noise": "none", // Removed complex data URI for debugging
      },
      borderRadius: {
        lg: "12px", // Simplified radius
        md: "8px",
        sm: "4px",
      },
      boxShadow: {
        chalk: "2px 4px 6px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
} satisfies Config;
