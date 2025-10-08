import { Pin, PinOff } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import type { QuickstartAction } from "../../config/quickstarts";
import { cn } from "../../lib/cn";

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

/**
 * Quickstart tile component with tap and long-press support
 * Implements Issue #105 - Startkacheln funktional machen
 */
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
      // Optional: Add haptic feedback
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

    // Only trigger tap if it wasn't a long press
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
    <button
      data-testid={`quickstart-${action.id}`}
      className={cn(
        "card-glass border-white/12 group relative flex min-h-[120px] flex-col items-center justify-center overflow-hidden rounded-2xl border px-4 py-4 text-center text-white shadow-[0_20px_55px_rgba(8,7,24,0.45)] transition-all duration-200",
        action.glow ?? "",
        isActive && "scale-95 opacity-70",
        isLoading && "pointer-events-none",
        !isLoading && "hover:scale-[1.02] active:scale-[0.98]",
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchCancel}
      disabled={isLoading}
      type="button"
    >
      {/* Gradient Background */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-25 transition-opacity",
          action.gradient,
          "group-hover:opacity-35",
        )}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/15 opacity-60 mix-blend-screen" />

      {/* Pin Badge */}
      {isPinned && (
        <div className="bg-accent-500/20 absolute right-2 top-2 rounded-full p-1">
          <Pin className="h-3 w-3 text-accent-500" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-2 text-2xl">{action.icon || "✨"}</div>
        <div className="text-sm font-medium text-white">{action.title}</div>
        <div className="mt-1 text-xs text-white/70 opacity-70">{action.subtitle}</div>
      </div>

      {/* Long Press Actions */}
      {showActions && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/80 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handlePinToggle}
            className="flex flex-col items-center gap-1 rounded-lg px-4 py-3 text-white transition-colors hover:bg-white/10"
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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
        </div>
      )}
    </button>
  );
}
