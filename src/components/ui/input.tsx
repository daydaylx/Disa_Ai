import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const inputVariants = cva(
  "flex w-full rounded-[var(--radius-md)] border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 placeholder:text-text-secondary file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-11 px-3 py-2 text-sm", // 44px height
        md: "h-11 px-4 py-2.5 text-sm", // 44px height
        lg: "h-14 px-5 py-3.5 text-base", // 56px height
      },
      variant: {
        default: "border-line bg-surface-base text-text-primary",
        "neo-subtle":
          "border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-base)] text-text-primary shadow-[var(--shadow-inset-subtle)] focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
        "neo-inset":
          "border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-text-primary shadow-[var(--shadow-inset-medium)] focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
        ghost:
          "border-transparent bg-transparent text-text-primary focus-visible:border-[var(--color-border-focus)] focus-visible:bg-surface-base/60",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", size, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, variant }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
