import React from "react";
import { cn } from "@/lib/utils";

interface ContextActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
  isActive?: boolean;
}

export const ContextAction = React.forwardRef<HTMLButtonElement, ContextActionProps>(
  ({ className, icon, label, isActive, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "group relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200",
          "min-h-[44px] min-w-[44px]", // Touch target
          "flex-shrink-0",
          "text-sm font-medium whitespace-nowrap",
          "border",
          isActive
            ? "bg-accent-chat/10 border-accent-chat text-accent-chat"
            : "bg-surface-1/50 border-white/10 text-ink-secondary hover:bg-surface-2 hover:text-ink-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-chat/50",
          "active:scale-95",
          className
        )}
        {...props}
      >
        {icon && (
          <span className={cn("flex-shrink-0", isActive ? "text-accent-chat" : "text-ink-tertiary group-hover:text-ink-primary")}>
            {icon}
          </span>
        )}
        <span>{label}</span>
      </button>
    );
  }
);

ContextAction.displayName = "ContextAction";
