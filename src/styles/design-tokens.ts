/**
 * Glassmorphism design token definitions for the redesigned Disa AI interface.
 *
 * The tokens favour glassmorphism surfaces with subtle transparency and high-contrast typography.
 * CSS variable wiring lives in `design-tokens.css`.
 */

export const colors = {
  canvas: "#0b0d10" /* Canvas background */,
  layer1: "#101318" /* Primary layer */,
  layer2: "#161a20" /* Secondary layer for depth */,
  surface0: "rgba(12, 16, 23, 0.94)" /* Base surface */,
  surface1: "rgba(17, 22, 31, 0.96)" /* Card surface */,
  surface2: "rgba(23, 29, 41, 0.98)" /* Elevated surface */,
  primaryText: "#f4f7ff" /* Primärtext */,
  secondaryText: "#dde6f6" /* Sekundärtext */,
  mutedText: "rgba(204, 216, 233, 0.78)" /* Muted body */,
  subtleText: "rgba(204, 216, 233, 0.62)" /* Noch dezenterer Text */,
  accent1: "#6fd3ff" /* Kalt */,
  accent2: "#ff9f6f" /* Warm */,
  accent1Rgb: "111, 211, 255",
  accent2Rgb: "255, 159, 111",
  brandRgb: "111, 211, 255",
  brand: "rgb(111, 211, 255)" /* Brand primary */,
  brandWeak: "rgba(111, 211, 255, 0.22)",
  brandStrong: "rgba(111, 211, 255, 0.92)",
  brandContrast: "#03101a",
  success: "#34C759" /* Green */,
  successBg: "rgba(52, 199, 89, 0.1)",
  warning: "#FFCC00" /* Yellow */,
  warningBg: "rgba(255, 204, 0, 0.1)",
  danger: "#FF3B30" /* Red */,
  dangerBg: "rgba(255, 59, 48, 0.1)",
} as const;

// Spacing scale (8px grid) - Updated to match new tokens
export const spacing = {
  0: "4px",
  1: "8px" /* space-1: 8px */,
  2: "12px" /* space-2: 12px */,
  3: "16px" /* space-3: 16px */,
  4: "24px" /* space-4: 24px */,
  5: "32px" /* space-5: 32px */,
  6: "40px" /* space-6: 40px */,
  8: "64px" /* space-8: 64px */,
} as const;

// Touch targets and accessibility
export const touchTargets = {
  minimum: "44px", // iOS guideline minimum
  recommended: "48px", // Material Design recommended
  comfortable: "56px", // Comfortable for all users
  large: "64px", // Large touch targets for better UX
} as const;

// Typography scale - Updated to match new tokens
export const typography = {
  display: {
    fontSize: "28px" /* font-display: 28px */,
    lineHeight: "36px",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  h1: {
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  h2: {
    fontSize: "20px",
    lineHeight: "28px",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  h3: {
    fontSize: "18px",
    lineHeight: "26px",
    fontWeight: "500",
    letterSpacing: "-0.01em",
  },
  body: {
    fontSize: "16px" /* font-body: 16px */,
    lineHeight: "24px",
    fontWeight: "400",
  },
  hint: {
    fontSize: "14px" /* font-hint: 14px */,
    lineHeight: "20px",
    fontWeight: "500",
  },
  caption: {
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: "400",
  },
  mono: {
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: "400",
    fontFamily: "ui-monospace, 'SF Mono', 'Monaco', 'Inconsolata', monospace",
  },
} as const;

// Border radii tokens
export const radii = {
  none: "0px",
  sm: "8px",
  base: "12px",
  lg: "16px",
  xl: "20px",
  full: "9999px",
  pill: "999px",
} as const;

// Elevation tokens
export const elevation = {
  level1: "0 2px 10px rgba(0, 0, 0, 0.35)" /* elev-1 */,
  level2: "0 6px 26px rgba(0, 0, 0, 0.45)" /* elev-2 */,
  level3: "0 12px 40px rgba(0, 0, 0, 0.55)" /* elev-3 */,
  neon: "0 0 18px rgba(111,211,255,0.35)" /* neon glow */,
  neonStrong: "0 0 24px rgba(111,211,255,0.5)" /* strong neon glow */,
} as const;

export const text = {
  strong: "#f4f7ff",
  primary: "#dde6f6",
  muted: "rgba(204, 216, 233, 0.78)",
  subtle: "rgba(204, 216, 233, 0.62)",
} as const;

export const surfaces = {
  0: "rgba(12, 16, 23, 0.94)",
  1: "rgba(17, 22, 31, 0.96)",
  2: "rgba(23, 29, 41, 0.98)",
} as const;

export const border = {
  baseRgb: "126, 148, 175",
  subtleRgb: "80, 98, 124",
  strongRgb: "168, 191, 214",
} as const;

// Motion tokens
export const transitions = {
  fast: "120ms",
  normal: "200ms",
  slow: "300ms",
  spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// Reference breakpoints (mobile first focus)
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;

// Blur tokens
export const blur = {
  sm: "6px" /* glass-blur-sm */,
  md: "12px" /* glass-blur-md */,
  lg: "18px" /* glass-blur-lg */,
} as const;

// Glassmorphism parameters
export const glass = {
  bg: "18, 22, 28" /* glass-bg: RGB from bg0 */,
  alpha: 0.16 /* glass-alpha */,
  alphaSubtle: 0.08 /* glass-alpha-subtle */,
  alphaStrong: 0.24 /* glass-alpha-strong */,
  stroke: "rgba(255,255,255,0.12)" /* glass-stroke */,
  strokeStrong: "rgba(255,255,255,0.18)" /* glass-stroke-strong */,
  radius: "18px" /* glass-radius */,
} as const;

export const gradients = {
  primary: "linear-gradient(135deg, #6fd3ff 0%, #ff9f6f 100%)",
  accent: "linear-gradient(135deg, #101318 0%, #0b0d10 100%)",
  glass: "linear-gradient(135deg, rgba(111,211,255,0.1) 0%, rgba(255,159,111,0.1) 100%)",
  sunset: "linear-gradient(135deg, #ff9f6f 0%, #ff6b6b 100%)",
  ocean: "linear-gradient(135deg, #6fd3ff 0%, #4ecdc4 100%)",
} as const;

export const designTokens = {
  colors,
  spacing,
  touchTargets,
  typography,
  radii,
  elevation,
  text,
  surfaces,
  border,
  transitions,
  breakpoints,
  blur,
  glass,
  gradients,
} as const;

export type DesignTokens = typeof designTokens;
