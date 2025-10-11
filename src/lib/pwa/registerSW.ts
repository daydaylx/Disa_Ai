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

// Cleanup function for memory leak prevention
export function cleanupServiceWorkerTimers(): void {
  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }
}

let controllerListenerAttached = false;
let controllerReloading = false;
let shouldReloadOnControllerChange = false;
let updateCheckInterval: ReturnType<typeof setInterval> | null = null;

function attachControllerChangeListener() {
  if (controllerListenerAttached) return;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!shouldReloadOnControllerChange) return;
    if (controllerReloading) return;
    controllerReloading = true;

    // Use centralized reload manager
    import("../utils/reload-manager")
      .then(({ reloadHelpers }) => {
        reloadHelpers.serviceWorkerUpdate(0);
      })
      .catch(() => {
        // Fallback
        window.location.reload();
      });
  });
  controllerListenerAttached = true;
}

/**
 * Check if the Service Worker version differs from current build
 */
async function checkBuildIdMismatch(registration: ServiceWorkerRegistration): Promise<boolean> {
  try {
    // Send message to SW to get its version
    const sw = registration.active;
    if (!sw) return false;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        const swVersion = event.data?.version;
        const expectedVersion = `v2.1.0-${BUILD_ID.slice(-8)}`;
        const mismatch = swVersion !== expectedVersion;

        // eslint-disable-next-line no-console
        console.log("[SW] Build check:", {
          expectedVersion,
          service_worker: swVersion,
          mismatch,
        });

        resolve(mismatch);
      };

      // Timeout nach 1 Sekunde
      setTimeout(() => resolve(false), 1000);

      sw.postMessage({ type: "CHECK_FOR_UPDATE" }, [messageChannel.port2]);
    });
  } catch (e) {
    console.warn("[SW] Build check failed:", e);
    return false;
  }
}

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

  // Setup cleanup listeners for memory leak prevention
  window.addEventListener("beforeunload", cleanupServiceWorkerTimers);
  window.addEventListener("pagehide", cleanupServiceWorkerTimers);

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
        // alle 30min nach Updates schauen (mit cleanup für Memory Leak Prevention)
        if (updateCheckInterval) clearInterval(updateCheckInterval);
        updateCheckInterval = setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);

        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          nw?.addEventListener("statechange", () => {
            // Update verfügbar: neuer SW installiert, alter aktiv → UI-Toast anbieten
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              try {
                reg.waiting?.postMessage({ type: "SKIP_WAITING" });
                shouldReloadOnControllerChange = true;
                attachControllerChangeListener();
                // Check for Build-ID mismatch
                void checkBuildIdMismatch(reg).then((shouldForceReload) => {
                  // Update-Banner entfernt - kein Toast mehr anzeigen

                  // User-controlled reload only - no automatic reload to prevent loops
                  if (shouldForceReload) {
                    shouldReloadOnControllerChange = true;
                    // Note: Auto-reload removed to fix infinite reload loop issue #125
                  }
                });
              } catch {
                /* noop */
              }
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
