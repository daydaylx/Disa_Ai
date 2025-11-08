import { Pin, PinOff } from "../../lib/icons";
import { useCallback, useState } from "react";

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

// const LONG_PRESS_DURATION = 500; // For future touch interaction implementation

export function QuickstartTile({
  action,
  onTap,
  // onLongPress, // For future touch interaction implementation
  onTogglePin,
  isPinned = false,
  isActive = false,
  isLoading = false,
}: QuickstartTileProps) {
  const [showActions, setShowActions] = useState(false);
  // const longPressTimerRef = useRef<NodeJS.Timeout | null>(null); // For future touch interaction
  // const isLongPressRef = useRef(false); // For future touch interaction

  // Touch handlers for future implementation
  // const handleTouchStart = useCallback(() => {
  //   isLongPressRef.current = false;
  //   longPressTimerRef.current = setTimeout(() => {
  //     isLongPressRef.current = true;
  //     setShowActions(true);
  //     onLongPress?.(action);
  //     if (navigator.vibrate) {
  //       navigator.vibrate(50);
  //     }
  //   }, LONG_PRESS_DURATION);
  // }, [action, onLongPress]);

  // const handleTouchEnd = useCallback(() => {
  //   if (longPressTimerRef.current) {
  //     clearTimeout(longPressTimerRef.current);
  //     longPressTimerRef.current = null;
  //   }

  //   if (!isLongPressRef.current) {
  //     onTap(action);
  //   }
  // }, [action, onTap]);

  // const handleTouchCancel = useCallback(() => {
  //   if (longPressTimerRef.current) {
  //     clearTimeout(longPressTimerRef.current);
  //     longPressTimerRef.current = null;
  //   }
  //   isLongPressRef.current = false;
  // }, []);

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
      elevation="medium"
      interactive="gentle"
      padding="md"
      state={isLoading ? "loading" : "default"}
      className={cn(
        "group relative min-h-[120px] overflow-hidden",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-base",
        isActive && "scale-95 opacity-70",
        isLoading && "pointer-events-none",
        "data-[state=selected]:ring-brand data-[state=selected]:shadow-glow-brand data-[state=selected]:ring-2",
      )}
      onCardClick={() => onTap(action)}
    >
      {/* Background Pattern */}
      <div className="opacity-3 absolute inset-0 z-0">
        <div className="absolute -right-4 -top-4 rotate-12 text-6xl">{action.icon || "✨"}</div>
      </div>

      <CardContent className="relative z-10 flex h-full flex-col items-center justify-between text-center">
        <div className="w-full space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="rounded-card-small bg-brand/10 text-brand flex h-8 w-8 items-center justify-center">
              <span className="text-lg">{action.icon || "✨"}</span>
            </div>
            {isPinned && (
              <div className="bg-brand/10 text-brand flex h-5 w-5 items-center justify-center rounded-full">
                <Pin className="h-3 w-3" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-title-sm text-text-strong line-clamp-1 font-semibold">
              {action.title}
            </h3>
            {action.subtitle && (
              <p className="line-clamp-2 text-xs leading-relaxed text-text-muted">
                {action.subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="w-full pt-2">
          <div className="text-text-subtle text-center text-xs">
            {action.subtitle || "Zum Starten tippen"}
          </div>
        </div>
      </CardContent>

      {/* Long Press Indicator */}
      {showActions && (
        <div
          className="bg-brand/5 border-brand/30 rounded-card absolute inset-0 z-20 flex items-center justify-center border-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handlePinToggle}
            className="rounded-card-inner bg-brand/10 text-brand hover:bg-brand/20 flex flex-col items-center gap-1 px-4 py-3 transition-all hover:scale-105"
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
        <div className="bg-overlay-dialog/80 absolute inset-0 z-20 flex items-center justify-center">
          <div className="border-brand h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      )}
    </Card>
  );
}
