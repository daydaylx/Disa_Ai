/**
 * Disa AI Service Worker
 * Progressive Web App functionality for offline support and caching
 */

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

// Enable navigation preload for faster loading
self.addEventListener("activate", (event) => {
  if ("navigationPreload" in self.registration) {
    event.waitUntil(self.registration.navigationPreload.enable());
  }
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
      fetch(event.request).catch(() => {
        // Return cached index.html for offline navigation
        return caches.match("/index.html");
      }),
    );
  }
});

// Skip waiting and immediately activate new service worker
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
