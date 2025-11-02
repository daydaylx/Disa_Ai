const pxToRem = (px: number): string => `${(px / 16).toFixed(4).replace(/\.?0+$/, "")}rem`;

const cssVar = (name: string): string => `var(${name})`;

export const COLOR_TOKENS = {
  surface: cssVar("--surface-neumorphic-base"),
  onSurface: cssVar("--color-text-primary"),
  primary: cssVar("--color-brand-primary"),
  secondary: cssVar("--color-text-secondary"),
  success: cssVar("--color-status-success-fg"),
  warning: cssVar("--color-status-warning-fg"),
  danger: cssVar("--color-status-danger-fg"),
} as const;

const surfaceColors = {
  DEFAULT: cssVar("--surface-neumorphic-base"),
  canvas: cssVar("--surface-neumorphic-base"),
  base: cssVar("--surface-neumorphic-base"),
  subtle: cssVar("--surface-neumorphic-floating"),
  muted: cssVar("--surface-neumorphic-pressed"),
  raised: cssVar("--surface-neumorphic-raised"),
  card: cssVar("--surface-neumorphic-floating"),
  popover: cssVar("--surface-neumorphic-floating"),
  overlay: cssVar("--surface-neumorphic-overlay"),
  "0": cssVar("--surface-0"),
  "1": cssVar("--surface-1"),
  "2": cssVar("--surface-2"),
  "3": cssVar("--surface-3"),
} as const;

const textColors = {
  DEFAULT: cssVar("--color-text-primary"),
  primary: cssVar("--color-text-primary"),
  secondary: cssVar("--color-text-secondary"),
  tertiary: cssVar("--color-text-tertiary"),
  muted: cssVar("--color-text-muted"),
  inverse: cssVar("--color-text-inverse"),
  brand: cssVar("--color-text-on-brand"),
  accent: cssVar("--color-text-on-accent"),
  link: cssVar("--color-text-link"),
  linkHover: cssVar("--color-text-link-hover"),
  strong: cssVar("--color-text-primary"),
  subtle: cssVar("--color-text-secondary"),
  "0": cssVar("--color-text-primary"),
  "1": cssVar("--color-text-secondary"),
  "2": cssVar("--color-text-tertiary"),
} as const;

const brandColors = {
  DEFAULT: cssVar("--color-brand-primary"),
  primary: cssVar("--color-brand-primary"),
  contrast: cssVar("--color-brand-on-primary"),
  weak: cssVar("--brand-weak"),
  hover: cssVar("--color-brand-primary-hover"),
  active: cssVar("--color-brand-primary-active"),
  subtle: cssVar("--color-brand-subtle"),
  strong: cssVar("--color-brand-strong"),
  on: cssVar("--color-brand-on-primary"),
  text: cssVar("--color-brand-on-primary"),
} as const;

const borderColors = {
  DEFAULT: cssVar("--color-border-subtle"),
  hairline: cssVar("--color-border-hairline"),
  subtle: cssVar("--color-border-subtle"),
  strong: cssVar("--color-border-strong"),
  focus: cssVar("--color-border-focus"),
  divider: cssVar("--color-border-divider"),
} as const;

const statusColors = {
  success: cssVar("--color-status-success-fg"),
  "success-bg": cssVar("--color-status-success-bg"),
  "success-border": cssVar("--color-status-success-border"),
  warning: cssVar("--color-status-warning-fg"),
  "warning-bg": cssVar("--color-status-warning-bg"),
  "warning-border": cssVar("--color-status-warning-border"),
  danger: cssVar("--color-status-danger-fg"),
  "danger-bg": cssVar("--color-status-danger-bg"),
  "danger-border": cssVar("--color-status-danger-border"),
  info: cssVar("--color-status-info-fg"),
  "info-bg": cssVar("--color-status-info-bg"),
  "info-border": cssVar("--color-status-info-border"),
} as const;

const actionColors = {
  DEFAULT: cssVar("--color-action-primary-bg"),
  primary: cssVar("--color-action-primary-bg"),
  "primary-hover": cssVar("--color-action-primary-hover"),
  "primary-active": cssVar("--color-action-primary-active"),
  "primary-fg": cssVar("--color-action-primary-fg"),
  "primary-focus": cssVar("--color-action-primary-focus-ring"),
  secondary: cssVar("--color-action-secondary-bg"),
  "secondary-hover": cssVar("--color-action-secondary-hover"),
  "secondary-active": cssVar("--color-action-secondary-active"),
  "secondary-fg": cssVar("--color-action-secondary-fg"),
  "secondary-border": cssVar("--color-action-secondary-border"),
  "secondary-border-hover": cssVar("--color-action-secondary-border-hover"),
  "secondary-focus": cssVar("--color-action-secondary-focus-ring"),
  ghost: cssVar("--color-action-ghost-fg"),
  "ghost-hover": cssVar("--color-action-ghost-hover"),
  "ghost-active": cssVar("--color-action-ghost-active"),
  "ghost-focus": cssVar("--color-action-ghost-focus-ring"),
  destructive: cssVar("--color-action-destructive-bg"),
  "destructive-hover": cssVar("--color-action-destructive-hover"),
  "destructive-active": cssVar("--color-action-destructive-active"),
  "destructive-fg": cssVar("--color-action-destructive-fg"),
  "destructive-focus": cssVar("--color-action-destructive-focus-ring"),
} as const;

const controlColors = {
  field: cssVar("--color-control-field-bg"),
  "field-hover": cssVar("--color-control-field-hover"),
  "field-disabled": cssVar("--color-control-field-disabled"),
  "field-fg": cssVar("--color-control-field-fg"),
  "field-placeholder": cssVar("--color-control-field-placeholder"),
  "field-border": cssVar("--color-control-field-border"),
  "field-border-hover": cssVar("--color-control-field-border-hover"),
  "field-border-active": cssVar("--color-control-field-border-active"),
  "field-focus": cssVar("--color-control-field-focus-ring"),
  chip: cssVar("--color-control-chip-bg"),
  "chip-hover": cssVar("--color-control-chip-hover"),
  "chip-fg": cssVar("--color-control-chip-fg"),
  "chip-border": cssVar("--color-control-chip-border"),
} as const;

const tableColors = {
  header: cssVar("--color-table-header-bg"),
  "header-fg": cssVar("--color-table-header-fg"),
  "header-border": cssVar("--color-table-header-border"),
  divider: cssVar("--color-table-row-divider"),
  hover: cssVar("--color-table-row-hover"),
} as const;

const overlayColors = {
  scrim: cssVar("--color-overlay-scrim"),
  tooltip: cssVar("--color-overlay-tooltip-bg"),
  "tooltip-fg": cssVar("--color-overlay-tooltip-fg"),
  toast: cssVar("--color-overlay-toast-bg"),
  "toast-fg": cssVar("--color-overlay-toast-fg"),
  "toast-accent": cssVar("--color-overlay-toast-accent"),
  dialog: cssVar("--color-overlay-dialog-bg"),
  "dialog-border": cssVar("--color-overlay-dialog-border"),
} as const;

export const tailwindColors = {
  surface: surfaceColors,
  text: textColors,
  brand: brandColors,
  border: borderColors,
  status: statusColors,
  action: actionColors,
  control: controlColors,
  table: tableColors,
  overlay: overlayColors,
} as const;

const baseSpacingScale = {
  none: "0px",
  "3xs": pxToRem(2),
  "2xs": pxToRem(4),
  xs: pxToRem(6),
  sm: pxToRem(8),
  md: pxToRem(12),
  lg: pxToRem(16),
  xl: pxToRem(20),
  "2xl": pxToRem(24),
  "3xl": pxToRem(32),
  "4xl": pxToRem(40),
  "5xl": pxToRem(48),
} as const;

const baseSpacingSemantic = {
  "stack-xs": baseSpacingScale["2xs"],
  "stack-sm": baseSpacingScale.xs,
  "stack-md": baseSpacingScale.sm,
  "stack-lg": baseSpacingScale.md,
  "inline-sm": baseSpacingScale.xs,
  "inline-md": baseSpacingScale.sm,
  "inline-lg": baseSpacingScale.md,
  section: baseSpacingScale["3xl"],
  "container-x": baseSpacingScale.lg,
  "container-y": baseSpacingScale.xl,
} as const;

const baseSpacingTouch = {
  "touch-compact": pxToRem(44),
  "touch-comfortable": pxToRem(48),
  "touch-relaxed": pxToRem(56),
  "touch-spacious": pxToRem(64),
} as const;

const baseSpacingFixed = {
  scrollbar: pxToRem(12),
  "ripple-max": pxToRem(200),
  "bottomsheet-handle": pxToRem(4),
  "bottomsheet-handle-width": pxToRem(40),
  "bottomsheet-border": pxToRem(2),
} as const;

export const spacingScale = baseSpacingScale;
export const spacingSemantic = baseSpacingSemantic;
export const spacingTouch = baseSpacingTouch;
export const spacingFixed = baseSpacingFixed;

export const tailwindSpacing = {
  ...baseSpacingScale,
  ...baseSpacingSemantic,
  ...baseSpacingTouch,
  ...baseSpacingFixed,
} as const;

export const tailwindRadii = {
  none: "0px",
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  pill: "999px",
  full: "9999px",
  scrollbar: "16px",
  focus: "4px",
  toast: "12px",
  button: "12px",
  badge: "8px",
} as const;

export const tailwindShadows = {
  sm: cssVar("--shadow-neumorphic-sm"),
  md: cssVar("--shadow-neumorphic-md"),
  lg: cssVar("--shadow-neumorphic-lg"),
  surface: cssVar("--shadow-neumorphic-sm"),
  raised: cssVar("--shadow-neumorphic-md"),
  overlay: cssVar("--shadow-neumorphic-lg"),
  popover: cssVar("--shadow-neumorphic-xl"),
  focus: cssVar("--shadow-focus-neumorphic"),

  // Neomorphic shadows
  "neo-sm": cssVar("--shadow-neumorphic-sm"),
  "neo-md": cssVar("--shadow-neumorphic-md"),
  "neo-lg": cssVar("--shadow-neumorphic-lg"),
  "neo-xl": cssVar("--shadow-neumorphic-xl"),

  // Neomorphic inset shadows
  "inset-subtle": cssVar("--shadow-inset-subtle"),
  "inset-medium": cssVar("--shadow-inset-medium"),
  "inset-strong": cssVar("--shadow-inset-strong"),

  // Depth shadows (for existing components)
  "depth-1": cssVar("--shadow-depth-1"),
  "depth-2": cssVar("--shadow-depth-2"),
  "depth-3": cssVar("--shadow-depth-3"),
  "depth-4": cssVar("--shadow-depth-4"),
  "depth-5": cssVar("--shadow-depth-5"),
  "depth-6": cssVar("--shadow-depth-6"),

  // Neomorphic focus
  "focus-neo": cssVar("--shadow-focus-neumorphic"),

  // Glow accents
  "glow-brand": cssVar("--shadow-glow-brand"),
  "glow-success": cssVar("--shadow-glow-success"),
  "glow-warning": cssVar("--shadow-glow-warning"),
  "glow-error": cssVar("--shadow-glow-error"),
} as const;

export const tailwindFontFamily = {
  sans: ["Inter", "system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
  numeric: ["Inter", "system-ui", "Segoe UI", "sans-serif"],
} as const;

export const tailwindMotion = {
  duration: {
    micro: "120ms",
    small: "160ms",
    medium: "220ms",
    large: "320ms",
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
    accelerate: "cubic-bezier(0.8, 0, 1, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  },
} as const;

export type TextStyle = {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing?: string;
  textTransform?: string;
};

export const textStyles: Record<
  | "display"
  | "headline"
  | "title"
  | "subtitle"
  | "body"
  | "bodyStrong"
  | "bodySmall"
  | "caption"
  | "label"
  | "mono",
  TextStyle
> = {
  display: {
    fontSize: pxToRem(40),
    lineHeight: pxToRem(48),
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  headline: {
    fontSize: pxToRem(32),
    lineHeight: pxToRem(40),
    fontWeight: 600,
    letterSpacing: "-0.012em",
  },
  title: {
    fontSize: pxToRem(24),
    lineHeight: pxToRem(32),
    fontWeight: 600,
    letterSpacing: "-0.008em",
  },
  subtitle: {
    fontSize: pxToRem(20),
    lineHeight: pxToRem(28),
    fontWeight: 500,
    letterSpacing: "-0.002em",
  },
  body: { fontSize: pxToRem(16), lineHeight: pxToRem(24), fontWeight: 400 },
  bodyStrong: { fontSize: pxToRem(16), lineHeight: pxToRem(24), fontWeight: 600 },
  bodySmall: { fontSize: pxToRem(14), lineHeight: pxToRem(20), fontWeight: 400 },
  caption: {
    fontSize: pxToRem(12),
    lineHeight: pxToRem(18),
    fontWeight: 500,
    letterSpacing: "0.02em",
  },
  label: {
    fontSize: pxToRem(12),
    lineHeight: pxToRem(16),
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  mono: { fontSize: pxToRem(13), lineHeight: pxToRem(20), fontWeight: 500 },
};

export const fixedFontSizes = {
  badge: pxToRem(12),
  input: pxToRem(16),
} as const;
