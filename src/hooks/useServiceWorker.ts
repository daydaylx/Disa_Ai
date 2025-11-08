import { useEffect } from "react";

import { useToasts } from "../components/ui/toast/ToastsProvider";
import {
  activateServiceWorkerUpdate,
  registerSW,
  subscribeToServiceWorker,
} from "../lib/pwa/registerSW";

export function useServiceWorker() {
  const { push } = useToasts();

  useEffect(() => {
    registerSW();

    let refreshToastShown = false;
    let offlineToastShown = false;

    const unsubscribe = subscribeToServiceWorker((state) => {
      if (state.needRefresh && !refreshToastShown) {
        refreshToastShown = true;
        push({
          kind: "info",
          title: "Update verfügbar",
          message: "Eine neue Version ist verfügbar. Jetzt aktualisieren?",
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

      if (state.offlineReady && !offlineToastShown) {
        offlineToastShown = true;
        push({
          kind: "success",
          title: "Offline bereit",
          message: "Disa AI ist jetzt auch ohne Verbindung nutzbar.",
          duration: 4000,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [push]);
}
