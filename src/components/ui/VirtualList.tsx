/**
 * VirtualList Component
 * Implements Issue #106 - Generic virtual scrolling for any type of list
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "../../lib/utils";

interface VirtualListProps<T> {
  /** Array of items to render */
  items: T[];
  /** Function to render each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Unique key extractor for each item */
  keyExtractor: (item: T, index: number) => string | number;
  /** Height of each item in pixels (fixed height for optimal performance) */
  itemHeight?: number;
  /** Estimated height when itemHeight is not provided */
  estimatedItemHeight?: number;
  /** Number of items to render outside visible area (buffer) */
  overscan?: number;
  /** Container height (if not provided, uses parent height) */
  height?: number | string;
  /** Container className */
  className?: string;
  /** Threshold for virtualization activation */
  virtualizationThreshold?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Loading component */
  loadingComponent?: React.ReactNode;
  /** Empty state component */
  emptyComponent?: React.ReactNode;
  /** Scroll to bottom when new items are added */
  autoScrollToBottom?: boolean;
  /** Called when scrolled near bottom */
  onScrollNearBottom?: () => void;
  /** Threshold for onScrollNearBottom (in pixels from bottom) */
  nearBottomThreshold?: number;
}

export function VirtualList<T>({
  items,
  renderItem,
  keyExtractor,
  itemHeight = 100,
  estimatedItemHeight = 100,
  overscan = 5,
  height = "100%",
  className,
  virtualizationThreshold = 50,
  isLoading = false,
  loadingComponent,
  emptyComponent,
  autoScrollToBottom = false,
  onScrollNearBottom,
  nearBottomThreshold = 100,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Track if we should virtualize based on item count
  const shouldVirtualize = items.length > virtualizationThreshold;

  // Calculate visible range
  const { startIndex, endIndex, offsetY, totalHeight } = useMemo(() => {
    if (!shouldVirtualize || containerHeight === 0) {
      return {
        startIndex: 0,
        endIndex: items.length - 1,
        offsetY: 0,
        totalHeight: items.length * (itemHeight || estimatedItemHeight),
      };
    }

    const visibleHeight = containerHeight;
    const effectiveItemHeight = itemHeight || estimatedItemHeight;

    const startIndex = Math.max(0, Math.floor(scrollTop / effectiveItemHeight) - overscan);
    const visibleCount = Math.ceil(visibleHeight / effectiveItemHeight);
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);

    const offsetY = startIndex * effectiveItemHeight;
    const totalHeight = items.length * effectiveItemHeight;

    return { startIndex, endIndex, offsetY, totalHeight };
  }, [
    scrollTop,
    containerHeight,
    items.length,
    itemHeight,
    estimatedItemHeight,
    overscan,
    shouldVirtualize,
  ]);

  // Get visible items
  const visibleItems = useMemo(() => {
    if (!shouldVirtualize) {
      return items.map((item, index) => ({ item, index }));
    }
    return items.slice(startIndex, endIndex + 1).map((item, relativeIndex) => ({
      item,
      index: startIndex + relativeIndex,
    }));
  }, [items, startIndex, endIndex, shouldVirtualize]);

  // Handle scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      setScrollTop(target.scrollTop);

      // Check if near bottom
      if (onScrollNearBottom) {
        const { scrollTop, scrollHeight, clientHeight } = target;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        if (distanceFromBottom <= nearBottomThreshold) {
          onScrollNearBottom();
        }
      }
    },
    [onScrollNearBottom, nearBottomThreshold],
  );

  // Measure container height
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;
      if (entry) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (autoScrollToBottom && scrollElementRef.current) {
      const element = scrollElementRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [items.length, autoScrollToBottom]);

  // Loading state
  if (isLoading) {
    return (
      <div
        ref={containerRef}
        className={cn("flex items-center justify-center", className)}
        style={{ height }}
      >
        {loadingComponent || (
          <div className="flex items-center gap-2 text-white/60">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
            <span>Laden...</span>
          </div>
        )}
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div
        ref={containerRef}
        className={cn("flex items-center justify-center", className)}
        style={{ height }}
      >
        {emptyComponent || (
          <div className="text-center text-white/60">
            <p>Keine Elemente gefunden</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{ height }}
    >
      <div ref={scrollElementRef} className="h-full overflow-y-auto" onScroll={handleScroll}>
        {/* Virtual scrolling container */}
        <div style={{ height: totalHeight, position: "relative" }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: "relative",
            }}
          >
            {visibleItems.map(({ item, index }) => (
              <div
                key={keyExtractor(item, index)}
                style={{
                  height: shouldVirtualize ? itemHeight || estimatedItemHeight : undefined,
                  minHeight: shouldVirtualize ? undefined : estimatedItemHeight,
                }}
                className="w-full"
              >
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for easier virtual list usage with common patterns
 */
export function useVirtualList<T>({
  items,
  threshold = 50,
  itemHeight = 100,
}: {
  items: T[];
  threshold?: number;
  itemHeight?: number;
}) {
  const shouldVirtualize = items.length > threshold;

  return {
    shouldVirtualize,
    itemHeight: shouldVirtualize ? itemHeight : undefined,
    estimatedItemHeight: itemHeight,
    virtualizationThreshold: threshold,
  };
}
