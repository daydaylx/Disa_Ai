import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Logo animation states
 */
export type LogoState = "idle" | "loading" | "typing" | "thinking" | "success" | "error";

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
 * - Presence animation (subtle glow/halo) for all states
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
  const isIdle = state === "idle";

  return (
    <span
      className={cn(
        "group relative inline-flex items-baseline gap-1 text-ink-primary text-lg font-semibold tracking-tight select-none cursor-default isolation-auto",
        stateClass,
        className,
      )}
      {...props}
    >
      {/* Presence Mark - Subtle background glow/animation */}
      <span className="presence-mark" aria-hidden="true" data-state={state} />

      <span className="logo-animated inline-flex items-baseline gap-[0.28em] relative z-10">
        {/* DISA part in hand-written style */}
        <span
          className={cn(
            "logo-disa inline-flex items-baseline gap-[0.05em] font-hand text-[1.02em] leading-none tracking-[0.01em]",
            isIdle && "motion-safe:animate-logo-float",
          )}
        >
          <span className="logo-letter transition-colors duration-300 group-hover:text-white">
            D
          </span>
          <span className="logo-letter transition-colors duration-300 group-hover:text-white delay-75">
            i
          </span>
          <span className="logo-letter transition-colors duration-300 group-hover:text-white delay-100">
            s
          </span>
          <span className="logo-letter transition-colors duration-300 group-hover:text-white delay-150">
            a
          </span>
        </span>

        {/* AI part in clean sans, desaturated */}
        <span
          className={cn(
            "logo-ai-part inline-flex items-baseline gap-[0.06em] font-sans text-[0.96em] font-medium tracking-[-0.01em] text-ink-primary/90 transition-colors duration-300 group-hover:text-accent-secondary",
            isIdle && "motion-safe:animate-logo-scale-pulse",
          )}
        >
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
