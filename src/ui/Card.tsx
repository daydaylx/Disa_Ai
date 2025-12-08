import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva("relative rounded-2xl border transition-all duration-300", {
  variants: {
    variant: {
      default: "bg-surface-1/60 backdrop-blur-md border-white/5 shadow-sm", // Glassy standard
      flat: "border-transparent bg-surface-1/40 backdrop-blur-none shadow-none", // Subtle grouping
      outline: "bg-transparent border-white/10", // Wireframe
      interactive:
        "bg-surface-1/60 backdrop-blur-md border-white/5 hover:border-brand-primary/30 hover:bg-surface-1/80 hover:shadow-glow-sm cursor-pointer active:scale-[0.99]", // Interactive glass
      elevated: "bg-surface-2 border-white/10 shadow-md", // Raised Opaque
      inset: "bg-black/20 border-black/10 shadow-inner", // Deep inset
      premium:
        "bg-surface-2/80 backdrop-blur-xl border-brand-secondary/20 shadow-lg overflow-hidden", // Premium
    },
    accent: {
      neutral: "", // Default behavior
      chat: "", // Handled conditionally
      models: "",
      roles: "",
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
    accent: "neutral",
  },
});

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
    {
      className,
      variant,
      padding,
      accent = "neutral",
      withAccent = false,
      accentColor = "secondary",
      children,
      ...props
    },
    ref,
  ) => {
    // Generate accent-specific classes dynamically based on the prop
    const accentClasses = React.useMemo(() => {
      if (accent === "neutral") return "";

      const colors = {
        chat: "border-accent-chat/20 bg-accent-chat/5 hover:border-accent-chat/40",
        models: "border-accent-models/20 bg-accent-models/5 hover:border-accent-models/40",
        roles: "border-accent-roles/20 bg-accent-roles/5 hover:border-accent-roles/40",
      };

      return colors[accent as keyof typeof colors] || "";
    }, [accent]);

    // Override variant styles if an accent is provided
    // If variant is interactive, we merge the accent hover effects
    const finalClassName = cn(
      cardVariants({ variant, padding, className }),
      accentClasses,
      // Ensure glass effect is maintained if we added a bg tint
      accent !== "neutral" && variant === "default" && "backdrop-blur-md"
    );

    const showAccent = withAccent && variant === "premium";
    const accentColorClass = {
      primary: "bg-brand-primary",
      secondary: "bg-brand-secondary",
      tertiary: "bg-brand-tertiary",
    }[accentColor];

    return (
      <div ref={ref} className={finalClassName} {...props}>
        {showAccent && (
          <div className={cn("absolute top-0 left-0 right-0 h-1 opacity-80", accentColorClass)} />
        )}
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 pb-3", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight text-base text-ink-primary",
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
