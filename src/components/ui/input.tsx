import * as React from "react";

import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  glassmorphic?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, glassmorphic = true, ...props }, ref) => {
    if (glassmorphic) {
      return (
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--glass-border-soft)_70%,transparent)]",
            "bg-[color-mix(in_srgb,var(--surface-card)_85%,transparent)]",
            "px-[var(--space-xs)] py-[var(--space-2xs)] text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-[color-mix(in_srgb,var(--text-secondary)_70%,transparent)]",
            "focus-visible:outline focus-visible:outline-[var(--focus-ring-width)] focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-offset-[var(--focus-ring-offset)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "shadow-[var(--shadow-sm)] backdrop-blur-[var(--glass-backdrop-blur-xs)]",
            "transition-all duration-200 ease-[cubic-bezier(.23,1,.32,1)]",
            "hover:shadow-[var(--shadow-lg)]",
            className,
          )}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
