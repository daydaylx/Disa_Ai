import { useEffect, useRef } from "react";

import { useToasts } from "@/ui";

import {
  activateServiceWorkerUpdate,
  getServiceWorkerState,
  registerSW,
  type ServiceWorkerState,
  subscribeToServiceWorker,
} from "../lib/pwa/registerSW";

// Global type for PWA disabled flag
declare global {
  var __VITE_PWA_DISABLED__: boolean;
}

export function useServiceWorker() {
  const { push } = useToasts();
  const refreshToastShown = useRef(false);
  const offlineToastShown = useRef(false);

  useEffect(() => {
    // Skip if not in production or if PWA is disabled
    if (
      !import.meta.env.PROD ||
      (typeof __VITE_PWA_DISABLED__ !== "undefined" && __VITE_PWA_DISABLED__)
    ) {
      return;
    }

    const handleStateChange = (state: ServiceWorkerState) => {
      if (state.needRefresh && !refreshToastShown.current) {
        refreshToastShown.current = true;
        push({
          kind: "info",
          title: "Update verfügbar",
          message: "Eine neue Version ist verfügbar. Jetzt aktualisieren?",
          duration: 0,
          action: {
            label: "Neu laden",
            onClick: () => {
              void activateServiceWorkerUpdate().then(() => {
                import("../lib/utils/reload-manager")
                  .then(({ reloadHelpers }) => {
                    reloadHelpers.serviceWorkerUpdate(0);
                  })
                  .catch(() => {
                    window.location.reload();
                  });
              });
            },
          },
        });
        return;
      }

      if (state.offlineReady && !offlineToastShown.current) {
        offlineToastShown.current = true;
        push({
          kind: "success",
          title: "Offline bereit",
          message: "Disa AI ist jetzt auch ohne Verbindung nutzbar.",
          duration: 4500,
        });
      }
    };

    registerSW();

    // Handle initial state
    const initialState = getServiceWorkerState();
    handleStateChange(initialState);

    // Subscribe to subsequent changes
    const unsubscribe = subscribeToServiceWorker(handleStateChange);

    return () => {
      unsubscribe();
    };
  }, [push]);
}
