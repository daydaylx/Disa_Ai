/**
 * Fluent 2 inspired color tokens tailored for DisaAI.
 * Values follow the Soft-Depth direction: matte surfaces, soft shadows,
 * high contrast foregrounds and clearly named elevation layers.
 */
/* eslint-disable no-restricted-syntax */

export type ThemeMode = "light" | "dark";

export type SurfaceTokens = {
  canvas: string;
  base: string;
  subtle: string;
  muted: string;
  raised: string;
  card: string;
  popover: string;
  overlay: string;
};

// Card Branding System Tokens
export type CardBrandingTokens = {
  pageBgRgb: string; // RGB values for page background (for notch cutout)
  cardBgRgb: string; // RGB values for card background
  cardBorderRgb: string; // RGB values for card border
  cardBorderAlpha: string; // Default border alpha (0..1)
  cardRadius: string; // Card radius in px
  cardShadow: string; // Default card shadow
  cardShadowPressed: string; // Pressed state shadow
  tintFade: string; // Tint fade percentage
  tintAlphaSoft: string; // Global subtle tint alpha (0.06-0.10)
  tintAlphaStrong: string; // Role/theme strong tint alpha (0.15-0.25)
  brandRgb: string; // Brand color in RGB format
  rolePrimaryRgb: string; // Primary role color in RGB
  roleSecondaryRgb: string; // Secondary role color in RGB
};

export type TextTokens = {
  primary: string;
  secondary: string;
  tertiary: string;
  muted: string;
  inverse: string;
  onBrand: string;
  onAccent: string;
  link: string;
  linkHover: string;
};

export type BorderTokens = {
  hairline: string;
  subtle: string;
  strong: string;
  focus: string;
  divider: string;
};

export type BrandTokens = {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  subtle: string;
  strong: string;
  onPrimary: string;
};

export type StatusTokenSet = {
  fg: string;
  bg: string;
  border: string;
};

export type StatusTokens = {
  success: StatusTokenSet;
  warning: StatusTokenSet;
  danger: StatusTokenSet;
  info: StatusTokenSet;
};

export type ActionTokens = {
  primary: {
    bg: string;
    hover: string;
    active: string;
    fg: string;
    focusRing: string;
  };
  secondary: {
    bg: string;
    hover: string;
    active: string;
    fg: string;
    border: string;
    borderHover: string;
    focusRing: string;
  };
  ghost: {
    fg: string;
    hover: string;
    active: string;
    focusRing: string;
  };
  destructive: {
    bg: string;
    hover: string;
    active: string;
    fg: string;
    focusRing: string;
  };
};

export type ControlTokens = {
  field: {
    bg: string;
    hover: string;
    disabled: string;
    fg: string;
    placeholder: string;
    border: string;
    borderHover: string;
    borderActive: string;
    focusRing: string;
  };
  chip: {
    bg: string;
    fg: string;
    border: string;
    hover: string;
  };
};

export type TableTokens = {
  headerBg: string;
  headerFg: string;
  headerBorder: string;
  rowDivider: string;
  rowHover: string;
};

export type OverlayTokens = {
  scrim: string;
  tooltipBg: string;
  tooltipFg: string;
  toastBg: string;
  toastFg: string;
  toastAccent: string;
  dialogBg: string;
  dialogBorder: string;
};

export type ColorScheme = {
  surfaces: SurfaceTokens;
  text: TextTokens;
  border: BorderTokens;
  brand: BrandTokens;
  status: StatusTokens;
  action: ActionTokens;
  controls: ControlTokens;
  table: TableTokens;
  overlay: OverlayTokens;
  cardBranding: CardBrandingTokens;
};

export const colorTokens: Record<ThemeMode, ColorScheme> = {
  light: {
    surfaces: {
      canvas: "#e9ecf4",
      base: "#fdfdff",
      subtle: "#f4f6fb",
      muted: "#dfe3f0",
      raised: "#fbfcff",
      card: "#fdfdff",
      popover: "#fbfcff",
      overlay: "rgba(15, 18, 32, 0.65)",
    },
    text: {
      primary: "#0f1724",
      secondary: "#4a5163",
      tertiary: "#676d82",
      muted: "#7d8398",
      inverse: "#f6f7ff",
      onBrand: "#f6f7ff",
      onAccent: "#f6f7ff",
      link: "#8B5CF6",
      linkHover: "#7C3AED",
    },
    border: {
      hairline: "rgba(15, 23, 36, 0.06)",
      subtle: "rgba(15, 23, 36, 0.12)",
      strong: "rgba(15, 23, 36, 0.3)",
      focus: "#8B5CF6",
      divider: "rgba(15, 23, 36, 0.1)",
    },
    brand: {
      primary: "#8B5CF6",
      primaryHover: "#7C3AED",
      primaryActive: "#6D28D9",
      subtle: "#EDE9FE",
      strong: "#7C3AED",
      onPrimary: "#ffffff",
    },
    status: {
      success: {
        fg: "#0d8f62",
        bg: "#e8f5ef",
        border: "#72cba4",
      },
      warning: {
        fg: "#b26a00",
        bg: "#fff2d9",
        border: "#ffc266",
      },
      danger: {
        fg: "#c13a32",
        bg: "#ffe5e2",
        border: "#f38b83",
      },
      info: {
        fg: "#0d73d6",
        bg: "#e5f1ff",
        border: "#7cbbff",
      },
    },
    action: {
      primary: {
        bg: "#8B5CF6",
        hover: "#7C3AED",
        active: "#6D28D9",
        fg: "#ffffff",
        focusRing: "rgba(139, 92, 246, 0.35)",
      },
      secondary: {
        bg: "#f2f4fb",
        hover: "#e7eafa",
        active: "#dfe3f5",
        fg: "#0f1724",
        border: "rgba(15, 23, 36, 0.18)",
        borderHover: "rgba(15, 23, 36, 0.3)",
        focusRing: "rgba(139, 92, 246, 0.25)",
      },
      ghost: {
        fg: "#0f1724",
        hover: "rgba(15, 23, 36, 0.06)",
        active: "rgba(15, 23, 36, 0.12)",
        focusRing: "rgba(139, 92, 246, 0.25)",
      },
      destructive: {
        bg: "#c13a32",
        hover: "#a42e29",
        active: "#821f1b",
        fg: "#fdfdff",
        focusRing: "rgba(193, 58, 50, 0.35)",
      },
    },
    controls: {
      field: {
        bg: "#f7f8fd",
        hover: "#fbfcff",
        disabled: "#eceff6",
        fg: "#0f1724",
        placeholder: "#676d82",
        border: "rgba(15, 23, 36, 0.12)",
        borderHover: "rgba(15, 23, 36, 0.22)",
        borderActive: "#8B5CF6",
        focusRing: "rgba(139, 92, 246, 0.35)",
      },
      chip: {
        bg: "#edf0ff",
        fg: "#0f1724",
        border: "rgba(15, 23, 36, 0.18)",
        hover: "#e1e7ff",
      },
    },
    table: {
      headerBg: "#edf0fa",
      headerFg: "#4a5163",
      headerBorder: "rgba(15, 23, 36, 0.12)",
      rowDivider: "rgba(15, 23, 36, 0.1)",
      rowHover: "rgba(139, 92, 246, 0.08)",
    },
    overlay: {
      scrim: "rgba(4, 6, 12, 0.6)",
      tooltipBg: "#0a0e1d",
      tooltipFg: "#f6f7ff",
      toastBg: "#f5f6ff",
      toastFg: "#0f1724",
      toastAccent: "#8B5CF6",
      dialogBg: "#f9faff",
      dialogBorder: "rgba(15, 23, 36, 0.1)",
    },
    cardBranding: {
      pageBgRgb: "15 23 36", // RGB values for light mode page background
      cardBgRgb: "253 253 255", // RGB for card background
      cardBorderRgb: "15 23 36", // RGB for card border
      cardBorderAlpha: "0.08", // Default border alpha
      cardRadius: "16px", // Standard card radius
      cardShadow: "0 6px 18px rgba(15, 23, 36, 0.12)", // Subtle shadow
      cardShadowPressed: "0 4px 14px rgba(15, 23, 36, 0.18)", // Pressed state
      tintFade: "65%", // Tint fade percentage
      tintAlphaSoft: "0.08", // Global subtle tint
      tintAlphaStrong: "0.20", // Role/theme strong tint
      brandRgb: "139 92 246", // Brand purple RGB
      rolePrimaryRgb: "139 92 246", // Primary role color
      roleSecondaryRgb: "167 139 250", // Secondary role color
    },
  },
  dark: {
    surfaces: {
      canvas: "#0B0F14",
      base: "#0F1420",
      subtle: "#141a2b",
      muted: "#1b2235",
      raised: "#1a2134",
      card: "#151d31",
      popover: "#192238",
      overlay: "rgba(0, 0, 0, 0.7)",
    },
    text: {
      primary: "#f5f6ff",
      secondary: "#c2c7da",
      tertiary: "#8d94ad",
      muted: "#6f738b",
      inverse: "#0B0F14",
      onBrand: "#0B0F14",
      onAccent: "#0B0F14",
      link: "#A78BFA",
      linkHover: "#C4B5FD",
    },
    border: {
      hairline: "rgba(255, 255, 255, 0.08)",
      subtle: "rgba(255, 255, 255, 0.12)",
      strong: "rgba(255, 255, 255, 0.22)",
      focus: "#8B5CF6",
      divider: "rgba(255, 255, 255, 0.1)",
    },
    brand: {
      primary: "#8B5CF6",
      primaryHover: "#A78BFA",
      primaryActive: "#7C3AED",
      subtle: "rgba(139, 92, 246, 0.12)",
      strong: "#A78BFA",
      onPrimary: "#0B0F14",
    },
    status: {
      success: {
        fg: "#31d193",
        bg: "#0f241c",
        border: "#27a971",
      },
      warning: {
        fg: "#ffb74d",
        bg: "#271d0c",
        border: "#f5a936",
      },
      danger: {
        fg: "#ff6b6b",
        bg: "#2b1215",
        border: "#ff8c8c",
      },
      info: {
        fg: "#5aa8ff",
        bg: "#0d1c2b",
        border: "#7cbbff",
      },
    },
    action: {
      primary: {
        bg: "#8B5CF6",
        hover: "#A78BFA",
        active: "#7C3AED",
        fg: "#0B0F14",
        focusRing: "rgba(139, 92, 246, 0.4)",
      },
      secondary: {
        bg: "#1b2336",
        hover: "#1f2940",
        active: "#182032",
        fg: "#f5f6ff",
        border: "rgba(255, 255, 255, 0.18)",
        borderHover: "rgba(255, 255, 255, 0.28)",
        focusRing: "rgba(139, 92, 246, 0.35)",
      },
      ghost: {
        fg: "#f5f6ff",
        hover: "rgba(255, 255, 255, 0.08)",
        active: "rgba(255, 255, 255, 0.16)",
        focusRing: "rgba(139, 92, 246, 0.35)",
      },
      destructive: {
        bg: "#ff6b6b",
        hover: "#ff8c8c",
        active: "#e05656",
        fg: "#06080f",
        focusRing: "rgba(255, 107, 107, 0.45)",
      },
    },
    controls: {
      field: {
        bg: "#151c2e",
        hover: "#1b2336",
        disabled: "#111627",
        fg: "#f5f6ff",
        placeholder: "#8d94ad",
        border: "rgba(255, 255, 255, 0.14)",
        borderHover: "rgba(255, 255, 255, 0.22)",
        borderActive: "#8B5CF6",
        focusRing: "rgba(139, 92, 246, 0.4)",
      },
      chip: {
        bg: "#1d2740",
        fg: "#f5f6ff",
        border: "rgba(255, 255, 255, 0.16)",
        hover: "#253152",
      },
    },
    table: {
      headerBg: "#161f33",
      headerFg: "#c2c7da",
      headerBorder: "rgba(255, 255, 255, 0.12)",
      rowDivider: "rgba(255, 255, 255, 0.1)",
      rowHover: "rgba(139, 92, 246, 0.12)",
    },
    overlay: {
      scrim: "rgba(0, 0, 0, 0.7)",
      tooltipBg: "#05070f",
      tooltipFg: "#f5f6ff",
      toastBg: "#141b2f",
      toastFg: "#f5f6ff",
      toastAccent: "#8B5CF6",
      dialogBg: "#141b2f",
      dialogBorder: "rgba(255, 255, 255, 0.08)",
    },
    cardBranding: {
      pageBgRgb: "19 19 20", // RGB values for dark mode page background (matches actual bg-app)
      cardBgRgb: "21 29 49", // RGB for card background
      cardBorderRgb: "255 255 255", // RGB for card border
      cardBorderAlpha: "0.08", // Default border alpha
      cardRadius: "16px", // Standard card radius
      cardShadow: "0 6px 18px rgba(0, 0, 0, 0.32)", // Subtle shadow
      cardShadowPressed: "0 4px 14px rgba(0, 0, 0, 0.42)", // Pressed state
      tintFade: "65%", // Tint fade percentage
      tintAlphaSoft: "0.08", // Global subtle tint
      tintAlphaStrong: "0.20", // Role/theme strong tint
      brandRgb: "139 92 246", // Brand purple RGB
      rolePrimaryRgb: "139 92 246", // Primary role color
      roleSecondaryRgb: "167 139 250", // Secondary role color
    },
  },
} as const;

export const colorCssVars = {
  surfaces: {
    canvas: "--color-surface-canvas",
    base: "--color-surface-base",
    subtle: "--color-surface-subtle",
    muted: "--color-surface-muted",
    raised: "--color-surface-raised",
    card: "--color-surface-card",
    popover: "--color-surface-popover",
    overlay: "--color-surface-overlay",
  },
  text: {
    primary: "--color-text-primary",
    secondary: "--color-text-secondary",
    tertiary: "--color-text-tertiary",
    muted: "--color-text-muted",
    inverse: "--color-text-inverse",
    onBrand: "--color-text-on-brand",
    onAccent: "--color-text-on-accent",
    link: "--color-text-link",
    linkHover: "--color-text-link-hover",
  },
  border: {
    hairline: "--color-border-hairline",
    subtle: "--color-border-subtle",
    strong: "--color-border-strong",
    focus: "--color-border-focus",
    divider: "--color-border-divider",
  },
  brand: {
    primary: "--color-brand-primary",
    primaryHover: "--color-brand-primary-hover",
    primaryActive: "--color-brand-primary-active",
    subtle: "--color-brand-subtle",
    strong: "--color-brand-strong",
    onPrimary: "--color-brand-on-primary",
  },
  status: {
    success: {
      fg: "--color-status-success-fg",
      bg: "--color-status-success-bg",
      border: "--color-status-success-border",
    },
    warning: {
      fg: "--color-status-warning-fg",
      bg: "--color-status-warning-bg",
      border: "--color-status-warning-border",
    },
    danger: {
      fg: "--color-status-danger-fg",
      bg: "--color-status-danger-bg",
      border: "--color-status-danger-border",
    },
    info: {
      fg: "--color-status-info-fg",
      bg: "--color-status-info-bg",
      border: "--color-status-info-border",
    },
  },
  action: {
    primary: {
      bg: "--color-action-primary-bg",
      hover: "--color-action-primary-hover",
      active: "--color-action-primary-active",
      fg: "--color-action-primary-fg",
      focusRing: "--color-action-primary-focus",
    },
    secondary: {
      bg: "--color-action-secondary-bg",
      hover: "--color-action-secondary-hover",
      active: "--color-action-secondary-active",
      fg: "--color-action-secondary-fg",
      border: "--color-action-secondary-border",
      borderHover: "--color-action-secondary-border-hover",
      focusRing: "--color-action-secondary-focus",
    },
    ghost: {
      fg: "--color-action-ghost-fg",
      hover: "--color-action-ghost-hover",
      active: "--color-action-ghost-active",
      focusRing: "--color-action-ghost-focus",
    },
    destructive: {
      bg: "--color-action-destructive-bg",
      hover: "--color-action-destructive-hover",
      active: "--color-action-destructive-active",
      fg: "--color-action-destructive-fg",
      focusRing: "--color-action-destructive-focus",
    },
  },
  controls: {
    field: {
      bg: "--color-control-field-bg",
      hover: "--color-control-field-hover",
      disabled: "--color-control-field-disabled",
      fg: "--color-control-field-fg",
      placeholder: "--color-control-field-placeholder",
      border: "--color-control-field-border",
      borderHover: "--color-control-field-border-hover",
      borderActive: "--color-control-field-border-active",
      focusRing: "--color-control-field-focus-ring",
    },
    chip: {
      bg: "--color-control-chip-bg",
      fg: "--color-control-chip-fg",
      border: "--color-control-chip-border",
      hover: "--color-control-chip-hover",
    },
  },
  table: {
    headerBg: "--color-table-header-bg",
    headerFg: "--color-table-header-fg",
    headerBorder: "--color-table-header-border",
    rowDivider: "--color-table-row-divider",
    rowHover: "--color-table-row-hover",
  },
  overlay: {
    scrim: "--color-overlay-scrim",
    tooltipBg: "--color-overlay-tooltip-bg",
    tooltipFg: "--color-overlay-tooltip-fg",
    toastBg: "--color-overlay-toast-bg",
    toastFg: "--color-overlay-toast-fg",
    toastAccent: "--color-overlay-toast-accent",
    dialogBg: "--color-overlay-dialog-bg",
    dialogBorder: "--color-overlay-dialog-border",
  },
  cardBranding: {
    pageBgRgb: "--card-page-bg-rgb",
    cardBgRgb: "--card-bg-rgb",
    cardBorderRgb: "--card-border-rgb",
    cardBorderAlpha: "--card-border-alpha",
    cardRadius: "--card-radius",
    cardShadow: "--card-shadow",
    cardShadowPressed: "--card-shadow-pressed",
    tintFade: "--tint-fade",
    tintAlphaSoft: "--tint-alpha-soft",
    tintAlphaStrong: "--tint-alpha-strong",
    brandRgb: "--brand-rgb",
    rolePrimaryRgb: "--role-primary-rgb",
    roleSecondaryRgb: "--role-secondary-rgb",
  },
} as const;
