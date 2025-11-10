import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { ChevronRight, MoreHorizontal } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { Button } from "./button"; // Assuming Button component is updated

const cardVariants = cva("relative rounded-xl border transition-all duration-200 ease-in-out", {
  variants: {
    variant: {
      default: "bg-surface-card/80 backdrop-blur-lg border-line shadow-card",
      outline: "bg-surface-base border-line shadow-sm",
      flat: "bg-surface-base border-transparent shadow-none",
    },
    intent: {
      default: "border-line",
      primary: "border-accent",
      success: "border-success",
      warning: "border-warning",
      danger: "border-danger",
      info: "border-info",
    },
    padding: {
      none: "p-0",
      sm: "p-space-sm",
      md: "p-space-md",
      lg: "p-space-lg",
    },
    size: {
      auto: "w-auto",
      full: "w-full",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
    },
    state: {
      default: "",
      loading: "animate-pulse opacity-70 pointer-events-none",
      disabled: "opacity-50 pointer-events-none",
      selected: "border-accent ring-2 ring-accent/30 ring-offset-2 ring-offset-surface-bg",
    },
    interactive: {
      true: "cursor-pointer hover:border-accent hover:shadow-overlay",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    intent: "default",
    padding: "md",
    size: "full",
    state: "default",
    interactive: false,
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
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

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            variant,
            intent,
            padding,
            size,
            state: isLoading ? "loading" : disabled ? "disabled" : selected ? "selected" : state,
            interactive: isClickable || interactive,
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
          <CardHeader className="flex flex-row items-center gap-space-md p-space-md">
            {/* Selection indicator */}
            {selectable && (
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    "h-4 w-4 rounded border-2 transition-colors",
                    selected ? "bg-accent border-accent" : "border-line hover:border-accent",
                  )}
                >
                  {selected && (
                    <svg
                      className="h-3 w-3 text-accent-contrast"
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
                  <CardTitle className="truncate text-base font-semibold leading-snug text-text-primary">
                    {title}
                  </CardTitle>
                )}
                {subtitle && (
                  <p className="mt-1 truncate text-sm text-text-secondary">{subtitle}</p>
                )}
              </div>
            )}

            {/* Trailing content */}
            <div className="flex flex-shrink-0 items-center gap-space-sm">
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
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>

                  {/* Simple dropdown menu */}
                  {isMenuOpen && menuItems.length > 0 && (
                    <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border border-line bg-surface-card shadow-overlay">
                      {menuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            item.onClick();
                            setIsMenuOpen(false);
                          }}
                          disabled={item.disabled}
                          className="flex w-full items-center gap-space-sm px-space-md py-space-sm text-left text-sm text-text-primary first:rounded-t-lg last:rounded-b-lg hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
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
                    "h-4 w-4 text-text-secondary transition-transform",
                    selected && "rotate-90",
                  )}
                />
              )}
            </div>
          </CardHeader>
        )}

        {/* Main content */}
        {children && <CardContent className="px-space-md pb-space-md pt-0">{children}</CardContent>}

        {/* Footer actions */}
        {actions && (
          <CardFooter className="border-t border-line px-space-md py-space-md">
            <div className="flex w-full items-center justify-between gap-space-md">{actions}</div>
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
      className={cn("flex flex-col gap-space-sm", "text-text-primary", className)}
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
        "text-lg font-semibold leading-tight tracking-tight text-text-primary",
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
    className={cn("text-sm leading-relaxed text-text-secondary", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-space-md", "text-text-primary", className)}
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
        "flex items-center justify-between gap-space-md border-t border-line",
        "text-text-primary",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
