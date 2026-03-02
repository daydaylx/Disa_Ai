import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md font-medium min-h-[22px] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-accent-primary-dim text-accent-primary border border-accent-primary/20", // Subtle accent
        secondary: "bg-surface-2 text-ink-secondary border border-border-ink", // Neutral
        outline: "text-ink-secondary border border-border-ink bg-transparent",
        destructive: "bg-status-error/10 text-status-error border border-status-error/20",
        success: "bg-status-success/10 text-status-success border border-status-success/20",
        warning: "bg-status-warning/10 text-status-warning border border-status-warning/20",
        // Page-specific accent variants
        models: "bg-accent-models-dim text-accent-models border border-accent-models-border",
        roles: "bg-accent-roles-dim text-accent-roles border border-accent-roles-border",
        settings:
          "bg-accent-settings-dim text-accent-settings border border-accent-settings-border",
        chat: "bg-accent-chat-dim text-accent-chat border border-accent-chat-border",
      },
      size: {
        default: "px-2.5 py-1 text-xs",
        sm: "px-1.5 py-0.5 text-[11px] min-h-[20px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
