/**
 * Web Vitals measurement and reporting
 * Measures Core Web Vitals: LCP, CLS, INP, TTFB
 */

import * as React from "react";

interface Metric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  entries: PerformanceEntry[];
  id: string;
  navigationType: string;
}

interface WebVitalsConfig {
  endpoint?: string;
  debug?: boolean;
  sampling?: number;
  reportAllChanges?: boolean;
}

class WebVitalsReporter {
  private config: WebVitalsConfig;
  private metrics: Map<string, Metric> = new Map();
  private isSupported: boolean;

  constructor(config: WebVitalsConfig = {}) {
    this.config = {
      debug: process.env.NODE_ENV === "development",
      sampling: 0.1, // 10% sampling
      reportAllChanges: false,
      ...config,
    };

    this.isSupported = typeof window !== "undefined" && "performance" in window;

    if (this.isSupported) {
      this.initializeObservers();
    }
  }

  private initializeObservers(): void {
    // Largest Contentful Paint (LCP)
    this.observeLCP();

    // Cumulative Layout Shift (CLS)
    this.observeCLS();

    // Interaction to Next Paint (INP)
    this.observeINP();

    // Time to First Byte (TTFB)
    this.observeTTFB();

    // First Input Delay (FID) - deprecated but still useful
    this.observeFID();

    // Custom performance marks
    this.observeCustomMarks();
  }

  private observeLCP(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformancePaintTiming;

        if (lastEntry) {
          this.reportMetric({
            name: "LCP",
            value: lastEntry.startTime,
            rating: this.getRating("LCP", lastEntry.startTime),
            delta: lastEntry.startTime,
            entries: [lastEntry],
            id: this.generateId(),
            navigationType: this.getNavigationType(),
          });
        }
      });

      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (error) {
      this.debugLog("LCP observer error:", error);
    }
  }

  private observeCLS(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      let clsValue = 0;
      let clsEntries: PerformanceEntry[] = [];

      const observer = new PerformanceObserver((list) => {
        let latestValue = 0;

        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            const entryValue = (entry as any).value;
            clsValue += entryValue;
            latestValue = entryValue;
            clsEntries.push(entry);
          }
        }

        this.reportMetric({
          name: "CLS",
          value: clsValue,
          rating: this.getRating("CLS", clsValue),
          delta: latestValue,
          entries: clsEntries,
          id: this.generateId(),
          navigationType: this.getNavigationType(),
        });
      });

      observer.observe({ type: "layout-shift", buffered: true });
    } catch (error) {
      this.debugLog("CLS observer error:", error);
    }
  }

  private observeINP(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      let longestInteraction = 0;
      let longestEntry: PerformanceEventTiming | null = null;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceEventTiming[]) {
          if ((entry as any).interactionId && entry.duration > longestInteraction) {
            longestInteraction = entry.duration;
            longestEntry = entry;
          }
        }

        if (longestEntry) {
          this.reportMetric({
            name: "INP",
            value: longestInteraction,
            rating: this.getRating("INP", longestInteraction),
            delta: longestInteraction,
            entries: [longestEntry],
            id: this.generateId(),
            navigationType: this.getNavigationType(),
          });
        }
      });

      observer.observe({ type: "event", buffered: true } as any);
    } catch (error) {
      this.debugLog("INP observer error:", error);
    }
  }

  private observeTTFB(): void {
    try {
      const navigationEntry = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;

      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;

        this.reportMetric({
          name: "TTFB",
          value: ttfb,
          rating: this.getRating("TTFB", ttfb),
          delta: ttfb,
          entries: [navigationEntry],
          id: this.generateId(),
          navigationType: this.getNavigationType(),
        });
      }
    } catch (error) {
      this.debugLog("TTFB observer error:", error);
    }
  }

  private observeFID(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          const fid = fidEntry.processingStart - fidEntry.startTime;

          this.reportMetric({
            name: "FID",
            value: fid,
            rating: this.getRating("FID", fid),
            delta: fid,
            entries: [entry],
            id: this.generateId(),
            navigationType: this.getNavigationType(),
          });
        }
      });

      observer.observe({ type: "first-input", buffered: true });
    } catch (error) {
      this.debugLog("FID observer error:", error);
    }
  }

  private observeCustomMarks(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.startsWith("disa-")) {
            this.reportMetric({
              name: entry.name,
              value: entry.startTime,
              rating: "good", // Custom marks don't have standard ratings
              delta: entry.startTime,
              entries: [entry],
              id: this.generateId(),
              navigationType: this.getNavigationType(),
            });
          }
        }
      });

      observer.observe({ type: "measure", buffered: true });
      observer.observe({ type: "mark", buffered: true });
    } catch (error) {
      this.debugLog("Custom marks observer error:", error);
    }
  }

  private getRating(metricName: string, value: number): "good" | "needs-improvement" | "poor" {
    const thresholds = {
      LCP: [2500, 4000],
      CLS: [0.1, 0.25],
      INP: [200, 500],
      FID: [100, 300],
      TTFB: [800, 1800],
    };

    const [good, poor] = thresholds[metricName as keyof typeof thresholds] || [0, 0];

    if (value <= good) return "good";
    if (value <= poor) return "needs-improvement";
    return "poor";
  }

  private getNavigationType(): string {
    if (!performance.navigation) return "unknown";

    const types = ["navigate", "reload", "back_forward", "prerender"];
    return types[performance.navigation.type] || "unknown";
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldSample(): boolean {
    return Math.random() < this.config.sampling!;
  }

  private reportMetric(metric: Metric): void {
    this.metrics.set(metric.name, metric);

    if (this.config.debug) {
      this.debugLog(`${metric.name}:`, {
        value: metric.value.toFixed(2),
        rating: metric.rating,
        navigationType: metric.navigationType,
      });
    }

    // Report to analytics endpoint
    if (this.config.endpoint && this.shouldSample()) {
      void this.sendToAnalytics(metric);
    }

    // Trigger custom event for application use
    this.dispatchCustomEvent(metric);
  }

  private async sendToAnalytics(metric: Metric): Promise<void> {
    try {
      const payload = {
        metric: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
        navigation_type: metric.navigationType,
        user_agent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        session_id: this.getSessionId(),
      };

      // Use sendBeacon for reliability, fallback to fetch
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.config.endpoint!, JSON.stringify(payload));
      } else {
        await fetch(this.config.endpoint!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      }
    } catch (error) {
      this.debugLog("Analytics error:", error);
    }
  }

  private dispatchCustomEvent(metric: Metric): void {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("web-vital", {
          detail: metric,
        }),
      );
    }
  }

  private getSessionId(): string {
    const key = "disa-session-id";
    let sessionId = sessionStorage.getItem(key);

    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem(key, sessionId);
    }

    return sessionId;
  }

  private debugLog(...args: any[]): void {
    if (this.config.debug) {
      // eslint-disable-next-line no-console
      console.log("[Web Vitals]", ...args);
    }
  }

  // Public API
  public mark(name: string): void {
    if (this.isSupported) {
      performance.mark(`disa-${name}`);
    }
  }

  public measure(name: string, startMark?: string, endMark?: string): void {
    if (this.isSupported) {
      try {
        performance.measure(
          `disa-${name}`,
          startMark ? `disa-${startMark}` : undefined,
          endMark ? `disa-${endMark}` : undefined,
        );
      } catch (error) {
        this.debugLog("Measure error:", error);
      }
    }
  }

  public getMetrics(): Metric[] {
    return Array.from(this.metrics.values());
  }

  public getMetric(name: string): Metric | undefined {
    return this.metrics.get(name);
  }
}

// Singleton instance
let webVitalsInstance: WebVitalsReporter | null = null;

export function initializeWebVitals(config?: WebVitalsConfig): WebVitalsReporter {
  if (!webVitalsInstance) {
    webVitalsInstance = new WebVitalsReporter(config);
  }
  return webVitalsInstance;
}

export function getWebVitals(): WebVitalsReporter | null {
  return webVitalsInstance;
}

// Convenience functions
export function markPerformance(name: string): void {
  webVitalsInstance?.mark(name);
}

export function measurePerformance(name: string, startMark?: string, endMark?: string): void {
  webVitalsInstance?.measure(name, startMark, endMark);
}

// React hook for Web Vitals
export function useWebVitals() {
  const [metrics, setMetrics] = React.useState<Metric[]>([]);

  React.useEffect(() => {
    const handleWebVital = (event: CustomEvent<Metric>) => {
      setMetrics((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex((m) => m.name === event.detail.name);

        if (existingIndex >= 0) {
          updated[existingIndex] = event.detail;
        } else {
          updated.push(event.detail);
        }

        return updated;
      });
    };

    window.addEventListener("web-vital", handleWebVital as EventListener);
    return () => window.removeEventListener("web-vital", handleWebVital as EventListener);
  }, []);

  return { metrics, mark: markPerformance, measure: measurePerformance };
}

export type { Metric, WebVitalsConfig };
