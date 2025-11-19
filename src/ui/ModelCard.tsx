import { Star } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { GlassCard } from "@/ui/GlassCard";
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
      <GlassCard
        className={cn("cursor-pointer group transition-transform hover:scale-105", className)}
        onClick={onCardClick}
      >
        <div className="space-y-2.5">
          {/* Row 1: Name + Badges */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 mr-2">
              <h3 className="text-sm font-semibold text-text-primary truncate">{name}</h3>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {isFavorite && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 px-1 py-0.5 text-xs">
                  ⭐
                </Badge>
              )}
              <Badge
                variant="secondary"
                className={cn(
                  "px-1 py-0.5 text-xs font-medium",
                  isFree
                    ? "bg-green-500/20 text-green-600"
                    : "bg-blue-500/20 text-blue-600"
                )}
              >
                {isFree ? "FREE" : price}
              </Badge>
            </div>
          </div>

          {/* Row 2: Provider */}
          <p className="text-xs text-text-secondary font-medium uppercase tracking-wide">
            {vendor}
          </p>

          {/* Row 3: Horizontal bars - kompakter */}
          <div className="space-y-1.5">
            {[
              { label: 'Speed', val: speed, color: 'bg-green-500' },
              { label: 'Quality', val: quality, color: 'bg-blue-500' },
              { label: 'Value', val: value, color: 'bg-orange-500' }
            ].map(({label, val, color}) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs font-medium text-text-secondary w-11 flex-shrink-0">
                  {label}
                </span>
                <div className="flex-1 h-1 bg-surface-panel/50 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      color
                    )}
                    style={{width: `${val}%`}}
                  />
                </div>
                <span className="text-xs font-semibold text-text-primary w-6 text-right flex-shrink-0">
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Row 4: Chips & Favorite Action */}
          <div className="flex items-center justify-between pt-1">
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-[var(--glass-border-soft)]">
              {contextLength}
            </Badge>

            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className="p-0.5 rounded text-text-secondary hover:text-yellow-500 transition-colors"
              >
                <Star
                  className={cn(
                    "h-3.5 w-3.5",
                    isFavorite && "fill-yellow-500 text-yellow-500"
                  )}
                />
              </button>
            )}
          </div>
        </div>
      </GlassCard>
    );
  },
);

ModelCardComponent.displayName = "ModelCard";

export const ModelCard = ModelCardComponent;
