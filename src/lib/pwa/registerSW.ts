export function registerSW() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const swUrl = "/sw.js";
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
                  } catch (e) {
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
