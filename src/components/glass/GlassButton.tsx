import * as React from "react";

import { cn } from "../../lib/cn";

export type GlassButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "accent"
  | "success"
  | "info";
export type GlassButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "jumbo";

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-pressed"?: boolean;
  "aria-expanded"?: boolean;
  loading?: boolean;
}

const variantClasses: Record<GlassButtonVariant, string> = {
  primary: "glass-button--primary",
  secondary: "glass-button--secondary",
  ghost: "glass-button--ghost",
  danger: "glass-button--danger",
  accent: "glass-button--accent",
  success: "glass-button--success",
  info: "glass-button--info",
};

const sizeClasses: Record<GlassButtonSize, string> = {
  xs: "glass-button--xs",
  sm: "glass-button--sm",
  md: "glass-button--md",
  lg: "glass-button--lg",
  xl: "glass-button--xl",
  jumbo: "glass-button--jumbo",
};

export function GlassButton({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  onClick,
  type = "button",
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-pressed": ariaPressed,
  "aria-expanded": ariaExpanded,
  loading = false,
}: GlassButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "glass-button",
        variantClasses[variant],
        sizeClasses[size],
        disabled && "glass-button--disabled",
        loading && "glass-button--loading",
        className,
      )}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-busy={loading}
    >
      <span className="glass-button__content">{loading ? "" : children}</span>
      <div className="glass-button__glow" />
    </button>
  );
}
