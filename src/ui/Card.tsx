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
      // New branding variants
      plain: "bg-surface-card border-surface-border-subtle shadow-surface-subtle", // No tint
      tinted: "bg-surface-card border-surface-border-subtle shadow-surface-subtle", // Subtle tint
      roleStrong: "bg-surface-card border-surface-border-subtle shadow-surface-subtle", // Strong role tint
    },
    padding: {
      none: "p-0",
      sm: "p-3 sm:p-4",
      default: "p-4 sm:p-5",
      lg: "p-6",
    },
    // Page-specific accent variants for visual categorization
    accent: {
      none: "",
      chat: "border-l-2 border-l-accent-chat-border",
      models: "border-l-2 border-l-accent-models-border",
      roles: "border-l-2 border-l-accent-roles-border",
      settings: "border-l-2 border-l-accent-settings-border",
    },
    // Notch variant for cutout effect
    notch: {
      none: "",
      cutout: "card-notch-cutout",
    },
    // Notch size
    notchSize: {
      sm: "card-notch-sm",
      default: "card-notch-default",
      lg: "card-notch-lg",
    },
  },
  compoundVariants: [
    // When interactive + accent, enhance hover states
    {
      variant: "interactive",
      accent: "models",
      className: "hover:border-accent-models-border hover:shadow-glow-models",
    },
    {
      variant: "interactive",
      accent: "roles",
      className: "hover:border-accent-roles-border hover:shadow-glow-roles",
    },
    {
      variant: "interactive",
      accent: "settings",
      className: "hover:border-accent-settings-border hover:shadow-glow-settings",
    },
    // Tint variants with notch
    {
      variant: "tinted",
      notch: "cutout",
      className: "card-tinted-with-notch",
    },
    {
      variant: "roleStrong",
      notch: "cutout",
      className: "card-role-strong-with-notch",
    },
  ],
  defaultVariants: {
    variant: "default",
    padding: "default",
    accent: "none",
    notch: "none",
    notchSize: "default",
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
  accentColor?: "primary" | "secondary" | "tertiary" | "models" | "roles";
  /**
   * Tint color for tinted and roleStrong variants
   * Can be CSS variable name or hex color
   */
  tintColor?: string;
  /**
   * Role color for roleStrong variant (RGB format)
   */
  roleColor?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      accent,
      notch,
      notchSize = "default",
      withAccent = false,
      accentColor = "secondary",
      tintColor,
      roleColor,
      children,
      ...props
    },
    ref,
  ) => {
    const showAccent = withAccent && variant === "premium";
    const accentColorClass = {
      primary: "bg-brand-primary",
      secondary: "bg-brand-secondary",
      tertiary: "bg-brand-tertiary",
      models: "bg-accent-models",
      roles: "bg-accent-roles",
    }[accentColor];

    // Determine tint strength based on variant
    const tintAlpha = React.useMemo(() => {
      if (variant === "tinted") return "var(--tint-alpha-soft)";
      if (variant === "roleStrong") return "var(--tint-alpha-strong)";
      return "0"; // No tint for other variants
    }, [variant]);

    // Generate tint style
    const tintStyle = React.useMemo(() => {
      if (!tintColor || variant === "plain") return {};

      if (variant === "roleStrong" && roleColor) {
        // For roleStrong, use RGB format for better performance
        return {
          "--card-tint-color": `rgb(${roleColor})`,
          "--card-tint-alpha": tintAlpha,
        } as React.CSSProperties;
      }

      // For tinted variant, use the provided tintColor
      return {
        "--card-tint-color": tintColor,
        "--card-tint-alpha": tintAlpha,
      } as React.CSSProperties;
    }, [tintColor, roleColor, variant, tintAlpha]);

    // Notch size classes
    const notchSizeClasses = {
      sm: "w-4 h-4",
      default: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, accent, notch, notchSize, className }))}
        style={tintStyle}
        {...props}
      >
        {showAccent && (
          <div className={cn("absolute top-0 left-0 right-0 h-1 opacity-80", accentColorClass)} />
        )}

        {/* Tint Overlay - uses CSS variables for performance */}
        {(variant === "tinted" || variant === "roleStrong") && (
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit]"
            style={{
              backgroundColor: `rgb(var(--card-tint-color) / var(--card-tint-alpha))`,
            }}
          />
        )}

        {/* Notch Cutout Element */}
        {notch === "cutout" && (
          <div
            className={cn(
              "absolute top-0 right-0 pointer-events-none z-20",
              notchSizeClasses[notchSize ?? "default"],
              "card-notch-element",
            )}
            style={{
              backgroundColor: `rgb(var(--card-page-bg-rgb))`,
              borderLeft: "1px solid rgba(var(--card-border-rgb), var(--card-border-alpha))",
              borderBottom: "1px solid rgba(var(--card-border-rgb), var(--card-border-alpha))",
            }}
          />
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
