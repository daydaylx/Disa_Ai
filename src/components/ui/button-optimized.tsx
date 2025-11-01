/**
 * Optimized Button Component for Disa AI
 * Reduced complexity: 30+ variants → 8 essential variants
 * Clean, consistent, and accessible button system
 */

import React from "react";

import { cn } from "../../lib/utils";

export interface OptimizedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary" // Main action - filled brand color
    | "secondary" // Secondary action - elevated surface
    | "ghost" // Minimal action - text only with hover
    | "outline" // Border-only action
    | "success" // Success action - green
    | "warning" // Warning action - orange
    | "danger" // Danger action - red
    | "link"; // Link-style action
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const optimizedButtonVariants = (
  variant: OptimizedButtonProps["variant"] = "primary",
  size: OptimizedButtonProps["size"] = "md",
) => {
  const baseClasses = cn(
    // Base styles
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    // Touch-friendly sizing
    "select-none touch-manipulation",
  );

  const variantClasses = {
    // Primary Actions
    primary: cn(
      "bg-[var(--color-brand-primary)] text-white",
      "hover:bg-[var(--color-brand-hover)] hover:shadow-md",
      "active:bg-[var(--color-brand-active)] active:scale-95",
      "focus-visible:ring-[var(--color-brand-primary)]",
    ),

    secondary: cn(
      "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]",
      "border border-[var(--color-border-subtle)]",
      "hover:bg-[var(--color-surface-base)] hover:shadow-sm",
      "active:bg-[var(--color-surface-elevated)] active:scale-95",
      "focus-visible:ring-[var(--color-brand-primary)]",
    ),

    // Secondary Actions
    ghost: cn(
      "text-[var(--color-text-primary)]",
      "hover:bg-[var(--color-surface-elevated)]",
      "active:bg-[var(--color-surface-elevated)] active:scale-95",
      "focus-visible:ring-[var(--color-brand-primary)]",
    ),

    outline: cn(
      "border border-[var(--color-border-subtle)] text-[var(--color-text-primary)]",
      "bg-[var(--color-surface-base)]",
      "hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-border-subtle)]",
      "active:bg-[var(--color-surface-base)] active:scale-95",
      "focus-visible:ring-[var(--color-brand-primary)]",
    ),

    // Status Actions
    success: cn(
      "bg-[var(--color-status-success-bg)] text-[var(--color-status-success-fg)]",
      "hover:bg-[color-mix(in_srgb,var(--color-status-success-bg)_80%,transparent)]",
      "active:scale-95",
      "focus-visible:ring-[var(--color-status-success-fg)]",
    ),

    warning: cn(
      "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-fg)]",
      "hover:bg-[color-mix(in_srgb,var(--color-status-warning-bg)_80%,transparent)]",
      "active:scale-95",
      "focus-visible:ring-[var(--color-status-warning-fg)]",
    ),

    danger: cn(
      "bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger-fg)]",
      "hover:bg-[color-mix(in_srgb,var(--color-status-danger-bg)_80%,transparent)]",
      "active:scale-95",
      "focus-visible:ring-[var(--color-status-danger-fg)]",
    ),

    // Special
    link: cn(
      "text-[var(--color-brand-primary)] underline-offset-4",
      "hover:underline focus-visible:underline",
      "focus-visible:ring-[var(--color-brand-primary)]",
    ),
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return cn(baseClasses, variantClasses[variant], sizeClasses[size]);
};

export const OptimizedButton = React.forwardRef<HTMLButtonElement, OptimizedButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(
        props.children as React.ReactElement,
        {
          className: cn(optimizedButtonVariants(variant, size), className),
          ref,
          ...props,
        } as React.Attributes,
      );
    }

    return (
      <button
        className={cn(optimizedButtonVariants(variant, size), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

OptimizedButton.displayName = "OptimizedButton";
