/**
 * Service Worker Management Utilities
 * Provides functions to manage, debug, and emergency-uninstall service workers
 */

export interface ServiceWorkerInfo {
  isSupported: boolean;
  isRegistered: boolean;
  version?: string;
  state?: ServiceWorkerState;
  cacheCount?: number;
}

/**
 * Get current Service Worker status and information
 */
export async function getServiceWorkerInfo(): Promise<ServiceWorkerInfo> {
  const info: ServiceWorkerInfo = {
    isSupported: "serviceWorker" in navigator,
    isRegistered: false,
  };

  if (!info.isSupported) {
    return info;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      info.isRegistered = true;

      const sw = registration.active || registration.waiting || registration.installing;
      if (sw) {
        info.state = sw.state;
      }

      // Try to get version from SW
      if (registration.active) {
        try {
          const version = await new Promise<string>((resolve, reject) => {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
              resolve(event.data?.version || "unknown");
            };
            setTimeout(() => reject(new Error("timeout")), 1000);
            registration.active?.postMessage({ type: "CHECK_FOR_UPDATE" }, [messageChannel.port2]);
          });
          info.version = version;
        } catch {
          info.version = "unknown";
        }
      }
    }

    // Get cache count
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      info.cacheCount = cacheNames.length;
    }
  } catch (error) {
    console.error("Failed to get SW info:", error);
  }

  return info;
}

/**
 * Force uninstall Service Worker and clear all caches
 * Use this as emergency recovery function
 */
export async function emergencyUninstallServiceWorker(): Promise<void> {
  console.error("🚨 Emergency SW Uninstall");

  try {
    // Unregister service worker
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const success = await registration.unregister();
        console.error("SW unregistered:", success);
      }
    }

    // Clear all caches
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      console.error("Clearing", cacheNames.length, "caches");

      await Promise.all(
        cacheNames.map(async (name) => {
          try {
            await caches.delete(name);
            console.error("Deleted cache:", name);
          } catch (error) {
            console.error("Failed to delete cache:", name, error);
          }
        }),
      );
    }

    // Clear localStorage
    try {
      localStorage.clear();
      console.error("LocalStorage cleared");
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }

    // Clear sessionStorage
    try {
      sessionStorage.clear();
      console.error("SessionStorage cleared");
    } catch (error) {
      console.error("Failed to clear sessionStorage:", error);
    }

    console.error("✅ Emergency cleanup completed");
  } catch (error) {
    console.error("❌ Emergency cleanup failed:", error);
    throw error;
  }
}

/**
 * Check for Service Worker update and force refresh
 */
export async function checkForServiceWorkerUpdate(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      return false;
    }

    // Force check for update
    await registration.update();

    // Check if there's a waiting SW
    if (registration.waiting) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to check for SW update:", error);
    return false;
  }
}

/**
 * Skip waiting and activate new Service Worker immediately
 */
export async function activateWaitingServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });

      // Wait for controller change
      return new Promise((resolve) => {
        const handleControllerChange = () => {
          navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
          resolve();
        };
        navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

        // Timeout fallback
        setTimeout(() => {
          navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
          resolve();
        }, 5000);
      });
    }
  } catch (error) {
    console.error("Failed to activate waiting SW:", error);
  }
}

/**
 * Debug function to log all Service Worker and cache information
 */
export async function debugServiceWorker(): Promise<void> {
  console.error("🔍 Service Worker Debug Info");

  try {
    const info = await getServiceWorkerInfo();
    console.error("Service Worker Info:", info);

    if ("caches" in window) {
      const cacheNames = await caches.keys();
      console.error("Cache names:", cacheNames);

      for (const name of cacheNames) {
        try {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          console.error(`Cache "${name}": ${keys.length} entries`);
        } catch (error) {
          console.error(`Failed to inspect cache "${name}":`, error);
        }
      }
    }

    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.error("Registration:", {
          scope: registration.scope,
          updateViaCache: registration.updateViaCache,
          installing: registration.installing?.scriptURL,
          waiting: registration.waiting?.scriptURL,
          active: registration.active?.scriptURL,
        });
      }
    }
  } catch (error) {
    console.error("Debug failed:", error);
  }
}

// Add to window for emergency access
if (typeof window !== "undefined") {
  (window as any).__swDebug = {
    info: getServiceWorkerInfo,
    uninstall: emergencyUninstallServiceWorker,
    checkUpdate: checkForServiceWorkerUpdate,
    activate: activateWaitingServiceWorker,
    debug: debugServiceWorker,
  };
}
