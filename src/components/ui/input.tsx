import React from "react";

import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?:
    | "default"
    | "elevated"
    | "glass"
    | "inset-subtle"
    | "inset-medium"
    | "inset-strong"
    | "surface-raised"
    | "surface-floating";
  focusGlow?: "subtle" | "medium" | "strong";
  state?: "default" | "success" | "warning" | "error";
}

const inputVariants = (
  variant: InputProps["variant"] = "default",
  focusGlow: InputProps["focusGlow"],
  state: InputProps["state"] = "default",
) => {
  const baseClasses =
    "flex h-10 w-full rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-text-muted)] disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses = {
    default:
      "border border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2",

    /* Elevated Input Variants - Premium Depth Effects */
    elevated: "input-elevated",
    glass: "input-glass",
    "inset-subtle":
      "input-inset-subtle border border-[var(--color-border-subtle)] bg-[var(--color-surface-card)]",
    "inset-medium":
      "input-inset-medium border border-[var(--color-border-subtle)] bg-[var(--color-surface-card)]",
    "inset-strong":
      "input-inset-strong border border-[var(--color-border-subtle)] bg-[var(--color-surface-card)]",
    "surface-raised": "input-surface-raised",
    "surface-floating": "input-surface-floating",
  };

  const focusGlowClasses = {
    subtle: "input-focus-glow-subtle",
    medium: "input-focus-glow-medium",
    strong: "input-focus-glow-strong",
  };

  const stateClasses = {
    default: "",
    success: "input-enhanced-success",
    warning: "input-enhanced-warning",
    error: "input-enhanced-error",
  };

  return cn(
    baseClasses,
    variantClasses[variant],
    focusGlow && focusGlowClasses[focusGlow],
    stateClasses[state],
  );
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, focusGlow, state, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants(variant, focusGlow, state), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
