/**
 * Motion tokens mirroring Fluent 2 dynamics.
 */

export type DurationTokens = {
  micro: string;
  small: string;
  medium: string;
  large: string;
};

export type EasingTokens = {
  standard: string;
  emphasized: string;
  exit: string;
  accelerate: string;
  decelerate: string;
};

export type MotionTokens = {
  duration: DurationTokens;
  easing: EasingTokens;
};

export const motionTokens: MotionTokens = {
  duration: {
    micro: "120ms",
    small: "150ms",
    medium: "180ms",
    large: "200ms",
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
    accelerate: "cubic-bezier(0.8, 0, 1, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
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
