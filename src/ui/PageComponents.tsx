import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const pageHeaderVariants = cva("flex items-start justify-between gap-4", {
  variants: {
    variant: {
      default: "mb-6",
      hero: "mb-8",
      compact: "mb-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const pageHeaderTitleVariants = cva("font-semibold text-ink-primary tracking-tight", {
  variants: {
    variant: {
      default: "text-2xl",
      hero: "text-3xl sm:text-4xl",
      compact: "text-xl",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const pageHeaderDescriptionVariants = cva("text-ink-secondary", {
  variants: {
    variant: {
      default: "text-sm mt-1",
      hero: "text-base mt-2",
      compact: "text-xs mt-0.5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface PageHeaderProps extends VariantProps<typeof pageHeaderVariants> {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader - Consistent page header for all screens
 *
 * Variants:
 * - default: Standard page header (text-2xl title, text-sm description)
 * - hero: Large hero header for landing/empty states (text-3xl/4xl title, text-base description)
 * - compact: Compact header for tight spaces (text-xl title, text-xs description)
 */
export function PageHeader({
  title,
  description,
  action,
  className,
  variant = "default",
}: PageHeaderProps) {
  return (
    <div className={cn(pageHeaderVariants({ variant }), className)}>
      <div>
        <h1 className={cn(pageHeaderTitleVariants({ variant }))}>{title}</h1>
        {description && (
          <p className={cn(pageHeaderDescriptionVariants({ variant }))}>{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

const emptyStateVariants = cva("flex flex-col items-center justify-center text-center", {
  variants: {
    variant: {
      default: "py-16 px-4",
      compact: "py-8 px-4",
      hero: "py-20 px-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const emptyStateIconVariants = cva(
  "rounded-2xl bg-surface-2 flex items-center justify-center text-ink-tertiary",
  {
    variants: {
      variant: {
        default: "h-14 w-14 mb-4",
        compact: "h-10 w-10 mb-3",
        hero: "h-20 w-20 mb-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const emptyStateTitleVariants = cva("font-medium text-ink-primary", {
  variants: {
    variant: {
      default: "text-base",
      compact: "text-sm",
      hero: "text-xl sm:text-2xl",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const emptyStateDescriptionVariants = cva("text-ink-tertiary", {
  variants: {
    variant: {
      default: "text-sm mt-1 max-w-xs",
      compact: "text-xs mt-0.5 max-w-xs",
      hero: "text-base mt-2 max-w-md",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState - Consistent empty state for lists
 *
 * Variants:
 * - default: Standard empty state (py-16, h-14 icon, text-base title)
 * - compact: Compact empty state for tight spaces (py-8, h-10 icon, text-sm title)
 * - hero: Hero empty state for landing pages (py-20, h-20 icon, text-xl/2xl title)
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div className={cn(emptyStateVariants({ variant }), className)}>
      {icon && <div className={cn(emptyStateIconVariants({ variant }))}>{icon}</div>}
      <h3 className={cn(emptyStateTitleVariants({ variant }))}>{title}</h3>
      {description && (
        <p className={cn(emptyStateDescriptionVariants({ variant }))}>{description}</p>
      )}
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
