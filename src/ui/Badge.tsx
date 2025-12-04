import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-[var(--border-chalk)] bg-[var(--bg-slate)] text-[var(--ink-primary)] hover:bg-[rgba(255,255,255,0.05)] shadow-[0_0_0_1px_var(--border-chalk)]",
        secondary:
          "border-[var(--border-chalk)] bg-transparent text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--border-chalk-strong)]",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-[var(--ink-primary)] border-[var(--border-chalk)] bg-transparent hover:bg-[rgba(255,255,255,0.03)]",
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

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div className={badgeVariants({ variant, className })} ref={ref} {...props} />
  ),
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
