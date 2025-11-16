import React from "react";

import { cn } from "../../lib/utils";

interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  disabled?: boolean;
}

const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      interactive = false,
      disabled = false,
      children,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      default: "border border-border-subtle bg-surface-base text-text-primary",
      elevated:
        "border border-border-subtle bg-surface-raised text-text-primary shadow-[var(--shadow-card)]",
      glass:
        "border border-[var(--glass-border-soft)] bg-[var(--layer-glass-panel)] text-text-primary shadow-[var(--shadow-card)] backdrop-blur-[var(--glass-backdrop-blur-sm)]",
    };

    const paddingClasses = {
      none: "p-0",
      sm: "p-[var(--space-padding-sm)]",
      md: "p-[var(--space-padding-md)]",
      lg: "p-[var(--space-padding-lg)]",
    };

    const interactiveClass = interactive
      ? "cursor-pointer hover:shadow-[var(--shadow-lg)] transition-shadow duration-200"
      : "";

    const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

    const classes = cn(
      "rounded-[var(--radius-card)]",
      variantClasses[variant],
      paddingClasses[padding],
      interactiveClass,
      disabledClass,
      className,
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

BaseCard.displayName = "BaseCard";

export { BaseCard };
