/**
 * CARD AURORA - Streamlined Mobile-First Glassmorphism
 *
 * Komplett neu aufgebaute Card-Komponente für das Aurora Design System
 * - Fokussiert auf Mobile-First Glassmorphism
 * - Touch-optimierte Interaktionen
 * - Balanced Premium Visual Design
 * - 80% weniger Code als die Legacy-Version
 */

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const cardVariants = cva(
  // Aurora Basis - Mobile-First Foundation
  [
    "relative isolate overflow-hidden",
    "text-[var(--text-primary)]",
    "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
    // Touch-optimiert für Mobile
    "select-none",
  ].join(" "),
  {
    variants: {
      // === CORE AURORA TONES - Nur 5 essenzielle Varianten ===
      variant: {
        "aurora-primary": [
          // Aurora Primary Glass mit Premium-Effekt
          "bg-[var(--surface-card)]",
          "backdrop-blur-[var(--backdrop-blur-medium)]",
          "border border-[var(--glass-border-aurora)]",
          "rounded-[var(--radius-lg)]",
          // Subtle Aurora Glow Overlay
          "before:absolute before:inset-0 before:bg-gradient-to-br",
          "before:from-[var(--aurora-primary-500)]/5 before:to-[var(--aurora-lila-500)]/5",
          "before:pointer-events-none before:rounded-[var(--radius-lg)]",
        ].join(" "),

        "aurora-soft": [
          // Dezenter Aurora Glass-Stil
          "bg-[var(--glass-surface-subtle)]",
          "backdrop-blur-[var(--backdrop-blur-subtle)]",
          "border border-[var(--glass-border-subtle)]",
          "rounded-[var(--radius-md)]",
        ].join(" "),

        "glass-primary": [
          // Vollständiges Premium Glassmorphism
          "bg-[var(--glass-surface-medium)]",
          "backdrop-blur-[var(--backdrop-blur-strong)]",
          "border border-[var(--glass-border-medium)]",
          "rounded-[var(--radius-lg)]",
          "shadow-[var(--shadow-glow-soft)]",
        ].join(" "),

        "glass-soft": [
          // Subtiler Glass-Stil
          "bg-[var(--glass-surface-subtle)]",
          "backdrop-blur-[var(--backdrop-blur-subtle)]",
          "border border-[var(--glass-border-subtle)]",
          "rounded-[var(--radius-md)]",
        ].join(" "),

        ghost: [
          // Transparenter Stil
          "bg-transparent",
          "border border-transparent",
          "rounded-[var(--radius-md)]",
        ].join(" "),
      },

      // === ELEVATION SYSTEM - 4 Level reichen völlig ===
      elevation: {
        none: "shadow-none",
        subtle: "shadow-[var(--shadow-depth-1)]", // Leichte Tiefe
        medium: "shadow-[var(--shadow-premium-medium)]", // Standard Premium
        strong: "shadow-[var(--shadow-premium-strong)]", // Hero Cards
      },

      // === INTERACTIVE STATES - Touch-optimiert ===
      interactive: {
        false: "",
        hover: [
          "cursor-pointer",
          // Responsive Hover (nur Desktop mit Maus)
          "md:hover:bg-[var(--surface-raised)]",
          "md:hover:border-[var(--glass-border-aurora)]",
          "md:hover:shadow-[var(--shadow-premium-strong)]",
          "md:hover:transform md:hover:translate-y-[-2px]",
        ].join(" "),
        press: [
          "cursor-pointer",
          // Mobile Touch-States (alle Geräte)
          "active:bg-[var(--surface-raised)]",
          "active:transform active:scale-[var(--touch-scale-press)]",
          "active:shadow-[var(--shadow-depth-1)]",
          // Desktop Hover zusätzlich
          "md:hover:bg-[var(--surface-raised)]",
          "md:hover:shadow-[var(--shadow-premium-medium)]",
        ].join(" "),
      },

      // === SIZE VARIANTS - Mobile-optimierte Abstände ===
      size: {
        sm: "p-[var(--spacing-3)]", // 12px - kompakte Cards
        default: "p-[var(--spacing-4)]", // 16px - Standard
        lg: "p-[var(--spacing-6)]", // 24px - Hero Cards
        xl: "p-[var(--spacing-8)]", // 40px - Feature Cards
      },
    },
    defaultVariants: {
      variant: "aurora-soft",
      elevation: "subtle",
      interactive: false,
      size: "default",
    },
    // === COMPOUND VARIANTS - Smart Kombinationen ===
    compoundVariants: [
      // Touch-optimierte Mindestgrößen für interaktive Cards
      {
        interactive: ["hover", "press"],
        class: "min-h-[var(--touch-target-compact)]",
      },
      // Premium-Kombinationen
      {
        variant: "aurora-primary",
        elevation: "strong",
        class: "shadow-[var(--shadow-premium-strong)], [var(--shadow-glow-primary)]",
      },
      // Glass + Strong = Maximum Premium
      {
        variant: "glass-primary",
        elevation: "strong",
        class: "shadow-[var(--shadow-glow-primary)], [var(--shadow-premium-strong)]",
      },
    ],
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

// === MAIN CARD COMPONENT ===
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, elevation, interactive, size, asChild = false, ...props }, ref) => {
    const cardClasses = cardVariants({ variant, elevation, interactive, size });

    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(
        props.children as React.ReactElement,
        {
          className: cn(cardClasses, className),
          ref,
          ...props,
        } as React.Attributes,
      );
    }

    return <div className={cn(cardClasses, className)} ref={ref} {...props} />;
  },
);
Card.displayName = "Card";

// === CARD SUB-COMPONENTS - Aurora Design System ===

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-[var(--spacing-2)]",
        "pb-[var(--spacing-4)]",
        // Mobile-responsive Padding
        "px-0 md:px-[var(--spacing-1)]",
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
        // Aurora Typography Scale
        "text-[var(--text-xl)] font-[var(--font-semibold)]",
        "leading-[var(--leading-tight)] tracking-[-0.01em]",
        "text-[var(--text-primary)]",
        // Mobile-responsive
        "text-lg md:text-xl",
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
    className={cn(
      // Aurora Typography
      "text-[var(--text-base)] font-[var(--font-normal)]",
      "leading-[var(--leading-normal)]",
      "text-[var(--text-secondary)]",
      // Mobile-optimierte Zeilen
      "text-sm md:text-base",
      className,
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-[var(--spacing-4)]",
        // Keine zusätzliche Padding - wird über Card size gesteuert
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
        "flex items-center justify-between gap-[var(--spacing-4)]",
        "pt-[var(--spacing-4)]",
        "border-t border-[var(--border-subtle)]",
        // Mobile-responsive Layout
        "flex-col gap-[var(--spacing-3)] md:flex-row md:gap-[var(--spacing-4)]",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

// === EXPORT EVERYTHING ===
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };

// === USAGE EXAMPLES ===
/*

// Standard Aurora Card
<Card variant="aurora-soft" size="default">
  <CardHeader>
    <CardTitle>Model Selection</CardTitle>
    <CardDescription>Choose your AI model</CardDescription>
  </CardHeader>
  <CardContent>
    Content here...
  </CardContent>
</Card>

// Interactive Premium Card
<Card
  variant="aurora-primary"
  elevation="strong"
  interactive="press"
  size="lg"
>
  <CardContent>Hero content</CardContent>
</Card>

// Glassmorphism Card
<Card variant="glass-primary" elevation="medium">
  <CardContent>Glass content</CardContent>
</Card>

// Touch-optimized Mobile Card
<Card
  variant="aurora-soft"
  interactive="press"
  className="touch-manipulation"
>
  <CardContent>Mobile content</CardContent>
</Card>

*/
