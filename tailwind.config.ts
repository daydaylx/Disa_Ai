/* eslint-disable */
import type { Config } from "tailwindcss";

// INK THEME MAPPING
// We map Tailwind utilities directly to the CSS variables defined in src/styles/theme-ink.css

const colorTokens = {
  // Backgrounds
  bg: {
    app: "var(--bg-app)", // Off-white paper
    page: "var(--bg-page)", // Page surface
    surface: "var(--bg-surface)",
  },

  // Ink (Text & Icons)
  ink: {
    primary: "var(--ink-primary)", // Dark Blue-Black
    secondary: "var(--ink-secondary)", // Muted Grey
    tertiary: "var(--ink-tertiary)", // Light Grey - Timestamps, Hints
    onAccent: "var(--ink-on-accent)",
  },

  // Legacy Text Mappings (for compatibility)
  text: {
    DEFAULT: "var(--ink-primary)",
    primary: "var(--ink-primary)",
    secondary: "var(--ink-secondary)",
    muted: "var(--ink-secondary)",
    disabled: "var(--text-disabled)",
  },

  // Accent Colors (Muted Indigo/Violet)
  accent: {
    DEFAULT: "var(--accent-primary)",
    hover: "var(--accent-hover)",
    secondary: "var(--accent-secondary)",
  },

  // Mapping 'brand' and 'primary' to accent for consistency
  primary: {
    DEFAULT: "var(--accent-primary)",
    50: "var(--bg-page)", // Lightest
    100: "var(--bg-surface)",
    500: "var(--accent-primary)",
    600: "var(--accent-hover)",
  },
  brand: {
    DEFAULT: "var(--accent-primary)",
    hover: "var(--accent-hover)",
  },

  // Semantic
  success: { DEFAULT: "var(--color-success)" },
  warning: { DEFAULT: "var(--color-warning)" },
  error: { DEFAULT: "var(--color-error)" },

  // Legacy Surface Mappings
  surface: {
    DEFAULT: "var(--bg-surface)",
    soft: "var(--bg-page)",
    card: "var(--bg-page)",
    overlay: "rgba(255, 255, 255, 0.9)", // Paper overlay
    1: "var(--bg-page)",
    2: "var(--bg-page)",
    base: "var(--bg-app)",
    inset: "var(--surface-inset)",
  },

  neutral: {
    50: "var(--bg-app)",
    900: "var(--ink-primary)",
  },

  // Legacy compatibility for shadcn/ui components
  input: "var(--border-color)",
  ring: "var(--accent-primary)",
  background: "var(--bg-page)",
  foreground: "var(--ink-primary)",
  popover: {
    DEFAULT: "var(--bg-page)",
    foreground: "var(--ink-primary)",
  },
  muted: {
    DEFAULT: "var(--surface-inset)",
    foreground: "var(--ink-secondary)",
  },
};

const spacingScale = {
  0: "0px",
  1: "4px",
  2: "6px",
  3: "8px",
  4: "12px",
  5: "16px",
  6: "20px",
  7: "24px",
  8: "32px",
  9: "40px",
  10: "48px",
};

const radii = {
  none: "0px",
  sm: "var(--r-sm)", // 8px
  md: "var(--r-md)", // 12px
  lg: "var(--r-lg)", // 16px
  full: "9999px",
};

const boxShadows = {
  sm: "var(--shadow-paper)",
  md: "var(--shadow-floating)",
  // Compatibility mappings
  raise: "var(--shadow-paper)",
  raiseLg: "var(--shadow-floating)",
  inset: "var(--shadow-inset)",
  none: "none",
};

const fontSizes = {
  xs: ["12px", { lineHeight: "1.5" }],
  sm: ["14px", { lineHeight: "1.5" }],
  base: ["var(--text-base)", { lineHeight: "var(--leading-normal)" }], // ~17px
  lg: ["19px", { lineHeight: "1.4" }],
  xl: ["22px", { lineHeight: "1.3" }],
  "2xl": ["26px", { lineHeight: "1.2" }],
  "3xl": ["32px", { lineHeight: "1.2" }],
};

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", "[data-theme='dark']"], // Kept class strategy, but we prefer light
  theme: {
    screens: {
      xs: "360px", // Mobile First small
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: colorTokens,
      spacing: spacingScale,
      borderRadius: radii,
      boxShadow: boxShadows,
      borderColor: {
        DEFAULT: "var(--border-color)",
        ink: "var(--border-color)",
      },
      zIndex: {
        // Base layers
        background: "var(--z-background)",
        base: "var(--z-base)",
        content: "var(--z-content)",
        "sticky-header": "var(--z-sticky-header)",
        "sticky-content": "var(--z-sticky-content)",

        // UI Chrome
        header: "var(--z-header)",
        navigation: "var(--z-navigation)",
        "bottom-nav": "var(--z-bottom-nav)",
        sidebar: "var(--z-sidebar)",

        // Overlays
        composer: "var(--z-composer)",
        fab: "var(--z-fab)",
        drawer: "var(--z-drawer)",
        "bottom-sheet": "var(--z-bottom-sheet)",

        // Modals
        "modal-backdrop": "var(--z-modal-backdrop)",
        modal: "var(--z-modal)",

        // Popovers
        popover: "var(--z-popover)",
        dropdown: "var(--z-dropdown)",
        tooltip: "var(--z-tooltip)",

        // System
        toast: "var(--z-toast)",
        notification: "var(--z-notification)",

        // Critical
        "skip-link": "var(--z-skip-link)",
        debug: "var(--z-debug)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["Lora", "serif"],
      },
      fontSize: fontSizes,
      minHeight: {
        "screen-dynamic": "var(--vh, 100dvh)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
        fast: "150ms",
        medium: "300ms",
      },
      // Bookmark Wackel-Animation
      keyframes: {
        "bookmark-wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(3deg)" },
          "75%": { transform: "rotate(-3deg)" },
        },
      },
      animation: {
        "bookmark-wiggle": "bookmark-wiggle 0.4s ease-in-out 2",
      },
      // Remove or redefine legacy gradients to be subtle/invisible
      backgroundImage: {
        "brand-gradient": "none",
        "brand-gradient-soft": "none",
        "metric-gradient": "none",
      },
    },
  },
  plugins: [],
} satisfies Config;
