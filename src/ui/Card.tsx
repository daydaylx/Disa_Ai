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
      // New branding variants
      plain: "bg-surface-card border-white/[0.02] shadow-surface-subtle", // Almost invisible border
      tinted: "bg-surface-card border-white/[0.02] shadow-surface-subtle", // Tinted will handle the color via overlay
      roleStrong: "bg-surface-card border-surface-border-subtle shadow-surface-subtle", // Strong role tint
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

    // Determine tint strength
    const tintAlpha = React.useMemo(() => {
      if (variant === "tinted") return "0.08"; // Fixed soft alpha
      if (variant === "roleStrong") return "var(--tint-alpha-strong)";
      return "0";
    }, [variant]);

    // Generate tint style
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

      // For tinted: Gradient
      return {
        "--card-tint-color": tintColor,
        "--card-tint-alpha": tintAlpha,
      } as React.CSSProperties;
    }, [tintColor, roleColor, variant, tintAlpha]);

    // Notch size pixel values
    const notchSizePx = {
      sm: 12,
      default: 16,
      lg: 20, // 18-22px range
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

        {/* Tint Overlay - Gradient for global, Solid/Strong for roles */}
        {(variant === "tinted" || variant === "roleStrong") && (
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden"
            style={{
              background:
                variant === "tinted"
                  ? `linear-gradient(90deg, rgb(var(--card-tint-color) / var(--card-tint-alpha)) 0%, transparent 100%)`
                  : `rgb(var(--card-tint-color) / var(--card-tint-alpha))`,
            }}
          />
        )}

        {/* Notch Cutout Element */}
        {notch === "cutout" && (
          <div
            className="absolute top-0 right-0 pointer-events-none z-20"
            style={{
              width: notchSizePx,
              height: notchSizePx,
              backgroundColor: "var(--bg-app)", // Explicitly use app background
              borderBottomLeftRadius: "6px", // Smooth corner inside
              borderLeft: "1px solid rgba(255, 255, 255, 0.08)", // Match border.DEFAULT
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "-1px 1px 2px rgba(0,0,0,0.2)", // Subtle inner depth
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
