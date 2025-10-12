import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-corporate-accent-primary text-color-corporate-text-on-accent hover:bg-[--color-corporate-accent-secondary]",
        destructive:
          "bg-corporate-accent-danger text-color-corporate-text-on-accent hover:bg-red-600",
        outline:
          "border border-corporate-border-primary bg-corporate-bg-primary hover:bg-corporate-bg-elevated hover:text-corporate-text-primary",
        secondary:
          "bg-corporate-bg-elevated text-corporate-text-primary hover:bg-corporate-bg-card",
        ghost: "hover:bg-corporate-bg-elevated hover:text-corporate-text-primary",
        link: "text-corporate-accent-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-4 py-2", // 48px min-height for touch
        sm: "h-11 rounded-md px-3", // 44px for less critical actions
        lg: "h-14 rounded-md px-8", // 56px for primary actions
        icon: "h-12 w-12", // 48px square for icons
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
