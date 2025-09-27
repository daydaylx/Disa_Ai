const SW_VERSION = "v1.0.0-79356518";
const HTML_CACHE = `html-${SW_VERSION}`;
const ASSET_CACHE = `assets-${SW_VERSION}`;
const OFFLINE_URL = "/offline.html";

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

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Clean old caches
      const expected = new Set([HTML_CACHE, ASSET_CACHE]);
      const keys = await caches.keys();
      const deletePromises = keys
        .filter((key) => !expected.has(key))
        .map((key) => {
          console.log("[SW] Deleting old cache:", key);
          return caches.delete(key);
        });

      await Promise.all(deletePromises);

      // Claim all clients immediately
      await self.clients.claim();

      console.log("[SW] Activated with version:", SW_VERSION);
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
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (error) {
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
