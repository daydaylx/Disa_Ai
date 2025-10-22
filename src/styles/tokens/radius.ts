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

  /* Additional radii for specific components */
  scrollbar: string;
  focus: string;
  toast: string;
  installPrompt: string;
  button: string;
  badge: string;
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

  /* Additional radii for specific components */
  scrollbar: "999px",
  focus: "6px",
  toast: "16px",
  installPrompt: "12px",
  button: "20px",
  badge: "8px",
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

  /* Additional radii for specific components */
  scrollbar: "--radius-scrollbar",
  focus: "--radius-focus",
  toast: "--radius-toast",
  installPrompt: "--radius-install-prompt",
  button: "--radius-button",
  badge: "--radius-badge",
} as const;
