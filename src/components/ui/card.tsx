import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const cardVariants = cva(
  "relative rounded-lg border border-[var(--border-card)] bg-card text-text-0 shadow-card transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
  {
    variants: {
      tone: {
        default: "",
        muted: "bg-surface-0 text-text-1",
        contrast: "bg-surface-2 text-text-0",
      },
      elevation: {
        none: "shadow-none",
        sm: "shadow-card",
        md: "shadow-card-hover",
      },
      interactive: {
        false: "",
        true: "hover:bg-card-hover hover:shadow-card-hover focus-visible:ring-brand motion-safe:hover:-translate-y-[2px]",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    compoundVariants: [
      {
        tone: "muted",
        elevation: "none",
        class: "border-border/60",
      },
      {
        tone: "contrast",
        class: "border-border/70",
      },
    ],
    defaultVariants: {
      tone: "default",
      elevation: "sm",
      interactive: false,
      padding: "none",
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, tone, elevation, interactive, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ tone, elevation, interactive, padding, className }))}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-3 px-6 pb-4 pt-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-token-h2 font-semibold leading-tight tracking-tight text-text-0",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-token-body leading-relaxed text-text-1", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-4 px-6 pb-6", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-4 border-t border-border/60 px-6 pb-6 pt-4",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
