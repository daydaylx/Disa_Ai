import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-[12px] font-medium uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-weak text-brand",
        secondary: "border-border bg-surface-1 text-text-1",
        outline: "border-border bg-transparent text-text-1",
        muted: "border-transparent bg-surface-2 text-text-1",
        destructive: "border-transparent bg-danger/15 text-danger",
        brand: "border-transparent bg-brand text-brand-contrast",
        soft: "border-transparent bg-surface-2 text-text-1",
        success: "border-transparent bg-status-success-fg/10 text-status-success-fg",
        warning: "border-transparent bg-status-warning-fg/10 text-status-warning-fg",
        error: "border-transparent bg-status-danger-fg/10 text-status-danger-fg",
        info: "border-transparent bg-status-info-fg/10 text-status-info-fg",
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
  return (
    <div 
      className={cn(badgeVariants({ variant, size }), className)} 
      {...props} 
    />
  );
}

export { Badge, badgeVariants };
