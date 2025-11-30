import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

/**
 * PremiumInput - Material Input mit Brand-Focus
 *
 * Inset-Style mit Brand-Ring auf Focus
 */
const inputVariants = cva(
  "flex min-h-[44px] w-full rounded-md px-3 py-2 text-base bg-surface-1 border border-border-ink text-ink-primary placeholder:text-ink-tertiary file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-fast",
  {
    variants: {
      variant: {
        default:
          "bg-surface-inset shadow-inset text-text-primary placeholder:text-ink-secondary focus-visible:ring-2 focus-visible:ring-brand focus-visible:shadow-brandGlow",
        outline:
          "border border-surface-1 bg-transparent placeholder:text-ink-secondary focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand",
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
      <input type={type} className={inputVariants({ variant, className })} ref={ref} {...props} />
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
