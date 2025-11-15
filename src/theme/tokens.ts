/**
 * Design System Tokens
 * Verbindliche Definitionen für Radii, Shadows, Spacing & Glass-Opacity
 */

export const tokens = {
  radii: {
    xs: '6px',   // Kleinste Elemente
    sm: '10px',  // Standard Buttons, Inputs
    md: '14px',  // Karten, Panels, größere Elemente
    lg: '18px',  // Hauptcontainer, Dialoge
    xl: '24px',  // Maximaler Radius für spezielle Fälle
  },

  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.16)',    // Standard-Card
    lg: '0 8px 24px rgba(0, 0, 0, 0.32)',   // Floating / Modal
  },

  spacing: {
    '3xs': '4px',  // 4px
    '2xs': '8px',  // 8px
    xs: '12px',    // 12px
    sm: '16px',    // 16px
    md: '24px',    // 24px
  },

  glass: {
    opacity: {
      'light': 0.12,  // Leichte Glass-Opacity
      'medium': 0.18, // Mittlere Glass-Opacity (Standard)
      'dark': 0.24,   // Dunklere Glass-Opacity für Mobile
    },
    backdropBlur: {
      xs: '8px',
      sm: '12px',
      md: '16px',
      lg: '24px',
    },
  },

  // Accessibility and contrast enhancements
  accessibility: {
    focusRing: {
      width: '2px',
      offset: '2px',
    },
    highContrast: {
      borderWidth: '2px',
    },
    reducedMotion: {
      duration: '0.01ms',
      iterationCount: 1,
    },
  },

  // Color contrast improvements
  contrast: {
    normal: 4.5,  // Minimum AA contrast ratio
    enhanced: 7,  // AAA contrast ratio
  },

  // Color palette - consistent primary, accent, and danger colors
  colors: {
    primary: {
      DEFAULT: '#8B5CF6',  // Violet
      hover: '#7C3AED',
      active: '#6D28D9',
      contrast: '#0B0F14',  // Dark text on primary
    },
    accent: {
      DEFAULT: '#8B5CF6',  // Same as primary
      soft: '#EDE9FE',
      strong: '#7C3AED',
      contrast: '#0B0F14',
      border: 'color-mix(in srgb, #8B5CF6 60%, transparent)',
    },
    danger: {
      DEFAULT: '#EF4444',  // Red
      soft: '#FEE2E2',
      strong: '#DC2626',
      contrast: '#FFFFFF',
      border: 'color-mix(in srgb, #EF4444 60%, transparent)',
    },
    success: {
      DEFAULT: '#10B981',  // Green
      soft: '#D1FAE5',
      strong: '#059669',
      contrast: '#FFFFFF',
      border: 'color-mix(in srgb, #10B981 60%, transparent)',
    },
    warning: {
      DEFAULT: '#F59E0B',  // Amber
      soft: '#FFFBEB',
      strong: '#D97706',
      contrast: '#FFFFFF',
      border: 'color-mix(in srgb, #F59E0B 60%, transparent)',
    },
    neutral: {
      bg: '#0F1420',  // Dark background
      surface: '#151D31',  // Card surface
      border: 'color-mix(in srgb, white 18%, transparent)',
      text: {
        primary: '#F5F6FF',
        secondary: '#C2C7DA',
        tertiary: '#8D94AD',
        muted: '#6F738B',
        inverse: '#0B0F14',
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
      xs: '0.75rem',   // 12px
      sm: '0.875rem', // 14px
      base: '1rem',   // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem',  // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
    },
  },
} as const;

export type Tokens = typeof tokens;