import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const cardVariants = cva(
  "relative isolate overflow-hidden rounded-[var(--radius-card)] border border-border-hairline bg-surface-card text-text-primary shadow-surface transition-[box-shadow,transform,border-color,background,opacity,backdrop-filter] duration-small ease-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-border-focus)]",
  {
    variants: {
      tone: {
        default: "",
        muted: "bg-surface-subtle text-text-secondary border-border-subtle",
        contrast: "bg-surface-popover text-text-inverse border-border-strong",
        translucent:
          "backdrop-blur-sm bg-surface-card/80 text-text-primary border-border-subtle shadow-surface",
        solid: "bg-surface-card border-border",
        outlined: "bg-transparent border-border-strong",
      },
      elevation: {
        none: "shadow-none",
        surface: "shadow-surface",
        raised: "shadow-raised",
        overlay: "shadow-overlay",
        popover: "shadow-popover",
        // Neo-Depth System Extensions
        "surface-subtle": "shadow-[var(--shadow-surface-subtle)]",
        "surface-prominent": "shadow-[var(--shadow-surface-prominent)]",
        "surface-hover": "shadow-[var(--shadow-surface-hover)]",
        "surface-active": "shadow-[var(--shadow-surface-active)]",
        // Advanced Depth System
        "depth-1": "shadow-depth-1",
        "depth-2": "shadow-depth-2",
        "depth-3": "shadow-depth-3",
        "depth-4": "shadow-depth-4",
        "depth-5": "shadow-depth-5",
        "depth-6": "shadow-depth-6",
        floating: "shadow-floating",
        elevated: "shadow-elevated",
      },
      interactive: {
        false: "",
        // Enhanced interactions for Neo-Depth
        gentle:
          "motion-safe:hover:-translate-y-[3px] motion-safe:hover:shadow-[var(--shadow-surface-hover)] motion-safe:hover:bg-surface-raised cursor-pointer motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out",
        dramatic:
          "motion-safe:hover:-translate-y-[6px] motion-safe:hover:scale-[1.01] motion-safe:hover:shadow-[var(--shadow-surface-prominent)] cursor-pointer motion-safe:transition-all motion-safe:duration-280 motion-safe:ease-out",
        subtle:
          "motion-safe:hover:bg-surface-subtle motion-safe:hover:border-border cursor-pointer motion-safe:transition-all motion-safe:duration-150 motion-safe:ease-out",
        press:
          "motion-safe:active:translate-y-[1px] motion-safe:active:scale-[0.99] motion-safe:active:shadow-[var(--shadow-surface-active)] cursor-pointer motion-safe:transition-all motion-safe:duration-120 motion-safe:ease-out",
        lift: "motion-safe:hover:-translate-y-[4px] motion-safe:hover:shadow-[var(--shadow-surface-hover)] motion-safe:focus-visible:translate-y-0 motion-safe:focus-visible:shadow-raised cursor-pointer motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out",
        glow: "motion-safe:hover:shadow-[var(--shadow-glow-brand)] cursor-pointer motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out",
        "glow-success":
          "motion-safe:hover:shadow-[var(--shadow-glow-success)] cursor-pointer motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out",
        "glow-warning":
          "motion-safe:hover:shadow-[var(--shadow-glow-warning)] cursor-pointer motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out",
        "glow-error":
          "motion-safe:hover:shadow-[var(--shadow-glow-error)] cursor-pointer motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out",
        // Advanced Interactive States
        "depth-hover":
          "motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[var(--shadow-hover-lift)] cursor-pointer motion-safe:transition-all motion-safe:duration-280 motion-safe:ease-out",
        "depth-press":
          "motion-safe:active:translate-y-[1px] motion-safe:active:scale-[0.98] motion-safe:active:shadow-[var(--shadow-active-press)] cursor-pointer motion-safe:transition-all motion-safe:duration-120 motion-safe:ease-out",
        "floating-hover":
          "motion-safe:hover:-translate-y-[3px] motion-safe:hover:shadow-floating cursor-pointer motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out",
        "ambient-subtle":
          "ambient-glow-subtle cursor-pointer motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out",
        "ambient-medium":
          "ambient-glow-medium cursor-pointer motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out",
        "ambient-strong":
          "ambient-glow-strong cursor-pointer motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out",
      },
      padding: {
        none: "",
        xs: "p-[var(--space-sm)]",
        sm: "p-[var(--space-md)]",
        md: "p-[var(--space-lg)]",
        lg: "p-[var(--space-xl)]",
        xl: "p-[var(--space-2xl)]",
      },
      size: {
        auto: "",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "w-full",
      },
      intent: {
        default: "",
        primary: "border-brand bg-brand/5 text-brand-text",
        secondary: "border-action-secondary bg-action-secondary/5",
        warning: "border-status-warning bg-status-warning/5 text-status-warning-text",
        error: "border-status-error bg-status-error/5 text-status-error-text",
        success: "border-status-success bg-status-success/5 text-status-success-text",
        info: "border-status-info bg-status-info/5 text-status-info-text",
      },
      state: {
        default: "",
        loading: "animate-pulse bg-surface-subtle pointer-events-none",
        disabled: "opacity-50 pointer-events-none cursor-not-allowed",
        selected: "border-brand bg-brand/10 ring-2 ring-brand/20",
        focus: "ring-2 ring-brand/50",
      },
    },
    compoundVariants: [
      {
        tone: "muted",
        class: "border-border-subtle",
      },
      {
        tone: "contrast",
        elevation: "overlay",
        class: "shadow-overlay",
      },
      {
        intent: "primary",
        interactive: "gentle",
        class: "motion-safe:hover:bg-brand/10",
      },
      {
        intent: "error",
        interactive: "gentle",
        class: "motion-safe:hover:bg-status-error/10",
      },
      {
        intent: "success",
        interactive: "gentle",
        class: "motion-safe:hover:bg-status-success/10",
      },
      {
        intent: "warning",
        interactive: "gentle",
        class: "motion-safe:hover:bg-status-warning/10",
      },
      {
        state: "loading",
        class: "animate-pulse",
      },
      {
        state: "selected",
        interactive: false,
        class: "cursor-default",
      },
      {
        interactive: ["gentle", "dramatic", "subtle", "press", "lift", "glow"],
        class: "touch-target min-h-[44px]",
      },
      {
        tone: "translucent",
        interactive: ["gentle", "dramatic"],
        class: "motion-safe:hover:bg-surface-card/90 motion-safe:hover:backdrop-blur-md",
      },
      {
        intent: "primary",
        interactive: "glow",
        class:
          "motion-safe:hover:shadow-[0_0_25px_rgba(var(--color-brand-rgb),0.4)] motion-safe:hover:border-brand/60",
      },
      {
        intent: "error",
        interactive: "glow",
        class: "motion-safe:hover:shadow-[0_0_20px_rgba(var(--color-status-error-rgb),0.3)]",
      },
      {
        intent: "success",
        interactive: "glow",
        class: "motion-safe:hover:shadow-[0_0_20px_rgba(var(--color-status-success-rgb),0.3)]",
      },
      {
        state: "selected",
        interactive: ["gentle", "subtle"],
        class: "motion-safe:hover:bg-brand/15 motion-safe:hover:border-brand/40",
      },
      {
        state: "loading",
        interactive: false,
        class: "cursor-wait pointer-events-none",
      },
    ],
    defaultVariants: {
      tone: "default",
      elevation: "surface",
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
