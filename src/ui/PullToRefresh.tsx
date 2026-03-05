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

type Status = "idle" | "pulling" | "ready" | "refreshing";

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
  const [pullDistance, _setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [status, _setStatus] = useState<Status>("idle");

  // Fix 1: Refs spiegeln State damit Event-Callbacks stabil bleiben
  // (kein Re-Attach des passive:false touchmove-Listeners mitten in einer Geste)
  const statusRef = useRef<Status>("idle");
  const pullDistanceRef = useRef(0);

  const setStatus = useCallback((s: Status) => {
    statusRef.current = s;
    _setStatus(s);
  }, []);

  const setPullDistance = useCallback((d: number) => {
    pullDistanceRef.current = d;
    _setPullDistance(d);
  }, []);

  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wasAtTopOnStart = useRef(false);
  const lastScrollTop = useRef(0);
  const scrollVelocity = useRef(0);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled) return;

      const container = containerRef.current;
      if (!container) return;

      startY.current = e.touches[0]?.clientY ?? 0;
      wasAtTopOnStart.current = container.scrollTop <= 1;
      lastScrollTop.current = container.scrollTop;
      scrollVelocity.current = 0;

      if (wasAtTopOnStart.current) {
        setStatus("pulling");
      }
    },
    [disabled, setStatus],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (disabled || statusRef.current === "refreshing") return;

      if (!wasAtTopOnStart.current) return;

      const container = containerRef.current;
      if (!container) return;

      const currentY = e.touches[0]?.clientY ?? 0;
      const deltaY = currentY - startY.current;

      const currentScrollTop = container.scrollTop;
      scrollVelocity.current = Math.abs(currentScrollTop - lastScrollTop.current);
      lastScrollTop.current = currentScrollTop;

      if (currentScrollTop > 5 || scrollVelocity.current > 2) {
        const s = statusRef.current;
        if (s === "pulling" || s === "ready") {
          setStatus("idle");
          setPullDistance(0);
        }
        return;
      }

      // Fix 2: HYSTERESIS 10→24px — verhindert Fehlauslöser nach Scroll-Momentum
      const HYSTERESIS = 24;

      if (deltaY > HYSTERESIS) {
        e.preventDefault();

        const rubberBand = Math.min((deltaY - HYSTERESIS) * 0.5, maxPullDistance);
        setPullDistance(rubberBand);

        if (rubberBand >= threshold) {
          if (statusRef.current !== "ready") {
            setStatus("ready");
            hapticFeedback("light");
          }
        } else if (statusRef.current === "ready") {
          setStatus("pulling");
        }
      }
    },
    [disabled, threshold, maxPullDistance, setStatus, setPullDistance],
  );

  const handleTouchEnd = useCallback(async () => {
    if (disabled || statusRef.current === "refreshing") return;

    wasAtTopOnStart.current = false;
    scrollVelocity.current = 0;

    if (pullDistanceRef.current >= threshold && statusRef.current === "ready") {
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
      setStatus("idle");
      setPullDistance(0);
    }
  }, [disabled, threshold, onRefresh, setStatus, setPullDistance]);

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

  const spinnerRotation = Math.min((pullDistance / threshold) * 360, 360);
  const opacity = Math.min(pullDistance / threshold, 1);

  return (
    // Fix 4: overscroll-contain isoliert Custom-Pull von nativem iOS-Rubber-Band
    <div ref={containerRef} className={cn("relative overflow-auto overscroll-contain", className)}>
      {/* Pull-Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-popover"
        style={{
          height: pullDistance,
          opacity,
          transition: isRefreshing || status === "idle" ? "all 0.3s ease" : "none",
        }}
      >
        <div className="flex flex-col items-center gap-2 pb-4">
          <RefreshCw
            className={cn(
              "h-6 w-6 text-accent-primary transition-transform",
              isRefreshing && "animate-spin",
            )}
            style={{
              transform: isRefreshing ? "rotate(360deg)" : `rotate(${spinnerRotation}deg)`,
            }}
          />

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
          // Fix 3: Transition nur bei aktivem Snap-Back — im echten Idle (pullDistance=0)
          // keine Transition, damit der Browser den Layer sauber komposieren kann
          transition:
            (status === "idle" || isRefreshing) && pullDistance > 0
              ? "transform 0.3s ease"
              : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
