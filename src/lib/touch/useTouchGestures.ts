import { useCallback, useRef, useState } from "react";

export interface TouchGesture {
  onSwipeLeft?: (event: TouchEvent, distance: number) => void;
  onSwipeRight?: (event: TouchEvent, distance: number) => void;
  onSwipeUp?: (event: TouchEvent, distance: number) => void;
  onSwipeDown?: (event: TouchEvent, distance: number) => void;
  onLongPress?: (event: TouchEvent) => void;
  onDoubleTap?: (event: TouchEvent) => void;
  onTap?: (event: TouchEvent) => void;
}

export interface TouchGestureConfig {
  threshold?: number; // Minimum distance in pixels for swipe
  longPressDelay?: number; // Delay in ms for long press
  doubleTapDelay?: number; // Delay in ms for double tap
  enableHaptics?: boolean; // Enable haptic feedback
}

const DEFAULT_CONFIG: TouchGestureConfig = {
  threshold: 50,
  longPressDelay: 500,
  doubleTapDelay: 300,
  enableHaptics: true,
};

export function useTouchGestures(gestures: TouchGesture, config: TouchGestureConfig = {}) {
  const { threshold, longPressDelay, doubleTapDelay, enableHaptics } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [isLongPressActive, setIsLongPressActive] = useState(false);
  const longPressTimer = useRef<number>();
  const doubleTapTimer = useRef<number>();
  const lastTapTime = useRef<number>(0);

  const triggerHaptic = useCallback(
    (type: "light" | "medium" | "heavy" = "light") => {
      if (enableHaptics && "vibrate" in navigator && typeof navigator.vibrate === "function") {
        const patterns = {
          light: [10],
          medium: [50],
          heavy: [100],
        };
        navigator.vibrate(patterns[type]);
      }
    },
    [enableHaptics],
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0];
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      });

      // Long press detection
      longPressTimer.current = window.setTimeout(() => {
        setIsLongPressActive(true);
        gestures.onLongPress?.(event);
        triggerHaptic("medium");
      }, longPressDelay);

      // Double tap detection
      const now = Date.now();
      if (now - lastTapTime.current < doubleTapDelay) {
        gestures.onDoubleTap?.(event);
        triggerHaptic("light");
        clearTimeout(longPressTimer.current);
      }
      lastTapTime.current = now;
    },
    [gestures, longPressDelay, doubleTapDelay, triggerHaptic],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!touchStart) return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const distanceX = Math.abs(deltaX);
      const distanceY = Math.abs(deltaY);

      // Clear long press timer on movement
      if (distanceX > 10 || distanceY > 10) {
        clearTimeout(longPressTimer.current);
      }

      // Detect swipe direction
      if (distanceX > threshold && distanceY < threshold) {
        if (deltaX > 0 && gestures.onSwipeRight) {
          gestures.onSwipeRight(event, distanceX);
          triggerHaptic("light");
        } else if (deltaX < 0 && gestures.onSwipeLeft) {
          gestures.onSwipeLeft(event, distanceX);
          triggerHaptic("light");
        }
      } else if (distanceY > threshold && distanceX < threshold) {
        if (deltaY > 0 && gestures.onSwipeDown) {
          gestures.onSwipeDown(event, distanceY);
          triggerHaptic("light");
        } else if (deltaY < 0 && gestures.onSwipeUp) {
          gestures.onSwipeUp(event, distanceY);
          triggerHaptic("light");
        }
      }
    },
    [touchStart, threshold, gestures, triggerHaptic],
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (!touchStart) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const distanceX = Math.abs(deltaX);
      const distanceY = Math.abs(deltaY);

      // Clear long press timer
      clearTimeout(longPressTimer.current);

      // If no significant movement, it's a tap
      if (distanceX < threshold && distanceY < threshold) {
        gestures.onTap?.(event);
        triggerHaptic("light");
      }

      // Reset
      setTouchStart(null);
      setIsLongPressActive(false);
    },
    [touchStart, threshold, gestures, triggerHaptic],
  );

  const handleTouchCancel = useCallback(() => {
    clearTimeout(longPressTimer.current);
    setTouchStart(null);
    setIsLongPressActive(false);
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
    isLongPressActive,
  };
}
