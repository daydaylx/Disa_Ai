import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

/**
 * PrimaryButton - Hero Material Button
 *
 * Large, prominent call-to-action button with strong material presence
 * NO borders - depth through shadows + accent glow
 */
const primaryButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-base font-bold transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-accent-primary text-white shadow-raiseLg hover:bg-accent-hover hover:shadow-accentGlowLg active:scale-[0.98] active:translate-y-px active:bg-accent-active",
      },
      size: {
        default: "h-12 py-3 px-8",
        lg: "h-14 px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof primaryButtonVariants> {}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={primaryButtonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  },
);
PrimaryButton.displayName = "PrimaryButton";

export { PrimaryButton };
