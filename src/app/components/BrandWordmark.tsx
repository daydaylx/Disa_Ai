import type { ComponentProps } from "react";

import {
  AnimatedLogo,
  type LogoMotionIntensity,
  type LogoMotionMode,
  type LogoState,
} from "./AnimatedLogo";

export interface BrandWordmarkProps extends Omit<ComponentProps<"span">, "children"> {
  /**
   * Animation state of the logo
   * @default "idle"
   */
  state?: LogoState;

  /**
   * Controls visibility and energy of logo motion.
   * @default "subtle"
   */
  intensity?: LogoMotionIntensity;

  /**
   * Motion profile for context-specific tuning.
   * @default "header"
   */
  motionMode?: LogoMotionMode;

  /**
   * Whether to show the thinking cursor
   * @default false
   */
  showCursor?: boolean;
}

/**
 * BrandWordmark - DISA AI brand logo with animations
 *
 * Now powered by AnimatedLogo with breathing effects, hover interactions,
 * and state-based animations for enhanced brand presence.
 */
export function BrandWordmark({
  className,
  state = "idle",
  intensity = "subtle",
  motionMode = "header",
  showCursor: _showCursor = false, // Not used currently, reserved for future cursor animation
  ...props
}: BrandWordmarkProps) {
  return (
    <AnimatedLogo
      className={className}
      intensity={intensity}
      motionMode={motionMode}
      state={state}
      {...props}
    />
  );
}
