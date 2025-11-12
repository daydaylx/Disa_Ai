import * as React from "react";

import { cn } from "../../lib/utils";
import { Card } from "./card";

export interface TileCardProps {
  /** Icon element to display (e.g., <Brain className="h-8 w-8" />) */
  icon?: React.ReactNode;

  /** Main title */
  title: string;

  /** Optional description */
  description?: string;

  /** Click handler */
  onClick?: () => void;

  /** Custom className */
  className?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Badge/tag to display in top-right corner */
  badge?: React.ReactNode;

  /** Aspect ratio (default: "square" = 1:1) */
  aspectRatio?: "square" | "video" | "auto";

  /** Icon position (default: "top") */
  iconPosition?: "top" | "left";
}

/**
 * TileCard - Einheitliche Kachel-Komponente für Grid-Layouts (Start/Hub)
 *
 * Features:
 * - Einheitliche Höhen durch Aspect-Ratio
 * - Konsistente Icon-Platzierung
 * - Glassmorphism-Styling
 * - Hover-States mit Elevation
 * - Touch-friendly (min 44px height)
 *
 * @example
 * ```tsx
 * <TileCard
 *   icon={<Brain className="h-8 w-8 text-accent" />}
 *   title="Research"
 *   description="Tiefe Recherchen, Quellencheck"
 *   onClick={() => navigate('/research')}
 * />
 * ```
 */
export function TileCard({
  icon,
  title,
  description,
  onClick,
  className,
  disabled = false,
  badge,
  aspectRatio = "square",
  iconPosition = "top",
}: TileCardProps) {
  const aspectRatioClass =
    aspectRatio === "square" ? "aspect-square" : aspectRatio === "video" ? "aspect-video" : "";

  return (
    <Card
      tone="glass-primary"
      elevation="surface"
      padding="md"
      interactive="gentle"
      clickable={!!onClick}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col transition-all duration-200",
        aspectRatioClass,
        iconPosition === "left" && "flex-row items-center gap-4",
        className,
      )}
      data-testid="tile-card"
    >
      {/* Badge in top-right corner */}
      {badge && (
        <div className="absolute right-3 top-3" data-testid="tile-card-badge">
          {badge}
        </div>
      )}

      {/* Icon */}
      {icon && (
        <div
          className={cn(
            "flex-shrink-0 text-accent",
            iconPosition === "top" ? "mb-3" : "mb-0",
          )}
          data-testid="tile-card-icon"
        >
          {icon}
        </div>
      )}

      {/* Content */}
      <div className={cn("flex flex-1 flex-col", iconPosition === "top" ? "gap-2" : "gap-1")}>
        <h3
          className="text-base font-semibold leading-tight text-text-primary line-clamp-2"
          data-testid="tile-card-title"
        >
          {title}
        </h3>

        {description && (
          <p
            className="text-sm text-text-secondary line-clamp-3"
            data-testid="tile-card-description"
          >
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}
