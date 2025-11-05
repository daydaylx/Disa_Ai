import React from "react";

import { cn } from "../../lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Neomorphic variant for different depth levels */
  variant?: "neo-subtle" | "neo-medium" | "neo-dramatic" | "neo-extreme";
  /** Size variant for different touch targets */
  size?: "sm" | "md" | "lg";
}

const inputVariants: Record<"neo-subtle" | "neo-medium" | "neo-dramatic" | "neo-extreme", string> =
  {
    "neo-subtle": "neo-inset-subtle",
    "neo-medium": "neo-inset-medium",
    "neo-dramatic": "neo-inset-strong",
    "neo-extreme": "neo-inset-extreme",
  };

const inputSizes = {
  sm: "h-10 min-h-[40px] px-3 py-2 text-sm touch-target", // Android minimum
  md: "h-12 min-h-[48px] px-4 py-3 text-base touch-target-preferred", // Standard Android
  lg: "h-14 min-h-[56px] px-5 py-4 text-base touch-target-preferred", // Comfortable Android
};

const inputBaseClasses = [
  // Layout & Structure
  "flex w-full rounded-[var(--radius-md)]",

  // Neomorphic Foundation
  "bg-[var(--surface-neumorphic-base)]",
  "border-[var(--border-neumorphic-subtle)]",

  // Typography
  "text-[var(--color-text-primary)]",
  "placeholder:text-[var(--color-text-muted)]",
  "font-medium tracking-[-0.01em]",

  // Transitions
  "transition-all duration-200 ease-out",

  // Focus States (Dramatic Neomorphic)
  "focus-visible:outline-none",
  "focus-visible:shadow-[var(--focus-ring)]",
  "focus-visible:border-[var(--color-border-focus)]",
  "focus-visible:bg-[var(--surface-neumorphic-floating)]",

  // States
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
  "disabled:shadow-[var(--shadow-inset-subtle)]",

  // Hover Enhancement
  "hover:bg-[var(--surface-neumorphic-raised)]",
  "hover:shadow-[var(--shadow-inset-medium)]",

  // Dark Mode Optimization
  "dark:bg-[var(--surface-neumorphic-base)]",
  "dark:border-[var(--border-neumorphic-dark)]",
].join(" ");

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "neo-subtle", size = "md", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputBaseClasses, inputVariants[variant], inputSizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
