import * as React from "react";

import { cn } from "../../lib/cn";
import { hapticFeedback } from "../../lib/touch/haptics";

type Variant = "primary" | "ghost" | "danger" | "base";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  enableHaptic?: boolean;
  testId?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "btn-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-accent-500 focus-visible:outline-offset-2",
  ghost:
    "btn-ghost focus:outline-none focus-visible:outline-2 focus-visible:outline-accent-500 focus-visible:outline-offset-2",
  danger:
    "btn-danger focus:outline-none focus-visible:outline-2 focus-visible:outline-danger focus-visible:outline-offset-2",
  base: "focus:outline-none focus-visible:outline-2 focus-visible:outline-accent-500 focus-visible:outline-offset-2",
};

const sizeClasses: Record<Size, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      enableHaptic = true,
      testId,
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

    return (
      <button
        ref={ref}
        className={cn("btn", variantClasses[variant], sizeClasses[size], className)}
        aria-busy={loading || undefined}
        data-testid={testId}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <span className="border-accent-500 mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
