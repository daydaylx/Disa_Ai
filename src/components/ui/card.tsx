import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const cardVariants = cva(
  "relative isolate overflow-hidden rounded-[var(--radius-xl)] border border-border-hairline bg-surface-card text-text-primary shadow-surface transition-[box-shadow,transform,border-color,background] duration-small ease-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-border-focus)]",
  {
    variants: {
      tone: {
        default: "",
        muted: "bg-surface-subtle text-text-secondary",
        contrast: "bg-surface-popover text-text-inverse border-border-strong",
      },
      elevation: {
        none: "shadow-none",
        surface: "shadow-surface",
        raised: "shadow-raised",
        overlay: "shadow-overlay",
      },
      interactive: {
        false: "",
        true: "motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-raised",
      },
      padding: {
        none: "",
        sm: "p-[var(--space-md)]",
        md: "p-[var(--space-lg)]",
        lg: "p-[var(--space-xl)]",
      },
    },
    compoundVariants: [
      {
        tone: "muted",
        class: "border-border-subtle",
      },
      {
        tone: "contrast",
        elevation: "overlay",
        class: "shadow-overlay",
      },
    ],
    defaultVariants: {
      tone: "default",
      elevation: "surface",
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
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-[var(--space-stack-sm)] px-[var(--space-lg)] pb-[var(--space-md)] pt-[var(--space-lg)]",
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-title font-semibold leading-tight tracking-tight text-text-primary",
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
    className={cn("text-body leading-relaxed text-text-secondary", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-[var(--space-stack-md)] px-[var(--space-lg)] pb-[var(--space-lg)]",
        className,
      )}
      {...props}
    />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-[var(--space-inline-lg)] border-t border-border-divider px-[var(--space-lg)] pb-[var(--space-lg)] pt-[var(--space-md)]",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
