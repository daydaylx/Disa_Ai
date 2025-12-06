import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-white shadow-sm hover:bg-brand-primary/90 hover:shadow-glow-sm",
        secondary:
          "bg-surface-2 text-ink-primary border border-white/5 hover:bg-surface-3 hover:border-white/10",
        destructive:
          "bg-surface-1 text-status-error border border-border-ink hover:bg-surface-2 hover:border-status-error/30",
        outline:
          "border border-white/10 bg-transparent hover:bg-surface-2/50 text-ink-secondary hover:text-ink-primary hover:border-white/20",
        ghost: "hover:bg-surface-2/50 text-ink-secondary hover:text-ink-primary",
        link: "text-brand-primary underline-offset-4 hover:underline",
        glass:
          "bg-surface-1/40 backdrop-blur-md border border-white/10 text-ink-primary hover:bg-surface-1/60 hover:border-white/20 shadow-sm",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
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
    VariantProps<typeof buttonVariants> {
  // asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
