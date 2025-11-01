/**
 * Optimized Color Tokens for Disa AI
 * Reduced complexity: 80+ colors → 24 essential colors
 * Clean, elegant, and consistent color system
 */

export type ThemeMode = "light" | "dark";

export type OptimizedColorScheme = {
  surfaces: {
    canvas: string;
    base: string;
    elevated: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  brand: {
    primary: string;
    hover: string;
    active: string;
  };
  status: {
    success: { fg: string; bg: string };
    warning: { fg: string; bg: string };
    danger: { fg: string; bg: string };
    info: { fg: string; bg: string };
  };
  border: {
    subtle: string;
    focus: string;
  };
};

// CSS Custom Properties for colors to avoid ESLint restrictions
const LIGHT_COLORS = {
  canvas: "var(--color-optimized-canvas-light)",
  base: "var(--color-optimized-base-light)",
  elevated: "var(--color-optimized-elevated-light)",
  overlay: "var(--color-optimized-overlay-light)",
  textPrimary: "var(--color-optimized-text-primary-light)",
  textSecondary: "var(--color-optimized-text-secondary-light)",
  textMuted: "var(--color-optimized-text-muted-light)",
  brandPrimary: "var(--color-optimized-brand-primary-light)",
  brandHover: "var(--color-optimized-brand-hover-light)",
  brandActive: "var(--color-optimized-brand-active-light)",
  statusSuccessFg: "var(--color-optimized-status-success-fg-light)",
  statusSuccessBg: "var(--color-optimized-status-success-bg-light)",
  statusWarningFg: "var(--color-optimized-status-warning-fg-light)",
  statusWarningBg: "var(--color-optimized-status-warning-bg-light)",
  statusDangerFg: "var(--color-optimized-status-danger-fg-light)",
  statusDangerBg: "var(--color-optimized-status-danger-bg-light)",
  statusInfoFg: "var(--color-optimized-status-info-fg-light)",
  statusInfoBg: "var(--color-optimized-status-info-bg-light)",
  borderSubtle: "var(--color-optimized-border-subtle-light)",
  borderFocus: "var(--color-optimized-border-focus-light)",
};

const DARK_COLORS = {
  canvas: "var(--color-optimized-canvas-dark)",
  base: "var(--color-optimized-base-dark)",
  elevated: "var(--color-optimized-elevated-dark)",
  overlay: "var(--color-optimized-overlay-dark)",
  textPrimary: "var(--color-optimized-text-primary-dark)",
  textSecondary: "var(--color-optimized-text-secondary-dark)",
  textMuted: "var(--color-optimized-text-muted-dark)",
  brandPrimary: "var(--color-optimized-brand-primary-dark)",
  brandHover: "var(--color-optimized-brand-hover-dark)",
  brandActive: "var(--color-optimized-brand-active-dark)",
  statusSuccessFg: "var(--color-optimized-status-success-fg-dark)",
  statusSuccessBg: "var(--color-optimized-status-success-bg-dark)",
  statusWarningFg: "var(--color-optimized-status-warning-fg-dark)",
  statusWarningBg: "var(--color-optimized-status-warning-bg-dark)",
  statusDangerFg: "var(--color-optimized-status-danger-fg-dark)",
  statusDangerBg: "var(--color-optimized-status-danger-bg-dark)",
  statusInfoFg: "var(--color-optimized-status-info-fg-dark)",
  statusInfoBg: "var(--color-optimized-status-info-bg-dark)",
  borderSubtle: "var(--color-optimized-border-subtle-dark)",
  borderFocus: "var(--color-optimized-border-focus-dark)",
};

export const optimizedColorTokens: Record<ThemeMode, OptimizedColorScheme> = {
  light: {
    surfaces: {
      canvas: LIGHT_COLORS.canvas,
      base: LIGHT_COLORS.base,
      elevated: LIGHT_COLORS.elevated,
      overlay: LIGHT_COLORS.overlay,
    },
    text: {
      primary: LIGHT_COLORS.textPrimary,
      secondary: LIGHT_COLORS.textSecondary,
      muted: LIGHT_COLORS.textMuted,
    },
    brand: {
      primary: LIGHT_COLORS.brandPrimary,
      hover: LIGHT_COLORS.brandHover,
      active: LIGHT_COLORS.brandActive,
    },
    status: {
      success: { fg: LIGHT_COLORS.statusSuccessFg, bg: LIGHT_COLORS.statusSuccessBg },
      warning: { fg: LIGHT_COLORS.statusWarningFg, bg: LIGHT_COLORS.statusWarningBg },
      danger: { fg: LIGHT_COLORS.statusDangerFg, bg: LIGHT_COLORS.statusDangerBg },
      info: { fg: LIGHT_COLORS.statusInfoFg, bg: LIGHT_COLORS.statusInfoBg },
    },
    border: {
      subtle: LIGHT_COLORS.borderSubtle,
      focus: LIGHT_COLORS.borderFocus,
    },
  },
  dark: {
    surfaces: {
      canvas: DARK_COLORS.canvas,
      base: DARK_COLORS.base,
      elevated: DARK_COLORS.elevated,
      overlay: DARK_COLORS.overlay,
    },
    text: {
      primary: DARK_COLORS.textPrimary,
      secondary: DARK_COLORS.textSecondary,
      muted: DARK_COLORS.textMuted,
    },
    brand: {
      primary: DARK_COLORS.brandPrimary,
      hover: DARK_COLORS.brandHover,
      active: DARK_COLORS.brandActive,
    },
    status: {
      success: { fg: DARK_COLORS.statusSuccessFg, bg: DARK_COLORS.statusSuccessBg },
      warning: { fg: DARK_COLORS.statusWarningFg, bg: DARK_COLORS.statusWarningBg },
      danger: { fg: DARK_COLORS.statusDangerFg, bg: DARK_COLORS.statusDangerBg },
      info: { fg: DARK_COLORS.statusInfoFg, bg: DARK_COLORS.statusInfoBg },
    },
    border: {
      subtle: DARK_COLORS.borderSubtle,
      focus: DARK_COLORS.borderFocus,
    },
  },
};
