import { logger } from "../utils/production-logger";

// Build-ID from import.meta.env or fallback to timestamp
const BUILD_ID =
  (import.meta as any)?.env?.VITE_BUILD_ID ??
  (import.meta as any)?.env?.VITE_BUILD_TIMESTAMP ??
  "dev-" + Date.now().toString(36);

export { BUILD_ID };

function isServiceWorkerDisabled(): boolean {
  try {
    if (typeof navigator === "undefined" || typeof location === "undefined") {
      return true;
    }

    const params = new URLSearchParams(location.search);
    const webdriver = Boolean((navigator as any).webdriver);
    const playwrightUA = /playwright/i.test(navigator.userAgent);
    return webdriver || params.has("no-sw") || playwrightUA;
  } catch (error) {
    logger.warn("[SW] guard failed, disabling registration", error);
    return true;
  }
}

export function registerSW() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) {
    logger.warn("[SW] Service Worker not supported in this browser");
    return;
  }

  if (isServiceWorkerDisabled()) {
    logger.warn("[SW] registration skipped (test or guard condition)");
    return;
  }

  // Enhanced error boundary for PWA stability
  const originalErrorHandler = window.onerror;
  const swErrorHandler = (
    message: any,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error,
  ) => {
    if (source?.includes("sw.js") || error?.stack?.includes("sw.js")) {
      logger.error("[SW] Service Worker error caught:", { message, source, error });
      // Don't let SW errors crash the main app
      return true;
    }
    return originalErrorHandler?.(message, source, lineno, colno, error) || false;
  };

  window.onerror = swErrorHandler;

  const hasImportScripts =
    typeof (globalThis as unknown as { importScripts?: unknown }).importScripts !== "undefined";
  const baseUrl =
    (import.meta as any)?.env?.VITE_BASE_URL ?? (import.meta as any)?.env?.BASE_URL ?? "./";
  const swUrl = hasImportScripts ? `/sw.js?build=${BUILD_ID}` : `${baseUrl}sw.js?build=${BUILD_ID}`;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          nw?.addEventListener("statechange", () => {
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              logger.info(
                "[SW] New content is available and will be used when all tabs for this scope are closed.",
              );
            }
          });
        });
      })
      .catch((error) => {
        logger.error("[SW] registration failed", error);
      });
  });
}
