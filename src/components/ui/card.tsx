import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const cardVariants = cva(
  [
    "relative isolate overflow-hidden rounded-2xl border border-[var(--border-glass)]",
    "bg-[var(--glass-layer-card)] text-[var(--text-on-glass)] shadow-[var(--glass-shadow)]",
    "backdrop-blur-[var(--glass-blur)] supports-[backdrop-filter]:backdrop-saturate-125",
    "transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-[var(--glass-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg)]",
  ].join(" "),
  {
    variants: {
      tone: {
        default: "",
        muted: "bg-[var(--glass-overlay-muted)] text-text-1",
        contrast:
          "border-white/50 bg-[var(--glass-overlay-strong)] text-[var(--text-on-glass)] shadow-lg",
      },
      elevation: {
        none: "shadow-none",
        sm: "shadow-[var(--glass-shadow)]",
        md: "shadow-card-hover",
      },
      interactive: {
        false: "",
        true: "motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-card-hover hover:bg-[var(--glass-overlay-muted)]",
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
