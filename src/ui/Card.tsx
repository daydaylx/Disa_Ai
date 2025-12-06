import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative rounded-2xl border bg-surface-1 text-ink-primary transition-all",
  {
    variants: {
      variant: {
        default: "border shadow-sm", // Standard card with subtle border
        flat: "border-transparent bg-surface-1 shadow-none", // No border, no shadow
        outline: "bg-transparent border", // Wireframe style
        interactive:
          "border hover:border-medium hover:bg-surface-2 cursor-pointer active:scale-[0.99]",
        elevated: "border-subtle bg-surface-2 shadow-md", // Raised appearance (from MaterialCard)
        inset: "border-subtle bg-surface-inset shadow-inset", // Deep inset style
        premium: "border-subtle bg-surface-2 shadow-md overflow-hidden", // Premium style with optional accent
      },
      padding: {
        none: "p-0",
        sm: "p-3 sm:p-4",
        default: "p-4 sm:p-5",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Add accent strip at the top of the card (typically for premium/brand elements)
   * Only visible when variant="premium"
   */
  withAccent?: boolean;
  /**
   * Accent color for the strip
   * @default "primary" (indigo)
   */
  accentColor?: "primary" | "secondary" | "tertiary";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant, padding, withAccent = false, accentColor = "secondary", children, ...props },
    ref,
  ) => {
    const showAccent = withAccent && variant === "premium";
    const accentColorClass = {
      primary: "bg-accent-primary",
      secondary: "bg-accent-secondary",
      tertiary: "bg-accent-tertiary",
    }[accentColor];

    return (
      <div ref={ref} className={cn(cardVariants({ variant, padding, className }))} {...props}>
        {showAccent && <div className={cn("absolute top-0 left-0 right-0 h-1", accentColorClass)} />}
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1 pb-3", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "font-medium leading-none tracking-tight text-base text-ink-primary",
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
  <p ref={ref} className={cn("text-sm text-ink-secondary leading-relaxed", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center pt-3", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
