import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

// vite-plugin-pwa will inject precache manifest here
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

const params = new URL(self.location.href).searchParams;
const BUILD_ID = params.get("build") ?? "dev";
const VERSION_SUFFIX = BUILD_ID.slice(-8);
// Dynamic cache versioning with forward compatibility
const SW_VERSION = `v2.3.0-${VERSION_SUFFIX}`;
const HTML_CACHE = `html-${SW_VERSION}`;
const ASSET_CACHE = `assets-${SW_VERSION}`;
const OFFLINE_URL = "/offline.html";

// Future-proof cache naming patterns
const CACHE_PATTERNS = {
  // Current cache types
  HTML: /^html-v\d+\.\d+\.\d+-\w+$/,
  ASSETS: /^assets-v\d+\.\d+\.\d+-\w+$/,

  // Reserved patterns for future cache types
  API: /^api-v\d+\.\d+\.\d+-\w+$/,
  USER_DATA: /^userdata-v\d+\.\d+\.\d+-\w+$/,
  STATIC: /^static-v\d+\.\d+\.\d+-\w+$/,
  DYNAMIC: /^dynamic-v\d+\.\d+\.\d+-\w+$/,

  // Generic pattern for any app-versioned cache
  APP_VERSIONED: /^[\w-]+-v\d+\.\d+\.\d+-\w+$/,
};

// Current version's expected caches (dynamic generation)
const CURRENT_CACHES = new Set([HTML_CACHE, ASSET_CACHE]);

// Enhanced cache busting configuration
const FORCE_UPDATE_TIMESTAMP = Date.now();
const CACHE_STRATEGY = {
  HTML: "network-first",
  ASSETS: "stale-while-revalidate",
  API: "network-only",
};

const ASSET_DESTINATIONS = new Set([
  "style",
  "script",
  "font",
  "image",
  "audio",
  "video",
  "worker",
]);
const ASSET_EXTENSIONS = [
  ".js",
  ".css",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".avif",
  ".ico",
  ".json",
  ".webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(HTML_CACHE);
        await cache.addAll([OFFLINE_URL]);
      } catch (error) {
        console.warn("[SW] precache failed", error);
      }
    })(),
  );
  self.skipWaiting();
});

/**
 * Determines if a cache should be preserved during cleanup
 * @param {string} cacheName - The cache name to evaluate
 * @returns {boolean} - True if cache should be preserved
 */
function shouldPreserveCache(cacheName) {
  // 1. Always preserve current version caches
  if (CURRENT_CACHES.has(cacheName)) {
    return true;
  }

  // 2. Preserve any cache matching known patterns (future compatibility)
  const isAppVersioned = Object.values(CACHE_PATTERNS).some((pattern) => pattern.test(cacheName));

  if (isAppVersioned) {
    // Extract version from cache name for intelligent cleanup
    const versionMatch = cacheName.match(/v(\d+)\.(\d+)\.(\d+)/);
    if (versionMatch) {
      const [, major, minor] = versionMatch;
      const currentVersionMatch = SW_VERSION.match(/v(\d+)\.(\d+)\.(\d+)/);

      if (currentVersionMatch) {
        const [, currentMajor, currentMinor] = currentVersionMatch;

        // Preserve caches from same major version (forwards compatibility)
        if (major === currentMajor) {
          // But only preserve if version is not too far behind
          const currentMinorInt = parseInt(currentMinor);
          const minorInt = parseInt(minor);

          // Keep caches within reasonable minor version range (e.g., ±2 versions)
          if (Math.abs(currentMinorInt - minorInt) <= 2) {
            console.log(`[SW] Preserving recent same-major cache: ${cacheName}`);
            return true;
          } else {
            console.log(
              `[SW] Deleting old minor version: ${cacheName} (too far behind current ${SW_VERSION})`,
            );
            return false;
          }
        }

        // Preserve newer versions (rollback safety)
        if (
          parseInt(major) > parseInt(currentMajor) ||
          (major === currentMajor && parseInt(minor) > parseInt(currentMinor))
        ) {
          console.log(`[SW] Preserving newer cache for rollback: ${cacheName}`);
          return true;
        }
      }
    }
  }

  // 3. Preserve non-versioned caches (might be from other apps or manual caches)
  if (!cacheName.includes("-v") && !cacheName.includes("workbox")) {
    console.log(`[SW] Preserving non-versioned cache: ${cacheName}`);
    return true;
  }

  return false;
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Intelligent cache cleanup with forward/backward compatibility
      const keys = await caches.keys();

      // Categorize caches for cleanup decision
      const cachesToDelete = [];
      const cachesToPreserve = [];

      for (const key of keys) {
        if (shouldPreserveCache(key)) {
          cachesToPreserve.push(key);
        } else {
          cachesToDelete.push(key);
        }
      }

      console.log(
        `[SW] Cache analysis: ${cachesToPreserve.length} to preserve, ${cachesToDelete.length} to delete`,
      );

      // Delete only truly stale caches
      const deletePromises = cachesToDelete.map(async (key) => {
        console.log("[SW] Deleting stale cache:", key);
        try {
          await caches.delete(key);
          return { key, success: true };
        } catch (error) {
          console.warn("[SW] Failed to delete cache:", key, error);
          return { key, success: false };
        }
      });

      const results = await Promise.allSettled(deletePromises);
      const deletedCount = results.filter(
        (r) => r.status === "fulfilled" && r.value.success,
      ).length;

      console.log(
        `[SW] Smart cleanup: ${deletedCount}/${cachesToDelete.length} stale caches removed, ${cachesToPreserve.length} preserved`,
      );

      // Claim all clients immediately to ensure fresh assets
      await self.clients.claim();

      // Notify clients about the activation with detailed cache info
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => {
        client.postMessage({
          type: "SW_ACTIVATED",
          version: SW_VERSION,
          cachesCleaned: deletedCount,
          cachesPreserved: cachesToPreserve.length,
          cacheStrategy: "smart-versioned",
        });
      });

      console.log(
        "[SW] Activated with version:",
        SW_VERSION,
        "and claimed",
        clients.length,
        "clients",
      );
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (!event.data) return;
  if (event.data === "SKIP_WAITING" || event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  // Enhanced update handling
  if (event.data?.type === "CHECK_FOR_UPDATE") {
    event.ports[0]?.postMessage({ type: "UPDATE_AVAILABLE", version: SW_VERSION });
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Nur gleiche Origin behandeln
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (shouldHandleAsAsset(request, url)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

function shouldHandleAsAsset(request, url) {
  if (ASSET_DESTINATIONS.has(request.destination)) return true;
  if (url.pathname.startsWith("/assets/")) return true;
  return ASSET_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
}

async function networkFirst(request) {
  const cache = await caches.open(HTML_CACHE);
  try {
    // Enhanced network-first strategy with cache busting
    const url = new URL(request.url);

    // Add cache-busting parameter for HTML requests to ensure fresh content
    if (!url.searchParams.has("sw-bust")) {
      url.searchParams.set("sw-bust", FORCE_UPDATE_TIMESTAMP.toString());
      const bustRequest = new Request(url.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        mode: request.mode,
        credentials: request.credentials,
        cache: "no-cache", // Force fresh fetch
      });

      const response = await fetch(bustRequest);
      if (response && response.ok) {
        // Cache the original request (without cache-busting param)
        if (response.headers.get("content-type")?.includes("text/html")) {
          cache.put(request, response.clone()).catch(() => {});
        }
      }
      return response;
    }

    // Fallback to normal fetch if cache-busting param already exists
    const response = await fetch(request);
    if (response && response.ok) {
      if (response.headers.get("content-type")?.includes("text/html")) {
        cache.put(request, response.clone()).catch(() => {});
      }
    }
    return response;
  } catch (error) {
    console.warn("[SW] Network failed for navigation, falling back to cache:", error);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    const offline = await cache.match(OFFLINE_URL);
    if (offline) {
      return offline;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok && response.status < 400) {
        // Clone response before caching to avoid stream consumption
        const responseClone = response.clone();
        cache.put(request, responseClone).catch(() => {});
      }
      return response;
    })
    .catch(() => undefined);

  // Return cached version immediately if available, then update in background
  if (cached) {
    // Update cache in background without waiting
    fetchPromise.catch(() => {});
    return cached;
  }

  // No cached version, wait for network
  return (await fetchPromise) || fetch(request);
}
