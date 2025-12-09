import React from "react";

import { getCategoryStyle } from "@/lib/categoryColors";
import { Star } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/Badge";

/**
 * ModelCard - Refactored to SimpleModelRow
 * Minimalist, calm, functional.
 */

interface ModelCardProps {
  name: string;
  vendor: string;
  quality: number; // kept for compatibility, displayed as simple metric if high
  contextScore: number;
  openness: number;
  isFree: boolean;
  price: string;
  contextLength: string;
  notes?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isActive?: boolean;
  className?: string;
  onCardClick?: () => void;
}

export const ModelCard = React.memo(
  ({
    name,
    vendor,
    isFree,
    price,
    contextLength,
    isFavorite = false,
    isActive = false,
    onToggleFavorite,
    className,
    onCardClick,
  }: ModelCardProps) => {
    // Use 'expert' (Cyan) for free models, 'business' (Indigo) for premium models
    const theme = getCategoryStyle(isFree ? "expert" : "business");

    return (
      <div
        onClick={onCardClick}
        className={cn(
          "group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
          // Active State
          isActive
            ? cn("bg-surface-2 ring-1", theme.border, theme.glow)
            : cn("bg-surface-1 border-border-ink hover:bg-surface-2", `hover:${theme.border}`),
          className,
        )}
      >
        {/* Left: Visual Anchor (Icon Placeholder or Vendor Logo) */}
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg font-bold transition-colors",
            isActive
              ? cn(theme.bg, theme.text, theme.border)
              : cn(
                  "bg-surface-2 text-ink-secondary border-border-ink",
                  `group-hover:${theme.text}`,
                  `group-hover:${theme.border}`,
                ),
          )}
        >
          {name.charAt(0).toUpperCase()}
        </div>

        {/* Center: Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-medium truncate transition-colors",
                isActive ? theme.text : "text-ink-primary group-hover:text-ink-primary",
              )}
            >
              {name}
            </span>
            {isActive && (
              <span
                className={cn(
                  "flex h-1.5 w-1.5 rounded-full shadow-sm",
                  theme.text.replace("text-", "bg-"),
                )}
              />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-tertiary">
            <span className="truncate">{vendor}</span>
            <span>•</span>
            <span>{contextLength}</span>
          </div>
        </div>

        {/* Right: Meta & Action */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <Badge
            variant={isFree ? "success" : "secondary"}
            className={cn("text-[10px] h-5 px-1.5", !isFree && cn(theme.badge, theme.badgeText))}
          >
            {isFree ? "Free" : price}
          </Badge>

          {/* Favorite (Only visible if faved or group hover) */}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={cn(
                "transition-opacity p-1",
                isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100 md:opacity-0", // Always show on mobile if desired, or use opacity logic
              )}
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  isFavorite
                    ? "fill-accent-secondary text-accent-secondary"
                    : "text-ink-tertiary hover:text-ink-primary",
                )}
              />
            </button>
          )}
        </div>
      </div>
    );
  },
);

ModelCard.displayName = "ModelCard";
