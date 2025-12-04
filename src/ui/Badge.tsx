import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";

/**
 * Badge - Digital Slate Theme
 *
 * Simple, pill-shaped markers.
 * Uses chalk colors for semantic states.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-wide font-hand",
  {
    variants: {
      variant: {
        default:
          "border border-chalk-white text-chalk-white shadow-[0_0_4px_rgba(255,255,255,0.2)]",
        secondary: "border border-chalk-dim text-chalk-dim",
        destructive: "border border-error text-error shadow-[0_0_4px_rgba(255,200,200,0.2)]",
        outline: "text-chalk-white border border-chalk-dim",
        accent: "border border-chalk-blue text-chalk-blue shadow-[0_0_4px_rgba(165,216,255,0.3)]",
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
    <div className={cn(badgeVariants({ variant, className }))} ref={ref} {...props} />
  ),
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
