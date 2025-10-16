import { useRef } from "react";

interface SwipeGesture {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: SwipeOptions): SwipeGesture => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current || !e.touches[0]) return;

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    // Calculate the distance moved
    const diffX = touchX - touchStartX.current;
    const diffY = touchY - touchStartY.current;

    // Only consider horizontal swipes (minimize vertical scrolling conflicts)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX < 0 && onSwipeLeft) {
        // Swiping left
        onSwipeLeft();
      } else if (diffX > 0 && onSwipeRight) {
        // Swiping right
        onSwipeRight();
      }

      // Reset after swipe to prevent multiple triggers
      touchStartX.current = null;
      touchStartY.current = null;
    }
  };

  const onTouchEnd = () => {
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
