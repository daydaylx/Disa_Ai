import { Pin, PinOff } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import type { QuickstartAction } from "../../config/quickstarts";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "../ui/card";

interface QuickstartTileProps {
  action: QuickstartAction;
  onTap: (action: QuickstartAction) => void;
  onLongPress?: (action: QuickstartAction) => void;
  onTogglePin?: (actionId: string) => void;
  isPinned?: boolean;
  isActive?: boolean;
  isLoading?: boolean;
  index?: number;
}

const LONG_PRESS_DURATION = 500;

export function QuickstartTile({
  action,
  onTap,
  onLongPress,
  onTogglePin,
  isPinned = false,
  isActive = false,
  isLoading = false,
}: QuickstartTileProps) {
  const [showActions, setShowActions] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const handleTouchStart = useCallback(() => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setShowActions(true);
      onLongPress?.(action);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, LONG_PRESS_DURATION);
  }, [action, onLongPress]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (!isLongPressRef.current) {
      onTap(action);
    }
  }, [action, onTap]);

  const handleTouchCancel = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    isLongPressRef.current = false;
  }, []);

  const handlePinToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onTogglePin?.(action.id);
      setShowActions(false);
    },
    [action.id, onTogglePin],
  );

  return (
    <Card
      clickable
      elevation="raised"
      interactive="gentle"
      padding="md"
      state={isLoading ? "loading" : "default"}
      className={cn(
        "group relative min-h-[120px] overflow-hidden",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-base",
        isActive && "scale-95 opacity-70",
        isLoading && "pointer-events-none",
        "data-[state=selected]:ring-brand data-[state=selected]:ring-2 data-[state=selected]:shadow-glow-brand"
      )}
      onCardClick={() => onTap(action)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3 z-0">
        <div className="absolute -right-4 -top-4 text-6xl rotate-12">
          {action.icon || "✨"}
        </div>
      </div>

      <CardContent className="relative z-10 h-full flex flex-col justify-between items-center text-center">
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-card-small bg-brand/10 text-brand">
              <span className="text-lg">{action.icon || "✨"}</span>
            </div>
            {isPinned && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Pin className="h-3 w-3" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-title-sm text-text-strong line-clamp-1">
              {action.title}
            </h3>
            {action.subtitle && (
              <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                {action.subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 w-full">
          <div className="text-xs text-text-subtle text-center">
            {action.action || "Zum Starten tippen"}
          </div>
        </div>
      </CardContent>

      {/* Long Press Indicator */}
      {showActions && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-brand/5 border-2 border-brand/30 rounded-card"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handlePinToggle}
            className="flex flex-col items-center gap-1 rounded-card-inner bg-brand/10 px-4 py-3 text-brand transition-all hover:scale-105 hover:bg-brand/20"
            type="button"
          >
            {isPinned ? (
              <>
                <PinOff className="h-5 w-5" />
                <span className="text-xs">Lösen</span>
              </>
            ) : (
              <>
                <Pin className="h-5 w-5" />
                <span className="text-xs">Anheften</span>
              </>
            )}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-overlay-dialog/80">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      )}
    </Card>
  );
}
