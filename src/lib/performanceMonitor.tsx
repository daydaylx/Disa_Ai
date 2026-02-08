/**
 * Performance Monitoring Utilities (DEV ONLY)
 *
 * Lightweight performance tracking for development
 * Measures render times, memory usage, and FPS
 */

import { useEffect, useRef } from "react";

const isDevEnvironment = import.meta.env.DEV;

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  fps: number;
}

interface PerformanceHUDProps {
  enabled?: boolean;
  renderTime?: number;
  memoryUsage?: number;
  fps?: number;
}

/**
 * Simple hash function for content caching
 * @internal - reserved for future use
 */
function _hashContent(content: string): string {
  let hash = 5381;
  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash = hash & 0x7fffffff;
  }
  return hash.toString(36);
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string, enabled = isDevEnvironment) {
  const renderStartTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);
  const avgRenderTime = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const startTime = performance.now();
    renderStartTimeRef.current = startTime;

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      renderCountRef.current++;

      const currentAvg = avgRenderTime.current;
      const newAvg = currentAvg + (renderTime - currentAvg) / renderCountRef.current;
      avgRenderTime.current = newAvg;

      if (renderTime > 50) {
        console.warn(
          `[Performance] ${componentName}: Slow render (${renderTime.toFixed(1)}ms, avg: ${newAvg.toFixed(1)}ms)`,
        );
      }

      if (import.meta.env.DEV) {
        const marks = (window as any).__PERF_MARKS || [];
        marks.push({
          name: componentName,
          duration: renderTime,
          timestamp: new Date().toISOString(),
        });

        if (marks.length > 50) {
          marks.shift();
        }

        (window as any).__PERF_MARKS = marks;
      }
    };
  }, [enabled, componentName]);

  useEffect(() => {
    if (!enabled) return;

    renderStartTimeRef.current = 0;
    renderCountRef.current = 0;
    avgRenderTime.current = 0;
  }, [enabled, avgRenderTime]);

  function getMetrics(): PerformanceMetrics | null {
    if (!enabled) return null;

    return {
      renderTime: avgRenderTime.current,
      memoryUsage: getMemoryUsage(),
      fps: getFPS(),
    };
  }

  return {
    trackRender:
      renderStartTimeRef.current === 0
        ? startTracking
        : () => {
            return () => {
              if (renderStartTimeRef.current === 0) return startTracking();
              const startTime = renderStartTimeRef.current;
              const endTime = performance.now();
              const renderTime = endTime - startTime;

              const currentAvg = avgRenderTime.current;
              const count = renderCountRef.current;
              const newAvg = currentAvg + (renderTime - currentAvg) / (count + 1);
              avgRenderTime.current = newAvg;

              renderStartTimeRef.current = 0;
              return renderTime;
            };
          },
    getMetrics,
  };
}

function getMemoryUsage(): number {
  if (typeof (performance as any).memory === "undefined") {
    return 0;
  }

  try {
    return Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024));
  } catch {
    return 0;
  }
}

let fpsFrameCount = 0;
let fpsLastTime = performance.now();

function getFPS(): number {
  const now = performance.now();
  fpsFrameCount++;
  const delta = now - fpsLastTime;

  if (delta >= 500) {
    const fps = Math.round((fpsFrameCount * 1000) / delta);
    fpsFrameCount = 0;
    fpsLastTime = now;

    if (fps < 45) {
      console.warn(`[Performance] Low FPS: ${fps}`);
    }
  }

  return 0;
}

class MarkdownCache {
  private cache = new Map<string, ParsedPart[]>();
  private maxSize = 100;

  set(key: string, value: ParsedPart[]) {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, value);
  }

  get(key: string): ParsedPart[] | null {
    return this.cache.get(key) || null;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const markdownCache = new MarkdownCache();

export function PerformanceHUD({
  enabled,
  renderTime = 50,
  memoryUsage = 50,
  fps = 60,
}: PerformanceHUDProps) {
  const { getMetrics } = usePerformanceMonitor("PerformanceHUD", true);

  if (!enabled || !isDevEnvironment) {
    return null;
  }

  const metrics = getMetrics();

  if (!metrics) {
    return null;
  }

  const { renderTime: rTime, memoryUsage: mem, fps: currentFps } = metrics;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 bg-black/80 text-white text-xs font-mono p-3 rounded-lg shadow-lg pointer-events-none"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className={rTime > renderTime ? "text-yellow-400" : "text-green-400"}>
            ⏱ {rTime.toFixed(0)}ms
          </span>
          <span>render</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={mem > memoryUsage ? "text-yellow-400" : "text-green-400"}>
            💾 {mem.toFixed(1)}MB
          </span>
          <span>memory</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={currentFps < fps ? "text-yellow-400" : "text-green-400"}>
            📊 {currentFps.toFixed(0)}FPS
          </span>
          <span>FPS</span>
        </div>
      </div>
    </div>
  );
}
