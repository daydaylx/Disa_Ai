import * as React from "react";

import { cn } from "@/lib/utils";

type IconButtonVariant = "primary" | "secondary" | "ghost" | "glass-primary";

const variantClasses: Record<IconButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_10px_25px_rgba(0,0,0,0.2)]",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_5px_15px_rgba(0,0,0,0.1)]",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  "glass-primary":
    "bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-medium)] border border-[var(--glass-border-subtle)] text-text-secondary hover:bg-[var(--glass-surface-strong)] hover:border-[var(--glass-border-medium)] hover:text-text-primary shadow-[var(--shadow-glow-soft)]",
};

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-9 w-9",
      md: "h-10 w-10",
      lg: "h-11 w-11",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
