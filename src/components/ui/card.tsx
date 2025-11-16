import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const cardVariants = cva(
  // Dramatic Neomorphic Foundation
  "relative isolate overflow-hidden rounded-[var(--radius-xl)] border text-[var(--color-text-primary)] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-neumorphic)] focus-visible:border-[var(--acc1)]",
  {
    variants: {
      tone: {
        // === PRIMARY NEOMORPHIC TONES ===
        "neo-raised":
          "bg-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-md)]",
        "neo-floating":
          "bg-[var(--surface-neumorphic-floating)] border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-lg)]",
        "neo-dramatic":
          "bg-gradient-to-br from-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-xl)]",
        "neo-extreme":
          "bg-gradient-to-br from-white via-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-dramatic)] before:absolute before:inset-0 before:rounded-[var(--radius-xl)] before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none",
        "neo-inset":
          "bg-[var(--surface-neumorphic-pressed)] border-[var(--border-neumorphic-dark)] shadow-[var(--shadow-inset-medium)]",
        "neo-glass":
          "bg-[var(--surface-neumorphic-floating)]/80 border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-lg)] backdrop-blur-sm",

        // === LEGACY TONES (Converted to Neomorphic) ===
        /** @deprecated Use neo-raised instead */
        default:
          "bg-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-subtle)] shadow-[var(--shadow-neumorphic-sm)]",
        /** @deprecated Use neo-floating instead */
        muted:
          "bg-[var(--surface-neumorphic-base)] border-[var(--border-neumorphic-subtle)] shadow-[var(--shadow-inset-subtle)] text-[var(--color-text-secondary)]",
        /** @deprecated Use neo-dramatic instead */
        contrast:
          "bg-[var(--surface-neumorphic-floating)] border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-xl)] text-[var(--color-text-primary)]",
        /** @deprecated Use neo-glass instead */
        translucent:
          "bg-[var(--surface-neumorphic-floating)]/90 border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-lg)] backdrop-blur-sm",
        /** @deprecated Use neo-raised instead */
        solid:
          "bg-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-md)]",
        /** @deprecated Use neo-inset instead */
        outlined:
          "bg-transparent border-2 border-[var(--border-neumorphic-subtle)] shadow-[var(--shadow-inset-subtle)]",
        /** @deprecated Use neo-floating instead */
        neumorphic:
          "bg-[var(--surface-neumorphic-floating)] border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-lg)]",
      },
      elevation: {
        // === DRAMATIC NEOMORPHIC ELEVATION SYSTEM ===
        none: "shadow-none",
        subtle: "shadow-[var(--shadow-neumorphic-sm)]", // 8px shadows
        medium: "shadow-[var(--shadow-neumorphic-md)]", // 15px shadows
        strong: "shadow-[var(--shadow-neumorphic-lg)]", // 25px shadows
        dramatic: "shadow-[var(--shadow-neumorphic-xl)]", // 35px shadows
        extreme: "shadow-[var(--shadow-neumorphic-dramatic)]", // 45px shadows
        maximum: "shadow-[var(--shadow-neumorphic-extreme)]", // 60px shadows!

        // === DEPTH SYSTEM (1-8 Levels) ===
        "depth-1": "shadow-[var(--shadow-depth-1)]", // 8px
        "depth-2": "shadow-[var(--shadow-depth-2)]", // 15px
        "depth-3": "shadow-[var(--shadow-depth-3)]", // 25px
        "depth-4": "shadow-[var(--shadow-depth-4)]", // 35px
        "depth-5": "shadow-[var(--shadow-depth-5)]", // 45px
        "depth-6": "shadow-[var(--shadow-depth-6)]", // 60px
        "depth-7": "shadow-[var(--shadow-depth-7)]", // 75px
        "depth-8": "shadow-[var(--shadow-depth-8)]", // 100px!!!

        // === LEGACY ELEVATIONS (Mapped to Neomorphic) ===
        /** @deprecated Use subtle instead */
        surface: "shadow-[var(--shadow-neumorphic-sm)]",
        /** @deprecated Use medium instead */
        raised: "shadow-[var(--shadow-neumorphic-md)]",
        /** @deprecated Use strong instead */
        overlay: "shadow-[var(--shadow-neumorphic-lg)]",
        /** @deprecated Use dramatic instead */
        popover: "shadow-[var(--shadow-neumorphic-xl)]",
        /** @deprecated Use extreme instead */
        floating: "shadow-[var(--shadow-neumorphic-dramatic)]",
        /** @deprecated Use maximum instead */
        elevated: "shadow-[var(--shadow-neumorphic-extreme)]",

        // === LEGACY NEO-DEPTH (Deprecated) ===
        /** @deprecated Use depth-1 instead */
        "surface-subtle": "shadow-[var(--shadow-depth-1)]",
        /** @deprecated Use depth-3 instead */
        "surface-prominent": "shadow-[var(--shadow-depth-3)]",
        /** @deprecated Use depth-2 instead */
        "surface-hover": "shadow-[var(--shadow-depth-2)]",
        /** @deprecated Use depth-1 instead */
        "surface-active": "shadow-[var(--shadow-depth-1)]",
      },
      interactive: {
        false: "",

        // === PRIMARY NEOMORPHIC INTERACTIONS ===
        "neo-gentle": [
          "cursor-pointer",
          "hover:shadow-[var(--shadow-neumorphic-lg)]",
          "hover:bg-[var(--surface-neumorphic-floating)]",
          "hover:-translate-y-1",
          "active:shadow-[var(--shadow-inset-subtle)]",
          "active:bg-[var(--surface-neumorphic-pressed)]",
          "active:translate-y-0.5",
        ].join(" "),

        "neo-dramatic": [
          "cursor-pointer",
          "hover:shadow-[var(--shadow-neumorphic-xl)]",
          "hover:bg-gradient-to-br hover:from-[var(--surface-neumorphic-floating)] hover:to-white",
          "hover:-translate-y-2 hover:scale-[1.02]",
          "active:shadow-[var(--shadow-inset-medium)]",
          "active:bg-[var(--surface-neumorphic-pressed)]",
          "active:translate-y-1 active:scale-[0.98]",
        ].join(" "),

        "neo-extreme": [
          "cursor-pointer",
          "hover:shadow-[var(--shadow-neumorphic-dramatic)]",
          "hover:bg-gradient-to-br hover:from-white hover:via-[var(--surface-neumorphic-floating)] hover:to-[var(--acc1)]/10",
          "hover:-translate-y-3 hover:scale-[1.05]",
          "active:shadow-[var(--shadow-inset-strong)]",
          "active:bg-[var(--surface-neumorphic-pressed)]",
          "active:translate-y-1.5 active:scale-[0.95]",
        ].join(" "),

        "neo-press": [
          "cursor-pointer",
          "active:shadow-[var(--shadow-inset-extreme)]",
          "active:bg-[var(--surface-neumorphic-pressed)]",
          "active:translate-y-2 active:scale-[0.96]",
        ].join(" "),

        "neo-lift": [
          "cursor-pointer",
          "hover:shadow-[var(--shadow-neumorphic-extreme)]",
          "hover:-translate-y-4",
          "focus-visible:-translate-y-0",
        ].join(" "),

        // === SEMANTIC GLOW EFFECTS ===
        "glow-brand": [
          "cursor-pointer",
          "hover:shadow-[0_0_40px_rgba(75,99,255,0.4)]",
          "hover:border-[var(--acc1)]",
        ].join(" "),

        "glow-success": [
          "cursor-pointer",
          "hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]",
          "hover:border-[var(--succ)]",
        ].join(" "),

        "glow-warning": [
          "cursor-pointer",
          "hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]",
          "hover:border-[var(--warn)]",
        ].join(" "),

        "glow-error": [
          "cursor-pointer",
          "hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]",
          "hover:border-[var(--err)]",
        ].join(" "),

        // === LEGACY INTERACTIONS (Converted to Neomorphic) ===
        /** @deprecated Use neo-gentle instead */
        gentle: [
          "cursor-pointer",
          "hover:-translate-y-1 hover:shadow-[var(--shadow-neumorphic-md)]",
          "hover:bg-[var(--surface-neumorphic-raised)]",
        ].join(" "),

        /** @deprecated Use neo-dramatic instead */
        dramatic: [
          "cursor-pointer",
          "hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[var(--shadow-neumorphic-lg)]",
        ].join(" "),

        /** @deprecated Use neo-gentle instead */
        subtle: [
          "cursor-pointer",
          "hover:bg-[var(--surface-neumorphic-raised)]",
          "hover:border-[var(--border-neumorphic-light)]",
        ].join(" "),

        /** @deprecated Use neo-press instead */
        press: [
          "cursor-pointer",
          "active:translate-y-0.5 active:scale-[0.99]",
          "active:shadow-[var(--shadow-inset-subtle)]",
        ].join(" "),

        /** @deprecated Use neo-lift instead */
        lift: [
          "cursor-pointer",
          "hover:-translate-y-1 hover:shadow-[var(--shadow-neumorphic-md)]",
        ].join(" "),

        /** @deprecated Use glow-brand instead */
        glow: "cursor-pointer hover:shadow-[var(--shadow-glow-brand)]",

        // === REMOVED LEGACY VARIANTS ===
        /** @deprecated Use neo-gentle instead */
        "depth-hover":
          "cursor-pointer hover:-translate-y-1 hover:shadow-[var(--shadow-neumorphic-md)]",
        /** @deprecated Use neo-press instead */
        "depth-press":
          "cursor-pointer active:translate-y-0.5 active:scale-[0.98] active:shadow-[var(--shadow-inset-subtle)]",
        /** @deprecated Use neo-lift instead */
        "floating-hover":
          "cursor-pointer hover:-translate-y-1 hover:shadow-[var(--shadow-neumorphic-lg)]",
        /** @deprecated Removed - use glow-* variants */
        "ambient-subtle": "cursor-pointer",
        /** @deprecated Removed - use glow-* variants */
        "ambient-medium": "cursor-pointer",
        /** @deprecated Removed - use glow-* variants */
        "ambient-strong": "cursor-pointer",
      },
      padding: {
        none: "",
        xs: "p-3", // 12px
        sm: "p-4", // 16px
        md: "p-6", // 24px
        lg: "p-8", // 32px
        xl: "p-10", // 40px
        "2xl": "p-12", // 48px
      },
      size: {
        auto: "",
        xs: "max-w-xs", // 320px
        sm: "max-w-sm", // 384px
        md: "max-w-md", // 448px
        lg: "max-w-lg", // 512px
        xl: "max-w-xl", // 576px
        "2xl": "max-w-2xl", // 672px
        "3xl": "max-w-3xl", // 768px
        full: "w-full",
      },
      intent: {
        default: "",
        // Neomorphic Semantic Colors with Gradients
        primary:
          "border-[var(--acc1)] bg-gradient-to-br from-[var(--acc1)]/5 to-[var(--acc2)]/5 text-[var(--color-text-primary)]",
        secondary:
          "border-[var(--color-border-subtle)] bg-gradient-to-br from-[var(--surface-neumorphic-base)] to-[var(--surface-neumorphic-raised)]",
        warning:
          "border-[var(--warn)] bg-gradient-to-br from-[var(--warn)]/5 to-[var(--warn)]/10 text-[var(--color-text-primary)]",
        error:
          "border-[var(--err)] bg-gradient-to-br from-[var(--err)]/5 to-[var(--err)]/10 text-[var(--color-text-primary)]",
        success:
          "border-[var(--succ)] bg-gradient-to-br from-[var(--succ)]/5 to-[var(--succ)]/10 text-[var(--color-text-primary)]",
        info: "border-[var(--info)] bg-gradient-to-br from-[var(--info)]/5 to-[var(--info)]/10 text-[var(--color-text-primary)]",
      },
      state: {
        default: "",
        loading: "animate-pulse bg-[var(--surface-neumorphic-base)] pointer-events-none opacity-75",
        disabled:
          "opacity-40 pointer-events-none cursor-not-allowed shadow-[var(--shadow-inset-subtle)]",
        selected:
          "border-[var(--acc1)] bg-gradient-to-br from-[var(--acc1)]/10 to-[var(--acc2)]/10 shadow-[0_0_0_2px_var(--acc1)]/20",
        focus: "border-[var(--acc1)] shadow-[var(--shadow-focus-neumorphic)]",
        hover: "shadow-[var(--shadow-neumorphic-lg)] -translate-y-1",
        active: "shadow-[var(--shadow-inset-medium)] translate-y-0.5",
      },
    },
    compoundVariants: [
      // === NEOMORPHIC TONE + INTERACTIVE COMBINATIONS ===
      {
        tone: ["neo-raised", "neo-floating", "neo-dramatic", "neo-extreme"],
        interactive: ["neo-gentle", "neo-dramatic", "neo-extreme"],
        class: "min-h-[44px]", // Touch target
      },
      {
        tone: "neo-glass",
        interactive: ["neo-gentle", "neo-dramatic"],
        class: "hover:bg-[var(--surface-neumorphic-floating)]/95 hover:backdrop-blur-md",
      },
      {
        tone: "neo-extreme",
        interactive: "neo-extreme",
        class: "hover:shadow-[var(--shadow-neumorphic-extreme)] hover:scale-[1.08]",
      },

      // === INTENT + INTERACTIVE COMBINATIONS ===
      {
        intent: "primary",
        interactive: ["glow-brand", "neo-gentle", "neo-dramatic"],
        class: "hover:from-[var(--acc1)]/10 hover:to-[var(--acc2)]/15",
      },
      {
        intent: "error",
        interactive: ["glow-error", "neo-gentle"],
        class: "hover:from-[var(--err)]/10 hover:to-[var(--err)]/15",
      },
      {
        intent: "success",
        interactive: ["glow-success", "neo-gentle"],
        class: "hover:from-[var(--succ)]/10 hover:to-[var(--succ)]/15",
      },
      {
        intent: "warning",
        interactive: ["glow-warning", "neo-gentle"],
        class: "hover:from-[var(--warn)]/10 hover:to-[var(--warn)]/15",
      },

      // === STATE COMBINATIONS ===
      {
        state: "loading",
        class: "animate-pulse cursor-wait pointer-events-none",
      },
      {
        state: "selected",
        interactive: false,
        class: "cursor-default",
      },
      {
        state: "disabled",
        interactive: false,
        class: "cursor-not-allowed",
      },
      {
        state: "selected",
        interactive: ["neo-gentle", "gentle"],
        class:
          "hover:from-[var(--acc1)]/15 hover:to-[var(--acc2)]/20 hover:border-[var(--acc1)]/60",
      },

      // === ELEVATION + TONE COMBINATIONS ===
      {
        tone: ["neo-dramatic", "neo-extreme"],
        elevation: ["dramatic", "extreme", "maximum"],
        class: "border-[var(--border-neumorphic-light)]",
      },
      {
        tone: "neo-inset",
        elevation: ["none", "subtle"],
        class: "border-[var(--border-neumorphic-dark)]",
      },

      // === ACCESSIBILITY COMBINATIONS ===
      {
        interactive: [
          "neo-gentle",
          "neo-dramatic",
          "neo-extreme",
          "glow-brand",
          "glow-success",
          "glow-warning",
          "glow-error",
        ],
        class: "min-h-[44px] touch-target",
      },

      // === LEGACY SUPPORT (Simplified) ===
      {
        tone: "neumorphic",
        interactive: ["gentle", "dramatic"],
        class:
          "hover:shadow-[var(--shadow-neumorphic-lg)] hover:bg-[var(--surface-neumorphic-floating)]",
      },
      {
        tone: "translucent",
        interactive: ["gentle", "dramatic"],
        class: "hover:bg-[var(--surface-neumorphic-floating)]/95 hover:backdrop-blur-md",
      },
    ],
    defaultVariants: {
      tone: "neo-raised", // Changed from "default" to neomorphic
      elevation: "medium", // Changed from "surface" to medium dramatic
      interactive: false,
      padding: "none",
      size: "auto",
      intent: "default",
      state: "default",
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Whether the card should be rendered as a clickable element
   * @default false
   */
  clickable?: boolean;
  /**
   * Callback fired when the card is clicked (only if clickable=true)
   */
  onCardClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * ARIA label for accessibility when clickable
   */
  "aria-label"?: string;
}

// Export variant props for external use
export type CardVariantProps = VariantProps<typeof cardVariants>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      tone,
      elevation,
      interactive,
      padding,
      size,
      intent,
      state,
      clickable = false,
      onCardClick,
      onClick,
      ...props
    },
    ref,
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (state === "disabled" || state === "loading") {
        event.preventDefault();
        return;
      }

      if (clickable && onCardClick) {
        onCardClick(event);
      }
      onClick?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (state === "disabled" || state === "loading") {
        event.preventDefault();
        return;
      }

      if (clickable && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        // Create a synthetic mouse event for consistency
        const syntheticEvent = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        });

        // Trigger the click handler with the synthetic event
        const target = event.currentTarget;
        if (onCardClick) {
          onCardClick({
            ...syntheticEvent,
            currentTarget: target,
            target: target,
          } as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            tone,
            elevation,
            interactive: clickable ? interactive || "gentle" : interactive,
            padding,
            size,
            intent,
            state,
            className,
          }),
        )}
        onClick={clickable ? handleClick : onClick}
        onKeyDown={clickable ? handleKeyDown : undefined}
        role={clickable ? "button" : undefined}
        tabIndex={clickable && state !== "disabled" && state !== "loading" ? 0 : undefined}
        aria-disabled={state === "disabled" || state === "loading" ? true : undefined}
        aria-pressed={state === "selected" ? true : undefined}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-[var(--space-stack-sm)] px-[var(--space-lg)] pb-[var(--space-md)] pt-[var(--space-lg)]",
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-title font-semibold leading-tight tracking-tight text-text-primary",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body leading-relaxed text-text-secondary", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-[var(--space-stack-md)] px-[var(--space-lg)] pb-[var(--space-lg)]",
        className,
      )}
      {...props}
    />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-[var(--space-inline-lg)] border-t border-border-divider px-[var(--space-lg)] pb-[var(--space-lg)] pt-[var(--space-md)]",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
