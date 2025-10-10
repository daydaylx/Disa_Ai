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
}

const LONG_PRESS_DURATION = 500; // ms

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
        "glass-card-secondary group relative min-h-[120px] p-2 transition-all duration-200",
        isActive && "scale-95 opacity-70",
        isLoading && "pointer-events-none",
        !isLoading &&
          "hover:-translate-y-[1px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] active:scale-[0.98]",
      )}
    >
      <button
        data-testid={`quickstart-${action.id}`}
        className="flex h-full w-full flex-col items-center justify-center text-center text-white"
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
          <div className="glass-card-tertiary absolute right-2 top-2 rounded-full p-1">
            <Pin className="h-3 w-3 text-white" />
          </div>
        )}

        <div className="relative z-10 space-y-2">
          <div className="text-2xl">{action.icon || "✨"}</div>
          <div className="text-sm font-medium text-white">{action.title}</div>
          <div className="text-xs text-white/75">{action.subtitle}</div>
        </div>

        {showActions && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/80 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handlePinToggle}
              className="btn-outline flex flex-col items-center gap-1 px-4 py-3"
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
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-md">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </button>
    </div>
  );
}
