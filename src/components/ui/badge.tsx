import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.06em] transition-[color,background,box-shadow]",
  {
    variants: {
      variant: {
        default:
          "border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-[var(--color-text-primary)] shadow-none hover:shadow-neo-sm",
        secondary: "border-border bg-surface-card text-text-secondary",
        outline: "border-border bg-transparent text-text-secondary",
        muted: "border-transparent bg-surface-subtle text-text-secondary",
        destructive: "border-transparent bg-danger/15 text-danger",
        brand:
          "border border-[color:rgba(var(--brand-rgb),0.45)] bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] shadow-[var(--shadow-glow-brand-subtle)]",
        soft: "border-transparent bg-surface-subtle text-text-secondary",
        success: "border-transparent bg-status-success-fg/12 text-status-success-fg",
        warning: "border-transparent bg-status-warning-fg/12 text-status-warning-fg",
        error: "border-transparent bg-status-danger-fg/12 text-status-danger-fg",
        info: "border-transparent bg-status-info-fg/12 text-status-info-fg",
        accent:
          "border border-[var(--color-accent-border)] bg-[var(--color-accent-surface)] text-[var(--color-text-on-accent)] shadow-[var(--shadow-glow-accent-subtle)] hover:bg-[var(--color-accent-surface-strong)]",
        neumorphic:
          "border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-text-primary shadow-none hover:shadow-neo-sm",
        "neumorphic-pressed":
          "border border-[var(--border-neumorphic-dark)] bg-[var(--surface-neumorphic-pressed)] text-text-primary shadow-inset-subtle",
        "neumorphic-brand":
          "border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-brand shadow-none hover:shadow-[var(--shadow-glow-brand-subtle)]",
        "neumorphic-success":
          "border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-status-success-fg shadow-none hover:shadow-[var(--shadow-glow-success-subtle)]",
        "neumorphic-warning":
          "border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-status-warning-fg shadow-none hover:shadow-[var(--shadow-glow-warning-subtle)]",
        "neumorphic-error":
          "border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-status-danger-fg shadow-none hover:shadow-[var(--shadow-glow-error-subtle)]",
      },
      size: {
        xs: "text-[10px] px-1.5 py-0.5",
        sm: "text-[11px] px-2 py-0.5",
        md: "text-[12px] px-2.5 py-1",
        lg: "text-[13px] px-3 py-1.5",
      },
      category: {
        none: "",
        alltag:
          "border-[var(--role-accent-alltag-border)] bg-[var(--role-accent-alltag-chip-bg)] text-[var(--role-accent-alltag-chip-text)]",
        business:
          "border-[var(--role-accent-business-border)] bg-[var(--role-accent-business-chip-bg)] text-[var(--role-accent-business-chip-text)]",
        kreativ:
          "border-[var(--role-accent-kreativ-border)] bg-[var(--role-accent-kreativ-chip-bg)] text-[var(--role-accent-kreativ-chip-text)]",
        bildung:
          "border-[var(--role-accent-bildung-border)] bg-[var(--role-accent-bildung-chip-bg)] text-[var(--role-accent-bildung-chip-text)]",
        familie:
          "border-[var(--role-accent-familie-border)] bg-[var(--role-accent-familie-chip-bg)] text-[var(--role-accent-familie-chip-text)]",
        beratung:
          "border-[var(--role-accent-beratung-border)] bg-[var(--role-accent-beratung-chip-bg)] text-[var(--role-accent-beratung-chip-text)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      category: "none",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, category, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "min-h-[22px] items-center",
        badgeVariants({ variant, size, category }),
        className,
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
