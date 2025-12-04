import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";

/**
 * Button - Digital Slate Theme
 *
 * Redesigned to match the "Chalk on Stone" aesthetic.
 * - Default: Transparent with white chalk border.
 * - Hover: Subtle highlight and "redrawn" border effect (handled by CSS class).
 * - Ghost: Minimal, text-only until hover.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chalk-blue disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        primary: "btn-chalk", // Defined in theme-slate.css for complex animations
        secondary:
          "border border-chalk-dim text-chalk-dim hover:text-chalk-white hover:border-chalk-white bg-transparent rounded-lg",
        ghost: "text-chalk-dim hover:text-chalk-white hover:bg-white/5 rounded-lg",
        link: "text-chalk-blue underline-offset-4 hover:underline p-0 h-auto min-h-0",
        destructive: "border border-error text-error hover:bg-error/10 rounded-lg",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11 p-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
