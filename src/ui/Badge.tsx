import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-accent-primary text-white shadow hover:bg-accent-primary/80",
        secondary:
          "border-transparent bg-surface-2 text-ink-secondary hover:bg-surface-3 hover:text-ink-primary",
        destructive:
          "border-transparent bg-status-error text-white shadow hover:bg-status-error/80",
        outline: "text-ink-secondary border border-border-ink/30",
        success:
          "border-transparent bg-status-success/10 text-status-success hover:bg-status-success/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
