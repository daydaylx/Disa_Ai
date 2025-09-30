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

let controllerListenerAttached = false;
let controllerReloading = false;
let shouldReloadOnControllerChange = false;

function attachControllerChangeListener() {
  if (controllerListenerAttached) return;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!shouldReloadOnControllerChange) return;
    if (controllerReloading) return;
    controllerReloading = true;
    window.location.reload();
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
        const expectedVersion = `v2.0.0-${BUILD_ID.slice(-8)}`;
        const mismatch = swVersion !== expectedVersion;

        // eslint-disable-next-line no-console
        console.log("[SW] Build check:", {
          current: expectedVersion,
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
  if (!("serviceWorker" in navigator)) return;

  const hasImportScripts =
    typeof (globalThis as unknown as { importScripts?: unknown }).importScripts !== "undefined";
  const baseUrl =
    (import.meta as any)?.env?.VITE_BASE_URL ?? (import.meta as any)?.env?.BASE_URL ?? "./";
  const swUrl = hasImportScripts ? `/sw.js?build=${BUILD_ID}` : `${baseUrl}sw.js?build=${BUILD_ID}`;
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        // alle 30min nach Updates schauen
        setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);

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
                  const reload = () => {
                    try {
                      window.location.reload();
                    } catch (_e) {
                      void _e;
                      /* ignore */
                    }
                  };
                  const evt = new CustomEvent("disa:toast", {
                    detail: {
                      kind: shouldForceReload ? "warning" : "info",
                      title: shouldForceReload ? "Update erforderlich" : "Update verfügbar",
                      message: shouldForceReload
                        ? "Neue Version wird geladen..."
                        : "Eine neue Version ist bereit.",
                      action: { label: "Neu laden", onClick: reload },
                    },
                  });
                  window.dispatchEvent(evt);

                  // Auto-reload after 3 seconds if force reload
                  if (shouldForceReload) {
                    shouldReloadOnControllerChange = true;
                    setTimeout(reload, 3000);
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
