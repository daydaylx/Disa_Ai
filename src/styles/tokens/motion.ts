/**
 * Motion tokens for Glassmorphism 2.0.
 * Simplified to 3 durations: 120ms (quick), 180ms (base), 240ms (slow)
 * Single primary easing: cubic-bezier(.23, 1, .32, 1) for smooth, natural motion
 */

export type DurationTokens = {
  micro: string; // Deprecated: Use quick instead
  small: string; // Deprecated: Use quick instead
  medium: string; // Deprecated: Use base instead
  large: string; // Deprecated: Use slow instead
};

export type EasingTokens = {
  standard: string; // Primary easing for all transitions
  emphasized: string; // Deprecated: Use standard instead
  exit: string; // Deprecated: Use standard instead
  accelerate: string; // Deprecated: Use standard instead
  decelerate: string; // Deprecated: Use standard instead
};

export type MotionTokens = {
  duration: DurationTokens;
  easing: EasingTokens;
};

export const motionTokens: MotionTokens = {
  duration: {
    micro: "120ms", // Quick: Hover, Press, Chip Select
    small: "120ms", // Deprecated: Use micro instead
    medium: "180ms", // Base: Modal, Sheet Enter/Exit
    large: "240ms", // Slow: Page Transitions
  },
  easing: {
    standard: "cubic-bezier(.23, 1, .32, 1)", // Smooth, natural motion for all
    emphasized: "cubic-bezier(.23, 1, .32, 1)", // Deprecated: Same as standard
    exit: "cubic-bezier(.23, 1, .32, 1)", // Deprecated: Same as standard
    accelerate: "cubic-bezier(.23, 1, .32, 1)", // Deprecated: Same as standard
    decelerate: "cubic-bezier(.23, 1, .32, 1)", // Deprecated: Same as standard
  },
};

export const motionCssVars = {
  durationMicro: "--motion-duration-micro",
  durationSmall: "--motion-duration-small",
  durationMedium: "--motion-duration-medium",
  durationLarge: "--motion-duration-large",
  easingStandard: "--motion-easing-standard",
  easingEmphasized: "--motion-easing-emphasized",
  easingExit: "--motion-easing-exit",
  easingAccelerate: "--motion-easing-accelerate",
  easingDecelerate: "--motion-easing-decelerate",
} as const;
