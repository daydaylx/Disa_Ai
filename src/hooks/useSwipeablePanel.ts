import { useEffect, useRef, useState } from "react";

export interface UseSwipeablePanelOptions {
  isOpen: boolean;
  onClose: () => void;
  initialHeight?: string;
  minHeightThreshold?: number; // Percentage of screen height (0-1)
  maxHeightPercentage?: number; // Percentage of screen height (0-1)
}

export interface UseSwipeablePanelReturn {
  sheetRef: React.RefObject<HTMLDivElement | null>;
  sheetHeight: string;
  isDragging: boolean;
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
}

/**
 * Custom hook for handling swipeable panel/bottom sheet gestures
 *
 * Features:
 * - Touch-based drag to expand/collapse
 * - Automatic height management
 * - Threshold-based closeIcon detection
 * - Smooth transitions with GPU acceleration
 *
 * @example
 * ```tsx
 * const { sheetRef, sheetHeight, isDragging, touchHandlers } = useSwipeablePanel({
 *   isOpen: true,
 *   onClose: () => setIsOpen(false),
 *   initialHeight: "85vh",
 * });
 *
 * return (
 *   <div ref={sheetRef} style={{ height: sheetHeight }} {...touchHandlers}>
 *     Panel content
 *   </div>
 * );
 * ```
 */
export function useSwipeablePanel({
  isOpen,
  onClose,
  initialHeight = "85vh",
  minHeightThreshold = 0.2,
  maxHeightPercentage = 0.9,
}: UseSwipeablePanelOptions): UseSwipeablePanelReturn {
  const [sheetHeight, setSheetHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);

  // Refs for touch handling
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartHeight = useRef<number>(0);

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartY.current = e.touches[0].clientY;
      if (sheetRef.current) {
        touchStartHeight.current = sheetRef.current.clientHeight;
      }
      setIsDragging(true);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY.current || !sheetRef.current || !e.touches[0]) return;

    const touchY = e.touches[0].clientY;
    const diffY = touchY - touchStartY.current;

    // Only expand/squeeze if swiping up/down
    if (Math.abs(diffY) > 10) {
      // Swipe down gesture - prepare to close
      if (diffY > 30) {
        const newHeight = Math.max(window.innerHeight * 0.1, touchStartHeight.current - diffY);
        setSheetHeight(`${newHeight}px`);
      } else if (diffY < -10) {
        // Swipe up - expand the sheet
        const newHeight = Math.min(
          window.innerHeight * maxHeightPercentage,
          touchStartHeight.current - diffY,
        );
        setSheetHeight(`${newHeight}px`);
      }
    }
  };

  const onTouchEnd = () => {
    if (touchStartY.current !== null) {
      touchStartY.current = null;

      // Calculate if the swipe was significant enough to close
      if (sheetRef.current) {
        const currentHeight = sheetRef.current.clientHeight;
        const minThreshold = window.innerHeight * minHeightThreshold;

        if (currentHeight < minThreshold) {
          onClose(); // Close if swiped down enough
        } else {
          // Reset to preferred height
          setSheetHeight(isOpen ? initialHeight : "0vh");
        }
      }
    }
    setIsDragging(false);
  };

  // Reset height when state changes
  useEffect(() => {
    setSheetHeight(isOpen ? initialHeight : "0vh");
  }, [isOpen, initialHeight]);

  // Handle hardware back button for Android
  useEffect(() => {
    if (!isOpen) return;

    const handleBackButton = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    window.addEventListener("popstate", handleBackButton);
    window.history.pushState({}, "");

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isOpen, onClose]);

  return {
    sheetRef,
    sheetHeight,
    isDragging,
    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
