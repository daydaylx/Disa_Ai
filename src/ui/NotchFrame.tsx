import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * NotchFrame - Disa AI's signature visual primitive
 *
 * A reusable frame component with a characteristic notch in the top-right corner.
 * The notch is created using CSS pseudo-elements for maximum performance.
 *
 * ## Design Decisions (Fixed)
 * - Notch corner: ALWAYS top-right
 * - Notch visible via pseudo-element illusion (not clip-path for performance)
 * - Accent/glow only on focus/active states, never idle
 * - Respects prefers-reduced-motion
 *
 * ## Usage
 * ```tsx
 * <NotchFrame>Content here</NotchFrame>
 * <NotchFrame variant="card">Card content</NotchFrame>
 * <NotchFrame variant="input" size="lg">Input container</NotchFrame>
 * ```
 */

const notchFrameVariants = cva(
  // Base styles - all NotchFrames share these
  [
    "relative isolate overflow-hidden",
    "border border-[var(--frame-border-color)]",
    "bg-[var(--frame-bg)] backdrop-blur-xl",
    "shadow-[var(--frame-shadow)]",
    "transition-all duration-[var(--frame-transition-duration)] ease-[var(--frame-transition-easing)]",
    // Notch pseudo-element (top-right corner)
    "before:absolute before:top-0 before:right-0",
    "before:w-[var(--notch-size)] before:h-[var(--notch-size)]",
    "before:bg-bg-app before:z-10",
    "before:transition-all before:duration-[var(--frame-transition-duration)]",
    // Edge highlight pseudo-element (only visible on focus/active)
    "after:absolute after:top-[var(--notch-size)] after:right-0",
    "after:w-[1px] after:h-[calc(100%-var(--notch-size))]",
    "after:bg-[var(--notch-edge-highlight)]",
    "after:transition-all after:duration-[var(--frame-transition-duration)]",
  ],
  {
    variants: {
      /**
       * Variant determines the visual style
       * - default: Standard frame with subtle border
       * - card: Suggestion card style with hover states
       * - input: Input container with focus ring
       * - hero: Large hero frame with prominent styling
       * - chip: Small chip/segment style
       */
      variant: {
        default: ["rounded-[var(--frame-radius)]", "before:rounded-bl-[var(--frame-radius)]"],
        card: [
          "rounded-[var(--frame-radius)]",
          "before:rounded-bl-[var(--frame-radius)]",
          "cursor-pointer",
          "hover:border-[var(--frame-border-color-hover)]",
          "hover:shadow-[var(--frame-shadow-hover)]",
          "active:scale-[0.98]",
          "group",
        ],
        input: [
          "rounded-3xl",
          "before:rounded-bl-2xl",
          "focus-within:border-[var(--frame-border-color-focus)]",
          "focus-within:shadow-[var(--frame-shadow-focus)]",
          "focus-within:after:bg-[var(--notch-edge-highlight-active)]",
        ],
        hero: [
          "rounded-[20px]",
          "before:rounded-bl-[16px]",
          "border-[var(--frame-border-color-hover)]",
        ],
        chip: [
          "rounded-full",
          "before:hidden", // No notch on pills
          "after:hidden",
        ],
        chipActive: [
          "rounded-2xl",
          "before:rounded-bl-xl",
          "border-[var(--frame-border-color-focus)]",
          "shadow-[var(--frame-shadow-focus)]",
          "after:bg-[var(--notch-edge-highlight-active)]",
        ],
      },
      /**
       * Size determines notch dimensions and padding
       * - sm: 10px notch (mobile default)
       * - md: 14px notch (larger containers)
       */
      size: {
        sm: "[--notch-size:var(--notch-size-sm)]",
        md: "[--notch-size:var(--notch-size-md)]",
      },
      /**
       * Glass effect intensity
       */
      glass: {
        none: "bg-surface-1 backdrop-blur-none",
        subtle: "bg-surface-glass/40 backdrop-blur-md",
        strong: "bg-surface-glass backdrop-blur-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      glass: "strong",
    },
  },
);

export interface NotchFrameProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notchFrameVariants> {
  /** Whether to render as a different element (button, etc.) */
  as?: "div" | "button" | "article" | "section";
}

/**
 * NotchFrame component with proper ref forwarding for different element types.
 */
export const NotchFrame = forwardRef<HTMLDivElement, NotchFrameProps>(
  ({ className, variant, size, glass, as = "div", children, ...props }, ref) => {
    const classes = cn(notchFrameVariants({ variant, size, glass }), className);

    // Render appropriate element type
    if (as === "button") {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className={classes}
          {...(props as HTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    if (as === "article") {
      return (
        <article ref={ref} className={classes} {...props}>
          {children}
        </article>
      );
    }

    if (as === "section") {
      return (
        <section ref={ref} className={classes} {...props}>
          {children}
        </section>
      );
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

NotchFrame.displayName = "NotchFrame";

/**
 * Utility CSS classes for NotchFrame styling without the component wrapper.
 * Use these when you need to apply the notch effect to existing elements.
 */
export const notchFrameClasses = {
  base: "relative isolate overflow-hidden border border-[var(--frame-border-color)] bg-[var(--frame-bg)] backdrop-blur-xl shadow-[var(--frame-shadow)] transition-all duration-[var(--frame-transition-duration)] ease-[var(--frame-transition-easing)]",
  notchSm: "[--notch-size:var(--notch-size-sm)]",
  notchMd: "[--notch-size:var(--notch-size-md)]",
  notchPseudo:
    "before:absolute before:top-0 before:right-0 before:w-[var(--notch-size)] before:h-[var(--notch-size)] before:bg-bg-app before:z-10 before:transition-all",
  edgePseudo:
    "after:absolute after:top-[var(--notch-size)] after:right-0 after:w-[1px] after:h-[calc(100%-var(--notch-size))] after:bg-[var(--notch-edge-highlight)] after:transition-all",
  hoverStates:
    "hover:border-[var(--frame-border-color-hover)] hover:shadow-[var(--frame-shadow-hover)]",
  focusStates:
    "focus-within:border-[var(--frame-border-color-focus)] focus-within:shadow-[var(--frame-shadow-focus)] focus-within:after:bg-[var(--notch-edge-highlight-active)]",
  activeEdge: "after:bg-[var(--notch-edge-highlight-active)]",
};

export { notchFrameVariants };
