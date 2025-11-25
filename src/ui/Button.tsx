import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

/**
 * PremiumButton - Premium Material Button mit Brand-Glow
 *
 * NO borders - depth through shadows only
 * Physical feedback: press transforms to scale(0.98) + translateY
 * Brand-Glow: Lila-Glow auf Primary-Buttons (SIGNATURE)
 *
 * Variants:
 * - primary: Lila Brand-Color mit Brand-Glow auf hover
 * - secondary: Raised surface with no accent
 * - ghost: Minimal, no shadow
 * - link: Text-only link style
 */
const buttonVariants = cva(
  "btn-aurora inline-flex items-center justify-center rounded-md text-sm font-semibold transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gradient text-white shadow-raise hover:shadow-brand-glow active:scale-[0.98] active:shadow-brand-glow-strong",
        secondary:
          "bg-surface-2 text-text-primary shadow-raise hover:shadow-raiseLg active:scale-[0.98] active:translate-y-px active:shadow-inset",
        ghost: "hover:bg-surface-2 hover:text-text-primary active:scale-[0.98]",
        link: "text-accent-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-[44px] py-2 px-4",
        sm: "min-h-[44px] rounded-sm px-3",
        lg: "min-h-[48px] rounded-md px-8",
        icon: "min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
