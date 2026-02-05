import { useCallback, useRef } from "react";

import { hapticFeedback } from "@/lib/haptics";

export interface LongPressConfig {
  onLongPress: (event: React.TouchEvent | React.MouseEvent) => void;
  onClick?: (event: React.TouchEvent | React.MouseEvent) => void;
  delay?: number; // Zeit in ms bis Long-Press (default: 500)
  moveThreshold?: number; // Max erlaubte Bewegung in px (default: 10)
  enableHaptic?: boolean; // Haptic Feedback beim Long-Press (default: true)
}

interface Position {
  x: number;
  y: number;
}

export function useLongPress(config: LongPressConfig) {
  const { onLongPress, onClick, delay = 500, moveThreshold = 10, enableHaptic = true } = config;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startPosRef = useRef<Position | null>(null);
  const isLongPressRef = useRef(false);

  // Cleanup function
  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Start Long-Press Timer
  const handleStart = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      // Prevent default to avoid context menu on mobile
      if ("touches" in event) {
        event.preventDefault();
      }

      // Speichere Start-Position
      const position =
        "touches" in event
          ? { x: event.touches[0]!.clientX, y: event.touches[0]!.clientY }
          : { x: event.clientX, y: event.clientY };

      startPosRef.current = position;
      isLongPressRef.current = false;

      // Starte Timer
      timeoutRef.current = setTimeout(() => {
        isLongPressRef.current = true;

        // Haptic Feedback
        if (enableHaptic) {
          hapticFeedback("heavy");
        }

        // Trigger Long-Press
        onLongPress(event);
      }, delay);
    },
    [delay, onLongPress, enableHaptic],
  );

  // Check für Bewegung (Cancel Long-Press wenn zu viel Bewegung)
  const handleMove = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (!startPosRef.current) return;

      const currentPos =
        "touches" in event
          ? { x: event.touches[0]!.clientX, y: event.touches[0]!.clientY }
          : { x: event.clientX, y: event.clientY };

      const deltaX = Math.abs(currentPos.x - startPosRef.current.x);
      const deltaY = Math.abs(currentPos.y - startPosRef.current.y);

      // Wenn zu viel Bewegung: Cancel Long-Press
      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        clearTimer();
      }
    },
    [moveThreshold, clearTimer],
  );

  // End Handler
  const handleEnd = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      // Wenn Long-Press getriggert wurde: Kein onClick
      if (isLongPressRef.current) {
        clearTimer();
        return;
      }

      // Sonst: Normal Click
      clearTimer();
      if (onClick) {
        // Light haptic für normal click
        if (enableHaptic) {
          hapticFeedback("light");
        }
        onClick(event);
      }
    },
    [onClick, clearTimer, enableHaptic],
  );

  // Cancel Handler (z.B. Touch-Cancel)
  const handleCancel = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  return {
    // Event handlers für DOM-Element
    handlers: {
      // Touch events (Mobile)
      onTouchStart: handleStart,
      onTouchMove: handleMove,
      onTouchEnd: handleEnd,
      onTouchCancel: handleCancel,

      // Mouse events (Desktop)
      onMouseDown: handleStart,
      onMouseMove: handleMove,
      onMouseUp: handleEnd,
      onMouseLeave: handleCancel,
    },
    // State
    isLongPressing: isLongPressRef.current,
  };
}

/**
 * Wrapper für einfachere Nutzung ohne onClick
 */
export function useLongPressOnly(
  onLongPress: (event: React.TouchEvent | React.MouseEvent) => void,
  delay?: number,
) {
  return useLongPress({
    onLongPress,
    delay,
  });
}
