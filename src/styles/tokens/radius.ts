/**
 * Corner radius tokens tuned for Fluent 2 Soft-Depth.
 */

export type RadiusTokens = {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  pill: string;
  full: string;
};

export const radiusTokens: RadiusTokens = {
  none: "0px",
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  pill: "999px",
  full: "9999px",
};

export const radiusCssVars = {
  none: "--radius-none",
  xs: "--radius-xs",
  sm: "--radius-sm",
  md: "--radius-md",
  lg: "--radius-lg",
  xl: "--radius-xl",
  pill: "--radius-pill",
  full: "--radius-full",
} as const;
