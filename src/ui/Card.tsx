import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

/**
 * Material Card Component - Neumorphism/Soft-Depth System
 *
 * NO backdrop-blur, NO borders - depth through shadows only
 *
 * Variants:
 * - raised: Standard raised card (default)
 * - inset: Pressed/inset appearance
 * - hero: Strong raised shadow for focal elements
 */
const cardVariants = cva("rounded-md transition-all duration-fast", {
  variants: {
    variant: {
      raised: "bg-surface-2 shadow-raise",
      inset: "bg-surface-1 shadow-inset",
      hero: "bg-surface-2 shadow-raiseLg",
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
  ({ className, variant, padding, ...props }, ref) => {
    return <div className={cardVariants({ variant, padding, className })} ref={ref} {...props} />;
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
