import * as React from "react";

import { cn } from "../../lib/utils/cn";

export type GlassVariant = "default" | "strong" | "subtle" | "elevated";
export type GlassGlow = "none" | "cyan" | "purple" | "mint" | "warm";

interface GlassCardProps {
  children: React.ReactNode;
  variant?: GlassVariant;
  glow?: GlassGlow;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const variantClasses: Record<GlassVariant, string> = {
  default: "glass-backdrop",
  strong: "glass-backdrop--strong",
  subtle: "glass-backdrop--subtle",
  elevated: "glass-backdrop shadow-2xl",
};

const glowClasses: Record<GlassGlow, string> = {
  none: "",
  cyan: "glass-glow--cyan",
  purple: "glass-glow--purple",
  mint: "glass-glow--mint",
  warm: "glass-glow--warm",
};

export function GlassCard({
  children,
  variant = "default",
  glow = "none",
  className,
  onClick,
  hover = false,
}: GlassCardProps) {
  const isInteractive = onClick || hover;

  return (
    <div
      className={cn(
        "glass-card",
        variantClasses[variant],
        glowClasses[glow],
        isInteractive && "glass-card--interactive",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
