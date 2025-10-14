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
        "group relative min-h-[120px] rounded-base border border-border bg-surface-1 transition-all duration-200",
        isActive && "scale-95 opacity-70",
        isLoading && "pointer-events-none",
        !isLoading && "hover:-translate-y-[1px] active:scale-[0.98]",
      )}
    >
      <button
        data-testid={`quickstart-${action.id}`}
        className="flex h-full w-full flex-col items-center justify-center text-center text-text-0"
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
          <div className="absolute right-2 top-2 rounded-full bg-surface-2 p-1">
            <Pin className="h-3 w-3 text-text-0" />
          </div>
        )}

        <div className="relative z-10 space-y-2">
          <div className="text-2xl">{action.icon || "✨"}</div>
          <div className="text-sm font-medium text-text-0">{action.title}</div>
          <div className="text-xs text-text-1">{action.subtitle}</div>
        </div>

        {showActions && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-base bg-black/80"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handlePinToggle}
              className="flex flex-col items-center gap-1 rounded-base border border-border bg-surface-2 px-4 py-3 text-text-0 transition-all hover:scale-105 hover:bg-surface-1"
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
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-base bg-black/60">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-brand" />
          </div>
        )}
      </button>
    </div>
  );
}
