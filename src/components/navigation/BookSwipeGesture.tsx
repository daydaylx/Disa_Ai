import { useDrag } from "@use-gesture/react";
import React from "react";

interface BookSwipeGestureProps {
  children: React.ReactNode;
  onSwipeLeft: () => void; // New Page
  onSwipeRight: () => void; // Go Back
  canSwipeRight: boolean;
  className?: string;
}

export function BookSwipeGesture({
  children,
  onSwipeLeft,
  onSwipeRight,
  canSwipeRight,
  className = "",
}: BookSwipeGestureProps) {
  // Configuration
  const SWIPE_THRESHOLD = 50; // px to trigger swipe
  const MAX_VERTICAL_DEVIATION = 30; // px to ignore if scrolling

  const bind = useDrag(
    ({ movement: [mx, my], active }) => {
      // Ignore if vertical movement is too high (scrolling)
      if (Math.abs(my) > MAX_VERTICAL_DEVIATION) return;

      // Ignore if user is selecting text (hacky check, but useful)
      if ((window.getSelection()?.toString().length ?? 0) > 0) return;

      // Trigger threshold logic
      if (!active) {
        // Gesture ended
        if (Math.abs(mx) > SWIPE_THRESHOLD) {
           if (mx < 0) {
             // Swipe Left (New Page)
             onSwipeLeft();
           } else if (mx > 0 && canSwipeRight) {
             // Swipe Right (Go Back)
             onSwipeRight();
           }
        }
      }
    },
    {
      filterTaps: true,
      rubberband: true,
    }
  );

  return (
    <div {...bind()} className={`touch-pan-y ${className}`}>
      {children}
    </div>
  );
}
