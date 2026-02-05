import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { hapticFeedback } from "@/lib/haptics";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.97]",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-white shadow-sm hover:bg-brand-primary/90 hover:shadow-glow-sm hover:-translate-y-px",
        secondary:
          "bg-surface-2 text-ink-primary border border-white/8 hover:bg-surface-3 hover:border-white/12 hover:-translate-y-px",
        destructive:
          "bg-surface-1 text-status-error border border-white/8 hover:bg-surface-2 hover:border-status-error/30 hover:-translate-y-px",
        outline:
          "border border-white/12 bg-transparent hover:bg-surface-2/50 text-ink-secondary hover:text-ink-primary hover:border-white/20 hover:-translate-y-px",
        ghost: "hover:bg-surface-2/50 text-ink-secondary hover:text-ink-primary",
        link: "text-brand-primary underline-offset-4 hover:underline",
        glass:
          "bg-surface-1/40 backdrop-blur-md border border-white/12 text-ink-primary hover:bg-surface-1/60 hover:border-white/20 shadow-sm hover:-translate-y-px",
      },
      size: {
        default: "h-11 px-4 rounded-xl min-w-[2.75rem]",
        sm: "h-10 rounded-lg px-3 text-xs min-w-[2.5rem]",
        lg: "h-14 rounded-xl px-6 text-base min-w-[3.5rem]",
        icon: "h-11 w-11 rounded-xl",
        "icon-sm": "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  // asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Haptic feedback on mobile
      hapticFeedback(variant === "destructive" ? "heavy" : "medium");

      // Call original onClick
      onClick?.(e);
    };

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
