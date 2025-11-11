/**
 * Recovery utilities for resetting the application state
 * Used when critical errors occur (e.g., vite:preloadError, chunk load failures)
 */

import { safeError, safeWarn } from "../utils/production-logger";

/**
 * Comprehensive app reset utility
 * - Unregisters all Service Workers
 * - Clears all caches
 * - Clears localStorage
 * - Reloads the page
 */
export async function resetApp(): Promise<void> {
  safeWarn("[RECOVERY] Starting full app reset...");

  try {
    // 1. Unregister all Service Workers
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        safeWarn("[RECOVERY] Service Worker unregistered:", registration.scope);
      }
    }

    // 2. Clear all caches
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        safeWarn("[RECOVERY] Cache deleted:", cacheName);
      }
    }

    // 3. Clear localStorage
    try {
      localStorage.clear();
      safeWarn("[RECOVERY] localStorage cleared");
    } catch (error) {
      safeError("[RECOVERY] Failed to clear localStorage:", error);
    }

    // 4. Clear sessionStorage (optional but thorough)
    try {
      sessionStorage.clear();
      safeWarn("[RECOVERY] sessionStorage cleared");
    } catch (error) {
      safeError("[RECOVERY] Failed to clear sessionStorage:", error);
    }

    safeWarn("[RECOVERY] Reset complete. Reloading...");
  } catch (error) {
    safeError("[RECOVERY] Reset failed:", error);
  } finally {
    // Always reload, even if some steps failed
    window.location.reload();
  }
}

/**
 * Simple page reload utility
 */
export function reloadApp(): void {
  safeWarn("[RECOVERY] Reloading app...");
  window.location.reload();
}
