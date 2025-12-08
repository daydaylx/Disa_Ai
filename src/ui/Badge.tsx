import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-accent-primary-dim text-accent-primary border border-accent-primary/20", // Subtle accent
        secondary: "bg-surface-2 text-ink-secondary border border-border-ink", // Neutral
        outline: "text-ink-secondary border border-border-ink bg-transparent",
        destructive: "bg-status-error/10 text-status-error border border-status-error/20",
        success: "bg-status-success/10 text-status-success border border-status-success/20",
        warning: "bg-status-warning/10 text-status-warning border border-status-warning/20",
        // Semantic Accents
        chat: "bg-accent-chat/10 text-accent-chat border border-accent-chat/20",
        models: "bg-accent-models/10 text-accent-models border border-accent-models/20",
        roles: "bg-accent-roles/10 text-accent-roles border border-accent-roles/20",
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
