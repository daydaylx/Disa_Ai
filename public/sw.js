/**
 * Disa AI Service Worker
 * Progressive Web App functionality for offline support and caching
 */

// First, attempt to load Workbox from CDN with error handling
try {
  importScripts("https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js");

  if (workbox) {
    console.log("Workbox loaded successfully");

    const { precacheAndRoute, cleanupOutdatedCaches, matchPrecache } = workbox.precaching;
    const { clientsClaim } = workbox.core;

    // Export for use in rest of service worker
    self.workbox = workbox;
    self.precacheAndRoute = precacheAndRoute;
    self.cleanupOutdatedCaches = cleanupOutdatedCaches;
    self.matchPrecache = matchPrecache;
    self.clientsClaim = clientsClaim;
  } else {
    console.log("Workbox failed to load from CDN");
  }
} catch (e) {
  console.warn("Failed to load Workbox from CDN:", e);
  console.log("Using fallback approach without Workbox");
}

const BUILD_VERSION = Date.now()
  .toString()
  .replace(/[^0-9A-Za-z]/g, "");
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

// Clean up outdated caches - use fallback if Workbox not available
if (typeof cleanupOutdatedCaches !== "undefined") {
  cleanupOutdatedCaches();
} else {
  console.log("cleanupOutdatedCaches not available, using manual cache cleanup");
}

// Take control of all clients immediately - use fallback if Workbox not available
if (typeof clientsClaim !== "undefined") {
  clientsClaim();
} else {
  self.clients.claim();
  console.log("Manual client claiming used instead of Workbox");
}

// Precache all build assets - use fallback if Workbox not available
if (typeof precacheAndRoute !== "undefined") {
  precacheAndRoute(self.__WB_MANIFEST);
} else {
  console.log("Precaching not available via Workbox, using manual precaching if available");
  // Fallback: register for navigation handling but skip precaching
}

// Handle offline fallback for navigation requests
self.addEventListener("fetch", (event) => {
  // Only handle navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Wait for the preloadResponse to settle before proceeding
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
          // Use Workbox matchPrecache if available, otherwise use standard cache matching
          let precachedShell;
          if (typeof matchPrecache !== "undefined") {
            precachedShell = await matchPrecache(APP_SHELL_URL);
          }

          if (precachedShell) {
            return precachedShell;
          }
          return caches.match(APP_SHELL_URL);
        }
      })(),
    );

    // Use waitUntil to ensure preloadResponse settles for navigation requests
    if (event.preloadResponse) {
      event.waitUntil(event.preloadResponse);
    }
  }
});

// Skip waiting and immediately activate new service worker
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
