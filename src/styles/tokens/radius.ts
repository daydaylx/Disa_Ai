/**
 * Corner radius tokens for Glassmorphism 2.0.
 * Simplified to 3 main values: 12px, 16px, 20px for visual consistency.
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
  xs: "8px", // Micro elements and tight corners
  sm: "12px", // Inputs, buttons, compact surfaces
  md: "16px", // Standard cards and list rows
  lg: "20px", // Hero surfaces and sheets
  xl: "20px", // Alias to large radius
  pill: "9999px", // Fully rounded (pills, avatars)
  full: "50%",

  /* Additional radii for specific components */
  scrollbar: "12px",
  focus: "12px",
  toast: "16px",
  installPrompt: "20px",
  button: "12px",
  badge: "9999px",

  /* Core card radii */
  card: "16px", // Standard cards
  cardInner: "12px", // Inputs / inner groups
  cardSmall: "12px", // Small nested surfaces
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
