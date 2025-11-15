import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-xs)] border px-[var(--space-xs)] py-[var(--space-2xs)] text-[11px] font-medium uppercase tracking-[0.06em] transition-[color,background,box-shadow] duration-[120ms] ease-[cubic-bezier(.23,1,.32,1)]",
  {
    variants: {
      variant: {
        default:
          "border border-[color-mix(in_srgb,var(--line)_70%,transparent)] bg-[color-mix(in_srgb,var(--surface-card)_85%,transparent)] text-[var(--color-text-primary)] shadow-none hover:shadow-surface backdrop-blur-sm",
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
        glass:
          "border border-[color-mix(in_srgb,var(--line)_70%,transparent)] bg-[color-mix(in_srgb,var(--surface-card)_85%,transparent)] text-text-primary shadow-none hover:shadow-surface backdrop-blur-sm",
        "glass-pressed":
          "border border-[color-mix(in_srgb,var(--line)_80%,transparent)] bg-[color-mix(in_srgb,var(--surface-card)_75%,transparent)] text-text-primary shadow-inset-subtle backdrop-blur-sm",
        "glass-brand":
          "border border-[color-mix(in_srgb,var(--accent)_50%,transparent)] bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] text-accent shadow-none hover:shadow-[var(--shadow-glow-brand-subtle)] backdrop-blur-sm",
        "glass-success":
          "border border-[color-mix(in_srgb,var(--status-success)_50%,transparent)] bg-[color-mix(in_srgb,var(--status-success)_20%,transparent)] text-status-success-fg shadow-none hover:shadow-[var(--shadow-glow-success-subtle)] backdrop-blur-sm",
        "glass-warning":
          "border border-[color-mix(in_srgb,var(--status-warning)_50%,transparent)] bg-[color-mix(in_srgb,var(--status-warning)_20%,transparent)] text-status-warning-fg shadow-none hover:shadow-[var(--shadow-glow-warning-subtle)] backdrop-blur-sm",
        "glass-error":
          "border border-[color-mix(in_srgb,var(--status-danger)_50%,transparent)] bg-[color-mix(in_srgb,var(--status-danger)_20%,transparent)] text-status-danger-fg shadow-none hover:shadow-[var(--shadow-glow-error-subtle)] backdrop-blur-sm",
      },
      size: {
        xs: "text-[10px] px-[calc(var(--space-2xs)/2)] py-[calc(var(--space-3xs)/2)]",  // ~4px
        sm: "text-[11px] px-[var(--space-2xs)] py-[calc(var(--space-3xs)/2)]",  // ~8px, 2px
        md: "text-[12px] px-[var(--space-xs)] py-[var(--space-2xs)]",  // ~12px, 8px
        lg: "text-[13px] px-[calc(var(--space-sm)/1.33)] py-[var(--space-xs)]",  // ~16px, 12px
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
      variant: "glass",
      size: "md",
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
