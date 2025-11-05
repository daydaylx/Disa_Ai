/* eslint-disable */
import type { Config } from "tailwindcss";

const tailwindColors = {
  // Simplified color system
  primary: "#4b63ff",
  secondary: "#676d82",
  background: "#fdfdff",
  surface: "#f4f6fb",
  text: {
    primary: "#0f1724",
    secondary: "#4a5163",
    muted: "#7d8398",
  },
};

const tailwindSpacing = {
  "touch-compact": "44px",
  "touch-comfortable": "48px",
  "touch-relaxed": "56px",
  "touch-spacious": "64px",
};

const tailwindRadii = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
};

const tailwindShadows = {
  "neo-sm": "0 2px 8px rgba(0, 0, 0, 0.04)",
  "neo-md": "0 4px 16px rgba(0, 0, 0, 0.08)",
  "neo-lg": "0 8px 32px rgba(0, 0, 0, 0.12)",
  "neo-xl": "0 16px 48px rgba(0, 0, 0, 0.16)",
};

const tailwindFontFamily = {
  sans: ["Inter", "system-ui", "sans-serif"],
};

const fixedFontSizes = {
  badge: "10px",
  input: "14px",
};

const textStyles = {
  "title-base": {
    fontSize: "20px",
    lineHeight: "28px",
    fontWeight: 600,
    letterSpacing: "-0.025em",
  },
};

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
      fontSize: {
        ...fixedFontSizes,
        ...Object.entries(textStyles).reduce<
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
              letterSpacing: style.letterSpacing || undefined,
            },
          ];

          return acc;
        }, {}),
      },
      transitionDuration: {
        small: "150ms",
        medium: "200ms",
        large: "300ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",
        emphasized: "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
        accelerate: "cubic-bezier(0.3, 0.0, 1, 1)",
        decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)",
      },
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
    function ({ addUtilities }: any) {
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

        // Touch Target Utilities
        ".touch-target": {
          minHeight: "44px",
          minWidth: "44px",
        },
        ".touch-target-preferred": {
          minHeight: "48px",
          minWidth: "48px",
        },

        // Android Safe Areas
        ".safe-y": {
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        },
        ".safe-x": {
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        },

        // Android Scroll Optimizations
        ".android-scroll": {
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        },
      };

      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
