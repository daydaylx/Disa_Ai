import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";

/**
 * Input - Konsistentes Design System
 * Basiert auf Fluent 2 / Material 3 Prinzipien
 */
const inputVariants = cva(
  "flex w-full rounded-xl px-4 py-3 text-base bg-surface-2 border transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-tertiary disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-1/50",
  {
    variants: {
      variant: {
        default:
          "border-white/12 hover:border-white/20 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20",
        ghost: "border-none bg-transparent focus:ring-0 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
