import { Pin, PinOff } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import type { QuickstartAction } from "../../config/quickstarts";
import { useGlassPalette } from "../../hooks/useGlassPalette";
import { DEFAULT_GLASS_VARIANTS, type GlassTint, gradientToTint } from "../../lib/theme/glass";
import { cn } from "../../lib/utils";
import { StaticGlassCard } from "../ui/StaticGlassCard";

interface QuickstartTileProps {
  action: QuickstartAction;
  onTap: (action: QuickstartAction) => void;
  onLongPress?: (action: QuickstartAction) => void;
  onTogglePin?: (actionId: string) => void;
  isPinned?: boolean;
  isActive?: boolean;
  isLoading?: boolean;
  index?: number; // For generating consistent tints
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
  index = 0,
}: QuickstartTileProps) {
  const [showActions, setShowActions] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const palette = useGlassPalette();

  // Generate consistent tint for this tile
  const fallbackTint: GlassTint = gradientToTint(DEFAULT_GLASS_VARIANTS[0]!) ?? {
    from: "hsla(220, 26%, 28%, 0.9)",
    to: "hsla(220, 30%, 20%, 0.78)",
  };

  const getTintForIndex = (idx: number): GlassTint => {
    const gradients = palette.length > 0 ? palette : DEFAULT_GLASS_VARIANTS;
    const gradient = gradients[idx % gradients.length];
    if (!gradient) {
      return fallbackTint;
    }
    return gradientToTint(gradient) ?? fallbackTint;
  };

  const tileTint = getTintForIndex(index);

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
    <StaticGlassCard
      tint={tileTint}
      padding="sm"
      className={cn(
        "group relative min-h-[120px] transition-all duration-200",
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
        {/* Pin Badge */}
        {isPinned && (
          <div className="absolute right-2 top-2 rounded-full border border-white/20 bg-white/15 p-1 backdrop-blur-sm">
            <Pin className="h-3 w-3 text-white" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 space-y-2">
          <div className="text-2xl">{action.icon || "✨"}</div>
          <div className="text-sm font-medium text-white">{action.title}</div>
          <div className="text-xs text-white/75">{action.subtitle}</div>
        </div>

        {/* Long Press Actions */}
        {showActions && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/80 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handlePinToggle}
              className="flex flex-col items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
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
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-md">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </button>
    </StaticGlassCard>
  );
}
