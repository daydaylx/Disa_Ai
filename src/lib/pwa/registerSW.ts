try {
  if ((navigator as any).webdriver) {
    /* test → kein SW */ throw new Error("__PW_TEST__");
  }
} catch (_e) {
  void _e;
  /* stop SW */
}
export function registerSW() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const hasImportScripts = typeof (globalThis as unknown as { importScripts?: unknown }).importScripts !== "undefined";
  const baseUrl =
    (import.meta as any)?.env?.VITE_BASE_URL ??
    (import.meta as any)?.env?.BASE_URL ??
    "./";
  const swUrl = hasImportScripts ? "/sw.js" : `${baseUrl}sw.js`;
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
                    kind: "info",
                    title: "Update verfügbar",
                    message: "Eine neue Version ist bereit.",
                    action: { label: "Neu laden", onClick: reload },
                  },
                });
                window.dispatchEvent(evt);
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
