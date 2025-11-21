import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

/**
 * Material Card Component - Neumorphism/Soft-Depth System with Signature Bevel
 *
 * NO backdrop-blur, NO borders - depth through shadows only
 * Bevel highlight auf raised variants (Werkzeug-DNA)
 *
 * Variants:
 * - raised: Standard raised card with bevel (default)
 * - inset: Pressed/inset appearance (NO bevel)
 * - hero: Strong raised shadow + stronger bevel for focal elements
 */
const cardVariants = cva("relative rounded-md transition-all duration-fast overflow-hidden", {
  variants: {
    variant: {
      raised:
        "bg-surface-2 shadow-raise before:absolute before:inset-0 before:rounded-md before:pointer-events-none before:bg-[var(--bevel-highlight)]",
      inset: "bg-surface-1 shadow-inset",
      hero: "bg-surface-2 shadow-raiseLg before:absolute before:inset-0 before:rounded-md before:pointer-events-none before:bg-[var(--bevel-highlight-strong)]",
    },
    padding: {
      default: "p-6",
      sm: "p-4",
      lg: "p-8",
      none: "p-0",
    },
  },
  defaultVariants: {
    variant: "raised",
    padding: "default",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, children, ...props }, ref) => {
    return (
      <div className={cardVariants({ variant, padding, className })} ref={ref} {...props}>
        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`flex flex-col space-y-1.5 ${className}`} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-2xl font-semibold leading-none tracking-tight text-text-primary ${className}`}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={`text-sm text-text-muted ${className}`} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={`pt-6 ${className}`} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`flex items-center pt-6 ${className}`} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
