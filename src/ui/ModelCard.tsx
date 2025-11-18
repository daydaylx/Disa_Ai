import React from "react";

import { Zap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { MetricRow } from "@/ui/MetricRow";
import { MobileCard } from "@/ui/MobileCard";
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
      <MobileCard
        accent="green"
        className={cn("cursor-pointer space-y-4", className)}
        onClick={onCardClick}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <Typography
              variant="body"
              className="text-[var(--text-primary)] font-semibold truncate"
            >
              {name}
            </Typography>
            <Typography variant="body-xs" className="text-[var(--text-secondary)]">
              {vendor}
            </Typography>
          </div>

          {onToggleFavorite && (
            <Button
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite();
              }}
              variant={isFavorite ? "secondary" : "ghost"}
              size="icon"
              aria-label={isFavorite ? "Von Favoriten entfernen" : "Zu Favoriten hinzufügen"}
            >
              <span
                className={cn(
                  "text-lg",
                  isFavorite ? "text-[var(--aurora-orange-500)]" : "text-[var(--text-muted)]",
                )}
              >
                ★
              </span>
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <MetricRow label="Speed" value={speed} score={speed} color="green" />
          <MetricRow label="Quality" value={quality} score={quality} color="green" />
          <MetricRow label="Value" value={value} score={value} color="yellow" />
        </div>

        <div className="flex flex-wrap gap-2">
          {isFree ? (
            <Badge variant="secondary">
              <Zap className="mr-1 h-3 w-3" />
              FREE
            </Badge>
          ) : (
            <Badge variant="secondary">{price}</Badge>
          )}
          <Badge variant="secondary">{contextLength}</Badge>
          <Badge variant="secondary">Context</Badge>
        </div>
      </MobileCard>
    );
  },
);

ModelCardComponent.displayName = "ModelCard";

export const ModelCard = ModelCardComponent;
