import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const cardVariants = cva(
  // Dramatic Neomorphic Foundation - v2.0.0
  "relative isolate overflow-hidden rounded-[var(--radius-xl)] border text-[var(--color-text-primary)] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-neumorphic)] focus-visible:border-[var(--color-border-focus)]",
  {
    variants: {
      tone: {
        // === PRIMARY NEOMORPHIC TONES (v2.0.0) ===
        "neo-subtle":
          "bg-[var(--surface-neumorphic-base)] border-[var(--border-neumorphic-subtle)] shadow-[var(--shadow-neumorphic-sm)]",
        "neo-raised":
          "bg-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-md)]",
        "neo-floating":
          "bg-[var(--surface-neumorphic-floating)] border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-lg)]",
        "neo-dramatic":
          "bg-gradient-to-br from-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-xl)]",
        "neo-inset":
          "bg-[var(--surface-neumorphic-pressed)] border-[var(--border-neumorphic-dark)] shadow-[var(--shadow-inset-medium)]",
        "neo-glass":
          "bg-[var(--surface-neumorphic-floating)]/80 border-[var(--border-neumorphic-light)] shadow-[var(--shadow-neumorphic-lg)] backdrop-blur-md",
      },
      elevation: {
        // === PERFORMANCE-OPTIMIZED ELEVATION SYSTEM ===
        none: "shadow-none",
        subtle: "shadow-[var(--shadow-neumorphic-sm)]", // 8px shadows
        medium: "shadow-[var(--shadow-neumorphic-md)]", // 15px shadows
        raised: "shadow-[var(--shadow-neumorphic-lg)]", // 25px shadows
        dramatic: "shadow-[var(--shadow-neumorphic-xl)]", // 35px shadows - Mobile limit
        // Note: extreme/maximum removed for mobile performance
      },
      interactive: {
        false: "",

        // === MOBILE-OPTIMIZED INTERACTIONS ===
        gentle: [
          "cursor-pointer",
          "hover:shadow-[var(--shadow-neumorphic-md)]",
          "hover:bg-[var(--surface-neumorphic-floating)]",
          "hover:-translate-y-0.5",
          "active:shadow-[var(--shadow-inset-subtle)]",
          "active:bg-[var(--surface-neumorphic-pressed)]",
          "active:translate-y-0.5",
        ].join(" "),

        dramatic: [
          "cursor-pointer",
          "hover:shadow-[var(--shadow-neumorphic-lg)]",
          "hover:bg-gradient-to-br hover:from-[var(--surface-neumorphic-floating)] hover:to-white",
          "hover:-translate-y-1 hover:scale-[1.01]",
          "active:shadow-[var(--shadow-inset-medium)]",
          "active:bg-[var(--surface-neumorphic-pressed)]",
          "active:translate-y-0.5 active:scale-[0.99]",
        ].join(" "),

        // === SEMANTIC GLOW EFFECTS (Mobile-safe) ===
        "glow-brand": [
          "cursor-pointer",
          "hover:shadow-[0_0_20px_rgba(75,99,255,0.3)]",
          "hover:border-[var(--acc1)]",
        ].join(" "),

        "glow-success": [
          "cursor-pointer",
          "hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]",
          "hover:border-[var(--ok)]",
        ].join(" "),

        "glow-warning": [
          "cursor-pointer",
          "hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]",
          "hover:border-[var(--warn)]",
        ].join(" "),

        "glow-error": [
          "cursor-pointer",
          "hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]",
          "hover:border-[var(--err)]",
        ].join(" "),

        "glow-accent": [
          "cursor-pointer",
          "hover:shadow-[var(--shadow-glow-accent)]",
          "hover:border-[var(--color-border-focus)]",
        ].join(" "),
      },
      padding: {
        none: "",
        xs: "p-[var(--space-sm)]", // 12px
        sm: "p-[var(--space-md)]", // 16px
        md: "p-[var(--space-lg)]", // 24px
        lg: "p-[var(--space-xl)]", // 32px
        xl: "p-[var(--space-2xl)]", // 40px
      },
      size: {
        auto: "",
        sm: "max-w-sm", // 384px
        md: "max-w-md", // 448px
        lg: "max-w-lg", // 512px
        xl: "max-w-xl", // 576px
        full: "w-full",
      },
      intent: {
        default: "border-l-4 border-l-transparent",
        // Neomorphic Semantic Colors with Subtle Gradients
        primary:
          "border-l-4 border-l-[var(--acc1)] bg-gradient-to-br from-[var(--acc1)]/5 to-[var(--acc2)]/5 text-[var(--color-text-primary)]",
        secondary:
          "border-[var(--color-border-subtle)] bg-gradient-to-br from-[var(--surface-neumorphic-base)] to-[var(--surface-neumorphic-raised)]",
        success:
          "border-[var(--ok)] bg-gradient-to-br from-[var(--ok)]/5 to-[var(--ok)]/8 text-[var(--color-text-primary)]",
        warning:
          "border-[var(--warn)] bg-gradient-to-br from-[var(--warn)]/5 to-[var(--warn)]/8 text-[var(--color-text-primary)]",
        error:
          "border-[var(--err)] bg-gradient-to-br from-[var(--err)]/5 to-[var(--err)]/8 text-[var(--color-text-primary)]",
        info: "border-[var(--info)] bg-gradient-to-br from-[var(--info)]/5 to-[var(--info)]/8 text-[var(--color-text-primary)]",
        accent:
          "border-[var(--color-border-focus)] bg-gradient-to-br from-[var(--acc2)]/12 to-[var(--acc1)]/10 text-[var(--color-text-primary)]",
      },
      state: {
        default: "",
        loading: "animate-pulse bg-[var(--surface-neumorphic-base)] pointer-events-none opacity-75",
        disabled:
          "opacity-40 pointer-events-none cursor-not-allowed shadow-[var(--shadow-inset-subtle)]",
        selected:
          "border-[var(--color-border-focus)] bg-gradient-to-br from-[var(--acc1)]/12 to-[var(--acc2)]/14 shadow-[var(--shadow-glow-accent-subtle)]",
        focus: "border-[var(--color-border-focus)] shadow-[var(--shadow-focus-neumorphic)]",
      },
    },
    compoundVariants: [
      // === TOUCH TARGET ENFORCEMENT ===
      {
        interactive: [
          "gentle",
          "dramatic",
          "glow-brand",
          "glow-success",
          "glow-warning",
          "glow-error",
          "glow-accent",
        ],
        class: "min-h-[44px] touch-target",
      },

      // === TONE + INTERACTIVE COMBINATIONS ===
      {
        tone: "neo-glass",
        class: "border-white/10",
      },
      {
        tone: "neo-glass",
        interactive: ["gentle", "dramatic"],
        class: "hover:bg-[var(--surface-neumorphic-floating)]/90 hover:backdrop-blur-md",
      },
      {
        tone: "neo-dramatic",
        interactive: "dramatic",
        class: "hover:shadow-[var(--shadow-neumorphic-xl)] hover:scale-[1.02]",
      },

      // === INTENT + INTERACTIVE COMBINATIONS ===
      {
        intent: "primary",
        interactive: ["glow-brand", "gentle", "dramatic"],
        class: "hover:from-[var(--acc1)]/8 hover:to-[var(--acc2)]/12",
      },
      {
        intent: "accent",
        interactive: ["glow-accent", "gentle"],
        class: "hover:from-[var(--acc2)]/14 hover:to-[var(--acc1)]/14",
      },
      {
        intent: "success",
        interactive: ["glow-success", "gentle"],
        class: "hover:from-[var(--ok)]/8 hover:to-[var(--ok)]/12",
      },
      {
        intent: "warning",
        interactive: ["glow-warning", "gentle"],
        class: "hover:from-[var(--warn)]/8 hover:to-[var(--warn)]/12",
      },
      {
        intent: "error",
        interactive: ["glow-error", "gentle"],
        class: "hover:from-[var(--err)]/8 hover:to-[var(--err)]/12",
      },

      // === STATE COMBINATIONS ===
      {
        state: "selected",
        interactive: ["gentle", "dramatic"],
        class:
          "hover:from-[var(--acc1)]/12 hover:to-[var(--acc2)]/15 hover:border-[var(--acc1)]/60",
      },
      {
        state: ["loading", "disabled"],
        interactive: false,
        class: "cursor-default",
      },
    ],
    defaultVariants: {
      tone: "neo-raised",
      elevation: "subtle",
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
   * Main title of the card
   */
  title?: string;
  /**
   * Subtitle or description
   */
  subtitle?: string;
  /**
   * Leading element (icon, avatar, etc.)
   */
  leading?: React.ReactNode;
  /**
   * Trailing element (badge, button, etc.)
   */
  trailing?: React.ReactNode;
  /**
   * Action buttons in footer
   */
  actions?: React.ReactNode;
  /**
   * Whether the card is selectable
   */
  selectable?: boolean;
  /**
   * Whether the card is currently selected
   */
  selected?: boolean;
  /**
   * Whether to show a chevron indicating clickability
   */
  showChevron?: boolean;
  /**
   * Whether to show a menu button
   */
  showMenu?: boolean;
  /**
   * Menu items (for dropdown)
   */
  menuItems?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  /**
   * Callback when card is clicked
   */
  onCardClick?: () => void;
  /**
   * Callback when selection changes
   */
  onSelectionChange?: (selected: boolean) => void;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Whether the card should be rendered as a clickable element
   * @default false
   */
  clickable?: boolean;
  /**
   * Callback fired when the card is clicked (only if clickable=true)
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
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
