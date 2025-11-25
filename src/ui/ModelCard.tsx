import React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/ui/Badge";
import { PremiumCard } from "@/ui/PremiumCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/Tooltip";

import { Info, Star } from "../lib/icons";

/**
 * ModelCard - Premium Material Design mit Unified Lila Metrics
 *
 * CHANGES:
 * - Nutzt PremiumCard (Signature-Komponente mit Lila-Strip)
 * - Unified Metric-Gradient (Lila statt bunte Farben)
 * - Premium Badge-Styling
 * - Physical Feedback
 */

interface ModelCardProps {
  name: string;
  vendor: string;
  quality: number;
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

const ModelCardComponent = React.memo(
  ({
    name,
    vendor,
    quality,
    contextScore,
    openness,
    isFree,
    price,
    contextLength,
    notes,
    isFavorite = false,
    isActive = false,
    onToggleFavorite,
    className,
    onCardClick,
  }: ModelCardProps) => {
    const metrics = [
      { label: "Qualität", val: quality },
      { label: "Kontext", val: contextScore },
      {
        label: "Offenheit",
        val: openness,
        tooltip:
          "Hohe Offenheit = weniger automatische Ablehnung. Faktencheck bleibt trotzdem aktiv.",
      },
    ];

    return (
      <div className={cn("relative group", className)}>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Favorit entfernen" : "Als Favorit markieren"}
            className={cn(
              "absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-transparent transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2",
              isFavorite
                ? "bg-brand/10 text-brand shadow-brandGlow"
                : "bg-surface-1/80 text-text-muted hover:text-brand hover:border-brand/40 hover:shadow-raise",
            )}
          >
            <Star className={cn("h-4 w-4", isFavorite && "fill-brand")} />
          </button>
        )}

        <PremiumCard
          onClick={onCardClick}
          className={cn("group h-full", isActive && "ring-2 ring-brand shadow-raiseLg")}
        >
          <TooltipProvider>
            <div className="space-y-3">
              {/* Row 1: Name + Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-text-primary truncate">{name}</h3>
                  <p className="text-xs text-text-muted font-medium uppercase tracking-wider mt-0.5">
                    {vendor}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isActive && (
                    <Badge
                      variant="secondary"
                      className="text-[11px] font-semibold bg-brand/10 text-brand border-brand/40"
                    >
                      Aktiv
                    </Badge>
                  )}
                  {isFavorite && (
                    <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center">
                      <Star className="h-3 w-3 fill-brand text-brand" />
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "px-2 py-0.5 text-xs font-semibold rounded-sm shadow-raise",
                      isFree
                        ? "bg-accent-secondary/15 text-accent-secondary"
                        : "bg-brand/15 text-brand-bright",
                    )}
                  >
                    {isFree ? "FREE" : price}
                  </Badge>
                </div>
              </div>

              {/* Row 2: Metrics */}
              <div className="space-y-2 bg-surface-inset shadow-inset p-3 rounded-md">
                {metrics.map(({ label, val, tooltip }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1 w-16 flex-shrink-0">
                      <span className="text-xs font-medium text-text-secondary">{label}</span>
                      {tooltip && (
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-text-muted" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[220px] text-xs">
                            {tooltip}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <div
                      className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--metric-gradient-bg)" }}
                    >
                      <div
                        className="h-full rounded-full bg-metric-gradient transition-all duration-300 shadow-brandGlow"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-text-primary w-10 text-right flex-shrink-0">
                      {Math.round(val)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Row 3: Context Length */}
              <div className="flex items-center pt-1">
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-1 bg-surface-1 shadow-raise rounded-sm"
                >
                  Kontext: {contextLength}
                </Badge>
              </div>

              {notes && <p className="text-xs text-text-secondary leading-snug">{notes}</p>}
            </div>
          </TooltipProvider>
        </PremiumCard>
      </div>
    );
  },
);

ModelCardComponent.displayName = "ModelCard";

export const ModelCard = ModelCardComponent;
