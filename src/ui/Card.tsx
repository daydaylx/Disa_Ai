import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

type CoreCardVariant = "surface" | "tinted" | "hero";
type LegacyCardVariant =
  | "default"
  | "flat"
  | "outline"
  | "interactive"
  | "elevated"
  | "inset"
  | "premium"
  | "plain"
  | "tintedSoft"
  | "roleStrong";
type CardVariant = CoreCardVariant | LegacyCardVariant;

const LEGACY_CARD_VARIANTS: Record<LegacyCardVariant, CoreCardVariant> = {
  default: "surface",
  flat: "surface",
  outline: "surface",
  interactive: "surface",
  elevated: "surface",
  inset: "surface",
  premium: "hero",
  plain: "surface",
  tintedSoft: "tinted",
  roleStrong: "tinted",
};

function normalizeRgbTuple(value: string): string {
  return value.replaceAll(",", " ").replace(/\s+/g, " ").trim();
}

const cardVariants = cva("relative rounded-2xl border transition-all duration-200", {
  variants: {
    variant: {
      surface: "bg-surface-card border-white/[0.08] shadow-surface-subtle",
      tinted: "bg-surface-card border-white/[0.08] shadow-surface-subtle overflow-hidden",
      hero: "bg-surface-2/80 border-white/[0.12] shadow-md overflow-hidden",
    },
    interactive: {
      true: "cursor-pointer active:translate-y-px active:shadow-sm hover:border-white/[0.14] hover:bg-surface-2/70",
      false: "",
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
      cutout: "card-notch-visual overflow-visible",
    },
    notchSize: {
      sm: "",
      default: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "surface",
    interactive: false,
    padding: "default",
    accent: "none",
    notch: "none",
    notchSize: "default",
  },
});

type CardVariantOptions = VariantProps<typeof cardVariants>;

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<CardVariantOptions, "variant" | "interactive"> {
  variant?: CardVariant;
  interactive?: boolean;
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
      interactive,
      accent,
      notch,
      notchSize = "default",
      withAccent = false,
      accentColor = "secondary",
      tintColor,
      roleColor,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const resolvedVariant: CoreCardVariant = React.useMemo(() => {
      if (!variant) return "surface";
      return variant in LEGACY_CARD_VARIANTS
        ? LEGACY_CARD_VARIANTS[variant as LegacyCardVariant]
        : (variant as CoreCardVariant);
    }, [variant]);

    const resolvedInteractive = interactive ?? variant === "interactive";
    const showAccent = withAccent && resolvedVariant === "hero";
    const accentColorClass = {
      primary: "bg-brand-primary",
      secondary: "bg-brand-secondary",
      tertiary: "bg-brand-tertiary",
      models: "bg-accent-models",
      roles: "bg-accent-roles",
    }[accentColor];

    // Legacy roleStrong keeps stronger tint while using the same core card surface.
    const tintAlpha = React.useMemo(() => {
      if (resolvedVariant !== "tinted") return "0";
      if (variant === "roleStrong") return "var(--tint-alpha-strong)"; // Role/Themen: 0.20-0.35
      return "var(--tint-alpha-soft)"; // Global cards: 0.06-0.10
    }, [resolvedVariant, variant]);

    // Generate tint style - Tint geometry: 0-18% strongest, fade until 65%
    const tintStyle = React.useMemo(() => {
      if (resolvedVariant !== "tinted") return {};
      const resolvedTintColor = roleColor ? normalizeRgbTuple(roleColor) : tintColor;
      if (!resolvedTintColor) return {};

      return {
        "--card-tint-color": resolvedTintColor,
        "--card-tint-alpha": tintAlpha,
      } as React.CSSProperties;
    }, [resolvedVariant, tintColor, roleColor, tintAlpha]);

    // Notch size attribute for CSS-based notch system
    const notchSizeAttr = notchSize ?? "default";

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            variant: resolvedVariant,
            interactive: resolvedInteractive,
            padding,
            accent,
            notch,
            notchSize,
            className,
          }),
        )}
        style={{ ...tintStyle, ...style }}
        data-variant={resolvedVariant}
        data-notch-size={notch === "cutout" ? notchSizeAttr : undefined}
        {...props}
      >
        {showAccent && (
          <div className={cn("absolute top-0 left-0 right-0 h-1 opacity-80", accentColorClass)} />
        )}

        {/* Tint Overlay - Gradient with proper geometry (0-18% strongest, fade until 65%) */}
        {resolvedVariant === "tinted" && (
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
