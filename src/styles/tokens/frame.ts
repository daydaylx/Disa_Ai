/**
 * Frame-Notch Design System Tokens
 *
 * The signature visual element of Disa AI.
 * A notched frame system that creates brand recognition across all UI elements.
 *
 * ## Design Decisions (Phase 0 - Fixed)
 *
 * 1. NOTCH CORNER: Top-right (fixed, never change)
 * 2. NOTCH SIZES:
 *    - notchSm = 10px (mobile default, smaller elements)
 *    - notchMd = 14px (larger containers, hero frames)
 * 3. OUTLINE RULE: 1px, very transparent (12-15% white/neutral)
 * 4. ACCENT RULE: Accent color only on Active/Focus states, NOT idle
 * 5. ANIMATION RULE:
 *    - Wordmark: Intro animation once on load
 *    - Notch: No continuous animation, only state transitions (hover/focus/press)
 */

export interface FrameTokens {
  // Frame base styling
  radius: string;
  borderWidth: string;
  borderColor: string;
  borderColorHover: string;
  borderColorFocus: string;
  borderColorActive: string;
  background: string;
  shadow: string;
  shadowHover: string;
  shadowFocus: string;

  // Notch sizes
  notchSm: string;
  notchMd: string;

  // Notch edge highlight (accent, only on active/focus)
  edgeHighlight: string;
  edgeHighlightActive: string;

  // Transition timing
  transitionDuration: string;
  transitionEasing: string;
}

export const frameTokens: FrameTokens = {
  // Frame base - using existing design system values
  radius: "16px", // matches radius-md
  borderWidth: "1px",
  borderColor: "rgba(255, 255, 255, 0.12)", // 12% white - subtle
  borderColorHover: "rgba(255, 255, 255, 0.18)", // 18% white - slightly more visible
  borderColorFocus: "rgba(139, 92, 246, 0.4)", // brand-primary at 40%
  borderColorActive: "rgba(139, 92, 246, 0.5)", // brand-primary at 50%
  background: "rgba(15, 15, 20, 0.6)", // dark glass background
  shadow: "0 2px 8px rgba(0, 0, 0, 0.35)", // elevation-1
  shadowHover: "0 4px 12px rgba(0, 0, 0, 0.4)",
  shadowFocus: "0 4px 16px rgba(139, 92, 246, 0.15), 0 2px 8px rgba(0, 0, 0, 0.35)",

  // Notch sizes (fixed decisions from Phase 0)
  notchSm: "10px", // Mobile default
  notchMd: "14px", // Larger containers

  // Edge highlight - only visible on active/focus
  edgeHighlight: "transparent",
  edgeHighlightActive: "rgba(139, 92, 246, 0.6)", // brand-primary glow

  // Animation timings
  transitionDuration: "200ms",
  transitionEasing: "cubic-bezier(0.4, 0, 0.2, 1)", // smooth easing
};

export const frameCssVars = {
  radius: "--frame-radius",
  borderWidth: "--frame-border-width",
  borderColor: "--frame-border-color",
  borderColorHover: "--frame-border-color-hover",
  borderColorFocus: "--frame-border-color-focus",
  borderColorActive: "--frame-border-color-active",
  background: "--frame-bg",
  shadow: "--frame-shadow",
  shadowHover: "--frame-shadow-hover",
  shadowFocus: "--frame-shadow-focus",
  notchSm: "--notch-size-sm",
  notchMd: "--notch-size-md",
  edgeHighlight: "--notch-edge-highlight",
  edgeHighlightActive: "--notch-edge-highlight-active",
  transitionDuration: "--frame-transition-duration",
  transitionEasing: "--frame-transition-easing",
} as const;

/**
 * Generate CSS variables for frame tokens
 */
export function generateFrameCssVariables(): Record<string, string> {
  return {
    [frameCssVars.radius]: frameTokens.radius,
    [frameCssVars.borderWidth]: frameTokens.borderWidth,
    [frameCssVars.borderColor]: frameTokens.borderColor,
    [frameCssVars.borderColorHover]: frameTokens.borderColorHover,
    [frameCssVars.borderColorFocus]: frameTokens.borderColorFocus,
    [frameCssVars.borderColorActive]: frameTokens.borderColorActive,
    [frameCssVars.background]: frameTokens.background,
    [frameCssVars.shadow]: frameTokens.shadow,
    [frameCssVars.shadowHover]: frameTokens.shadowHover,
    [frameCssVars.shadowFocus]: frameTokens.shadowFocus,
    [frameCssVars.notchSm]: frameTokens.notchSm,
    [frameCssVars.notchMd]: frameTokens.notchMd,
    [frameCssVars.edgeHighlight]: frameTokens.edgeHighlight,
    [frameCssVars.edgeHighlightActive]: frameTokens.edgeHighlightActive,
    [frameCssVars.transitionDuration]: frameTokens.transitionDuration,
    [frameCssVars.transitionEasing]: frameTokens.transitionEasing,
  };
}
