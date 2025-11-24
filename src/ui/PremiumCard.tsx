import React from "react";

import { cn } from "@/lib/utils";

/**
 * PremiumCard - SIGNATURE COMPONENT für Disa AI Brand Identity
 *
 * Erkennungsmerkmale:
 * - Lila Accent-Strip am Top (3px mit Brand-Glow)
 * - Bevel-Highlight (Top-Left Lichtquelle)
 * - Material Depth (Shadow-Raise)
 * - Physical Hover-Feedback
 *
 * Dieses Design-Element macht Disa AI visuell einzigartig.
 */

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  variant?: "default" | "hero";
  withAccentStrip?: boolean;
  interactiveRole?: "button" | "group" | "presentation" | "none";
  focusable?: boolean;
}

export const PremiumCard = React.memo(
  ({
    children,
    className,
    onClick,
    onKeyDown,
    variant = "default",
    withAccentStrip = true,
    interactiveRole = "button",
    focusable = true,
  }: PremiumCardProps) => {
    const isHero = variant === "hero";
    const isInteractive = Boolean(onClick) && interactiveRole !== "none";
    const role = isInteractive ? interactiveRole : undefined;
    const tabIndex = isInteractive && focusable ? 0 : undefined;

    return (
      <div
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        className={cn(
          "relative overflow-hidden rounded-md transition-all duration-fast",
          // Material Depth
          isHero ? "shadow-raiseLg" : "shadow-raise",
          // Background + Bevel Highlight
          "bg-surface-2",
          "before:absolute before:inset-0 before:bg-bevel-highlight before:pointer-events-none before:opacity-80",
          // Hover State
          onClick && "cursor-pointer hover:shadow-raiseLg hover:-translate-y-0.5",
          // Active State
          onClick && "active:scale-[0.99] active:translate-y-0",
          // Focus
          onClick &&
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2",
          className,
        )}
      >
        {/* Accent Strip (SIGNATURE ELEMENT) */}
        {withAccentStrip && (
          <div
            className="absolute top-0 left-0 right-0 h-[var(--card-accent-strip-height)] bg-brand-gradient"
            style={{ boxShadow: "var(--card-accent-strip-glow)" }}
          />
        )}

        {/* Content mit Padding für Accent-Strip */}
        <div
          className={cn(
            "relative z-10",
            withAccentStrip && "pt-3 px-4 pb-4",
            !withAccentStrip && "p-4",
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);

PremiumCard.displayName = "PremiumCard";
