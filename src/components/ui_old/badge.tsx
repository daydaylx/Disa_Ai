import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

// Aurora Badge Variants with CVA
const badgeVariants = cva(
  // Aurora Base Styles - Touch-Optimized
  [
    "inline-flex items-center gap-1 rounded-[var(--radius-pill)]",
    "text-xs font-medium uppercase tracking-[0.06em]",
    "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
    // Touch-optimized for mobile
    "select-none touch-manipulation",
  ].join(" "),
  {
    variants: {
      // === AURORA GLASS VARIANTS ===
      variant: {
        "aurora-soft": [
          // Subtle Aurora Glass
          "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
          "border border-[var(--glass-border-subtle)] text-[var(--text-primary)]",
          "shadow-[var(--shadow-glow-soft)]",
          "hover:bg-[var(--glass-surface-medium)] hover:border-[var(--glass-border-medium)]",
          "hover:shadow-[var(--shadow-glow-primary)]",
        ].join(" "),

        "aurora-primary": [
          // Premium Aurora Primary
          "bg-gradient-to-r from-[var(--aurora-primary-500)] to-[var(--aurora-primary-600)]",
          "border border-[var(--aurora-primary-400)] text-white",
          "shadow-[var(--shadow-glow-primary)]",
          "hover:from-[var(--aurora-primary-400)] hover:to-[var(--aurora-primary-500)]",
          "hover:shadow-[var(--shadow-glow-primary)] hover:scale-105",
        ].join(" "),

        "aurora-success": [
          // Aurora Success State
          "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
          "border border-[var(--aurora-green-400)] text-[var(--aurora-green-500)]",
          "shadow-[var(--shadow-glow-green)]",
          "hover:bg-[var(--aurora-green-500)]/10 hover:shadow-[var(--shadow-glow-green)]",
        ].join(" "),

        "aurora-warning": [
          // Aurora Warning State
          "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
          "border border-[var(--aurora-orange-400)] text-[var(--aurora-orange-500)]",
          "shadow-[var(--shadow-glow-orange)]",
          "hover:bg-[var(--aurora-orange-500)]/10 hover:shadow-[var(--shadow-glow-orange)]",
        ].join(" "),

        "aurora-danger": [
          // Aurora Danger State
          "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
          "border border-[var(--aurora-red-400)] text-[var(--aurora-red-500)]",
          "shadow-[var(--shadow-glow-red)]",
          "hover:bg-[var(--aurora-red-500)]/10 hover:shadow-[var(--shadow-glow-red)]",
        ].join(" "),

        "aurora-lila": [
          // Aurora Purple Accent
          "bg-gradient-to-r from-[var(--aurora-lila-500)] to-[var(--aurora-lila-600)]",
          "border border-[var(--aurora-lila-400)] text-white",
          "shadow-[var(--shadow-glow-lila)]",
          "hover:from-[var(--aurora-lila-400)] hover:to-[var(--aurora-lila-500)]",
          "hover:shadow-[var(--shadow-glow-lila)] hover:scale-105",
        ].join(" "),

        // === STANDARD VARIANTS (Aurora-enhanced) ===
        outline: [
          "bg-transparent border border-[var(--glass-border-medium)]",
          "text-[var(--text-secondary)] backdrop-blur-[var(--backdrop-blur-subtle)]",
          "hover:bg-[var(--glass-surface-subtle)] hover:text-[var(--text-primary)]",
        ].join(" "),

        ghost: [
          "bg-transparent border-transparent text-[var(--text-secondary)]",
          "hover:bg-[var(--glass-surface-subtle)] hover:text-[var(--text-primary)]",
        ].join(" "),
        secondary: [
          "bg-[var(--surface-muted)]/40 border border-[var(--glass-border-subtle)]",
          "text-[var(--text-secondary)]",
        ].join(" "),
        accent: [
          "bg-[var(--aurora-primary-500)]/15 border border-[var(--aurora-primary-400)]/40",
          "text-[var(--aurora-primary-200)]",
        ].join(" "),

        // === SEMANTIC VARIANTS ===
        success: [
          "bg-[var(--aurora-green-500)]/15 border-transparent",
          "text-[var(--aurora-green-600)] backdrop-blur-[var(--backdrop-blur-subtle)]",
        ].join(" "),

        warning: [
          "bg-[var(--aurora-orange-500)]/15 border-transparent",
          "text-[var(--aurora-orange-600)] backdrop-blur-[var(--backdrop-blur-subtle)]",
        ].join(" "),

        danger: [
          "bg-[var(--aurora-red-500)]/15 border-transparent",
          "text-[var(--aurora-red-600)] backdrop-blur-[var(--backdrop-blur-subtle)]",
        ].join(" "),
        muted: [
          "bg-[var(--surface-muted)]/60 border border-[var(--glass-border-subtle)]",
          "text-[var(--text-secondary)] backdrop-blur-[var(--backdrop-blur-subtle)]",
        ].join(" "),
        info: [
          "bg-[var(--aurora-primary-500)]/15 border-transparent",
          "text-[var(--aurora-primary-300)] backdrop-blur-[var(--backdrop-blur-subtle)]",
        ].join(" "),
      },

      // === TOUCH-OPTIMIZED SIZES ===
      size: {
        xs: "px-2 py-1 text-[10px] min-h-[24px]", // Below WCAG but for compact UI elements
        sm: "px-2.5 py-1 text-[11px] min-h-[var(--touch-target-compact)]", // 32px - WCAG compliant
        default: "px-3 py-1.5 text-[12px] min-h-[var(--touch-target-comfortable)]", // 40px - Comfortable
        lg: "px-4 py-2 text-[13px] min-h-[var(--touch-target-spacious)]", // 48px - Spacious
      },
    },
    defaultVariants: {
      variant: "aurora-soft",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
