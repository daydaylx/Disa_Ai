import { activateServiceWorkerUpdate, getServiceWorkerState, registerSW } from "./pwa/registerSW";

/**
 * Deployment Optimization Utilities
 *
 * Utilities for optimizing production deployments
 */

/**
 * Environment-specific configuration
 */
export interface DeploymentConfig {
  environment: "development" | "staging" | "production";
  apiBaseUrl: string;
  enableAnalytics: boolean;
  enableServiceWorker: boolean;
  cacheStrategy: "aggressive" | "conservative" | "disabled";
  logLevel: "debug" | "info" | "warn" | "error";
}

/**
 * Get deployment configuration based on environment
 */
export function getDeploymentConfig(): DeploymentConfig {
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;

  return {
    environment: isDev ? "development" : isProd ? "production" : "staging",
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://api.openrouter.ai",
    enableAnalytics: isProd,
    enableServiceWorker: isProd,
    cacheStrategy: isProd ? "aggressive" : "conservative",
    logLevel: isDev ? "debug" : "warn",
  };
}

/**
 * Resource preloading for critical assets
 */
declare global {
  interface Window {
    __DISA_CRITICAL_ASSETS__?: string[];
  }
}

export function preloadCriticalAssets(): void {
  if (typeof window === "undefined") {
    return;
  }

  const assets = Array.isArray(window.__DISA_CRITICAL_ASSETS__)
    ? window.__DISA_CRITICAL_ASSETS__
    : [];

  if (assets.length === 0) {
    return;
  }

  assets.forEach((asset) => {
    if (!asset || typeof asset !== "string") return;

    const link = document.createElement("link");
    link.rel = "preload";

    if (asset.endsWith(".css")) {
      link.as = "style";
    } else if (asset.endsWith(".js")) {
      link.as = "script";
    } else {
      link.as = "fetch";
    }

    link.href = asset;
    document.head.appendChild(link);
  });
}

/**
 * Service Worker registration and updates
 */
export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateCheckInterval: ReturnType<typeof setInterval> | null = null;

  async register(): Promise<boolean> {
    registerSW();

    if (!("serviceWorker" in navigator)) {
      console.warn("Service Worker not supported");
      return false;
    }

    const config = getDeploymentConfig();
    if (!config.enableServiceWorker) {
      console.warn("Service Worker disabled for this environment");
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration("/");
      this.registration = registration ?? null;

      if (!this.updateCheckInterval) {
        this.updateCheckInterval = setInterval(
          () => {
            void this.checkForUpdates();
          },
          30 * 60 * 1000,
        );
      }

      return Boolean(this.registration);
    } catch (error) {
      console.error("Service Worker lookup failed:", error);
      return false;
    }
  }

  async checkForUpdates(): Promise<void> {
    if (!("serviceWorker" in navigator)) return;

    if (!this.registration) {
      try {
        const registration = await navigator.serviceWorker.getRegistration("/");
        this.registration = registration ?? null;
      } catch (error) {
        console.error("Failed to get Service Worker registration:", error);
        return;
      }
    }

    try {
      await this.registration?.update();
    } catch (error) {
      console.error("Failed to check for Service Worker updates:", error);
    }
  }

  activateUpdate(): void {
    void activateServiceWorkerUpdate();
  }

  isUpdateAvailable(): boolean {
    return getServiceWorkerState().needRefresh;
  }

  destroy(): void {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
      this.updateCheckInterval = null;
    }
    this.registration = null;
  }
}

/**
 * Performance monitoring and reporting
 */
export class PerformanceReporter {
  private metrics: Map<string, number> = new Map();

  startTiming(label: string): void {
    this.metrics.set(`${label}_start`, performance.now());
  }

  endTiming(label: string): number {
    const startTime = this.metrics.get(`${label}_start`);
    if (!startTime) {
      console.warn(`No start time found for timing: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.set(label, duration);
    return duration;
  }

  recordMetric(name: string, value: number): void {
    this.metrics.set(name, value);
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  reportWebVitals(): void {
    // Web Vitals integration would go here
    const vitals = {
      FCP: 0, // First Contentful Paint
      LCP: 0, // Largest Contentful Paint
      FID: 0, // First Input Delay
      CLS: 0, // Cumulative Layout Shift
    };

    // Observer for Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        vitals.LCP = lastEntry.startTime;
      }
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // Observer for First Input Delay
    new PerformanceObserver((list) => {
      const firstEntry = list.getEntries()[0] as PerformanceEntry | undefined;
      if (firstEntry) {
        const typedEntry = firstEntry as any;
        vitals.FID = typedEntry.processingStart - typedEntry.startTime;
      }
    }).observe({ entryTypes: ["first-input"] });

    // Observer for Cumulative Layout Shift
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          vitals.CLS += (entry as any).value;
        }
      }
    }).observe({ entryTypes: ["layout-shift"] });

    // Record all vitals
    Object.entries(vitals).forEach(([name, value]) => {
      this.recordMetric(name, value);
    });
  }

  generateReport(): string {
    const config = getDeploymentConfig();
    const metrics = this.getMetrics();

    const report = {
      timestamp: new Date().toISOString(),
      environment: config.environment,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      connection: (navigator as any).connection
        ? {
            effectiveType: (navigator as any).connection.effectiveType,
            downlink: (navigator as any).connection.downlink,
          }
        : null,
      metrics,
    };

    return JSON.stringify(report, null, 2);
  }
}

/**
 * Error boundary for production error reporting
 */
export function setupErrorReporting(): void {
  // Global error handler
  window.addEventListener("error", (event) => {
    const errorInfo = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // In production, this would send to error reporting service
    console.error("Global error:", errorInfo);
  });

  // Unhandled promise rejection handler
  window.addEventListener("unhandledrejection", (event) => {
    const errorInfo = {
      reason: event.reason,
      promise: event.promise,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.error("Unhandled promise rejection:", errorInfo);
  });
}

/**
 * Cache management for aggressive caching strategy
 */
export class CacheManager {
  private static readonly CACHE_VERSION = "v1";
  private static readonly CACHE_NAME = `disa-ai-${CacheManager.CACHE_VERSION}`;

  static async clearOldCaches(): Promise<void> {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(
      (name) => name.startsWith("disa-ai-") && name !== CacheManager.CACHE_NAME,
    );

    await Promise.all(oldCaches.map((cacheName) => caches.delete(cacheName)));
  }

  static async precacheAssets(assets: string[]): Promise<void> {
    const cache = await caches.open(CacheManager.CACHE_NAME);
    await cache.addAll(assets);
  }

  static async getCachedResponse(request: Request): Promise<Response | undefined> {
    const cache = await caches.open(CacheManager.CACHE_NAME);
    return cache.match(request);
  }

  static async cacheResponse(request: Request, response: Response): Promise<void> {
    const cache = await caches.open(CacheManager.CACHE_NAME);
    await cache.put(request, response.clone());
  }
}

// Initialize deployment optimizations
const config = getDeploymentConfig();
const serviceWorkerManager = new ServiceWorkerManager();
const performanceReporter = new PerformanceReporter();

// Auto-initialize on load (Service Worker registration removed to prevent conflicts with registerSW.ts)
if (typeof window !== "undefined") {
  // Setup error reporting
  setupErrorReporting();

  // Start performance monitoring
  performanceReporter.reportWebVitals();

  // Preload critical assets
  if (config.environment === "production") {
    preloadCriticalAssets();
  }
}

export { performanceReporter, serviceWorkerManager };
