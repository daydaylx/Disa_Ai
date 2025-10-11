import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

// Enhanced error handling for PWA stability
try {
  // vite-plugin-pwa will inject precache manifest here
  precacheAndRoute(self.__WB_MANIFEST || []);
  cleanupOutdatedCaches();
  console.log("[SW] Precaching initialized successfully");
} catch (error) {
  console.error("[SW] Precaching failed:", error);
  // Graceful degradation - SW still works without precaching
}

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
  console.log(`[SW] Installing version ${SW_VERSION}`);

  event.waitUntil(
    (async () => {
      try {
        // Pre-cache essential resources
        const cache = await caches.open(HTML_CACHE);

        // Try to pre-cache offline page
        try {
          await cache.add(OFFLINE_URL);
          console.log("[SW] Successfully pre-cached offline page");
        } catch (offlineError) {
          console.warn("[SW] Failed to pre-cache offline page:", offlineError);
          // Don't fail installation if offline page can't be cached
        }

        // Pre-cache other essential resources if needed
        // Note: Main app resources are handled by workbox-precaching

        console.log(`[SW] Installation completed for version ${SW_VERSION}`);
      } catch (error) {
        console.error("[SW] Installation failed:", error);
        // Don't prevent installation - let it continue even with cache errors
      }
    })(),
  );

  // Immediately take control of the page
  self.skipWaiting();
});

/**
 * Safely parses version from a cache name
 * @param {string} cacheName - The cache name to parse
 * @returns {Object|null} - Version object {major, minor, patch} or null if invalid
 */
function parseVersion(cacheName) {
  try {
    const versionMatch = cacheName.match(/v(\d+)\.(\d+)\.(\d+)/);
    if (!versionMatch) return null;

    const [, major, minor, patch] = versionMatch;
    return {
      major: parseInt(major, 10),
      minor: parseInt(minor, 10),
      patch: parseInt(patch, 10),
      toString: () => `${major}.${minor}.${patch}`,
    };
  } catch (error) {
    console.warn(`[SW] Failed to parse version from cache name: ${cacheName}`, error);
    return null;
  }
}

/**
 * Determines if a cache should be preserved during cleanup
 * @param {string} cacheName - The cache name to evaluate
 * @returns {boolean} - True if cache should be preserved
 */
function shouldPreserveCache(cacheName) {
  try {
    // 1. Always preserve current version caches
    if (CURRENT_CACHES.has(cacheName)) {
      return true;
    }

    // 2. Preserve workbox-managed caches (unless they're very old)
    if (cacheName.includes("workbox-precache")) {
      return true;
    }

    // 3. Check if it's an app-versioned cache
    const isAppVersioned = Object.values(CACHE_PATTERNS).some((pattern) => {
      try {
        return pattern.test(cacheName);
      } catch (error) {
        console.warn(`[SW] Invalid cache pattern test for ${cacheName}:`, error);
        return false;
      }
    });

    if (isAppVersioned) {
      const cacheVersion = parseVersion(cacheName);
      const currentVersion = parseVersion(SW_VERSION);

      if (!cacheVersion || !currentVersion) {
        console.warn(`[SW] Version parsing failed for cache: ${cacheName}`);
        return false; // Delete unparseable versioned caches
      }

      // Simplified version comparison logic
      const versionDiff = {
        major: currentVersion.major - cacheVersion.major,
        minor: currentVersion.minor - cacheVersion.minor,
      };

      // Preserve current and future major versions
      if (versionDiff.major <= 0) {
        console.log(`[SW] Preserving current/future major version cache: ${cacheName}`);
        return true;
      }

      // Delete old major versions (breaking changes expected)
      if (versionDiff.major > 0) {
        console.log(
          `[SW] Deleting old major version cache: ${cacheName} (current: ${currentVersion.toString()})`,
        );
        return false;
      }
    }

    // 4. Preserve non-versioned caches (might be from other apps or manual caches)
    if (!cacheName.includes("-v") && !cacheName.includes("workbox")) {
      console.log(`[SW] Preserving non-versioned cache: ${cacheName}`);
      return true;
    }

    // 5. Default: preserve unknown caches to avoid breaking other apps
    console.log(`[SW] Preserving unknown cache (safety): ${cacheName}`);
    return true;
  } catch (error) {
    console.error(`[SW] Error in shouldPreserveCache for ${cacheName}:`, error);
    return true; // Preserve on error to be safe
  }
}

self.addEventListener("activate", (event) => {
  console.log(`[SW] Activating version ${SW_VERSION}`);

  event.waitUntil(
    (async () => {
      try {
        // Intelligent cache cleanup with forward/backward compatibility
        let keys;
        try {
          keys = await caches.keys();
        } catch (error) {
          console.error("[SW] Failed to get cache keys:", error);
          keys = []; // Continue with empty array
        }

        // Categorize caches for cleanup decision
        const cachesToDelete = [];
        const cachesToPreserve = [];

        for (const key of keys) {
          try {
            if (shouldPreserveCache(key)) {
              cachesToPreserve.push(key);
            } else {
              cachesToDelete.push(key);
            }
          } catch (error) {
            console.warn(`[SW] Error categorizing cache ${key}:`, error);
            cachesToPreserve.push(key); // Preserve on error to be safe
          }
        }

        console.log(
          `[SW] Cache analysis: ${cachesToPreserve.length} to preserve, ${cachesToDelete.length} to delete`,
        );

        // Delete only truly stale caches with error handling
        let deletedCount = 0;
        if (cachesToDelete.length > 0) {
          const deletePromises = cachesToDelete.map(async (key) => {
            console.log("[SW] Deleting stale cache:", key);
            try {
              const deleted = await caches.delete(key);
              return { key, success: deleted };
            } catch (error) {
              console.warn("[SW] Failed to delete cache:", key, error);
              return { key, success: false };
            }
          });

          try {
            const results = await Promise.allSettled(deletePromises);
            deletedCount = results.filter(
              (r) => r.status === "fulfilled" && r.value?.success === true,
            ).length;
          } catch (error) {
            console.error("[SW] Error during cache cleanup:", error);
          }
        }

        console.log(
          `[SW] Smart cleanup: ${deletedCount}/${cachesToDelete.length} stale caches removed, ${cachesToPreserve.length} preserved`,
        );

        // Claim all clients immediately to ensure fresh assets
        try {
          await self.clients.claim();
          console.log("[SW] Successfully claimed all clients");
        } catch (error) {
          console.error("[SW] Failed to claim clients:", error);
        }

        // Notify clients about the activation with detailed cache info
        try {
          const clients = await self.clients.matchAll({ type: "window" });
          const activationMessage = {
            type: "SW_ACTIVATED",
            version: SW_VERSION,
            cachesCleaned: deletedCount,
            cachesPreserved: cachesToPreserve.length,
            cacheStrategy: "smart-versioned",
            timestamp: Date.now(),
          };

          clients.forEach((client) => {
            try {
              client.postMessage(activationMessage);
            } catch (error) {
              console.warn("[SW] Failed to notify client:", error);
            }
          });

          console.log(
            `[SW] Activated version ${SW_VERSION} and notified ${clients.length} clients`,
          );
        } catch (error) {
          console.error("[SW] Failed to get clients for notification:", error);
        }
      } catch (error) {
        console.error("[SW] Activation failed:", error);
        // Don't prevent activation - let it continue even with errors
      }
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
  let cache;

  try {
    cache = await caches.open(HTML_CACHE);
  } catch (error) {
    console.error("[SW] Failed to open HTML cache:", error);
    // Continue without caching if cache fails
  }

  try {
    // Network-first strategy with robust error handling
    const url = new URL(request.url);
    let response;

    // Add cache-busting parameter for HTML requests to ensure fresh content
    if (!url.searchParams.has("sw-bust")) {
      url.searchParams.set("sw-bust", FORCE_UPDATE_TIMESTAMP.toString());

      try {
        const bustRequest = new Request(url.toString(), {
          method: request.method,
          headers: request.headers,
          body: request.body,
          mode: request.mode,
          credentials: request.credentials,
          cache: "no-cache", // Force fresh fetch
        });

        response = await fetch(bustRequest);
      } catch (fetchError) {
        console.warn("[SW] Cache-busting fetch failed, trying original:", fetchError);
        // Fallback to original request
        response = await fetch(request);
      }
    } else {
      // Direct fetch if cache-busting param already exists
      response = await fetch(request);
    }

    // Cache successful HTML responses
    if (response && response.ok && cache) {
      try {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("text/html")) {
          // Clone before caching to avoid stream consumption
          const responseClone = response.clone();
          cache.put(request, responseClone).catch((cacheError) => {
            console.warn("[SW] Failed to cache HTML response:", cacheError);
          });
        }
      } catch (cacheError) {
        console.warn("[SW] Error processing response for caching:", cacheError);
      }
    }

    return response;
  } catch (networkError) {
    console.warn("[SW] Network failed for navigation, falling back to cache:", networkError);

    if (!cache) {
      throw new Error("Network failed and cache unavailable");
    }

    try {
      // Try to find cached version of the request
      const cached = await cache.match(request);
      if (cached) {
        console.log("[SW] Serving cached HTML for:", request.url);
        return cached;
      }

      // Try offline page as last resort
      const offline = await cache.match(OFFLINE_URL);
      if (offline) {
        console.log("[SW] Serving offline page for:", request.url);
        return offline;
      }

      // No fallback available
      throw new Error("No cached fallback available");
    } catch (cacheError) {
      console.error("[SW] Cache fallback failed:", cacheError);
      throw networkError; // Throw original network error
    }
  }
}

async function staleWhileRevalidate(request) {
  let cache;

  try {
    cache = await caches.open(ASSET_CACHE);
  } catch (error) {
    console.error("[SW] Failed to open asset cache:", error);
    // Continue without caching if cache fails
    return fetch(request);
  }

  let cached;
  try {
    cached = await cache.match(request);
  } catch (error) {
    console.warn("[SW] Failed to match request in cache:", error);
    cached = null;
  }

  // Background fetch with robust error handling
  const fetchPromise = fetch(request)
    .then((response) => {
      if (!response) return undefined;

      // Only cache successful responses
      if (response.ok && response.status < 400 && cache) {
        try {
          // Clone response before caching to avoid stream consumption
          const responseClone = response.clone();
          cache.put(request, responseClone).catch((cacheError) => {
            console.warn("[SW] Failed to update cache for asset:", request.url, cacheError);
          });
        } catch (cloneError) {
          console.warn("[SW] Failed to clone response for caching:", cloneError);
        }
      }
      return response;
    })
    .catch((networkError) => {
      console.warn("[SW] Network fetch failed for asset:", request.url, networkError);
      return undefined;
    });

  // Return cached version immediately if available, then update in background
  if (cached) {
    // Update cache in background without waiting
    fetchPromise.catch(() => {
      // Silent fail for background updates
    });
    return cached;
  }

  // No cached version, wait for network with fallback
  try {
    const networkResponse = await fetchPromise;
    if (networkResponse) {
      return networkResponse;
    }

    // Network failed and no cache, try one more direct fetch
    console.log("[SW] Retrying direct fetch for asset:", request.url);
    return await fetch(request);
  } catch (finalError) {
    console.error("[SW] All asset fetch attempts failed:", request.url, finalError);
    throw finalError;
  }
}
