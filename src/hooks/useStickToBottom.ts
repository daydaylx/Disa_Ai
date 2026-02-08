import { type MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

interface UseStickToBottomOptions {
  threshold?: number; // 0.8 = scrolled to within 80% of bottom
  enabled?: boolean;
  containerRef?: MutableRefObject<HTMLDivElement | null>;
}

/**
 * Hook to manage stick-to-bottom behavior for chat lists
 * Automatically scrolls to bottom when new content appears,
 * but only if user is already near the bottom
 */
export function useStickToBottom(options: UseStickToBottomOptions = {}) {
  const { threshold = 150, enabled = true, containerRef } = options; // threshold in pixels now
  const internalRef = useRef<HTMLDivElement>(null);
  const scrollRef: MutableRefObject<HTMLDivElement | null> = containerRef ?? internalRef;
  const [isSticking, setIsSticking] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkShouldStick = useCallback(() => {
    if (!enabled || !scrollRef.current) return false;

    const element = scrollRef.current;
    const { scrollTop, scrollHeight, clientHeight } = element;

    // Calculate distance from bottom
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Consider "sticking" if we are within the threshold (pixels)
    // Using a pixel threshold is often more reliable than a percentage for long lists
    const nearBottom = distanceFromBottom <= threshold;

    setIsSticking(nearBottom);
    setShouldAutoScroll(nearBottom);

    return nearBottom;
  }, [enabled, scrollRef, threshold]);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      if (!scrollRef.current) return;

      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });

      setIsSticking(true);
      setShouldAutoScroll(true);
    },
    [scrollRef],
  );

  const scrollToBottomInstant = useCallback(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  // Throttled auto-scroll function
  const throttleScroll = useCallback(() => {
    if (!shouldAutoScroll || !scrollRef.current) return;

    if (throttleTimeoutRef.current) return;

    throttleTimeoutRef.current = setTimeout(() => {
      if (scrollRef.current && shouldAutoScroll) {
        // Use auto scrolling for updates to avoid "fighting" the animation
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "auto",
        });
      }
      throttleTimeoutRef.current = null;
    }, 100); // 100ms throttle
  }, [shouldAutoScroll, scrollRef]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll when content changes and should stick
  useEffect(() => {
    if (!enabled || !shouldAutoScroll || !scrollRef.current) return;

    const observer = new MutationObserver(() => {
      // If we are supposed to stick, scroll down
      // We throttle this to avoid excessive layout thrashing
      if (shouldAutoScroll) {
        throttleScroll();
      }
    });

    observer.observe(scrollRef.current, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [enabled, scrollRef, shouldAutoScroll, throttleScroll]);

  // Handle scroll events to update stickiness state
  useEffect(() => {
    if (!enabled || !scrollRef.current) return;

    const element = scrollRef.current;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkShouldStick();
          ticking = false;
        });
        ticking = true;
      }
    };

    element.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    checkShouldStick();

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [checkShouldStick, enabled, scrollRef]);

  return {
    scrollRef,
    isSticking,
    shouldAutoScroll,
    scrollToBottom,
    scrollToBottomInstant,
    checkShouldStick,
  };
}
