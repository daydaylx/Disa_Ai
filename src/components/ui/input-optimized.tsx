/**
 * Optimized Input Component for Disa AI
 * Clean, consistent, and accessible input system
 */

import React from "react";

import { cn } from "../../lib/utils";

export interface OptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  error?: boolean;
  success?: boolean;
}

const optimizedInputVariants = (
  variant: OptimizedInputProps["variant"] = "default",
  size: OptimizedInputProps["size"] = "md",
  error?: boolean,
  success?: boolean,
) => {
  const baseClasses = cn(
    // Base styles
    "w-full rounded-lg border transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
    "disabled:cursor-not-allowed disabled:opacity-50",
    // Touch-friendly sizing
    "select-none touch-manipulation",
  );

  const variantClasses = {
    default: cn(
      "bg-[var(--color-surface-base)] border-[var(--color-border-subtle)]",
      "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
      "hover:border-[var(--color-border-subtle)]",
      "focus:border-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]",
      "focus:bg-[var(--color-surface-elevated)]",
    ),

    filled: cn(
      "bg-[var(--color-surface-elevated)] border-transparent",
      "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
      "hover:bg-[var(--color-surface-base)]",
      "focus:bg-[var(--color-surface-base)] focus:border-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]",
    ),

    ghost: cn(
      "bg-transparent border-transparent",
      "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
      "hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-border-subtle)]",
      "focus:bg-[var(--color-surface-elevated)] focus:border-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]",
    ),
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-4 text-base",
  };

  const stateClasses = {
    error: cn(
      "border-[var(--color-status-danger-fg)]",
      "focus:border-[var(--color-status-danger-fg)] focus:ring-[var(--color-status-danger-fg)]",
      error && "animate-shake",
    ),
    success: cn(
      "border-[var(--color-status-success-fg)]",
      "focus:border-[var(--color-status-success-fg)] focus:ring-[var(--color-status-success-fg)]",
    ),
  };

  return cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    error && stateClasses.error,
    success && stateClasses.success,
  );
};

export const OptimizedInput = React.forwardRef<HTMLInputElement, OptimizedInputProps>(
  ({ className, variant, size, error, success, ...props }, ref) => {
    return (
      <input
        className={cn(optimizedInputVariants(variant, size, error, success), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

OptimizedInput.displayName = "OptimizedInput";
