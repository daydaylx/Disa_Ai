import { useCallback, useEffect, useRef, useState } from "react";

import { hapticFeedback } from "@/lib/haptics";
import { RefreshCw } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number; // Pull-Distanz zum Triggern (default: 80px)
  maxPullDistance?: number; // Maximale Pull-Distanz (default: 120px)
  disabled?: boolean;
  className?: string;
}

/**
 * Pull-to-Refresh Komponente für Mobile
 *
 * Wraps Content und ermöglicht Pull-Down zum Aktualisieren.
 * Visuelles Feedback mit Spinner und Text.
 *
 * @example
 * <PullToRefresh onRefresh={async () => await loadData()}>
 *   <div>Content</div>
 * </PullToRefresh>
 */
export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  maxPullDistance = 120,
  disabled = false,
  className,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [status, setStatus] = useState<"idle" | "pulling" | "ready" | "refreshing">("idle");

  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wasAtTopOnStart = useRef(false); // Track if we started at top
  const lastScrollTop = useRef(0); // Track scroll position
  const scrollVelocity = useRef(0); // Track scroll velocity

  // Check ob an top-position
  const isAtTop = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    return container.scrollTop === 0;
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled) return;

      const container = containerRef.current;
      if (!container) return;

      // Capture initial state
      startY.current = e.touches[0]?.clientY ?? 0;
      wasAtTopOnStart.current = container.scrollTop === 0;
      lastScrollTop.current = container.scrollTop;
      scrollVelocity.current = 0;

      // Only activate pulling if we're actually at top
      if (wasAtTopOnStart.current) {
        setStatus("pulling");
      }
    },
    [disabled],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (disabled || status === "refreshing") return;

      // Only allow pull-to-refresh if we started at top
      if (!wasAtTopOnStart.current) return;

      const container = containerRef.current;
      if (!container) return;

      const currentY = e.touches[0]?.clientY ?? 0;
      const deltaY = currentY - startY.current;

      // Track scroll velocity to detect active scrolling
      const currentScrollTop = container.scrollTop;
      scrollVelocity.current = Math.abs(currentScrollTop - lastScrollTop.current);
      lastScrollTop.current = currentScrollTop;

      // If user has scrolled down (not at top anymore) or is actively scrolling, cancel pull
      if (currentScrollTop > 5 || scrollVelocity.current > 2) {
        // User scrolled away from top - cancel pull gesture
        if (status === "pulling" || status === "ready") {
          setStatus("idle");
          setPullDistance(0);
        }
        return;
      }

      // Add hysteresis: require minimum 10px pull before activating
      const HYSTERESIS = 10;

      // Nur pull-down erlauben (with hysteresis)
      if (deltaY > HYSTERESIS) {
        // Prevent default scroll only when actively pulling
        e.preventDefault();

        // Rubber-band effect (langsamer bei größerer Distanz)
        const rubberBand = Math.min((deltaY - HYSTERESIS) * 0.5, maxPullDistance);
        setPullDistance(rubberBand);

        // Status update
        if (rubberBand >= threshold) {
          if (status !== "ready") {
            setStatus("ready");
            hapticFeedback("light"); // Feedback beim Threshold
          }
        } else if (status === "ready") {
          setStatus("pulling");
        }
      }
    },
    [disabled, status, threshold, maxPullDistance],
  );

  const handleTouchEnd = useCallback(async () => {
    if (disabled || status === "refreshing") return;

    // Reset tracking refs
    wasAtTopOnStart.current = false;
    scrollVelocity.current = 0;

    // Wenn threshold erreicht: Refresh triggern
    if (pullDistance >= threshold && status === "ready") {
      setStatus("refreshing");
      setIsRefreshing(true);
      hapticFeedback("medium");

      try {
        await onRefresh();
      } catch (error) {
        console.error("[PullToRefresh] Refresh failed:", error);
        hapticFeedback("error");
      } finally {
        setIsRefreshing(false);
        setStatus("idle");
        setPullDistance(0);
      }
    } else {
      // Zurück zu idle
      setStatus("idle");
      setPullDistance(0);
    }
  }, [disabled, status, pullDistance, threshold, onRefresh]);

  // Attach listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Berechne Rotation für Spinner (0-360deg basierend auf pullDistance)
  const spinnerRotation = Math.min((pullDistance / threshold) * 360, 360);
  const opacity = Math.min(pullDistance / threshold, 1);

  return (
    <div ref={containerRef} className={cn("relative overflow-auto", className)}>
      {/* Pull-Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-50"
        style={{
          height: pullDistance,
          opacity,
          transition: isRefreshing || status === "idle" ? "all 0.3s ease" : "none",
        }}
      >
        <div className="flex flex-col items-center gap-2 pb-4">
          {/* Spinner */}
          <RefreshCw
            className={cn(
              "h-6 w-6 text-accent-primary transition-transform",
              isRefreshing && "animate-spin",
            )}
            style={{
              transform: isRefreshing ? "rotate(360deg)" : `rotate(${spinnerRotation}deg)`,
            }}
          />

          {/* Text */}
          {status !== "idle" && (
            <p className="text-xs text-ink-secondary font-medium">
              {status === "refreshing" && "Aktualisiere..."}
              {status === "ready" && "Loslassen zum Aktualisieren"}
              {status === "pulling" && "Ziehen zum Aktualisieren"}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: status === "idle" || isRefreshing ? "transform 0.3s ease" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
