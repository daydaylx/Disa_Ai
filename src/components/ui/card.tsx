import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { ChevronRight, MoreHorizontal } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { Button } from "./button"; // Assuming Button component is updated

const cardVariants = cva(
  "relative rounded-lg border transition-all duration-2 ease-1 backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-line bg-surface-base",
        flat: "border-transparent bg-transparent shadow-none",
      },
      tone: {
        // Modern Glassmorphism variants
        "glass-primary": "bg-surface-glass border-line text-fg",
        "glass-subtle": "bg-surface-glass border-line text-fg-muted",
        "glass-floating": "bg-surface-glass border-line text-fg backdrop-blur-lg",
        "glass-overlay": "bg-surface-glass border-line text-fg backdrop-blur-lg",
        "glass-raised":
          "bg-[color-mix(in_srgb,var(--surface-card)_90%,white_10%)] border-[color-mix(in_srgb,var(--line)_70%,transparent_30%)] text-fg shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
        "glass-elevated":
          "bg-[color-mix(in_srgb,var(--surface-card)_85%,white_5%)] border-[color-mix(in_srgb,var(--line)_60%,transparent_40%)] text-fg shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-md",
        "glass-inset":
          "bg-[color-mix(in_srgb,var(--surface-base)_95%,black_5%)] border-[color-mix(in_srgb,var(--line)_50%,transparent_50%)] text-fg shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]",

        // Legacy aliases (using new glassmorphism styles)
        "neo-raised": "bg-surface-glass border-line text-fg",
        "neo-subtle": "bg-surface-glass border-line text-fg",
        "neo-inset": "bg-surface-glass border-line text-fg shadow-1",
        "neo-floating": "bg-surface-glass border-line text-fg backdrop-blur-lg",
        "neo-glass": "bg-surface-glass border-line text-fg backdrop-blur-lg",
      },
      intent: {
        default: "",
        accent: "border-accent",
        primary: "border-accent",
        success: "border-status-success/70",
        warning: "border-status-warning/70",
        danger: "border-status-danger/70",
        error: "border-status-danger/70",
        info: "border-status-info/70",
      },
      padding: {
        none: "p-0",
        xs: "p-1.5",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      size: {
        auto: "w-auto",
        full: "w-full",
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
      },
      state: {
        default: "",
        loading: "animate-pulse opacity-70 pointer-events-none",
        disabled: "opacity-50 pointer-events-none",
        selected: "border-accent ring-2 ring-accent/30 ring-offset-2 ring-offset-bg-1",
        focus: "ring-2 ring-accent ring-offset-2 ring-offset-bg-1",
      },
      elevation: {
        flat: "shadow-none",
        subtle: "shadow-1",
        surface: "shadow-1",
        medium: "shadow-1",
        dramatic: "shadow-2",
        raised: "shadow-2",
        floating: "shadow-[0_12px_32px_rgba(0,0,0,0.25)]",
      },
      interactive: {
        none: "",
        basic: "cursor-pointer hover:-translate-y-0.5 hover:shadow-1 hover:border-line",
        gentle: "cursor-pointer hover:-translate-y-1 hover:shadow-1 hover:border-line",
        glow: "cursor-pointer hover:shadow-glow-accent",
        "glow-accent": "cursor-pointer hover:border-accent hover:shadow-glow-accent",
        // Neue interaktive Varianten mit Glas-Effekten
        "glass-lift":
          "cursor-pointer hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-all duration-300",
        "glass-glow":
          "cursor-pointer hover:shadow-[0_0_0_4px_var(--accent-soft),0_8px_20px_rgba(139,92,246,0.3)] transition-all duration-300",
      },
    },
    defaultVariants: {
      variant: "default",
      tone: "glass-primary",
      intent: "default",
      padding: "md",
      size: "full",
      state: "default",
      elevation: "medium",
      interactive: "none",
    },
  },
);

type CardVariantProps = VariantProps<typeof cardVariants>;

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<CardVariantProps, "interactive"> {
  interactive?: CardVariantProps["interactive"] | boolean;
  title?: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  actions?: React.ReactNode;
  selectable?: boolean;
  selected?: boolean;
  showChevron?: boolean;
  showMenu?: boolean;
  menuItems?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  onCardClick?: () => void;
  onSelectionChange?: (selected: boolean) => void;
  isLoading?: boolean;
  disabled?: boolean;
  clickable?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      tone,
      elevation,
      intent,
      padding,
      size,
      state,
      interactive,
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

    const resolvedInteractive: CardVariantProps["interactive"] =
      typeof interactive === "boolean" ? (interactive ? "basic" : "none") : interactive;

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            variant,
            tone,
            intent,
            padding,
            size,
            state: isLoading ? "loading" : disabled ? "disabled" : selected ? "selected" : state,
            elevation,
            interactive: isClickable
              ? resolvedInteractive === "none"
                ? "basic"
                : resolvedInteractive
              : resolvedInteractive,
          }),
          className,
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
          <CardHeader className="flex flex-row items-center gap-4 p-4">
            {/* Selection indicator - Enlarged for accessibility */}
            {selectable && (
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
                    selected ? "bg-accent border-accent" : "border-line hover:border-accent",
                  )}
                >
                  {selected && (
                    <svg
                      className="h-4 w-4 text-accent-contrast"
                      fill="currentColor"
                      viewBox="0 0 12 12"
                    >
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
                  <CardTitle className="truncate text-base font-semibold leading-snug text-fg">
                    {title}
                  </CardTitle>
                )}
                {subtitle && <p className="mt-1 truncate text-sm text-fg-muted">{subtitle}</p>}
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
                  >
                    <MoreHorizontal className="h-4 w-4 shadow-1" />
                  </Button>

                  {/* Simple dropdown menu */}
                  {isMenuOpen && menuItems.length > 0 && (
                    <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border border-line bg-surface-glass shadow-2 backdrop-blur-lg">
                      {menuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            item.onClick();
                            setIsMenuOpen(false);
                          }}
                          disabled={item.disabled}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-fg first:rounded-t-lg last:rounded-b-lg hover:bg-surface-glass disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-surface/60">
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 text-fg-muted transition-transform shadow-1",
                      selected && "rotate-90",
                    )}
                  />
                </div>
              )}
            </div>
          </CardHeader>
        )}

        {/* Main content */}
        {children && <CardContent className="px-4 pb-4 pt-0">{children}</CardContent>}

        {/* Footer actions */}
        {actions && (
          <CardFooter className="border-t border-line px-4 py-4">
            <div className="flex w-full items-center justify-between gap-4">{actions}</div>
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
    <div ref={ref} className={cn("flex flex-col gap-2", "text-fg", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-tight tracking-tight text-fg", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm leading-relaxed text-fg-muted", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-4", "text-fg", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-4 border-t border-line",
        "text-fg",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
