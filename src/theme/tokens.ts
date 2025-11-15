/**
 * Design System Tokens
 * Verbindliche Definitionen für Radii, Shadows, Spacing & Glass-Opacity
 */

export const tokens = {
  radii: {
    xs: "6px", // Kleinste Elemente
    sm: "10px", // Standard Buttons, Inputs
    md: "14px", // Karten, Panels, größere Elemente
    lg: "18px", // Hauptcontainer, Dialoge
    xl: "24px", // Maximaler Radius für spezielle Fälle
  },

  shadows: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.16)", // Standard-Card
    lg: "0 8px 24px rgba(0, 0, 0, 0.32)", // Floating / Modal
  },

  spacing: {
    "3xs": "4px", // 4px
    "2xs": "8px", // 8px
    xs: "12px", // 12px
    sm: "16px", // 16px
    md: "24px", // 24px
  },

  glass: {
    opacity: {
      light: 0.12, // Leichte Glass-Opacity
      medium: 0.18, // Mittlere Glass-Opacity (Standard)
      dark: 0.24, // Dunklere Glass-Opacity für Mobile
    },
    backdropBlur: {
      xs: "8px",
      sm: "12px",
      md: "16px",
      lg: "24px",
    },
  },

  // Accessibility and contrast enhancements
  accessibility: {
    focusRing: {
      width: "2px",
      offset: "2px",
    },
    highContrast: {
      borderWidth: "2px",
    },
    reducedMotion: {
      duration: "0.01ms",
      iterationCount: 1,
    },
  },

  // Color contrast improvements
  contrast: {
    normal: 4.5, // Minimum AA contrast ratio
    enhanced: 7, // AAA contrast ratio
  },

  // Color palette - consistent primary, accent, and danger colors
  colors: {
    primary: {
      DEFAULT: "var(--color-primary)", // Violet
      hover: "var(--color-primary-hover)",
      active: "var(--color-primary-active)",
      contrast: "var(--color-primary-contrast)", // Dark text on primary
    },
    accent: {
      DEFAULT: "var(--color-accent)", // Same as primary
      soft: "var(--color-accent-soft)",
      strong: "var(--color-accent-strong)",
      contrast: "var(--color-accent-contrast)",
      border: "var(--color-accent-border)",
    },
    danger: {
      DEFAULT: "var(--color-danger)", // Red
      soft: "var(--color-danger-soft)",
      strong: "var(--color-danger-strong)",
      contrast: "var(--color-danger-contrast)",
      border: "var(--color-danger-border)",
    },
    success: {
      DEFAULT: "var(--color-success)", // Green
      soft: "var(--color-success-soft)",
      strong: "var(--color-success-strong)",
      contrast: "var(--color-success-contrast)",
      border: "var(--color-success-border)",
    },
    warning: {
      DEFAULT: "var(--color-warning)", // Amber
      soft: "var(--color-warning-soft)",
      strong: "var(--color-warning-strong)",
      contrast: "var(--color-warning-contrast)",
      border: "var(--color-warning-border)",
    },
    neutral: {
      bg: "var(--color-neutral-bg)", // Dark background
      surface: "var(--color-neutral-surface)", // Card surface
      border: "var(--color-neutral-border)",
      text: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        tertiary: "var(--color-text-tertiary)",
        muted: "var(--color-text-muted)",
        inverse: "var(--color-text-inverse)",
      },
    },
  },

  // Typography system
  typography: {
    fontFamily: {
      sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
    },
  },
} as const;

export type Tokens = typeof tokens;
