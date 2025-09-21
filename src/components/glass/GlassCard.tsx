import * as React from "react";

import { cn } from "../../lib/utils/cn";

export type GlassVariant =
  | "default"
  | "strong"
  | "subtle"
  | "elevated"
  | "adaptive"
  | "frosted"
  | "depth-1"
  | "depth-2"
  | "depth-3"
  | "depth-4";
export type GlassGlow = "none" | "cyan" | "purple" | "mint" | "warm";

interface GlassCardProps {
  children: React.ReactNode;
  variant?: GlassVariant;
  glow?: GlassGlow;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  gradientBorder?: boolean;
  animatedBorder?: boolean;
}

const variantClasses: Record<GlassVariant, string> = {
  default: "glass-backdrop",
  strong: "glass-backdrop--strong",
  subtle: "glass-backdrop--subtle",
  elevated: "glass-backdrop shadow-2xl",
  adaptive: "glass-adaptive",
  frosted: "glass-frosted",
  "depth-1": "glass-depth-1",
  "depth-2": "glass-depth-2",
  "depth-3": "glass-depth-3",
  "depth-4": "glass-depth-4",
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
  gradientBorder = false,
  animatedBorder = false,
}: GlassCardProps) {
  const isInteractive = onClick || hover;

  return (
    <div
      className={cn(
        "glass-card",
        variantClasses[variant],
        glowClasses[glow],
        isInteractive && "glass-card--interactive",
        gradientBorder && "glass-gradient-border",
        gradientBorder && animatedBorder && "glass-gradient-border--animated",
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
