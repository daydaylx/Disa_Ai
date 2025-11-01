import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-[12px] font-medium uppercase tracking-wide transition-[colors,box-shadow]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-weak text-brand",
        secondary: "border-border bg-surface-card text-text-secondary",
        outline: "border-border bg-transparent text-text-secondary",
        muted: "border-transparent bg-surface-subtle text-text-secondary",
        destructive: "border-transparent bg-danger/15 text-danger",
        brand: "border-transparent bg-brand text-brand-contrast",
        soft: "border-transparent bg-surface-subtle text-text-secondary",
        success: "border-transparent bg-status-success-fg/10 text-status-success-fg",
        warning: "border-transparent bg-status-warning-fg/10 text-status-warning-fg",
        error: "border-transparent bg-status-danger-fg/10 text-status-danger-fg",
        info: "border-transparent bg-status-info-fg/10 text-status-info-fg",
        // Neomorphic variants
        neumorphic:
          "border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-text-primary shadow-neo-sm motion-safe:hover:shadow-neo-md motion-safe:transition-shadow motion-safe:duration-200",
        "neumorphic-pressed":
          "border-[var(--border-neumorphic-dark)] bg-[var(--surface-neumorphic-pressed)] text-text-primary shadow-inset-subtle",
        "neumorphic-brand":
          "border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-brand shadow-neo-sm motion-safe:hover:shadow-[var(--shadow-glow-brand)] motion-safe:transition-shadow motion-safe:duration-200",
        "neumorphic-success":
          "border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-status-success-fg shadow-neo-sm motion-safe:hover:shadow-[var(--shadow-glow-success)] motion-safe:transition-shadow motion-safe:duration-200",
        "neumorphic-warning":
          "border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-status-warning-fg shadow-neo-sm motion-safe:hover:shadow-[var(--shadow-glow-warning)] motion-safe:transition-shadow motion-safe:duration-200",
        "neumorphic-error":
          "border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-status-danger-fg shadow-neo-sm motion-safe:hover:shadow-[var(--shadow-glow-error)] motion-safe:transition-shadow motion-safe:duration-200",
      },
      size: {
        xs: "text-[10px] px-1.5 py-0.5",
        sm: "text-[11px] px-2 py-0.5",
        md: "text-[12px] px-2.5 py-1",
        lg: "text-[13px] px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
