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
  "inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-[0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[var(--border-chalk-strong)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "border border-[var(--border-chalk-strong)] bg-[rgba(236,236,236,0.04)] text-text-primary shadow-[0_0_0_1px_rgba(236,236,236,0.08)] hover:bg-[rgba(236,236,236,0.07)] active:translate-y-[0.5px]",
        secondary:
          "border border-[var(--border-chalk)] bg-[rgba(255,255,255,0.02)] text-text-primary shadow-[0_0_0_1px_rgba(236,236,236,0.05)] hover:border-[var(--border-chalk-strong)] hover:bg-[rgba(255,255,255,0.03)] active:translate-y-[0.5px]",
        ghost:
          "text-text-secondary hover:text-text-primary border border-transparent hover:border-[var(--border-chalk)] hover:bg-[rgba(255,255,255,0.03)] active:bg-[rgba(255,255,255,0.05)]",
        link: "text-accent underline-offset-4 hover:underline p-0 h-auto min-h-0",
      },
      size: {
        default: "min-h-[44px] min-w-[44px] py-2 px-4",
        sm: "min-h-[42px] min-w-[42px] px-3 text-xs",
        lg: "min-h-[52px] min-w-[52px] px-6 text-base",
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
