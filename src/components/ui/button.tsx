import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-[var(--touch-recommended)] items-center justify-center gap-2 whitespace-nowrap rounded-base border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 disabled:pointer-events-none disabled:opacity-60 relative overflow-hidden group touch-target no-select",
  {
    variants: {
      variant: {
        default:
          "glass glass--subtle border-border/80 text-text-0 hover:bg-hover-bg hover:border-border-hover hover:-translate-y-[1px] hover:shadow-level2 active:translate-y-0 active:shadow-level",
        secondary:
          "glass glass--subtle border-border/60 text-text-1 hover:bg-hover-bg hover:text-text-0 hover:border-border-hover hover:-translate-y-[1px] active:translate-y-0",
        outline:
          "glass glass--subtle border-border/80 text-text-0 hover:bg-hover-bg hover:border-border-hover hover:-translate-y-[1px] active:translate-y-0",
        brand:
          "glass glass--strong border-transparent bg-gradient-to-r from-accent1/20 to-accent2/20 text-brand hover:from-accent1/30 hover:to-accent2/30 hover:-translate-y-[1px] hover:shadow-neon hover:border-border-focus active:translate-y-0 shadow-neon",
        ghost:
          "border-transparent bg-transparent text-text-1 hover:text-text-0 hover:bg-hover-bg hover:-translate-y-[1px] active:translate-y-0",
        link: "border-transparent bg-transparent text-brand underline-offset-4 hover:underline hover:text-accent1/80",
        destructive:
          "glass glass--strong border-transparent bg-danger-bg/20 text-danger hover:bg-danger-bg/30 hover:-translate-y-[1px] hover:shadow-level2 active:translate-y-0",
      },
      size: {
        default: "px-4 py-2 min-w-[var(--touch-recommended)]",
        sm: "h-[var(--touch-minimum)] px-3 text-sm py-1.5 min-w-[var(--touch-minimum)]",
        lg: "h-[var(--touch-comfortable)] px-5 text-base py-3 min-w-[var(--touch-comfortable)]",
        icon: "h-[var(--touch-recommended)] w-[var(--touch-recommended)] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {asChild ? (
          children
        ) : (
          <>
            {children}
            {/* Subtle shine effect on hover */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full rounded-base bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            {/* Touch ripple effect */}
            <div className="touch-ripple absolute inset-0 rounded-base" />
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
