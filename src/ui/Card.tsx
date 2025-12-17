import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva("relative rounded-2xl border transition-all duration-300", {
  variants: {
    variant: {
      default: "bg-surface-1/60 backdrop-blur-md border-white/[0.03] shadow-sm", // Glassy standard - ULTRA subtle border
      flat: "border-transparent bg-surface-1/40 backdrop-blur-none shadow-none",
      outline: "bg-transparent border-white/10",
      interactive:
        "bg-surface-1/60 backdrop-blur-md border-white/[0.03] hover:border-brand-primary/30 hover:bg-surface-1/80 hover:shadow-glow-sm cursor-pointer active:scale-[0.99]",
      elevated: "bg-surface-2 border-white/10 shadow-md",
      inset: "bg-black/20 border-black/10 shadow-inner",
      premium:
        "bg-surface-2/80 backdrop-blur-xl border-brand-secondary/20 shadow-lg overflow-hidden",
      // Disa Frame Branding System variants
      plain: "bg-surface-card border-white/[0.08] shadow-surface-subtle", // Minimal border (8-14% opacity)
      tintedSoft: "bg-surface-card border-white/[0.08] shadow-surface-subtle", // Global cards with soft tint
      roleStrong: "bg-surface-card border-white/[0.10] shadow-surface-subtle", // Role/Themen with strong tint
      tinted: "bg-surface-card border-white/[0.08] shadow-surface-subtle", // Legacy alias for tintedSoft
    },
    padding: {
      none: "p-0",
      sm: "p-3 sm:p-4",
      default: "p-4 sm:p-5",
      lg: "p-6",
    },
    accent: {
      none: "",
      chat: "border-l-2 border-l-accent-chat-border",
      models: "border-l-2 border-l-accent-models-border",
      roles: "border-l-2 border-l-accent-roles-border",
      settings: "border-l-2 border-l-accent-settings-border",
    },
    notch: {
      none: "",
      cutout: "card-notch-cutout",
    },
    notchSize: {
      sm: "card-notch-sm",
      default: "card-notch-default",
      lg: "card-notch-lg",
    },
  },
  compoundVariants: [
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
  withAccent?: boolean;
  accentColor?: "primary" | "secondary" | "tertiary" | "models" | "roles";
  tintColor?: string;
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

    // Determine tint strength - Disa Frame Branding System
    const tintAlpha = React.useMemo(() => {
      if (variant === "tintedSoft" || variant === "tinted") return "var(--tint-alpha-soft)"; // Global cards: 0.06-0.10
      if (variant === "roleStrong") return "var(--tint-alpha-strong)"; // Role/Themen: 0.20-0.35
      return "0";
    }, [variant]);

    // Generate tint style - Tint geometry: 0-18% strongest, fade until 65%
    const tintStyle = React.useMemo(() => {
      if (!tintColor && !roleColor) return {};
      if (variant === "plain") return {};

      // For roleStrong: Strong solid/gradient
      if (variant === "roleStrong" && roleColor) {
        return {
          "--card-tint-color": `rgb(${roleColor})`,
          "--card-tint-alpha": tintAlpha,
        } as React.CSSProperties;
      }

      // For tintedSoft/tinted: Gradient with proper geometry (0-18% strongest, fade until 65%)
      return {
        "--card-tint-color": tintColor,
        "--card-tint-alpha": tintAlpha,
      } as React.CSSProperties;
    }, [tintColor, roleColor, variant, tintAlpha]);

    // Notch size pixel values - Disa Frame Branding System
    const notchSizePx = {
      sm: 10, // Mobile default
      default: 18, // Default notch size
      lg: 22, // Hero cards and primary panels
    }[notchSize ?? "default"];

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

        {/* Tint Overlay - Gradient with proper geometry (0-18% strongest, fade until 65%) */}
        {(variant === "tintedSoft" || variant === "tinted" || variant === "roleStrong") && (
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden"
            style={{
              background:
                variant === "roleStrong" && roleColor
                  ? `rgb(var(--card-tint-color) / var(--card-tint-alpha))`
                  : `linear-gradient(90deg, rgb(var(--card-tint-color) / var(--card-tint-alpha)) 0%, rgb(var(--card-tint-color) / calc(var(--card-tint-alpha) * 0.5)) 18%, transparent 65%)`,
            }}
          />
        )}

        {/* L-shaped Notch Cutout - Shows page background, 2 inner edges (left + bottom) */}
        {notch === "cutout" && (
          <>
            {/* L-shaped cutout - shows page background */}
            <div
              className="absolute top-0 right-0 pointer-events-none z-20"
              style={{
                width: notchSizePx,
                height: notchSizePx,
                background: `rgb(var(--page-bg-rgb, 19, 19, 20))`,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0)",
                borderBottomLeftRadius: "6px",
              }}
            />
            {/* Inner edge highlights - left and bottom edges, 1px, slightly lighter than border */}
            <div
              className="absolute top-0 right-0 pointer-events-none z-30"
              style={{
                width: notchSizePx,
                height: notchSizePx,
                borderLeft: "1px solid rgba(255, 255, 255, 0.20)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.20)",
                borderBottomLeftRadius: "6px",
              }}
            />
          </>
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
