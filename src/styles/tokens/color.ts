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
      link: "#4b63ff",
      linkHover: "#3748df",
    },
    border: {
      hairline: "rgba(15, 23, 36, 0.08)",
      subtle: "rgba(15, 23, 36, 0.15)",
      strong: "rgba(15, 23, 36, 0.3)",
      focus: "#4b63ff",
      divider: "rgba(15, 23, 36, 0.12)",
    },
    brand: {
      primary: "#4b63ff",
      primaryHover: "#3748df",
      primaryActive: "#1f2bb3",
      subtle: "#e6ebff",
      strong: "#3748df",
      onPrimary: "#f6f7ff",
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
        bg: "#4b63ff",
        hover: "#3748df",
        active: "#1f2bb3",
        fg: "#f6f7ff",
        focusRing: "rgba(75, 99, 255, 0.35)",
      },
      secondary: {
        bg: "#f2f4fb",
        hover: "#e7eafa",
        active: "#dfe3f5",
        fg: "#0f1724",
        border: "rgba(15, 23, 36, 0.18)",
        borderHover: "rgba(15, 23, 36, 0.3)",
        focusRing: "rgba(75, 99, 255, 0.25)",
      },
      ghost: {
        fg: "#0f1724",
        hover: "rgba(15, 23, 36, 0.06)",
        active: "rgba(15, 23, 36, 0.12)",
        focusRing: "rgba(75, 99, 255, 0.25)",
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
        borderActive: "#4b63ff",
        focusRing: "rgba(75, 99, 255, 0.35)",
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
      rowHover: "rgba(75, 99, 255, 0.08)",
    },
    overlay: {
      scrim: "rgba(4, 6, 12, 0.6)",
      tooltipBg: "#0a0e1d",
      tooltipFg: "#f6f7ff",
      toastBg: "#f5f6ff",
      toastFg: "#0f1724",
      toastAccent: "#4b63ff",
      dialogBg: "#f9faff",
      dialogBorder: "rgba(15, 23, 36, 0.1)",
    },
  },
  dark: {
    surfaces: {
      canvas: "#06080f",
      base: "#0f1424",
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
      inverse: "#06080f",
      onBrand: "#06080f",
      onAccent: "#06080f",
      link: "#a8b5ff",
      linkHover: "#c3ccff",
    },
    border: {
      hairline: "rgba(255, 255, 255, 0.08)",
      subtle: "rgba(255, 255, 255, 0.15)",
      strong: "rgba(255, 255, 255, 0.3)",
      focus: "#7f96ff",
      divider: "rgba(255, 255, 255, 0.12)",
    },
    brand: {
      primary: "#7f96ff",
      primaryHover: "#a8b5ff",
      primaryActive: "#5c6cff",
      subtle: "rgba(127, 150, 255, 0.12)",
      strong: "#a8b5ff",
      onPrimary: "#06080f",
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
        bg: "#7f96ff",
        hover: "#a8b5ff",
        active: "#5c6cff",
        fg: "#06080f",
        focusRing: "rgba(127, 150, 255, 0.4)",
      },
      secondary: {
        bg: "#1b2336",
        hover: "#1f2940",
        active: "#182032",
        fg: "#f5f6ff",
        border: "rgba(255, 255, 255, 0.18)",
        borderHover: "rgba(255, 255, 255, 0.28)",
        focusRing: "rgba(127, 150, 255, 0.35)",
      },
      ghost: {
        fg: "#f5f6ff",
        hover: "rgba(255, 255, 255, 0.08)",
        active: "rgba(255, 255, 255, 0.16)",
        focusRing: "rgba(127, 150, 255, 0.35)",
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
        borderActive: "#7f96ff",
        focusRing: "rgba(127, 150, 255, 0.4)",
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
      rowHover: "rgba(127, 150, 255, 0.12)",
    },
    overlay: {
      scrim: "rgba(0, 0, 0, 0.7)",
      tooltipBg: "#05070f",
      tooltipFg: "#f5f6ff",
      toastBg: "#141b2f",
      toastFg: "#f5f6ff",
      toastAccent: "#7f96ff",
      dialogBg: "#141b2f",
      dialogBorder: "rgba(255, 255, 255, 0.08)",
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
} as const;
