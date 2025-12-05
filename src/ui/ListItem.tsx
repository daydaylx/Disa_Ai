import * as React from "react";

import { cn } from "@/lib/utils";

interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * ListItem - Reusable list item for models, roles, etc.
 *
 * Clean, minimal, consistent with the design system
 */
export function ListItem({
  title,
  subtitle,
  icon,
  action,
  isActive,
  onClick,
  className,
}: ListItemProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 text-left transition-all",
        onClick && "cursor-pointer hover:bg-surface-2 active:scale-[0.99]",
        isActive && "bg-surface-2",
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            "flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center",
            isActive
              ? "bg-accent-primary/10 text-accent-primary"
              : "bg-surface-2 text-ink-secondary",
          )}
        >
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate",
            isActive ? "text-accent-primary" : "text-ink-primary",
          )}
        >
          {title}
        </p>
        {subtitle && <p className="text-xs text-ink-tertiary truncate">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </Comp>
  );
}

interface ListGroupProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * ListGroup - Group list items with optional section header
 */
export function ListGroup({ title, children, className }: ListGroupProps) {
  return (
    <div className={cn("mb-4", className)}>
      {title && (
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary px-4 mb-2">
          {title}
        </h3>
      )}
      <div className="bg-surface-1 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
