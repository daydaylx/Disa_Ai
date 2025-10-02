import { useEffect } from "react";
import { useToasts } from "../components/ui/toast/ToastsProvider";

export function useServiceWorker() {
  const toasts = useToasts();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const swUrl = `/sw.js?build=${import.meta.env.VITE_BUILD_ID}`;
      navigator.serviceWorker.register(swUrl).then(registration => {
        setInterval(() => {
          registration.update();
        }, 1000 * 60 * 60); // Check for updates every hour

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  toasts.push({
                    kind: "info",
                    title: "Update verfügbar",
                    message: "Eine neue Version der App ist verfügbar.",
                    actions: [
                      {
                        label: "Neu laden",
                        onClick: () => {
                          installingWorker.postMessage({ type: "SKIP_WAITING" });
                          window.location.reload();
                        },
                      },
                    ],
                  });
                }
              }
            };
          }
        };
      });
    }
  }, [toasts]);
}
