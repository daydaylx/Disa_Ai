import * as React from "react";

import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const getVariantClasses = (variant: ButtonVariant) => {
  switch (variant) {
    case "primary":
      return "bg-primary text-text-inverted hover:bg-primary/90";
    case "secondary":
      return "bg-transparent border border-primary text-primary hover:bg-primary/10";
    case "ghost":
      return "bg-transparent text-text-default hover:bg-bg-elevated";
    case "destructive":
      return "bg-red-500 text-white hover:bg-red-500/90";
    default:
      return "bg-primary text-text-inverted hover:bg-primary/90";
  }
};

const getSizeClasses = (size: ButtonSize) => {
  switch (size) {
    case "sm":
      return "px-3 py-1.5 text-sm";
    case "md":
      return "px-4 py-2 text-base";
    case "lg":
      return "px-6 py-3 text-lg";
    default:
      return "px-4 py-2 text-base";
  }
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);

    return (
      <button
        className={cn(
          "focus-visible:ring-ring inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses,
          sizeClasses,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
