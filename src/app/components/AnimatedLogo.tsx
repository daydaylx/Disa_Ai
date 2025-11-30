import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Logo animation states
 */
export type LogoState = "idle" | "loading" | "thinking" | "success" | "error";

export interface AnimatedLogoProps extends Omit<ComponentProps<"span">, "children"> {
  /**
   * Animation state of the logo
   * @default "idle"
   */
  state?: LogoState;

  /**
   * Whether to show the thinking cursor after "AI"
   * @default false
   */
  showCursor?: boolean;
}

/**
 * AnimatedLogo - Animated DISA AI wordmark with multiple states
 *
 * Features:
 * - Breathing animation in idle state
 * - Letter-by-letter bounce on hover
 * - Wave animation during loading
 * - Blinking cursor during thinking
 * - Success/Error visual feedback
 *
 * @example
 * ```tsx
 * <AnimatedLogo state="idle" />
 * <AnimatedLogo state="loading" />
 * <AnimatedLogo state="thinking" showCursor />
 * ```
 */
export function AnimatedLogo({
  state = "idle",
  showCursor = false,
  className,
  ...props
}: AnimatedLogoProps) {
  const stateClass = `logo-state-${state}`;

  return (
    <span
      className={cn("text-ink-primary text-lg font-semibold tracking-tight", stateClass, className)}
      {...props}
    >
      <span className="logo-animated">
        {/* DISA part */}
        <span className="logo-letter">D</span>
        <span className="logo-letter">i</span>
        <span className="logo-letter">s</span>
        <span className="logo-letter">a</span>

        {/* Space */}
        <span className="inline-block w-[0.25em]" aria-hidden="true" />

        {/* AI part with brand color */}
        <span className="logo-ai-part text-brand">
          <span className="logo-letter">A</span>
          <span className="logo-letter">I</span>
        </span>

        {/* Thinking cursor (only visible in thinking state) */}
        {(state === "thinking" || showCursor) && (
          <span className="logo-cursor" aria-hidden="true" />
        )}
      </span>
    </span>
  );
}
