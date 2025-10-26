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

  /* Neo-Depth Card System - Standardized Card Radii */
  card: string; // Standard card radius (16px)
  cardInner: string; // Inner elements (12px)
  cardSmall: string; // Small elements like badges (8px)
  avatar: string; // Avatar/profile images (50%)
};

export const radiusTokens: RadiusTokens = {
  none: "0px",
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  pill: "16px",
  full: "50%",

  /* Additional radii for specific components */
  scrollbar: "16px",
  focus: "4px",
  toast: "12px",
  installPrompt: "12px",
  button: "12px",
  badge: "8px",

  /* Neo-Depth Card System - Consistent Geometry */
  card: "12px",
  cardInner: "8px",
  cardSmall: "4px",
  avatar: "50%",
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

  /* Neo-Depth Card System CSS Variables */
  card: "--radius-card",
  cardInner: "--radius-card-inner",
  cardSmall: "--radius-card-small",
  avatar: "--radius-avatar",
} as const;
