/**
 * Pull-to-Refresh Hook for Mobile - Native iOS/Android-like experience
 * Implements modern pull-to-refresh pattern with haptic feedback
 */

import { useEffect, useMemo, useRef, useState } from "react";

import { hapticFeedback } from "../lib/touch/haptics";

export interface PullToRefreshOptions {
  threshold?: number; // Pull distance threshold (default: 80px)
  resistance?: number; // Pull resistance factor (default: 3)
  snapBackDuration?: number; // Snap-back animation duration (default: 300ms)
  enabled?: boolean; // Enable/disable pull-to-refresh (default: true)
  haptics?: boolean; // Enable haptic feedback (default: true)
}

export interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  pullProgress: number; // 0-1
  canRefresh: boolean; // True when threshold is exceeded
}

const DEFAULT_OPTIONS: Required<PullToRefreshOptions> = {
  threshold: 80,
  resistance: 3,
  snapBackDuration: 300,
  enabled: true,
  haptics: true,
};

export function usePullToRefresh(
  onRefresh: () => Promise<void> | void,
  options: PullToRefreshOptions = {},
): [PullToRefreshState, { containerRef: React.RefObject<HTMLElement> }] {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    pullProgress: 0,
    canRefresh: false,
  });

  const containerRef = useRef<HTMLElement>(null);
  const touchStartRef = useRef<{ y: number; scrollTop: number } | null>(null);
  const isRefreshingRef = useRef(false);
  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);

  useEffect(() => {
    if (!opts.enabled) return;

    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger when at top of scroll container
      if (container.scrollTop > 0 || isRefreshingRef.current) return;

      const touch = e.touches[0];
      if (!touch) return;

      touchStartRef.current = {
        y: touch.clientY,
        scrollTop: container.scrollTop,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchStart = touchStartRef.current;
      if (!touchStart || isRefreshingRef.current) return;

      const touch = e.touches[0];
      if (!touch) return;

      const deltaY = touch.clientY - touchStart.y;

      // Only pull down from top
      if (deltaY <= 0 || container.scrollTop > 0) {
        setState((prev) => ({
          ...prev,
          isPulling: false,
          pullDistance: 0,
          pullProgress: 0,
          canRefresh: false,
        }));
        return;
      }

      // Calculate pull distance with resistance
      const pullDistance = Math.min(deltaY / opts.resistance, opts.threshold * 1.5);
      const pullProgress = Math.min(pullDistance / opts.threshold, 1);
      const canRefresh = pullDistance >= opts.threshold;

      // Haptic feedback when threshold is reached
      if (canRefresh && !state.canRefresh && opts.haptics) {
        hapticFeedback.impact("light");
      }

      setState((prev) => ({
        ...prev,
        isPulling: true,
        pullDistance,
        pullProgress,
        canRefresh,
      }));

      // Prevent default scrolling when pulling
      if (pullDistance > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      const currentState = state;
      touchStartRef.current = null;

      if (!currentState.isPulling || isRefreshingRef.current) return;

      if (currentState.canRefresh) {
        // Trigger refresh
        setState((prev) => ({
          ...prev,
          isRefreshing: true,
          pullDistance: opts.threshold,
          pullProgress: 1,
        }));

        isRefreshingRef.current = true;

        if (opts.haptics) {
          hapticFeedback.success();
        }

        try {
          await onRefresh();
        } finally {
          // Snap back animation
          setState((prev) => ({
            ...prev,
            isRefreshing: false,
          }));

          // Delay to show snap-back animation
          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              isPulling: false,
              pullDistance: 0,
              pullProgress: 0,
              canRefresh: false,
            }));
            isRefreshingRef.current = false;
          }, opts.snapBackDuration);
        }
      } else {
        // Snap back without refresh
        setState((prev) => ({
          ...prev,
          isPulling: false,
          pullDistance: 0,
          pullProgress: 0,
          canRefresh: false,
        }));
      }
    };

    const handleTouchCancel = () => {
      touchStartRef.current = null;
      setState((prev) => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        pullProgress: 0,
        canRefresh: false,
      }));
    };

    // Add event listeners
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchCancel, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchCancel);

      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [opts, onRefresh, state]);

  return [state, { containerRef: containerRef as React.RefObject<HTMLElement> }];
}

/**
 * PullToRefresh component interface
 * Implementation should be in a separate .tsx file
 */
export interface PullToRefreshIndicatorProps {
  state: PullToRefreshState;
  className?: string;
}
