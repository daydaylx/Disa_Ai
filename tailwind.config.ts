/* eslint-disable */
import type { Config } from "tailwindcss";
import {
  fixedFontSizes,
  tailwindColors,
  tailwindFontFamily,
  tailwindMotion,
  tailwindRadii,
  tailwindShadows,
  tailwindSpacing,
  textStyles,
} from "./src/theme/tokens";

const fontSize = Object.entries(textStyles).reduce<
  Record<string, string | [string, Record<string, string>]>
>((acc, [token, style]) => {
  const key = token
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");

  acc[key] = [
    style.fontSize,
    {
      lineHeight: style.lineHeight,
      fontWeight: `${style.fontWeight}`,
      ...(style.letterSpacing ? { letterSpacing: style.letterSpacing } : {}),
      ...(style.textTransform ? { textTransform: style.textTransform } : {}),
    },
  ];

  return acc;
}, {});

fontSize.badge = fixedFontSizes.badge;
fontSize.input = fixedFontSizes.input;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: tailwindColors,
      spacing: tailwindSpacing,
      borderRadius: tailwindRadii,
      boxShadow: tailwindShadows,
      fontFamily: tailwindFontFamily,
      fontSize,
      transitionDuration: tailwindMotion.duration,
      transitionTimingFunction: tailwindMotion.easing,
      minHeight: {
        "touch-compact": tailwindSpacing["touch-compact"],
        "touch-comfortable": tailwindSpacing["touch-comfortable"],
        "touch-relaxed": tailwindSpacing["touch-relaxed"],
        "touch-spacious": tailwindSpacing["touch-spacious"],
        "screen-dynamic": "var(--vh, 100dvh)",
        "screen-small": "100svh",
        "screen-large": "100lvh",
      },
      height: {
        "touch-compact": tailwindSpacing["touch-compact"],
        "touch-comfortable": tailwindSpacing["touch-comfortable"],
        "touch-relaxed": tailwindSpacing["touch-relaxed"],
        "touch-spacious": tailwindSpacing["touch-spacious"],
        "screen-dynamic": "var(--vh, 100dvh)",
        "screen-small": "100svh",
        "screen-large": "100lvh",
      },
      padding: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      margin: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },
  },
  safelist: [
    {
      pattern: /(grid|flex|gap|items|justify)-(.*)/,
    },
  ],
  plugins: [],
} satisfies Config;
