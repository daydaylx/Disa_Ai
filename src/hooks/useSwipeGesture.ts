import { useCallback, useEffect, useRef, useState } from "react";

import { hapticFeedback } from "@/lib/haptics";

export interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimale Distanz in px (default: 50)
  velocity?: number; // Minimale Geschwindigkeit (default: 0.3)
  enableHaptic?: boolean; // Haptic Feedback beim Trigger (default: true)
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export function useSwipeGesture(config: SwipeConfig) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocity = 0.3,
    enableHaptic = true,
  } = config;

  const touchStart = useRef<TouchPosition | null>(null);
  const touchEnd = useRef<TouchPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    touchEnd.current = null;
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch || !touchStart.current) return;

    const currentX = touch.clientX;
    const currentY = touch.clientY;

    // Berechne Drag-Offset für visuelles Feedback
    const offsetX = currentX - touchStart.current.x;
    const offsetY = currentY - touchStart.current.y;
    setDragOffset({ x: offsetX, y: offsetY });

    touchEnd.current = {
      x: currentX,
      y: currentY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    // Berechne Distanz
    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.time - touchStart.current.time;

    // Berechne Geschwindigkeit (px/ms)
    const velocityX = Math.abs(deltaX) / deltaTime;
    const velocityY = Math.abs(deltaY) / deltaTime;

    // Bestimme Swipe-Richtung
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Horizontale Swipe
    if (absX > absY && absX > threshold && velocityX > velocity) {
      if (deltaX > 0 && onSwipeRight) {
        if (enableHaptic) hapticFeedback("medium");
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        if (enableHaptic) hapticFeedback("medium");
        onSwipeLeft();
      }
    }

    // Vertikale Swipe
    else if (absY > absX && absY > threshold && velocityY > velocity) {
      if (deltaY > 0 && onSwipeDown) {
        if (enableHaptic) hapticFeedback("medium");
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        if (enableHaptic) hapticFeedback("medium");
        onSwipeUp();
      }
    }

    // Reset
    touchStart.current = null;
    touchEnd.current = null;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocity, enableHaptic]);

  // Return handlers und state
  return {
    // Touch event handlers für DOM-Element
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd, // Behandle Cancel wie End
    },
    // State für visuelles Feedback
    isDragging,
    dragOffset,
  };
}

/**
 * Alternative: Swipe-Gesture mit Ref (für bestehende Components)
 */
export function useSwipeGestureRef(config: SwipeConfig) {
  const elementRef = useRef<HTMLElement>(null);
  const { handlers } = useSwipeGesture(config);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    // Attach event listeners
    element.addEventListener("touchstart", handlers.onTouchStart);
    element.addEventListener("touchmove", handlers.onTouchMove);
    element.addEventListener("touchend", handlers.onTouchEnd);
    element.addEventListener("touchcancel", handlers.onTouchCancel);

    return () => {
      element.removeEventListener("touchstart", handlers.onTouchStart);
      element.removeEventListener("touchmove", handlers.onTouchMove);
      element.removeEventListener("touchend", handlers.onTouchEnd);
      element.removeEventListener("touchcancel", handlers.onTouchCancel);
    };
  }, [handlers]);

  return elementRef;
}
