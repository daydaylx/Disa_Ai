import * as React from "react";

import { cn } from "../../lib/cn";
import { hapticFeedback } from "../../lib/touch/haptics";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  enableHaptic?: boolean;
  testId?: string;
  icon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "glass-button glass-button--primary",
  secondary: "glass-button glass-button--secondary",
  ghost: "btn-ghost", // Keep legacy for specific use cases
  danger: "glass-button bg-danger text-text-inverted border-danger hover:opacity-90",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      enableHaptic = true,
      testId,
      icon,
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
          if (variant === "danger") {
            hapticFeedback.warning();
          } else {
            hapticFeedback.tap();
          }
        }
        onClick?.(e);
      },
      [enableHaptic, variant, onClick],
    );

    const isGlassButton = variant !== "ghost";
    const baseClass = isGlassButton ? "" : "btn";

    return (
      <button
        ref={ref}
        className={cn(
          baseClass,
          variantClasses[variant],
          sizeClasses[size],
          loading && isGlassButton && "glass-button--loading",
          className,
        )}
        aria-busy={loading || undefined}
        data-testid={testId}
        onClick={handleClick}
        disabled={props.disabled || loading}
        {...props}
      >
        {icon && !loading && <span className="mr-2">{icon}</span>}
        {loading && !isGlassButton && (
          <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
        <span className={loading && isGlassButton ? "opacity-0" : ""}>{children}</span>
      </button>
    );
  },
);

Button.displayName = "Button";
