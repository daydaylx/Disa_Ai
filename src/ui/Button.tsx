import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";

/**
 * InkButton - Calm, physical buttons for the Book Concept.
 *
 * Removes "Brand Glow" and "Aurora" effects.
 * Focuses on clarity, touch targets (min 44px), and subtle paper interactions.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-primary text-surface-1 shadow-sm hover:bg-accent-hover active:translate-y-[1px]",
        secondary:
          "bg-surface-2 text-text-primary border border-border-ink shadow-sm hover:bg-surface-3 hover:shadow-md active:translate-y-[1px]",
        ghost: "hover:bg-surface-2 text-text-secondary hover:text-text-primary active:bg-surface-3",
        link: "text-accent underline-offset-4 hover:underline p-0 h-auto min-h-0",
      },
      size: {
        default: "min-h-[44px] py-2 px-4",
        sm: "min-h-[44px] px-3 text-xs",
        lg: "min-h-[56px] px-8 text-base",
        icon: "min-h-[44px] min-w-[44px] p-2",
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
