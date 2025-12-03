import React, { useCallback, useEffect, useRef } from "react";

import { useBookNavigation } from "../../hooks/useBookNavigation";

interface SwipeHandlerProps {
  children: React.ReactNode;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

const MIN_SWIPE_DISTANCE = 60;
const MAX_VERTICAL_DEVIATION = 30;
const MIN_HORIZONTAL_DEVIATION = 40;

export function SwipeHandler({ children, onSwipeStart, onSwipeEnd }: SwipeHandlerProps) {
  const { startNewChat, goBack, swipeStack, activeChatId } = useBookNavigation();
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isSwipingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const canSwipeBack = useCallback(() => {
    if (!activeChatId) return false;
    const currentIndex = swipeStack.indexOf(activeChatId);
    return currentIndex !== -1 && currentIndex < swipeStack.length - 1;
  }, [activeChatId, swipeStack]);

  const canSwipeForward = useCallback(() => {
    // Always allow creating new chat
    return true;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Ignore touches on input elements and interactive elements
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "BUTTON" ||
      target.closest("button") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest('[role="button"]')
    ) {
      return;
    }

    if (e.touches.length === 0) return;

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    isSwipingRef.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || e.touches.length === 0) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // Check if we're still within vertical deviation limits
    if (deltaY > MAX_VERTICAL_DEVIATION) {
      touchStartRef.current = null;
      return;
    }

    // Only start tracking if we have minimum horizontal movement
    if (Math.abs(deltaX) >= MIN_HORIZONTAL_DEVIATION) {
      isSwipingRef.current = true;

      // Prevent default to avoid browser back/forward gestures
      if (Math.abs(deltaX) > 20) {
        e.preventDefault();
      }
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current || !isSwipingRef.current) return;

      if (e.changedTouches.length === 0) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Reset refs
      touchStartRef.current = null;
      isSwipingRef.current = false;

      // Validate swipe
      if (
        Math.abs(deltaX) < MIN_SWIPE_DISTANCE ||
        deltaY > MAX_VERTICAL_DEVIATION ||
        deltaTime > 500 // Max 500ms for a swipe
      ) {
        return;
      }

      // Determine swipe direction and trigger action
      if (deltaX < 0) {
        // Swipe left -> new chat
        if (canSwipeForward()) {
          onSwipeStart?.();
          setTimeout(() => {
            startNewChat(true);
            onSwipeEnd?.();
          }, 50);
        }
      } else if (deltaX > 0) {
        // Swipe right -> go back
        if (canSwipeBack()) {
          onSwipeStart?.();
          setTimeout(() => {
            goBack();
            onSwipeEnd?.();
          }, 50);
        }
      }
    },
    [canSwipeBack, canSwipeForward, startNewChat, goBack, onSwipeStart, onSwipeEnd],
  );

  // Mouse support for desktop testing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Ignore clicks on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "BUTTON" ||
      target.closest("button") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest('[role="button"]')
    ) {
      return;
    }

    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    isSwipingRef.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!touchStartRef.current || e.buttons !== 1) return;

    const deltaX = e.clientX - touchStartRef.current.x;
    const deltaY = Math.abs(e.clientY - touchStartRef.current.y);

    if (deltaY > MAX_VERTICAL_DEVIATION) {
      touchStartRef.current = null;
      return;
    }

    if (Math.abs(deltaX) >= MIN_HORIZONTAL_DEVIATION) {
      isSwipingRef.current = true;
    }
  }, []);

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!touchStartRef.current || !isSwipingRef.current) return;

      const deltaX = e.clientX - touchStartRef.current.x;
      const deltaY = Math.abs(e.clientY - touchStartRef.current.y);
      const deltaTime = Date.now() - touchStartRef.current.time;

      touchStartRef.current = null;
      isSwipingRef.current = false;

      if (
        Math.abs(deltaX) < MIN_SWIPE_DISTANCE ||
        deltaY > MAX_VERTICAL_DEVIATION ||
        deltaTime > 500
      ) {
        return;
      }

      if (deltaX < 0 && canSwipeForward()) {
        onSwipeStart?.();
        setTimeout(() => {
          startNewChat(true);
          onSwipeEnd?.();
        }, 50);
      } else if (deltaX > 0 && canSwipeBack()) {
        onSwipeStart?.();
        setTimeout(() => {
          goBack();
          onSwipeEnd?.();
        }, 50);
      }
    },
    [canSwipeBack, canSwipeForward, startNewChat, goBack, onSwipeStart, onSwipeEnd],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      touchStartRef.current = null;
      isSwipingRef.current = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ touchAction: "pan-y" }} // Allow vertical scrolling, disable horizontal
    >
      {children}
    </div>
  );
}
