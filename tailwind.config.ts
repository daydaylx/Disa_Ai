/* eslint-disable */
import type { Config } from "tailwindcss";

const colorTokens = {
  bg: {
    0: "var(--bg0)",
    1: "var(--bg1)",
  },
  surface: {
    DEFAULT: "var(--surface)",
    glass: "var(--surface-glass)",
  },
  text: {
    DEFAULT: "var(--fg)",
    muted: "var(--fg-muted)",
    subtle: "var(--fg-subtle)",
  },
  accent: {
    DEFAULT: "var(--accent)",
  },
  line: {
    DEFAULT: "var(--line)",
  },
  status: {
    success: "var(--success)",
    warning: "var(--warning)",
    danger: "var(--danger)",
    info: "var(--info)",
  },
};

const spacingScale = {
  1: "var(--space-1)",
  2: "var(--space-2)",
  3: "var(--space-3)",
  4: "var(--space-4)",
  6: "var(--space-6)",
  8: "var(--space-8)",
  12: "var(--space-12)",
};

const radii = {
  none: "0px",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  full: "9999px",
};

const boxShadows = {
  1: "var(--shadow-1)",
  2: "var(--shadow-2)",
  "glow-accent": "var(--shadow-glow-accent)",
};

const fontSizes = {
  xs: ["12px", { lineHeight: "1.4" }],
  sm: ["14px", { lineHeight: "1.4" }],
  base: ["16px", { lineHeight: "1.5" }],
  lg: ["18px", { lineHeight: "1.5" }],
  xl: ["20px", { lineHeight: "1.5" }],
  "2xl": ["24px", { lineHeight: "1.4" }],
  "3xl": ["28px", { lineHeight: "1.4" }],
  "4xl": ["32px", { lineHeight: "1.4" }],
};

const motionDurations = {
  1: "var(--motion-duration-1)",
  2: "var(--motion-duration-2)",
  3: "var(--motion-duration-3)",
};

const motionEasings = {
  1: "var(--motion-ease-1)",
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
      colors: colorTokens,
      spacing: spacingScale,
      borderRadius: radii,
      boxShadow: boxShadows,
      fontFamily: {
        sans: ["var(--font-family-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-family-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: fontSizes,
      minHeight: {
        ...spacingScale,
        "screen-dynamic": "var(--vh, 100dvh)",
        "screen-small": "100svh",
        "screen-large": "100lvh",
      },
      height: {
        ...spacingScale,
        "screen-dynamic": "var(--vh, 100dvh)",
        "screen-small": "100svh",
        "screen-large": "100lvh",
      },
      transitionDuration: motionDurations,
      transitionTimingFunction: motionEasings,
      backdropBlur: {
        sm: "8px",
        md: "12px",
        lg: "18px",
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
  plugins: [],
} satisfies Config;

/* Notes: Tailwind now maps directly to the new CSS variables (colors, spacing, radii, shadows, motion) so components consume the design tokens consistently. */
