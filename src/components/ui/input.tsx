import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

// Aurora Input Variants with CVA
const inputVariants = cva(
  [
    // Aurora Base Styles - Mobile-First
    "flex w-full rounded-[var(--radius-md)] border",
    "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
    "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
    // Focus States
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
    // Disabled States
    "disabled:cursor-not-allowed disabled:opacity-50",
    // Touch-optimized
    "select-none file:select-none file:touch-manipulation",
  ].join(" "),
  {
    variants: {
      variant: {
        "aurora-soft": [
          // Subtle Aurora Glass Input
          "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
          "border-[var(--glass-border-subtle)] shadow-[var(--shadow-glow-soft)]",
          // Interactive States
          "hover:bg-[var(--glass-surface-medium)] hover:border-[var(--glass-border-medium)]",
          "focus-visible:bg-[var(--glass-surface-medium)] focus-visible:border-[var(--glass-border-aurora)]",
          "focus-visible:shadow-[var(--shadow-glow-primary)]",
        ].join(" "),

        "aurora-primary": [
          // Premium Aurora Glass Input
          "bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)]",
          "border-[var(--glass-border-medium)] shadow-[var(--shadow-premium-subtle)]",
          // Premium Interactive States
          "hover:bg-[var(--glass-surface-strong)] hover:border-[var(--glass-border-aurora)] hover:shadow-[var(--shadow-premium-medium)]",
          "focus-visible:bg-[var(--glass-surface-strong)] focus-visible:border-[var(--aurora-primary-500)] focus-visible:shadow-[var(--shadow-glow-primary)]",
        ].join(" "),

        "aurora-minimal": [
          // Minimal Aurora Input
          "bg-transparent border-[var(--glass-border-subtle)]",
          // Subtle Interactive States
          "hover:bg-[var(--glass-surface-subtle)] hover:border-[var(--glass-border-medium)]",
          "focus-visible:bg-[var(--glass-surface-subtle)] focus-visible:border-[var(--glass-border-aurora)]",
        ].join(" "),

        outline: [
          // Standard Outline Input
          "bg-transparent border-[var(--glass-border-medium)]",
          "hover:border-[var(--glass-border-aurora)]",
          "focus-visible:border-[var(--aurora-primary-500)]",
        ].join(" "),
      },

      // === TOUCH-OPTIMIZED SIZES ===
      size: {
        sm: [
          "min-h-[var(--touch-target-compact)] px-[var(--space-sm)] py-[var(--space-xs)]",
          "text-[var(--text-sm)]",
        ].join(" "),
        default: [
          "min-h-[var(--touch-target-comfortable)] px-[var(--space-md)] py-[var(--space-sm)]",
          "text-[var(--text-base)]",
        ].join(" "),
        lg: [
          "min-h-[var(--touch-target-spacious)] px-[var(--space-lg)] py-[var(--space-md)]",
          "text-[var(--text-lg)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "aurora-soft",
      size: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
