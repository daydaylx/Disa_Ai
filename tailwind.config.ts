/* eslint-disable */
import type { Config } from "tailwindcss";

const colorTokens = {
  bg: {
    0: "var(--bg0)",
    1: "var(--bg1)",
    2: "var(--bg2)",
  },
  surface: {
    bg: "var(--surface-bg)",
    base: "var(--surface-base)",
    card: "var(--surface-card)",
    panel: "var(--surface-panel)",
    inline: "var(--surface-inline)",
    chat: "var(--surface-chat)",
    glass: "var(--surface-glass)",
    glassStrong: "var(--surface-glass-strong)",
  },
  text: {
    DEFAULT: "var(--text-primary)",
    primary: "var(--text-primary)",
    muted: "var(--text-muted)",
    subtle: "var(--text-tertiary)",
    inverted: "var(--text-inverted)",
  },
  accent: {
    DEFAULT: "var(--accent)",
    alt: "var(--accent-alt)",
    soft: "var(--accent-soft)",
  },
  line: {
    DEFAULT: "var(--line)",
    subtle: "var(--line-subtle)",
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
  5: "var(--space-5)",
  6: "var(--space-6)",
  8: "var(--space-8)",
  12: "var(--space-12)",
};

const radii = {
  none: "0px",
  xs: "var(--radius-xs)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  full: "9999px",
};

const boxShadows = {
  light: "var(--shadow-light)",
  heavy: "var(--shadow-heavy)",
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
        subtle: "var(--backdrop-blur-subtle)",
        medium: "var(--backdrop-blur-medium)",
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

/* Notes: Tailwind now maps directly to the new centralized CSS variables (colors, spacing, radii, shadows, motion) so components consume the design tokens consistently. All new components must use the centralized design system from design-tokens.css. */
