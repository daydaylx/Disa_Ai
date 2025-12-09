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

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isActive) return;
      const card = e.currentTarget;
      const icon = card.querySelector(".theme-icon") as HTMLElement;

      card.style.borderColor = theme.border;

      if (icon) {
        icon.style.color = theme.text;
        icon.style.borderColor = theme.border;
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isActive) return;
      const card = e.currentTarget;
      const icon = card.querySelector(".theme-icon") as HTMLElement;

      card.style.borderColor = "";

      if (icon) {
        icon.style.color = "";
        icon.style.borderColor = "";
      }
    };

    return (
      <div
        onClick={onCardClick}
        className={cn(
          "group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
          isActive ? "bg-surface-2 ring-1" : "bg-surface-1 border-border-ink hover:bg-surface-2",
          className,
        )}
        style={
          isActive
            ? {
                borderColor: theme.border,
                boxShadow: theme.glow,
              }
            : undefined
        }
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left: Visual Anchor (Icon Placeholder or Vendor Logo) */}
        <div
          className={cn(
            "theme-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg font-bold transition-colors",
            isActive ? "" : "bg-surface-2 text-ink-secondary border-border-ink",
          )}
          style={
            isActive
              ? {
                  backgroundColor: theme.bg,
                  color: theme.text,
                  borderColor: theme.border,
                }
              : undefined
          }
        >
          {name.charAt(0).toUpperCase()}
        </div>

        {/* Center: Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-medium truncate transition-colors",
                isActive ? "" : "text-ink-primary group-hover:text-ink-primary",
              )}
              style={isActive ? { color: theme.text } : undefined}
            >
              {name}
            </span>
            {isActive && (
              <span
                className="flex h-1.5 w-1.5 rounded-full shadow-sm"
                style={{ backgroundColor: theme.text }}
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
            className="text-[10px] h-5 px-1.5"
            style={
              !isFree
                ? {
                    backgroundColor: theme.badge,
                    color: theme.badgeText,
                  }
                : undefined
            }
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
                isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100 md:opacity-0",
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
