import * as React from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader - Consistent page header for all screens
 */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-xl font-bold text-ink-primary tracking-tight">{title}</h1>
        {description && <p className="text-sm text-ink-secondary mt-1">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState - Consistent empty state for lists
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}
    >
      {icon && (
        <div className="h-14 w-14 rounded-2xl bg-surface-2 flex items-center justify-center text-ink-tertiary mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium text-ink-primary">{title}</h3>
      {description && <p className="text-sm text-ink-tertiary mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface InfoBannerProps {
  icon?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

/**
 * InfoBanner - For status messages, privacy notices, etc.
 */
export function InfoBanner({
  icon,
  title,
  children,
  variant = "default",
  className,
}: InfoBannerProps) {
  const variantStyles = {
    default: "bg-surface-2 border-white/5 text-ink-secondary",
    success: "bg-status-success/10 border-status-success/20 text-status-success",
    warning: "bg-status-warning/10 border-status-warning/20 text-status-warning",
    error: "bg-status-error/10 border-status-error/20 text-status-error",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border",
        variantStyles[variant],
        className,
      )}
    >
      {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-medium mb-0.5">{title}</p>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
