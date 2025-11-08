import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { ChevronRight, MoreHorizontal } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { Button } from "./button";

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

        // === SEMANTIC GLOW EFFECTS (Mobile-optimized) ===
        "glow-brand": [
          "cursor-pointer",
          "hover:shadow-[0_0_16px_rgba(75,99,255,0.35)]", // Reduced blur for mobile performance
          "hover:border-[var(--acc1)]",
          "hover:ring-2 hover:ring-[var(--acc1)]/25 hover:ring-offset-2 hover:ring-offset-transparent",
        ].join(" "),

        "glow-success": [
          "cursor-pointer",
          "hover:shadow-[0_0_12px_rgba(34,197,94,0.35)]", // Reduced blur for mobile performance
          "hover:border-[var(--ok)]",
          "hover:ring-2 hover:ring-[var(--ok)]/25 hover:ring-offset-2 hover:ring-offset-transparent",
        ].join(" "),

        "glow-warning": [
          "cursor-pointer",
          "hover:shadow-[0_0_12px_rgba(245,158,11,0.35)]", // Reduced blur for mobile performance
          "hover:border-[var(--warn)]",
          "hover:ring-2 hover:ring-[var(--warn)]/25 hover:ring-offset-2 hover:ring-offset-transparent",
        ].join(" "),

        "glow-error": [
          "cursor-pointer",
          "hover:shadow-[0_0_12px_rgba(239,68,68,0.35)]", // Reduced blur for mobile performance
          "hover:border-[var(--err)]",
          "hover:ring-2 hover:ring-[var(--err)]/25 hover:ring-offset-2 hover:ring-offset-transparent",
        ].join(" "),

        "glow-accent": [
          "cursor-pointer",
          "hover:shadow-[var(--shadow-glow-accent)]",
          "hover:border-[var(--color-border-focus)]",
          "hover:ring-2 hover:ring-[var(--color-border-focus)]/25 hover:ring-offset-2 hover:ring-offset-transparent",
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
          "border-l-4 border-l-[var(--ok)] bg-gradient-to-br from-[var(--ok)]/5 to-[var(--ok)]/8 text-[var(--color-text-primary)]",
        warning:
          "border-l-4 border-l-[var(--warn)] bg-gradient-to-br from-[var(--warn)]/5 to-[var(--warn)]/8 text-[var(--color-text-primary)]",
        error:
          "border-l-4 border-l-[var(--err)] bg-gradient-to-br from-[var(--err)]/5 to-[var(--err)]/8 text-[var(--color-text-primary)]",
        info: "border-l-4 border-l-[var(--info)] bg-gradient-to-br from-[var(--info)]/5 to-[var(--info)]/8 text-[var(--color-text-primary)]",
        accent:
          "border-l-4 border-l-[var(--color-border-focus)] bg-gradient-to-br from-[var(--acc2)]/12 to-[var(--acc1)]/10 text-[var(--color-text-primary)]",
        // Enhanced semantic intents for specific card purposes
        feature:
          "border-l-4 border-l-[var(--acc1)] bg-gradient-to-br from-[var(--acc1)]/8 to-[var(--acc2)]/4 text-[var(--color-text-primary)]",
        announcement:
          "border-l-4 border-l-[var(--info)] bg-gradient-to-br from-[var(--info)]/10 to-[var(--acc1)]/6 text-[var(--color-text-primary)]",
        alert:
          "border-l-4 border-l-[var(--warn)] bg-gradient-to-br from-[var(--warn)]/10 to-[var(--warn)]/6 text-[var(--color-text-primary)]",
        notification:
          "border-l-4 border-l-[var(--acc2)] bg-gradient-to-br from-[var(--acc2)]/8 to-[var(--acc1)]/4 text-[var(--color-text-primary)]",
        data: "border-l-4 border-l-[var(--ok)] bg-gradient-to-br from-[var(--ok)]/6 to-[var(--info)]/4 text-[var(--color-text-primary)]",
      },
      state: {
        default: "",
        loading: "animate-pulse bg-[var(--surface-neumorphic-base)] pointer-events-none opacity-75",
        disabled:
          "opacity-50 pointer-events-none cursor-not-allowed shadow-[var(--shadow-inset-subtle)]",
        selected:
          "border-[var(--color-border-focus)] bg-gradient-to-br from-[var(--acc1)]/12 to-[var(--acc2)]/14 shadow-[var(--shadow-glow-accent-subtle)] ring-2 ring-[var(--acc1)]/30 ring-offset-2 ring-offset-transparent",
        focus:
          "border-[var(--color-border-focus)] shadow-[var(--shadow-focus-neumorphic)] ring-2 ring-[var(--acc1)]/30 ring-offset-2 ring-offset-transparent",
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
      {
        intent: "feature",
        interactive: ["glow-brand", "gentle", "dramatic"],
        class: "hover:from-[var(--acc1)]/10 hover:to-[var(--acc2)]/8",
      },
      {
        intent: "announcement",
        interactive: ["glow-accent", "gentle"],
        class: "hover:from-[var(--info)]/12 hover:to-[var(--acc1)]/8",
      },
      {
        intent: "alert",
        interactive: ["glow-warning", "gentle"],
        class: "hover:from-[var(--warn)]/12 hover:to-[var(--warn)]/8",
      },
      {
        intent: "notification",
        interactive: ["glow-brand", "gentle"],
        class: "hover:from-[var(--acc2)]/10 hover:to-[var(--acc1)]/6",
      },
      {
        intent: "data",
        interactive: ["glow-success", "gentle"],
        class: "hover:from-[var(--ok)]/8 hover:to-[var(--info)]/6",
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
      title,
      subtitle,
      leading,
      trailing,
      actions,
      selectable = false,
      selected = false,
      showChevron = false,
      showMenu = false,
      menuItems = [],
      onSelectionChange,
      isLoading = false,
      disabled = false,
      children,
      ...props
    },
    ref,
  ) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || isLoading) {
        event.preventDefault();
        return;
      }

      if (selectable) {
        const newSelected = !selected;
        onSelectionChange?.(newSelected);
      }

      onCardClick?.();
      onClick?.(event);
    };

    const handleMenuClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen(!isMenuOpen);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || isLoading) {
        event.preventDefault();
        return;
      }

      if (clickable && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        if (onCardClick) {
          onCardClick();
        }
      }
    };

    const isClickable = !disabled && !isLoading && (!!onCardClick || selectable || clickable);

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            tone,
            elevation,
            interactive: isClickable ? interactive || "gentle" : interactive,
            padding,
            size,
            intent,
            state: isLoading ? "loading" : disabled ? "disabled" : selected ? "selected" : state,
            className,
          }),
        )}
        onClick={isClickable ? handleCardClick : onClick}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable && !disabled && !isLoading ? 0 : undefined}
        aria-disabled={disabled || isLoading ? true : undefined}
        aria-pressed={selected ? true : undefined}
        {...props}
      >
        {(title || leading || trailing || selectable || showMenu || showChevron) && (
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
            {/* Selection indicator */}
            {selectable && (
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    "h-4 w-4 rounded border-2 transition-colors",
                    selected ? "bg-brand border-brand" : "hover:border-brand border-border-strong",
                  )}
                >
                  {selected && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  )}
                </div>
              </div>
            )}

            {/* Leading content */}
            {leading && <div className="flex-shrink-0">{leading}</div>}

            {/* Title and subtitle */}
            {(title || subtitle) && (
              <div className="min-w-0 flex-1">
                {title && (
                  <CardTitle className="text-text-strong truncate text-base leading-snug">
                    {title}
                  </CardTitle>
                )}
                {subtitle && <p className="mt-1 truncate text-sm text-text-muted">{subtitle}</p>}
              </div>
            )}

            {/* Trailing content */}
            <div className="flex flex-shrink-0 items-center gap-2">
              {trailing}

              {showMenu && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMenuClick}
                    disabled={disabled || isLoading}
                    aria-label="More options"
                    className="h-8 w-8"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>

                  {/* Simple dropdown menu */}
                  {isMenuOpen && menuItems.length > 0 && (
                    <div className="border-border absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border bg-surface-popover shadow-neo-xl">
                      {menuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            item.onClick();
                            setIsMenuOpen(false);
                          }}
                          disabled={item.disabled}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {showChevron && (
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-text-muted transition-transform",
                    selected && "rotate-90",
                  )}
                />
              )}
            </div>
          </CardHeader>
        )}

        {/* Main content */}
        {children && <CardContent className="px-4 pb-4 pt-0">{children}</CardContent>}

        {/* Footer actions */}
        {actions && (
          <CardFooter className="border-t border-border-divider px-4 py-3">
            <div className="flex w-full items-center justify-between gap-3">{actions}</div>
          </CardFooter>
        )}

        {/* Click overlay for better accessibility when disabled */}
        {(disabled || isLoading) && isClickable && (
          <div className="absolute inset-0 cursor-not-allowed bg-transparent" />
        )}
      </div>
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
        "text-[var(--color-text-primary)]", // Ensure high contrast for all text in header
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
        "text-[var(--color-text-primary)]", // Ensure high contrast for accessibility
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
    className={cn(
      "text-body leading-relaxed text-text-secondary",
      "text-[var(--color-text-secondary)]", // Ensure consistent contrast
      className,
    )}
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
        "text-[var(--color-text-primary)]", // Ensure high contrast for content text
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
        "text-[var(--color-text-primary)]", // Ensure high contrast for footer text
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
