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
  plugins: [
    // Dramatic Neomorphism Plugin
    function ({ addUtilities, theme }: any) {
      const newUtilities = {
        // Neo Surface Base Classes
        ".neo-surface-base": {
          backgroundColor: "var(--surface-neumorphic-base)",
          borderRadius: "var(--radius-xl)",
          border: "var(--border-neumorphic-subtle)",
          transition: "all var(--motion-duration-large) var(--motion-easing-standard)",
        },
        ".neo-surface-raised": {
          backgroundColor: "var(--surface-neumorphic-raised)",
          boxShadow: "var(--shadow-neumorphic-md)",
          borderRadius: "var(--radius-xl)",
          border: "var(--border-neumorphic-light)",
          transition: "all var(--motion-duration-large) var(--motion-easing-standard)",
        },
        ".neo-surface-floating": {
          backgroundColor: "var(--surface-neumorphic-floating)",
          boxShadow: "var(--shadow-neumorphic-lg)",
          borderRadius: "var(--radius-xl)",
          border: "var(--border-neumorphic-light)",
          transition: "all var(--motion-duration-large) var(--motion-easing-standard)",
        },
        ".neo-surface-pressed": {
          backgroundColor: "var(--surface-neumorphic-pressed)",
          boxShadow: "var(--shadow-inset-medium)",
          borderRadius: "var(--radius-xl)",
          border: "var(--border-neumorphic-dark)",
          transition: "all var(--motion-duration-large) var(--motion-easing-standard)",
        },

        // Dramatic Shadow Levels
        ".neo-shadow-sm": { boxShadow: "var(--shadow-neumorphic-sm)" },
        ".neo-shadow-md": { boxShadow: "var(--shadow-neumorphic-md)" },
        ".neo-shadow-lg": { boxShadow: "var(--shadow-neumorphic-lg)" },
        ".neo-shadow-xl": { boxShadow: "var(--shadow-neumorphic-xl)" },
        ".neo-shadow-dramatic": { boxShadow: "var(--shadow-neumorphic-dramatic)" },
        ".neo-shadow-extreme": { boxShadow: "var(--shadow-neumorphic-extreme)" },

        // Inset Shadow Levels
        ".neo-inset-subtle": { boxShadow: "var(--shadow-inset-subtle)" },
        ".neo-inset-medium": { boxShadow: "var(--shadow-inset-medium)" },
        ".neo-inset-strong": { boxShadow: "var(--shadow-inset-strong)" },
        ".neo-inset-extreme": { boxShadow: "var(--shadow-inset-extreme)" },

        // Interactive States - Hover Lift
        ".neo-hover-lift-sm:hover": {
          transform: "translateY(-2px)",
          boxShadow: "var(--shadow-neumorphic-md)",
          transition: "all var(--motion-duration-medium) var(--motion-easing-standard)",
        },
        ".neo-hover-lift-md:hover": {
          transform: "translateY(-4px)",
          boxShadow: "var(--shadow-neumorphic-lg)",
          transition: "all var(--motion-duration-medium) var(--motion-easing-standard)",
        },
        ".neo-hover-lift-lg:hover": {
          transform: "translateY(-6px)",
          boxShadow: "var(--shadow-neumorphic-xl)",
          transition: "all var(--motion-duration-medium) var(--motion-easing-standard)",
        },
        ".neo-hover-lift-dramatic:hover": {
          transform: "translateY(-8px)",
          boxShadow: "var(--shadow-neumorphic-dramatic)",
          transition: "all 300ms var(--motion-easing-emphasized)",
        },

        // Interactive States - Press Depth
        ".neo-press-subtle:active": {
          transform: "translateY(1px)",
          boxShadow: "var(--shadow-inset-subtle)",
          transition: "all 150ms var(--motion-easing-accelerate)",
        },
        ".neo-press-medium:active": {
          transform: "translateY(2px)",
          boxShadow: "var(--shadow-inset-medium)",
          transition: "all 150ms var(--motion-easing-accelerate)",
        },
        ".neo-press-deep:active": {
          transform: "translateY(3px)",
          boxShadow: "var(--shadow-inset-strong)",
          transition: "all 150ms var(--motion-easing-accelerate)",
        },

        // Focus States
        ".neo-focus:focus-visible": {
          outline: "none",
          boxShadow: "var(--shadow-focus-neumorphic)",
          borderColor: "var(--acc1)",
          transition: "all var(--motion-duration-medium) var(--motion-easing-standard)",
        },

        // Special Component Utilities
        ".neo-button": {
          backgroundColor: "var(--surface-neumorphic-raised)",
          boxShadow: "var(--shadow-neumorphic-md)",
          borderRadius: "var(--radius-lg)",
          border: "var(--border-neumorphic-light)",
          transition: "all var(--motion-duration-large) var(--motion-easing-standard)",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "var(--shadow-neumorphic-lg)",
          },
          "&:active": {
            transform: "translateY(1px)",
            boxShadow: "var(--shadow-inset-medium)",
          },
        },
        ".neo-input": {
          backgroundColor: "var(--surface-neumorphic-base)",
          boxShadow: "var(--shadow-inset-subtle)",
          borderRadius: "var(--radius-md)",
          border: "var(--border-neumorphic-subtle)",
          transition: "all var(--motion-duration-large) var(--motion-easing-standard)",
          "&:focus": {
            boxShadow: "var(--shadow-focus-neumorphic)",
            borderColor: "var(--acc1)",
          },
        },
        ".neo-card": {
          backgroundColor: "var(--surface-neumorphic-floating)",
          boxShadow: "var(--shadow-neumorphic-lg)",
          borderRadius: "var(--radius-xl)",
          border: "var(--border-neumorphic-light)",
          transition: "all var(--motion-duration-large) var(--motion-easing-standard)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "var(--shadow-neumorphic-xl)",
          },
        },

        // Reduced Motion Support
        "@media (prefers-reduced-motion: reduce)": {
          ".neo-hover-lift-sm:hover, .neo-hover-lift-md:hover, .neo-hover-lift-lg:hover, .neo-hover-lift-dramatic:hover":
            {
              transform: "none",
            },
          ".neo-press-subtle:active, .neo-press-medium:active, .neo-press-deep:active": {
            transform: "none",
          },
          ".neo-button:hover, .neo-button:active": {
            transform: "none",
          },
          ".neo-card:hover": {
            transform: "none",
          },
        },
      };

      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
