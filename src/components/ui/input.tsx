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
            "flex h-10 w-full rounded-[12px] border border-[color-mix(in_srgb,var(--line)_70%,transparent)]",
            "bg-[color-mix(in_srgb,var(--surface-card)_85%,transparent)]",
            "px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-[color-mix(in_srgb,var(--text-secondary)_70%,transparent)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "shadow-[0_2px_8px_rgba(0,0,0,0.05)] backdrop-blur-sm",
            "transition-all duration-200 ease-[cubic-bezier(.23,1,.32,1)]",
            "hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
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
