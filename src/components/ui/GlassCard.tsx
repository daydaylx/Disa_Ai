import * as React from "react";

import type { GlassTint } from "@/lib/theme/glass";
import { cn } from "@/lib/utils";

export type GlassCardVariant = "primary" | "secondary" | "tertiary" | "mesh";

export interface GlassCardProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Visual variant determining glass intensity
   * - primary: Main interactive tiles (Quickstart, Actions)
   * - secondary: Navigation, Sidebars
   * - tertiary: Badges, Pills, Subtle accents
   */
  variant?: GlassCardVariant;
  /** Optional padding size */
  padding?: "none" | "sm" | "md" | "lg";
  /** Optional tint gradient overlay */
  tint?: GlassTint;
  /** Tint opacity (0-1) */
  tintOpacity?: number;
  /** Enable hover glow effect */
  hoverGlow?: boolean;
}

const variantClasses: Record<GlassCardVariant, string> = {
  primary: "glass-card-primary",
  secondary: "glass-card-secondary",
  tertiary: "glass-card-tertiary",
  mesh: "glass-card-mesh",
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Unified GlassCard component with hierarchical variants
 *
 * Replaces: GlassTile, StaticGlassCard, and various ad-hoc implementations
 *
 * @example
 * // Primary interactive tile
 * <GlassCard variant="primary" padding="md">
 *   <h3>Action Tile</h3>
 * </GlassCard>
 *
 * @example
 * // Secondary navigation card
 * <GlassCard variant="secondary" padding="sm">
 *   <NavContent />
 * </GlassCard>
 *
 * @example
 * // Tertiary badge with tint
 * <GlassCard variant="tertiary" tint={myTint} tintOpacity={0.2}>
 *   <Badge />
 * </GlassCard>
 */
export function GlassCard({
  variant = "primary",
  padding = "md",
  tint,
  tintOpacity = 0.15,
  hoverGlow = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  const tintStyle = tint
    ? {
        background: `linear-gradient(135deg, ${tint.from} 0%, ${tint.to} 100%)`,
        opacity: tintOpacity,
      }
    : undefined;

  const hoverGlowClass = hoverGlow
    ? {
        primary: "glass-hover-glow-primary",
        secondary: "glass-hover-glow-secondary",
        tertiary: "glass-hover-glow-tertiary",
        mesh: "glass-hover-glow-primary", // Mesh uses primary glow
      }[variant]
    : "";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300",
        variantClasses[variant],
        paddingClasses[padding],
        hoverGlowClass,
        className,
      )}
      {...props}
    >
      {/* Optional tint gradient overlay */}
      {tint && variant !== "mesh" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
          style={tintStyle}
        />
      )}

      {/* Content container - positioned above ::before/::after layers */}
      <div className={variant === "mesh" ? "relative z-[2]" : "glass-content"}>{children}</div>
    </div>
  );
}
