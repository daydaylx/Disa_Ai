import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Logo animation states
 */
export type LogoState = "idle" | "loading" | "typing" | "thinking" | "success" | "error";
export type LogoMotionIntensity = "subtle" | "premium" | "accent";
export type LogoMotionMode = "header" | "hero";

export interface AnimatedLogoProps extends Omit<ComponentProps<"span">, "children"> {
  /**
   * Animation state of the logo, controlling the presence indicator.
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
}

/**
 * AnimatedLogo - Renders the "Disa AI" brand wordmark with a subtle
 * premium presence animation indicator.
 *
 * This component displays the brand name and a decorative `presence-mark`
 * element. The animation of the mark is controlled purely by CSS, driven
 * by the `data-state` attribute, which is set based on the `state` prop.
 *
 * **Animation Philosophy**: Premium, slow, non-intrusive. Timings are deliberately
 * extended to create a high-quality, ambient presence rather than distracting motion.
 *
 * **States and Animation Timings**:
 * - `idle`: Slow ambient pulse (~8.6s cycle)
 * - `typing`: Slightly elevated pulse (~5.4s cycle)
 * - `thinking`, `loading`: Clearly active pulse (~2.8s cycle)
 * - `error`: One-shot alert pulse (~560ms), then returns to idle
 *
 * **Accessibility**: Respects `prefers-reduced-motion` by showing static,
 * reduced-opacity glows instead of animated pulsing.
 *
 * **Performance**: Uses only `transform`, `opacity`, and `filter` (no layout changes).
 * Includes `pointer-events: none` to prevent interaction blocking.
 *
 * @example
 * ```tsx
 * <AnimatedLogo state="idle" />
 * <AnimatedLogo state="thinking" />
 * ```
 */
export function AnimatedLogo({
  state = "idle",
  intensity = "subtle",
  motionMode = "header",
  className,
  ...props
}: AnimatedLogoProps) {
  return (
    <span
      className={cn(
        "brand-wordmark relative inline-flex items-baseline font-semibold tracking-tight select-none",
        "isolation-isolate", // Creates a stacking context for the pseudo-element
        className,
      )}
      data-testid="animated-logo"
      {...props}
    >
      {/* Presence Mark: Animated via CSS based on parent's data-state */}
      <span
        className="presence-mark"
        aria-hidden="true"
        data-state={state}
        data-intensity={intensity}
        data-mode={motionMode}
      >
        <span className="presence-mark__core" />
        <span className="presence-mark__halo" />
      </span>

      {/* Wordmark Text with gradient accents */}
      <span className="relative z-content">
        <span className="bg-gradient-to-r from-brand-primary via-purple-400 to-brand-primary bg-clip-text text-transparent font-bold">
          Disa
        </span>{" "}
        <span className="bg-gradient-to-r from-accent-chat to-purple-400 bg-clip-text text-transparent font-bold">
          AI
        </span>
      </span>
    </span>
  );
}
