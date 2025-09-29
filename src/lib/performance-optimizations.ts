/**
 * Performance Optimization Utilities
 *
 * Collection of utilities to improve app performance and reduce bundle size
 */

/**
 * Lazy load imports with error handling
 */
// React import (needed for createAsyncRoute)
import React from "react";

export function createLazyImport<T>(importFn: () => Promise<T>) {
  return () => {
    return importFn().catch((error) => {
      console.error("Failed to load module:", error);
      // Return a fallback or rethrow based on requirements
      throw error;
    });
  };
}

/**
 * Debounce function calls to reduce unnecessary executions
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

/**
 * Throttle function calls to limit execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Intersection Observer for lazy loading
 */
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {},
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Optimize images by loading appropriate sizes
 */
export function getOptimizedImageUrl(
  baseUrl: string,
  width: number,
  height?: number,
  format = "webp",
): string {
  // This would integrate with a CDN or image optimization service
  const params = new URLSearchParams();
  params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  params.set("f", format);
  params.set("q", "85"); // Quality

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string, type?: string): void {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  if (type) link.type = type;

  document.head.appendChild(link);
}

/**
 * Memory-efficient virtual scrolling helper
 */
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function calculateVirtualScrollRange(
  scrollTop: number,
  itemCount: number,
  config: VirtualScrollConfig,
): { start: number; end: number; offsetY: number } {
  const { itemHeight, containerHeight, overscan = 5 } = config;

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(itemCount - 1, Math.ceil((scrollTop + containerHeight) / itemHeight));

  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(itemCount - 1, visibleEnd + overscan);
  const offsetY = start * itemHeight;

  return { start, end, offsetY };
}

/**
 * Bundle size analysis helper
 */
export function analyzeBundleSize(): Promise<{
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{ name: string; size: number }>;
}> {
  return fetch("/api/bundle-analysis")
    .then((response) => response.json())
    .catch(() => ({
      totalSize: 0,
      gzippedSize: 0,
      chunks: [],
    }));
}

/**
 * Code splitting helper for routes
 */
export const createAsyncRoute = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
) => {
  const LazyComponent = React.lazy(importFn);

  return (props: React.ComponentProps<T>) =>
    React.createElement(
      React.Suspense,
      {
        fallback: React.createElement(
          "div",
          { className: "flex items-center justify-center min-h-screen-dynamic" },
          React.createElement("div", {
            className:
              "animate-spin w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full",
          }),
        ),
      },
      React.createElement(LazyComponent, props),
    );
};

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static marks = new Map<string, number>();

  static mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  static measure(name: string, startMark: string): number {
    const startTime = this.marks.get(startMark);
    if (!startTime) {
      console.warn(`Start mark "${startMark}" not found`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.warn(`${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  static clearMarks(): void {
    this.marks.clear();
  }

  static getWebVitals(): Promise<{
    fcp: number;
    lcp: number;
    fid: number;
    cls: number;
  }> {
    return new Promise((resolve) => {
      // This would integrate with web-vitals library
      // For now, return mock data
      resolve({
        fcp: 1200,
        lcp: 2500,
        fid: 50,
        cls: 0.1,
      });
    });
  }
}
