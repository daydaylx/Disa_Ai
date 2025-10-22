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
};

export const colorTokens: Record<ThemeMode, ColorScheme> = {
  light: {
    surfaces: {
      canvas: "#f5f5f5",
      base: "#ffffff",
      subtle: "#f7f7f7",
      muted: "#f0efee",
      raised: "#fcfbfa",
      card: "#ffffff",
      popover: "#ffffff",
      overlay: "rgba(27, 26, 25, 0.45)",
    },
    text: {
      primary: "#201f1e",
      secondary: "#484644",
      tertiary: "#605e5c",
      muted: "#8a8886",
      inverse: "#ffffff",
      onBrand: "#ffffff",
      onAccent: "#0f2940",
      link: "#0f6cbd",
      linkHover: "#115ea3",
    },
    border: {
      hairline: "rgba(32, 31, 30, 0.08)",
      subtle: "#d2d0ce",
      strong: "#8a8886",
      focus: "#0f6cbd",
      divider: "rgba(32, 31, 30, 0.12)",
    },
    brand: {
      primary: "#0f6cbd",
      primaryHover: "#115ea3",
      primaryActive: "#0f548c",
      subtle: "#eff6fc",
      strong: "#0f4a8a",
      onPrimary: "#ffffff",
    },
    status: {
      success: {
        fg: "#0b6010",
        bg: "#e7f5ec",
        border: "#54b052",
      },
      warning: {
        fg: "#8a5d00",
        bg: "#fff4ce",
        border: "#f3c13a",
      },
      danger: {
        fg: "#b3261e",
        bg: "#fde7e9",
        border: "#f1707b",
      },
      info: {
        fg: "#0f6cbd",
        bg: "#e1f0ff",
        border: "#62a0ea",
      },
    },
    action: {
      primary: {
        bg: "#0f6cbd",
        hover: "#115ea3",
        active: "#0f548c",
        fg: "#ffffff",
        focusRing: "rgba(15, 108, 189, 0.35)",
      },
      secondary: {
        bg: "#eff6fc",
        hover: "#e1effa",
        active: "#d0e7f7",
        fg: "#0f4578",
        border: "#a6c7e5",
        borderHover: "#88b5dc",
        focusRing: "rgba(15, 108, 189, 0.35)",
      },
      ghost: {
        fg: "#0f6cbd",
        hover: "#e1f0ff",
        active: "#d0e7f7",
        focusRing: "rgba(15, 108, 189, 0.3)",
      },
      destructive: {
        bg: "#d13438",
        hover: "#b02024",
        active: "#960d15",
        fg: "#ffffff",
        focusRing: "rgba(209, 52, 56, 0.35)",
      },
    },
    controls: {
      field: {
        bg: "#ffffff",
        hover: "#f7f7f7",
        disabled: "#f3f2f1",
        fg: "#201f1e",
        placeholder: "rgba(32, 31, 30, 0.55)",
        border: "#d2d0ce",
        borderHover: "#b3b0ad",
        borderActive: "#0f6cbd",
        focusRing: "rgba(15, 108, 189, 0.35)",
      },
      chip: {
        bg: "#eff6fc",
        fg: "#0f4578",
        border: "#a6c7e5",
        hover: "#e1effa",
      },
    },
    table: {
      headerBg: "#f7f7f7",
      headerFg: "#201f1e",
      headerBorder: "#d2d0ce",
      rowDivider: "rgba(32, 31, 30, 0.08)",
      rowHover: "#f1f1f0",
    },
    overlay: {
      scrim: "rgba(27, 26, 25, 0.45)",
      tooltipBg: "#201f1e",
      tooltipFg: "#f5f5f5",
      toastBg: "#201f1e",
      toastFg: "#f5f5f5",
      toastAccent: "#0f6cbd",
      dialogBg: "#ffffff",
      dialogBorder: "#d2d0ce",
    },
  },
  dark: {
    surfaces: {
      canvas: "#11100f",
      base: "#1b1a19",
      subtle: "#252423",
      muted: "#2f2e2d",
      raised: "#323130",
      card: "#1f1e1d",
      popover: "#252423",
      overlay: "rgba(0, 0, 0, 0.6)",
    },
    text: {
      primary: "#f3f2f1",
      secondary: "#d2d0ce",
      tertiary: "#b3b0ad",
      muted: "#8a8886",
      inverse: "#201f1e",
      onBrand: "#0b0b0a",
      onAccent: "#052138",
      link: "#6cb8f6",
      linkHover: "#9ccffa",
    },
    border: {
      hairline: "rgba(255, 255, 255, 0.08)",
      subtle: "#3b3a39",
      strong: "#605e5c",
      focus: "#3aa0ff",
      divider: "rgba(255, 255, 255, 0.12)",
    },
    brand: {
      primary: "#3aa0ff",
      primaryHover: "#2899f5",
      primaryActive: "#0f7ddc",
      subtle: "#062d4d",
      strong: "#0a65b0",
      onPrimary: "#0b0b0a",
    },
    status: {
      success: {
        fg: "#58d370",
        bg: "#0d3b21",
        border: "#258d47",
      },
      warning: {
        fg: "#f5cc4d",
        bg: "#3d2e0d",
        border: "#d8a104",
      },
      danger: {
        fg: "#f1707b",
        bg: "#47141a",
        border: "#d13438",
      },
      info: {
        fg: "#6cb8f6",
        bg: "#123c73",
        border: "#2899f5",
      },
    },
    action: {
      primary: {
        bg: "#3aa0ff",
        hover: "#2899f5",
        active: "#1a86e1",
        fg: "#0b0b0a",
        focusRing: "rgba(58, 160, 255, 0.45)",
      },
      secondary: {
        bg: "#2f2e2d",
        hover: "#3a3938",
        active: "#464544",
        fg: "#f3f2f1",
        border: "#4d4a48",
        borderHover: "#605e5c",
        focusRing: "rgba(58, 160, 255, 0.45)",
      },
      ghost: {
        fg: "#6cb8f6",
        hover: "rgba(58, 160, 255, 0.18)",
        active: "rgba(58, 160, 255, 0.26)",
        focusRing: "rgba(58, 160, 255, 0.4)",
      },
      destructive: {
        bg: "#d13438",
        hover: "#b02024",
        active: "#960d15",
        fg: "#0b0b0a",
        focusRing: "rgba(241, 112, 123, 0.4)",
      },
    },
    controls: {
      field: {
        bg: "#292827",
        hover: "#323130",
        disabled: "#252423",
        fg: "#f3f2f1",
        placeholder: "rgba(243, 242, 241, 0.6)",
        border: "#3b3a39",
        borderHover: "#605e5c",
        borderActive: "#3aa0ff",
        focusRing: "rgba(58, 160, 255, 0.45)",
      },
      chip: {
        bg: "#252423",
        fg: "#f3f2f1",
        border: "#3b3a39",
        hover: "#323130",
      },
    },
    table: {
      headerBg: "#252423",
      headerFg: "#f3f2f1",
      headerBorder: "#3b3a39",
      rowDivider: "rgba(255, 255, 255, 0.08)",
      rowHover: "#2f2e2d",
    },
    overlay: {
      scrim: "rgba(0, 0, 0, 0.65)",
      tooltipBg: "#323130",
      tooltipFg: "#f3f2f1",
      toastBg: "#2d2c2b",
      toastFg: "#f3f2f1",
      toastAccent: "#3aa0ff",
      dialogBg: "#252423",
      dialogBorder: "#3b3a39",
    },
  },
} as const;

export type ColorTokens = typeof colorTokens;

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
      focusRing: "--color-action-primary-focus-ring",
    },
    secondary: {
      bg: "--color-action-secondary-bg",
      hover: "--color-action-secondary-hover",
      active: "--color-action-secondary-active",
      fg: "--color-action-secondary-fg",
      border: "--color-action-secondary-border",
      borderHover: "--color-action-secondary-border-hover",
      focusRing: "--color-action-secondary-focus-ring",
    },
    ghost: {
      fg: "--color-action-ghost-fg",
      hover: "--color-action-ghost-hover",
      active: "--color-action-ghost-active",
      focusRing: "--color-action-ghost-focus-ring",
    },
    destructive: {
      bg: "--color-action-destructive-bg",
      hover: "--color-action-destructive-hover",
      active: "--color-action-destructive-active",
      fg: "--color-action-destructive-fg",
      focusRing: "--color-action-destructive-focus-ring",
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
    header: {
      bg: "--color-table-header-bg",
      fg: "--color-table-header-fg",
      border: "--color-table-header-border",
    },
    row: {
      divider: "--color-table-row-divider",
      hover: "--color-table-row-hover",
    },
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
} as const;

/* Additional color values for specific components */
export const additionalColorTokens = {
  accent: "#4f46e5" /* Used in install prompt */,
  accentRgb: "79, 70, 229" /* RGB version of accent color */,
} as const;

export const additionalColorCssVars = {
  accent: "--accent-color",
  accentRgb: "--accent-color-rgb",
} as const;
