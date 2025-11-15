import * as React from "react";

import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "modern" | "glass" | "filled" | "outline";
  size?: "sm" | "md" | "lg";
  state?: "default" | "error" | "success" | "warning";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "modern", size = "md", state = "default", ...props }, ref) => {
    const baseClasses = cn(
      "flex w-full font-medium transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-[var(--text-muted)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "disabled:placeholder:text-[var(--text-muted)]/50",
    );

    const sizeClasses = {
      sm: "h-9 px-3 py-1.5 text-xs rounded-[var(--radius-xs)]",
      md: "h-10 px-4 py-2 text-sm rounded-[var(--radius-sm)]",
      lg: "h-12 px-5 py-3 text-base rounded-[var(--radius-md)]",
    };

    const variantClasses = {
      default: cn(
        "border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-primary)]",
        "shadow-[var(--shadow-light)]",
        "hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-heavy)]",
        "focus:border-[var(--color-primary-500)] focus:shadow-[var(--shadow-light)]",
      ),
      modern: cn(
        "border border-[var(--border-muted)] bg-white text-[var(--text-primary)]",
        "shadow-[var(--shadow-light)]",
        "hover:border-[var(--color-neutral-400)] hover:shadow-[var(--shadow-heavy)]",
        "focus:border-[var(--color-primary-500)] focus:shadow-[var(--shadow-light)]",
        "dark:bg-[var(--color-neutral-800)] dark:border-[var(--color-neutral-700)] dark:text-white",
        "dark:hover:border-[var(--color-neutral-600)] dark:focus:border-[var(--color-primary-400)]",
      ),
      glass: cn(
        "border border-[var(--glass-border-soft)] bg-[var(--layer-glass-panel)] text-[var(--text-primary)]",
        "backdrop-blur-[var(--backdrop-blur-medium)]",
        "hover:border-[var(--glass-border-strong)] hover:bg-[var(--layer-glass-inline)]",
        "focus:border-[var(--color-primary-500)] focus:bg-[var(--layer-glass-panel)]",
      ),
      filled: cn(
        "border-0 bg-[var(--color-neutral-100)] text-[var(--text-primary)]",
        "hover:bg-[var(--color-neutral-200)]",
        "focus:bg-white focus:shadow-[var(--shadow-light)] focus:border focus:border-[var(--color-primary-500)]",
        "dark:bg-[var(--color-neutral-800)] dark:hover:bg-[var(--color-neutral-700)]",
        "dark:focus:bg-[var(--color-neutral-800)]",
      ),
      outline: cn(
        "border-2 border-[var(--border-default)] bg-transparent text-[var(--text-primary)]",
        "hover:border-[var(--color-primary-400)] hover:bg-[var(--color-primary-50)]",
        "focus:border-[var(--color-primary-500)] focus:bg-[var(--color-primary-50)]",
        "dark:hover:bg-[var(--color-primary-950)] dark:focus:bg-[var(--color-primary-950)]",
      ),
    };

    const stateClasses = {
      default: "",
      error: cn(
        "border-[var(--color-error-500)] text-[var(--color-error-700)]",
        "focus:border-[var(--color-error-500)] focus:ring-[var(--color-error-500)]",
        "dark:text-[var(--color-error-400)]",
      ),
      success: cn(
        "border-[var(--color-success-500)] text-[var(--color-success-700)]",
        "focus:border-[var(--color-success-500)] focus:ring-[var(--color-success-500)]",
        "dark:text-[var(--color-success-400)]",
      ),
      warning: cn(
        "border-[var(--color-warning-500)] text-[var(--color-warning-700)]",
        "focus:border-[var(--color-warning-500)] focus:ring-[var(--color-warning-500)]",
        "dark:text-[var(--color-warning-400)]",
      ),
    };

    return (
      <input
        type={type}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          stateClasses[state],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
