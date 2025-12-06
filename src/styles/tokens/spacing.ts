/**
 * Spacing tokens built on an 8px rhythm with a few micro adjustments.
 * Values are emitted in rem to stay device agnostic.
 */

export type SpacingScale = {
  none: string;
  "3xs": string;
  "2xs": string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
};

export type SemanticSpacing = {
  stackXs: string;
  stackSm: string;
  stackMd: string;
  stackLg: string;
  inlineSm: string;
  inlineMd: string;
  inlineLg: string;
  section: string;
  containerX: string;
  containerY: string;
};

export type TouchTargets = {
  compact: string;
  comfortable: string;
  relaxed: string;
  spacious: string;
};

export type FixedSizes = {
  scrollbar: string;
  rippleMax: string;
  bottomsheetHandle: string;
  bottomsheetHandleWidth: string;
  bottomsheetBorder: string;
};

export type SpacingTokens = {
  scale: SpacingScale;
  semantic: SemanticSpacing;
  touch: TouchTargets;
  fixed: FixedSizes;
};

const spacingScale: SpacingScale = {
  none: "0px",
  "3xs": "0.5rem", // 8px
  "2xs": "0.75rem", // 12px
  xs: "1rem", // 16px
  sm: "1.25rem", // 20px
  md: "1.5rem", // 24px
  lg: "2rem", // 32px
  xl: "2.5rem", // 40px
  "2xl": "3rem", // 48px
  "3xl": "3.5rem", // 56px
  "4xl": "4rem", // 64px
};

const semanticSpacing: SemanticSpacing = {
  stackXs: spacingScale["2xs"],
  stackSm: spacingScale.xs,
  stackMd: spacingScale.sm,
  stackLg: spacingScale.md,
  inlineSm: spacingScale["2xs"],
  inlineMd: spacingScale.xs,
  inlineLg: spacingScale.sm,
  section: spacingScale.xl,
  containerX: spacingScale.xs,
  containerY: spacingScale.sm,
};

export const spacingTokens: SpacingTokens = {
  scale: spacingScale,
  semantic: semanticSpacing,
  touch: {
    compact: "2.75rem",
    comfortable: "3rem",
    relaxed: "3.25rem",
    spacious: "3.5rem",
  },
  fixed: {
    scrollbar: "8px",
    rippleMax: "200px",
    bottomsheetHandle: "5px",
    bottomsheetHandleWidth: "40px",
    bottomsheetBorder: "2px",
  },
};

export const spacingCssVars = {
  scale: {
    none: "--space-none",
    "3xs": "--space-3xs",
    "2xs": "--space-2xs",
    xs: "--space-xs",
    sm: "--space-sm",
    md: "--space-md",
    lg: "--space-lg",
    xl: "--space-xl",
    "2xl": "--space-2xl",
    "3xl": "--space-3xl",
    "4xl": "--space-4xl",
  },
  semantic: {
    stackXs: "--space-stack-xs",
    stackSm: "--space-stack-sm",
    stackMd: "--space-stack-md",
    stackLg: "--space-stack-lg",
    inlineSm: "--space-inline-sm",
    inlineMd: "--space-inline-md",
    inlineLg: "--space-inline-lg",
    section: "--space-section",
    containerX: "--space-container-x",
    containerY: "--space-container-y",
  },
  touch: {
    compact: "--size-touch-compact",
    comfortable: "--size-touch-comfortable",
    relaxed: "--size-touch-relaxed",
    spacious: "--size-touch-spacious",
  },
  fixed: {
    scrollbar: "--size-scrollbar",
    rippleMax: "--size-ripple-max",
    bottomsheetHandle: "--size-bottomsheet-handle",
    bottomsheetHandleWidth: "--size-bottomsheet-handle-width",
    bottomsheetBorder: "--size-bottomsheet-border",
  },
} as const;
