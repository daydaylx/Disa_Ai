import { useCallback, useEffect, useRef, useState } from "react";

interface UseStickToBottomOptions {
  threshold?: number; // 0.8 = scrolled to within 80% of bottom
  enabled?: boolean;
}

/**
 * Hook to manage stick-to-bottom behavior for chat lists
 * Automatically scrolls to bottom when new content appears,
 * but only if user is already near the bottom
 */
export function useStickToBottom(options: UseStickToBottomOptions = {}) {
  const { threshold = 0.8, enabled = true } = options;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSticking, setIsSticking] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const checkShouldStick = useCallback(() => {
    if (!enabled || !scrollRef.current) return false;

    const element = scrollRef.current;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const scrollableHeight = scrollHeight - clientHeight;

    if (scrollableHeight <= 0) return true; // No scrollable content

    const scrollPosition = scrollTop / scrollableHeight;
    const nearBottom = scrollPosition >= threshold;

    setIsSticking(nearBottom);
    setShouldAutoScroll(nearBottom);

    return nearBottom;
  }, [threshold, enabled]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior,
    });

    setIsSticking(true);
    setShouldAutoScroll(true);
  }, []);

  const scrollToBottomInstant = useCallback(() => {
    scrollToBottom("instant");
  }, [scrollToBottom]);

  // Auto-scroll when content changes and should stick
  useEffect(() => {
    if (!enabled || !shouldAutoScroll || !scrollRef.current) return;

    let rafId: number | null = null;

    const observer = new MutationObserver(() => {
      if (shouldAutoScroll && scrollRef.current) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (scrollRef.current) scrollToBottomInstant();
          rafId = null;
        });
      }
    });

    observer.observe(scrollRef.current, {
      childList: true,
      subtree: true,
      // Removed characterData: true - causes excessive callbacks during message streaming
      // We only need to track when new messages are added (childList), not character updates
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [enabled, shouldAutoScroll, scrollToBottomInstant]);

  // Handle scroll events
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
  }, [enabled, checkShouldStick]);

  return {
    scrollRef,
    isSticking,
    shouldAutoScroll,
    scrollToBottom,
    scrollToBottomInstant,
    checkShouldStick,
  };
}
