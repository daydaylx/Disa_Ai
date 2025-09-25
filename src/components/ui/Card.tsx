import React from "react";

import { cn } from "../../lib/cn";

type Variant = "default" | "glass" | "elevated";
type Size = "sm" | "md" | "lg";

type Props = {
  title?: string;
  meta?: string;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  role?: "button" | "region";
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaLabelledby?: string;
  className?: string;
  variant?: Variant;
  size?: Size;
  interactive?: boolean;
  testId?: string;
};

const variantClasses: Record<Variant, string> = {
  default: "glass-card",
  glass: "glass-panel glass-bg--medium",
  elevated: "glass-card glass-card--elevated",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2",
  md: "px-4 py-4",
  lg: "px-6 py-6",
};

export default function Card({
  title,
  meta,
  active,
  onClick,
  children,
  role,
  ariaExpanded,
  ariaControls,
  ariaLabelledby,
  className,
  variant = "default",
  size = "md",
  interactive = false,
  testId,
}: Props) {
  const isInteractive = interactive || typeof onClick === "function";
  const Comp: React.ElementType = isInteractive ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      role={role}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-labelledby={ariaLabelledby}
      data-testid={testId}
      className={cn(
        "w-full text-left transition-all duration-200",
        variantClasses[variant],
        sizeClasses[size],
        isInteractive && [
          "cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "hover:translateY(-1px) hover:transform",
          variant === "glass" && "glass-interactive",
        ],
        !isInteractive && active === undefined && "min-h-[56px]",
        active && "border-primary/30 bg-glass-bg-medium",
        className,
      )}
    >
      {title && (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium text-text-default">{title}</div>
            {meta && <div className="mt-1 truncate text-xs text-text-muted">{meta}</div>}
          </div>
          {active !== undefined && (
            <span
              className={cn(
                "flex-shrink-0 rounded-full border px-2 py-1 text-xs font-medium",
                active
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-border-default bg-bg-elevated text-text-muted",
              )}
            >
              {active ? "Aktiv" : "Inaktiv"}
            </span>
          )}
        </div>
      )}
      {children && <div className={cn("text-sm text-text-muted", title && "mt-3")}>{children}</div>}
    </Comp>
  );
}
