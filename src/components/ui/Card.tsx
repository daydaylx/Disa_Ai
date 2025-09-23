import React from "react";

import { cn } from "../../lib/utils/cn";

type Props = {
  title: string;
  meta?: string;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  role?: "button" | "region";
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaLabelledby?: string;
  className?: string;
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
}: Props) {
  const interactive = typeof onClick === "function";
  const Comp: any = interactive ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      role={role}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-labelledby={ariaLabelledby}
      className={cn(
        "w-full rounded-xl border border-glass-border/20 bg-glass-surface/10 px-4 py-4 text-left",
        "shadow-glass transition-colors duration-200",
        interactive &&
          "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        !active && "hover:bg-glass-surface/14",
        active && "bg-accent-teal/12 border-accent-teal/45",
        className,
      )}
      style={{ minHeight: 56 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-medium text-text-primary/90">{title}</div>
          {meta && <div className="truncate text-xs text-text-muted/80">{meta}</div>}
        </div>
        {active !== undefined && (
          <span
            className={cn(
              "rounded-full border px-2 py-1 text-xs",
              active
                ? "border-accent-teal/50 bg-accent-teal/15 text-[color:var(--accent-foreground)]"
                : "bg-glass-surface/12 border-glass-border/25 text-text-muted/85",
            )}
          >
            {active ? "Aktiv" : "Inaktiv"}
          </span>
        )}
      </div>
      {children && <div className="mt-2 text-sm text-text-secondary/90">{children}</div>}
    </Comp>
  );
}
