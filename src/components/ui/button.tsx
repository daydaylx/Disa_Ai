import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] border text-body font-medium transition-[background,box-shadow,border-color,color,transform] duration-small ease-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-border-focus)] focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-60 select-none",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-action-primary text-action-primary-fg shadow-raised hover:bg-action-primary-hover active:bg-action-primary-active",
        brand:
          "border-transparent bg-action-primary text-action-primary-fg shadow-raised hover:bg-action-primary-hover active:bg-action-primary-active",
        default:
          "border border-action-secondary-border bg-action-secondary text-action-secondary-fg shadow-surface hover:bg-action-secondary-hover hover:border-action-secondary-border-hover active:bg-action-secondary-active",
        secondary:
          "border border-action-secondary-border bg-action-secondary text-action-secondary-fg shadow-surface hover:bg-action-secondary-hover hover:border-action-secondary-border-hover active:bg-action-secondary-active",
        outline:
          "border border-action-secondary-border bg-transparent text-action-secondary-fg hover:bg-action-secondary-hover active:bg-action-secondary-active",
        ghost:
          "border border-transparent bg-transparent text-action-ghost hover:bg-action-ghost-hover active:bg-action-ghost-active",
        link: "border border-transparent bg-transparent text-text-link underline-offset-4 hover:underline hover:text-text-link-hover",
        destructive:
          "border-transparent bg-action-destructive text-action-destructive-fg shadow-surface hover:bg-action-destructive-hover active:bg-action-destructive-active",
      },
      size: {
        default:
          "min-h-[var(--size-touch-comfortable)] px-[var(--space-inline-lg)] py-[var(--space-2xs)] gap-[var(--space-2xs)]",
        sm: "min-h-[var(--size-touch-compact)] px-[var(--space-inline-md)] py-[var(--space-3xs)] text-body-sm",
        lg: "min-h-[var(--size-touch-relaxed)] px-[var(--space-inline-lg)] py-[var(--space-xs)] text-subtitle",
        icon: "size-[var(--size-touch-comfortable)] min-h-[var(--size-touch-comfortable)] rounded-[var(--radius-lg)] p-0 text-title",
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
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
