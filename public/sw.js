const SW_VERSION = "20240505";
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
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".avif",
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
      const expected = new Set([HTML_CACHE, ASSET_CACHE]);
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => !expected.has(key)).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (!event.data) return;
  if (event.data === "SKIP_WAITING" || event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
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
      if (response && response.ok) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    })
    .catch(() => undefined);

  return cached || (await fetchPromise) || fetch(request);
}
