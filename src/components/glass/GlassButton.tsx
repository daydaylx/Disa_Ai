import * as React from "react";

import { cn } from "../../lib/utils/cn";

export type GlassButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type GlassButtonSize = "sm" | "md" | "lg";

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const variantClasses: Record<GlassButtonVariant, string> = {
  primary: "glass-button--primary",
  secondary: "glass-button--secondary",
  ghost: "glass-button--ghost",
  danger: "glass-button--danger",
};

const sizeClasses: Record<GlassButtonSize, string> = {
  sm: "glass-button--sm",
  md: "glass-button--md",
  lg: "glass-button--lg",
};

export function GlassButton({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  onClick,
  type = "button",
}: GlassButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "glass-button",
        variantClasses[variant],
        sizeClasses[size],
        disabled && "glass-button--disabled",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="glass-button__content">{children}</span>
      <div className="glass-button__glow" />
    </button>
  );
}
