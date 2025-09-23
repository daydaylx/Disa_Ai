import * as React from "react";

import { cn } from "../../lib/cn";

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
  | "depth-4"
  | "soft"
  | "medium"
  | "ultra"
  | "panel"
  | "floating"
  | "modal";
export type GlassGlow = "none" | "cyan" | "purple" | "mint" | "warm";
export type GlassTint = "none" | "cyan" | "purple" | "mint" | "warm";

interface GlassCardProps {
  children: React.ReactNode;
  variant?: GlassVariant;
  glow?: GlassGlow;
  tint?: GlassTint;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  interactive?: boolean;
  gradientBorder?: boolean;
  animatedBorder?: boolean;
  enhanced?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

const variantClasses: Record<GlassVariant, string> = {
  default: "glass-backdrop",
  strong: "glass-backdrop--strong",
  subtle: "glass-bg--subtle",
  soft: "glass-bg--soft",
  medium: "glass-bg--medium",
  ultra: "glass-bg--ultra",
  elevated: "glass-backdrop shadow-2xl",
  adaptive: "glass-adaptive",
  frosted: "glass-frosted",
  panel: "glass-panel",
  floating: "glass-panel glass-panel--floating",
  modal: "glass-modal",
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

const tintClasses: Record<GlassTint, string> = {
  none: "",
  cyan: "glass-tint--cyan",
  purple: "glass-tint--purple",
  mint: "glass-tint--mint",
  warm: "glass-tint--warm",
};

export function GlassCard({
  children,
  variant = "default",
  glow = "none",
  tint = "none",
  className,
  onClick,
  hover = false,
  interactive = false,
  gradientBorder = false,
  animatedBorder = false,
  enhanced = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: GlassCardProps) {
  const isInteractive = onClick || hover || interactive;

  return (
    <div
      className={cn(
        "glass-card",
        variantClasses[variant],
        glowClasses[glow],
        tintClasses[tint],
        isInteractive && "glass-interactive",
        enhanced && "glass-card--enhanced-hover",
        gradientBorder && "glass-gradient-border",
        gradientBorder && animatedBorder && "glass-gradient-border--animated",
        "glass-hardware-accel",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {children}
    </div>
  );
}
