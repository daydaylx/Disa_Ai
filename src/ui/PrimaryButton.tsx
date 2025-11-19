import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const primaryButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-pink-500 text-white shadow-lg hover:bg-pink-600/90",
      },
      size: {
        default: "h-12 py-3 px-8",
        lg: "h-14 rounded-full px-10 text-lg",
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