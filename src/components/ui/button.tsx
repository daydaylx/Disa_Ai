import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-base border text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-weak focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-1 text-text-0 hover:bg-surface-1-hover",
        secondary: "border-border bg-surface-2 text-text-1 hover:bg-surface-1 hover:text-text-0",
        outline: "border-border bg-transparent text-text-0 hover:bg-surface-1",
        brand: "border-transparent bg-brand text-white hover:bg-brand/90",
        ghost: "border-transparent bg-transparent text-text-1 hover:text-text-0 hover:bg-surface-1",
        link: "border-transparent bg-transparent text-brand underline-offset-4 hover:underline",
        destructive: "border-transparent bg-danger text-white hover:bg-danger/90",
      },
      size: {
        default: "px-4",
        sm: "h-[42px] px-3 text-sm",
        lg: "h-12 px-5 text-base",
        icon: "h-[44px] w-[44px]",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
