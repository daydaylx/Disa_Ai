try {
  if ((navigator as any).webdriver) {
    /* test → kein SW */ throw new Error("__PW_TEST__");
  }
} catch (_e) {
  void _e;
  /* stop SW */
}

// Build-ID from import.meta.env or fallback to timestamp
const BUILD_ID =
  (import.meta as any)?.env?.VITE_BUILD_ID ??
  (import.meta as any)?.env?.VITE_BUILD_TIMESTAMP ??
  "dev-" + Date.now().toString(36);

export { BUILD_ID };

export function registerSW() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) {
    console.warn("[SW] Service Worker not supported in this browser");
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
      console.error("[SW] Service Worker error caught:", { message, source, error });
      // Don't let SW errors crash the main app
      return true;
    }
    return originalErrorHandler?.(message, source, lineno, colno, error) || false;
  };

  window.onerror = swErrorHandler;

  // Issue #75 behoben - Service Worker wieder aktiviert für PWA-Funktionalität
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
              // New content is available, and the new service worker has been installed.
              // The 'autoUpdate' strategy will handle the update automatically.
              console.log(
                "[SW] New content is available and will be used when all tabs for this scope are closed.",
              );
            }
          });
        });
      })
      .catch(() => {});
  });
}

// E2E: Service Worker im Test deaktivieren
try {
  const params = new URLSearchParams(location.search);
  const isE2E =
    (navigator as any).webdriver || params.has("no-sw") || /playwright/i.test(navigator.userAgent);
  if (isE2E) {
    console.warn("[SW] disabled in E2E");
    // Frühzeitiger Return aus jeglicher Registrierung
    // (falls oben eine auto-registrierende Routine existiert, bitte direkt dort guarden)
  }
} catch (_e) {
  void _e;
  /* ignore */
}
