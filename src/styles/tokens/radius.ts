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
  xs: "10.2px", // Deprecated: Use sm instead (reduced by 15%)
  sm: "10.2px", // Small elements: buttons, chips, badges (reduced by 15%)
  md: "13.6px", // Medium elements: cards, inputs, dialogs (reduced by 15%)
  lg: "17px", // Large elements: panels, large cards (reduced by 15%)
  xl: "13.6px", // Deprecated: Use md instead (reduced by 15%)
  pill: "9999px", // Fully rounded (pills, avatars)
  full: "50%",

  /* Additional radii for specific components */
  scrollbar: "13.6px", // (reduced by 15%)
  focus: "10.2px", // (reduced by 15%)
  toast: "10.2px", // (reduced by 15%)
  installPrompt: "13.6px", // (reduced by 15%)
  button: "10.2px", // (reduced by 15%)
  badge: "10.2px", // (reduced by 15%)

  /* Glassmorphism Card System - 3 consistent radii */
  card: "13.6px", // Standard cards (reduced by 15%)
  cardInner: "10.2px", // Inner elements (reduced by 15%)
  cardSmall: "10.2px", // Small elements (reduced by 15%)
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
