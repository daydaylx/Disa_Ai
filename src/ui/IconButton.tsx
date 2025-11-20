import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * MaterialIconButton - Neumorphism/Soft-Depth Icon Button
 * - NO backdrop-blur, NO borders
 * - Physical feedback on press
 */
type IconButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<IconButtonVariant, string> = {
  primary:
    "bg-accent-primary text-white shadow-raise hover:bg-accent-hover hover:shadow-accentGlow active:scale-[0.98] active:translate-y-px",
  secondary:
    "bg-surface-2 text-text-primary shadow-raise hover:shadow-raiseLg active:scale-[0.98] active:translate-y-px active:shadow-inset",
  ghost: "hover:bg-surface-2 hover:text-text-primary active:scale-[0.98]",
};

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "secondary", size = "md", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-9 w-9",
      md: "h-10 w-10",
      lg: "h-11 w-11",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:pointer-events-none disabled:opacity-50",
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
