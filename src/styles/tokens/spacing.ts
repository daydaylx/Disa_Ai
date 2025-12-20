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
  "3xs": "0.425rem", // 6.8px (reduced by 15%)
  "2xs": "0.6375rem", // 10.2px (reduced by 15%)
  xs: "0.85rem", // 13.6px (reduced by 15%)
  sm: "1.0625rem", // 17px (reduced by 15%)
  md: "1.275rem", // 20.4px (reduced by 15%)
  lg: "1.7rem", // 27.2px (reduced by 15%)
  xl: "2.125rem", // 34px (reduced by 15%)
  "2xl": "2.55rem", // 40.8px (reduced by 15%)
  "3xl": "2.975rem", // 47.6px (reduced by 15%)
  "4xl": "3.4rem", // 54.4px (reduced by 15%)
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
    compact: "2.3375rem", // 37.4px (reduced by 15%)
    comfortable: "2.55rem", // 40.8px (reduced by 15%)
    relaxed: "2.7625rem", // 44.2px (reduced by 15%)
    spacious: "2.975rem", // 47.6px (reduced by 15%)
  },
  fixed: {
    scrollbar: "6.8px", // (reduced by 15%)
    rippleMax: "170px", // (reduced by 15%)
    bottomsheetHandle: "4.25px", // (reduced by 15%)
    bottomsheetHandleWidth: "34px", // (reduced by 15%)
    bottomsheetBorder: "1.7px", // (reduced by 15%)
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
