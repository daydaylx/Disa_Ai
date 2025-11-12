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
  xs: "12px", // Deprecated: Use sm instead
  sm: "12px", // Small elements: buttons, chips, badges
  md: "16px", // Medium elements: cards, inputs, dialogs
  lg: "20px", // Large elements: panels, large cards
  xl: "16px", // Deprecated: Use md instead
  pill: "9999px", // Fully rounded (pills, avatars)
  full: "50%",

  /* Additional radii for specific components */
  scrollbar: "16px",
  focus: "12px",
  toast: "12px",
  installPrompt: "16px",
  button: "12px",
  badge: "12px",

  /* Glassmorphism Card System - 3 consistent radii */
  card: "16px", // Standard cards
  cardInner: "12px", // Inner elements
  cardSmall: "12px", // Small elements
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
