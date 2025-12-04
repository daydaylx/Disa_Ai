import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";

/**
 * Input - Digital Slate Theme
 *
 * Minimalist line-based input.
 * Replaced: Boxy/Neumorph styles.
 * Use .input-chalk from global CSS for the core look.
 */
const inputVariants = cva(
  "flex w-full bg-transparent px-0 py-2 text-lg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-chalk-dim/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "input-chalk", // Defined in theme-slate.css (bottom border only)
        ghost: "border-none focus:ring-0 p-0",
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
