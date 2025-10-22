import { Pin, PinOff } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import type { QuickstartAction } from "../../config/quickstarts";
import { cn } from "../../lib/utils";

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
    <div
      className={cn(
        "border-border group relative min-h-[96px] overflow-hidden rounded-lg border transition-all duration-200",
        "bg-surface-card hover:-translate-y-[1px] active:scale-[0.98]",
        isActive && "scale-95 opacity-70",
        isLoading && "pointer-events-none",
      )}
    >
      <button
        data-testid={`quickstart-${action.id}`}
        className="text-text-0 relative z-10 flex h-full w-full flex-col items-center justify-center text-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchCancel}
        disabled={isLoading}
        type="button"
      >
        {isPinned && (
          <div className="border-border absolute right-2 top-2 rounded-full border bg-surface-raised p-1">
            <Pin className="text-text-0 h-3 w-3" />
          </div>
        )}

        <div className="relative z-10 space-y-1.5">
          <div className="text-xl">{action.icon || "✨"}</div>
          <div className="text-text-0 text-xs font-medium sm:text-sm">{action.title}</div>
          <div className="text-text-1 text-xs">{action.subtitle}</div>
        </div>

        {showActions && (
          <div
            className="border-border absolute inset-0 z-20 flex items-center justify-center rounded-lg border bg-overlay-dialog shadow-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handlePinToggle}
              className="border-border flex flex-col items-center gap-1 rounded-lg border bg-surface-raised px-4 py-3 text-text-primary transition-all hover:scale-105 hover:shadow-raised"
              type="button"
            >
              {isPinned ? (
                <>
                  <PinOff className="h-6 w-6" />
                  <span className="text-xs">Lösen</span>
                </>
              ) : (
                <>
                  <Pin className="h-6 w-6" />
                  <span className="text-xs">Anheften</span>
                </>
              )}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="border-border absolute inset-0 z-20 flex items-center justify-center rounded-lg border bg-overlay-dialog shadow-overlay">
            <div className="border-border border-t-brand h-6 w-6 animate-spin rounded-full border-2" />
          </div>
        )}
      </button>
    </div>
  );
}
