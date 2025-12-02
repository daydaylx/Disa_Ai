import { forwardRef } from "react";

import { ChevronDown } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface ContextBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isOpen?: boolean;
}

export const ContextBadge = forwardRef<HTMLButtonElement, ContextBadgeProps>(
  ({ label, isOpen, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex min-w-0 max-w-[160px] items-center gap-1 rounded-full border border-border-ink bg-surface-1 px-2.5 py-1.5",
        "text-[11px] font-medium uppercase tracking-wide text-ink-primary",
        "transition-all duration-200 hover:bg-surface-2 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
        isOpen && "bg-ink-primary text-surface-1 border-ink-primary",
        className,
      )}
      {...props}
    >
      <span className="truncate">{label}</span>
      <ChevronDown
        className={cn(
          "h-3.5 w-3.5 text-ink-secondary transition-transform duration-200",
          isOpen && "rotate-180 text-surface-1/70",
        )}
      />
    </button>
  ),
);

ContextBadge.displayName = "ContextBadge";
