import React from "react";

import { Zap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { MetricRow } from "@/ui/MetricRow";
import { Typography } from "@/ui/Typography";

// ModelCard Component
interface ModelCardProps {
  name: string;
  vendor: string;
  speed: number;
  quality: number;
  value: number;
  isFree: boolean;
  price: string;
  contextLength: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  className?: string;
  onCardClick?: () => void;
}

const ModelCardComponent = React.memo(
  ({
    name,
    vendor,
    speed,
    quality,
    value,
    isFree,
    price,
    contextLength,
    isFavorite = false,
    onToggleFavorite,
    className,
    onCardClick,
  }: ModelCardProps) => {
    return (
      <Card
        className={cn(
          "rounded-[var(--radius-2xl)] group",
          // Aurora Premium Glass with Green-to-Lila Transition
          "bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)]",
          "border border-[var(--glass-border-medium)] shadow-[var(--shadow-glow-green)]",
          "hover:shadow-[var(--shadow-glow-lila)] hover:border-[var(--glass-border-aurora)]",
          "hover:-translate-y-1 transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
          className,
        )}
        onClick={onCardClick}
      >
        {/* Oben: Name + Provider + Favorite-Icon */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <Typography variant="body" className="text-[var(--text-primary)] font-medium truncate">
              {name}
            </Typography>
            <Typography variant="body-xs" className="text-[var(--text-secondary)] mt-0.5">
              {vendor}
            </Typography>
          </div>

          {onToggleFavorite && (
            <Button
              onClick={onToggleFavorite}
              className={cn(
                // Aurora Glass Button
                "p-[var(--space-xs)] rounded-[var(--radius-md)]",
                "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
                "border border-[var(--glass-border-subtle)]",
                "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
                "hover:bg-[var(--glass-surface-medium)] hover:scale-105 active:scale-95",
                "min-h-[var(--touch-target-compact)] min-w-[var(--touch-target-compact)]",
                "select-none touch-manipulation",
                isFavorite
                  ? "text-[var(--aurora-orange-500)] hover:text-[var(--aurora-orange-400)] shadow-[var(--shadow-glow-orange)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
              )}
              aria-label={isFavorite ? "Von Favoriten entfernen" : "Zu Favoriten hinzufügen"}
            >
              ★
            </Button>
          )}
        </div>

        {/* Mitte: 3x MetricRow */}
        <div className="space-y-2">
          <MetricRow label="Speed" value={speed} score={speed} color="green" />
          <MetricRow label="Quality" value={quality} score={quality} color="green" />
          <MetricRow label="Value" value={value} score={value} color="yellow" />
        </div>

        {/* Unten: Chips */}
        <div className="flex flex-wrap gap-2">
          {isFree ? (
            <Badge variant="secondary">
              <Zap className="w-3 h-3 mr-1" />
              FREE
            </Badge>
          ) : (
            <Badge variant="secondary">{price}</Badge>
          )}
          <Badge variant="secondary">{contextLength}</Badge>
          <Badge variant="secondary">Context</Badge>
        </div>
      </Card>
    );
  },
);

ModelCardComponent.displayName = "ModelCard";

export const ModelCard = ModelCardComponent;
