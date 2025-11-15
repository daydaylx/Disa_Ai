import * as React from "react";

import { cn } from "../../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  glassmorphic?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, glassmorphic = true, ...props }, ref) => {
    if (glassmorphic) {
      return (
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--glass-border-soft)_70%,transparent)]",
            "bg-[color-mix(in_srgb,var(--surface-card)_85%,transparent)]",
            "px-[var(--space-xs)] py-[var(--space-2xs)] text-sm placeholder:text-[color-mix(in_srgb,var(--text-secondary)_70%,transparent)]",
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
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
