import type { ComponentProps } from "react";

import { AnimatedLogo, type LogoState } from "./AnimatedLogo";

export interface BrandWordmarkProps extends Omit<ComponentProps<"span">, "children"> {
  /**
   * Animation state of the logo
   * @default "idle"
   */
  state?: LogoState;

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
  showCursor = false, // Not used currently, reserved for future cursor animation
  ...props
}: BrandWordmarkProps) {
  return <AnimatedLogo className={className} state={state} {...props} />;
}
