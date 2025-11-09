/**
 * Disa AI Service Worker
 * Progressive Web App functionality for offline support and caching
 */

import { precacheAndRoute, cleanupOutdatedCaches, matchPrecache } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

const BUILD_VERSION = (import.meta.env?.VITE_BUILD_TIMESTAMP ?? Date.now().toString()).replace(
  /[^0-9A-Za-z]/g,
  "",
);
const RUNTIME_CACHE_PREFIX = "disa-runtime";
const RUNTIME_CACHE_NAME = `${RUNTIME_CACHE_PREFIX}-${BUILD_VERSION}`;
const APP_SHELL_URL = "/index.html";

// Ensure fresh SW activates immediately
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

// Enable navigation preload for faster loading
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }

      // Drop outdated runtime caches aggressively
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys
          .filter((key) => key.startsWith(RUNTIME_CACHE_PREFIX) && key !== RUNTIME_CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
    })(),
  );
});

// Clean up outdated caches
cleanupOutdatedCaches();

// Take control of all clients immediately
clientsClaim();

// Precache all build assets
precacheAndRoute(self.__WB_MANIFEST);

// Handle offline fallback for navigation requests
self.addEventListener("fetch", (event) => {
  // Only handle navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.ok) {
            const runtimeCache = await caches.open(RUNTIME_CACHE_NAME);
            runtimeCache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          // Return cached index.html for offline navigation
          const precachedShell = await matchPrecache(APP_SHELL_URL);
          if (precachedShell) {
            return precachedShell;
          }
          return caches.match(APP_SHELL_URL);
        }
      })(),
    );
  }
});

// Skip waiting and immediately activate new service worker
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
