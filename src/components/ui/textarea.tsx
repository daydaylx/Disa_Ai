import * as React from "react";

import { cn } from "../../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Neomorphic variant for different depth levels */
  variant?: "neo-subtle" | "neo-medium" | "neo-dramatic" | "neo-extreme";
  /** Size variant for different heights and padding */
  size?: "sm" | "md" | "lg" | "xl";
  /** Enable/disable resize functionality */
  resizable?: boolean;
}

const textareaVariants: Record<
  "neo-subtle" | "neo-medium" | "neo-dramatic" | "neo-extreme",
  string
> = {
  "neo-subtle": "neo-inset-subtle",
  "neo-medium": "neo-inset-medium",
  "neo-dramatic": "neo-inset-strong",
  "neo-extreme": "neo-inset-extreme",
};

const textareaSizes = {
  sm: "min-h-[4rem] px-3 py-2 text-sm touch-target",
  md: "min-h-[6rem] px-4 py-3 text-base touch-target-preferred",
  lg: "min-h-[8rem] px-5 py-4 text-base touch-target-preferred",
  xl: "min-h-[12rem] px-6 py-5 text-lg touch-target-preferred",
};

const textareaBaseClasses = [
  // Layout & Structure
  "flex w-full rounded-[var(--radius-lg)]",

  // Neomorphic Foundation
  "bg-[var(--surface-neumorphic-base)]",
  "border-[var(--border-neumorphic-subtle)]",

  // Typography & Content
  "text-[var(--color-text-primary)]",
  "placeholder:text-[var(--color-text-muted)]",
  "font-medium tracking-[-0.01em]",
  "leading-relaxed",

  // Scrolling & Content Management
  "overflow-y-auto",
  "scrollbar-thin scrollbar-track-transparent",
  "scrollbar-thumb-[var(--color-border-subtle)]",

  // Transitions
  "transition-all duration-200 ease-out",

  // Focus States (Dramatic Neomorphic)
  "focus-visible:outline-none",
  "focus-visible:shadow-[var(--focus-ring)]",
  "focus-visible:border-[var(--color-border-focus)]",
  "focus-visible:bg-[var(--surface-neumorphic-floating)]",

  // Enhanced Hover State
  "hover:bg-[var(--surface-neumorphic-raised)]",
  "hover:shadow-[var(--shadow-inset-medium)]",

  // Disabled State
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
  "disabled:shadow-[var(--shadow-inset-subtle)]",
  "disabled:resize-none",

  // Dark Mode Optimization
  "dark:bg-[var(--surface-neumorphic-base)]",
  "dark:border-[var(--border-neumorphic-dark)]",
  "dark:scrollbar-thumb-[var(--color-border-subtle)]",
].join(" ");

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "neo-subtle", size = "md", resizable = false, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          textareaBaseClasses,
          textareaVariants[variant],
          textareaSizes[size],
          resizable ? "resize-y" : "resize-none",
          // Enhanced resize handle styling for neomorphic aesthetic
          resizable &&
            [
              "resize-y",
              "[&::-webkit-resizer]:bg-[var(--surface-neumorphic-raised)]",
              "[&::-webkit-resizer]:rounded-br-[var(--radius-md)]",
              "[&::-webkit-resizer]:shadow-[var(--shadow-neumorphic-sm)]",
            ].join(" "),
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
