import React from "react";

import { cn } from "../../lib/utils";

type ModernButtonVariant =
  | "aurora-primary"
  | "aurora-soft"
  | "glass-primary"
  | "glass-soft"
  | "glass-ghost"
  | "brand"
  | "success"
  | "warning"
  | "destructive"
  | "ghost"
  | "outline"
  | "link";

type LegacyButtonVariant =
  | "default"
  | "secondary"
  | "neumorphic"
  | "accent"
  | "glass-secondary"
  | "glass-accent";

const legacyVariantMap: Record<LegacyButtonVariant, ModernButtonVariant> = {
  default: "glass-primary",
  secondary: "glass-soft",
  neumorphic: "glass-primary",
  accent: "brand",
  "glass-secondary": "glass-soft",
  "glass-accent": "glass-primary",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ModernButtonVariant | LegacyButtonVariant;
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "icon";
  asChild?: boolean;
  /** Enable enhanced touch feedback for mobile */
  touchFeedback?: boolean;
  /** Enables dramatic hover motion, used in legacy tests */
  dramatic?: boolean;
}

const buttonVariants = (
  variant: ModernButtonVariant = "aurora-primary",
  size: ButtonProps["size"] = "default",
  touchFeedback: boolean = false,
) => {
  const baseClasses = [
    "inline-flex items-center justify-center gap-2",
    "font-medium tracking-[-0.01em]",
    "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "disabled:shadow-none disabled:transform-none",
    // Touch-optimierte Basis-Klassen
    "select-none touch-manipulation",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
  ].join(" ");

  const variantClasses = {
    "aurora-primary": [
      // Aurora Primary mit Premium Glass Effect
      "relative overflow-hidden",
      "bg-[var(--surface-card)]",
      `backdrop-blur-[var(--backdrop-blur-medium)]`,
      "border border-[var(--glass-border-aurora)]",
      "text-[var(--text-primary)] font-semibold",
      "shadow-[var(--shadow-premium-medium)]",
      // Hover States
      "hover:bg-[var(--surface-raised)]",
      `hover:shadow-[var(--shadow-premium-strong)]`,
      "hover:border-[var(--glass-border-lila)]",
      touchFeedback
        ? "hover:scale-[var(--touch-scale-hover)]"
        : "hover:transform hover:translate-y-[-1px]",
      // Active States
      "active:transform active:scale-[var(--touch-scale-press)]",
      "active:shadow-[var(--shadow-depth-1)]",
      // Before für Aurora Glow Overlay
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-[var(--aurora-primary-500)]/10 before:to-[var(--aurora-lila-500)]/10 before:opacity-0 before:transition-opacity before:duration-[var(--motion-medium)]",
      "hover:before:opacity-100",
    ].join(" "),

    "aurora-soft": [
      // Aurora Soft - dezenter Glass-Stil
      "bg-[var(--glass-surface-subtle)]",
      `backdrop-blur-[var(--backdrop-blur-subtle)]`,
      "border border-[var(--glass-border-subtle)]",
      "text-[var(--text-primary)]",
      "shadow-[var(--shadow-premium-subtle)]",
      // Hover
      "hover:bg-[var(--glass-surface-medium)]",
      "hover:border-[var(--glass-border-medium)]",
      touchFeedback
        ? "hover:scale-[var(--touch-scale-hover)]"
        : "hover:transform hover:translate-y-[-1px]",
      // Active
      "active:bg-[var(--glass-surface-strong)]",
      "active:transform active:scale-[var(--touch-scale-press)]",
    ].join(" "),

    "glass-primary": [
      // Vollständiges Glassmorphism Design
      "relative",
      "bg-[var(--glass-surface-medium)]",
      `backdrop-blur-[var(--backdrop-blur-strong)]`,
      "border border-[var(--glass-border-aurora)]",
      "text-[var(--text-primary)] font-semibold",
      "shadow-[var(--shadow-glow-primary)]",
      // Hover
      "hover:bg-[var(--glass-surface-strong)]",
      "hover:border-[var(--aurora-primary-400)]/50",
      "hover:shadow-[var(--shadow-glow-primary)], [var(--shadow-depth-3)]",
      touchFeedback
        ? "hover:scale-[var(--touch-scale-hover)]"
        : "hover:transform hover:translate-y-[-2px]",
      // Active
      "active:transform active:scale-[var(--touch-scale-press)]",
      "active:shadow-[var(--shadow-depth-1)]",
    ].join(" "),

    "glass-soft": [
      "bg-[var(--glass-surface-subtle)]",
      `backdrop-blur-[var(--backdrop-blur-medium)]`,
      "border border-[var(--glass-border-subtle)]",
      "text-[var(--text-secondary)]",
      "shadow-[var(--shadow-glow-soft)]",
      // Hover
      "hover:bg-[var(--glass-surface-medium)]",
      "hover:text-[var(--text-primary)]",
      "hover:border-[var(--glass-border-medium)]",
      touchFeedback
        ? "hover:scale-[var(--touch-scale-hover)]"
        : "hover:transform hover:translate-y-[-1px]",
      // Active
      "active:transform active:scale-[var(--touch-scale-press)]",
    ].join(" "),

    "glass-ghost": [
      "bg-transparent",
      `backdrop-blur-[var(--backdrop-blur-subtle)]`,
      "border border-transparent",
      "text-[var(--text-muted)]",
      "shadow-none",
      // Hover
      "hover:bg-[var(--glass-surface-subtle)]",
      "hover:border-[var(--glass-border-subtle)]",
      "hover:text-[var(--text-primary)]",
      touchFeedback ? "hover:scale-[var(--touch-scale-hover)]" : "",
      // Active
      "active:bg-[var(--glass-surface-medium)]",
      "active:transform active:scale-[var(--touch-scale-press)]",
    ].join(" "),

    brand: [
      // Marken-Button mit Aurora Primary
      "bg-[var(--color-primary)]",
      "border border-[var(--aurora-primary-400)]",
      "text-[var(--color-primary-text)] font-semibold",
      "shadow-[var(--shadow-glow-primary)]",
      // Hover
      "hover:bg-[var(--color-primary-hover)]",
      "hover:shadow-[var(--shadow-glow-primary)], [var(--shadow-depth-3)]",
      touchFeedback
        ? "hover:scale-[var(--touch-scale-hover)]"
        : "hover:transform hover:translate-y-[-2px]",
      // Active
      "active:bg-[var(--color-primary-active)]",
      "active:transform active:scale-[var(--touch-scale-press)]",
    ].join(" "),

    success: [
      // Aurora Green für Erfolgs-Aktionen
      "bg-[var(--aurora-green-500)]",
      "border border-[var(--aurora-green-400)]",
      "text-[var(--text-primary)] font-semibold",
      "shadow-[var(--shadow-glow-green)]",
      // Hover
      "hover:bg-[var(--aurora-green-400)]",
      "hover:shadow-[var(--shadow-glow-green)], [var(--shadow-depth-2)]",
      touchFeedback
        ? "hover:scale-[var(--touch-scale-hover)]"
        : "hover:transform hover:translate-y-[-1px]",
      // Active
      "active:bg-[var(--aurora-green-600)]",
      "active:transform active:scale-[var(--touch-scale-press)]",
    ].join(" "),

    warning: [
      // Aurora Yellow für Warn-Aktionen
      "bg-[var(--aurora-yellow-500)]",
      "border border-[var(--aurora-yellow-500)]/60",
      "text-[var(--bg-aurora-0)] font-semibold",
      "shadow-[var(--shadow-depth-2)]",
      // Hover
      "hover:bg-[var(--aurora-yellow-500)]/90",
      "hover:shadow-[var(--shadow-depth-3)]",
      touchFeedback
        ? "hover:scale-[var(--touch-scale-hover)]"
        : "hover:transform hover:translate-y-[-1px]",
      // Active
      "active:transform active:scale-[var(--touch-scale-press)]",
    ].join(" "),

    destructive: [
      // Error-Button
      "bg-[var(--color-error)]",
      "border border-[var(--color-error-border)]",
      "text-[var(--text-primary)] font-semibold",
      "shadow-[var(--shadow-depth-2)]",
      // Hover
      "hover:bg-[var(--color-error)]/90",
      "hover:shadow-[var(--shadow-depth-3)]",
      touchFeedback
        ? "hover:scale-[var(--touch-scale-hover)]"
        : "hover:transform hover:translate-y-[-1px]",
      // Active
      "active:transform active:scale-[var(--touch-scale-press)]",
    ].join(" "),

    ghost: [
      "bg-transparent",
      "border border-transparent",
      "text-[var(--text-muted)]",
      "shadow-none",
      // Hover
      "hover:bg-[var(--glass-surface-subtle)]",
      "hover:text-[var(--text-primary)]",
      touchFeedback ? "hover:scale-[var(--touch-scale-hover)]" : "",
      // Active
      "active:bg-[var(--glass-surface-medium)]",
      "active:transform active:scale-[var(--touch-scale-press)]",
    ].join(" "),

    outline: [
      "bg-transparent",
      "border-2 border-[var(--border-medium)]",
      "text-[var(--text-primary)]",
      // Hover
      "hover:bg-[var(--glass-surface-subtle)]",
      "hover:border-[var(--border-aurora)]",
      touchFeedback ? "hover:scale-[var(--touch-scale-hover)]" : "",
      // Active
      "active:bg-[var(--glass-surface-medium)]",
      "active:transform active:scale-[var(--touch-scale-press)]",
    ].join(" "),

    link: [
      "bg-transparent",
      "border border-transparent",
      "text-[var(--aurora-primary-500)]",
      "shadow-none",
      "hover:underline hover:text-[var(--aurora-primary-400)]",
      "focus-visible:ring-[var(--aurora-primary-500)]/30",
    ].join(" "),
  } as const;

  // Touch-optimierte Größen mit WCAG AA Compliance
  const sizeClasses = {
    xs: "min-h-[36px] px-3 py-1.5 text-xs rounded-[var(--radius-xs)]",
    sm: "min-h-[40px] px-4 py-2 text-sm rounded-[var(--radius-sm)]",
    default: `min-h-[var(--touch-target-compact)] px-6 py-3 text-base rounded-[var(--radius-md)]`,
    lg: `min-h-[var(--touch-target-comfortable)] px-8 py-4 text-lg rounded-[var(--radius-lg)]`,
    xl: `min-h-[var(--touch-target-spacious)] px-10 py-5 text-xl rounded-[var(--radius-xl)]`,
    icon: `min-h-[var(--touch-target-compact)] min-w-[var(--touch-target-compact)] rounded-[var(--radius-md)]`,
  };

  return cn(baseClasses, variantClasses[variant], sizeClasses[size]);
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = "default",
      touchFeedback = false,
      dramatic = false,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedVariant: ModernButtonVariant = variant
      ? (legacyVariantMap[variant as LegacyButtonVariant] ?? (variant as ModernButtonVariant))
      : "aurora-primary";

    const buttonClasses = cn(
      buttonVariants(resolvedVariant, size, touchFeedback),
      dramatic && "hover:translate-y-[-1px] hover:shadow-[var(--shadow-premium-strong)]",
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement;
      const childProps = (child.props ?? {}) as { className?: string };

      return React.cloneElement(child, {
        className: cn(buttonClasses, childProps.className, className),
        ref,
        ...props,
      } as React.Attributes);
    }

    return (
      <button className={cn(buttonClasses, className)} ref={ref} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
