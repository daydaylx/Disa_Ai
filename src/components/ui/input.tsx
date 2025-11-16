import * as React from "react";

import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "sm" | "md" | "lg";
}

const sizeClasses: Record<NonNullable<InputProps["inputSize"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-3 text-base",
  lg: "h-11 px-4 text-base",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", inputSize = "md", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[var(--radius-sm)] border border-[var(--glass-border-soft)] bg-surface-inline text-text-primary placeholder:text-text-secondary/70 shadow-[var(--shadow-xs)] transition-all duration-300 ease-[var(--motion-ease-elastic)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-glow-primary)] focus-visible:shadow-glow-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:cursor-not-allowed disabled:opacity-60",
          sizeClasses[inputSize],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
