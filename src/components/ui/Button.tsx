import * as React from "react";

import { hapticFeedback } from "../../lib/touch/haptics";
import { cn } from "../../lib/utils/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "subtle" | "destructive";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  enableHaptic?: boolean;
}

// Base styles are now in theme.css under the .btn class
const base = "btn";

// Variants now map to the centralized classes in theme.css
const variants: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  outline: "btn-outline",
  subtle: "btn-subtle",
  destructive: "btn-destructive",
};

// Sizes can remain as local utilities, but we ensure min-height is met via .btn
const sizes: Record<Size, string> = {
  sm: "h-11 px-4 text-sm", // h-11 to ensure 44px hit target
  md: "h-11 px-5 text-base",
  lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
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
        className={cn(base, variants[variant], sizes[size], className)}
        aria-busy={loading || undefined}
        onClick={handleClick}
        {...props}
      >
        {leftIcon ? <Icon name={leftIcon} className="mr-2" /> : null}
        <span className="inline-flex items-center">{children}</span>
        {rightIcon ? <Icon name={rightIcon} className="ml-2" /> : null}
      </button>
    );
  },
);

Button.displayName = "Button";
