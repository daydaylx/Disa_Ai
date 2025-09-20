import * as React from "react";

import { hapticFeedback } from "../../lib/touch/haptics";
import { cn } from "../../lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  enableHaptic?: boolean;
}

// Variants using new design system
const variants: Record<Variant, string> = {
  primary: "bg-accent-500 text-white hover:bg-accent-600",
  secondary: "glass border border-neutral-900 text-foreground hover:bg-neutral-900/50",
  ghost: "text-foreground hover:bg-neutral-900/50",
  destructive: "bg-error text-white hover:bg-error/90",
};

// Sizes following 4pt grid
const sizes: Record<Size, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      enableHaptic = true,
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (enableHaptic) {
          if (variant === "destructive") {
            hapticFeedback.warning();
          } else {
            hapticFeedback.tap();
          }
        }
        onClick?.(e);
      },
      [enableHaptic, variant, onClick],
    );

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "touch-target inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          // Variant and size styles
          variants[variant],
          sizes[size],
          className,
        )}
        aria-busy={loading || undefined}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <div className="border-current border-t-transparent mr-2 h-4 w-4 animate-spin rounded-full border-2" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
