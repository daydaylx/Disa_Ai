const CACHE = "disa-dev-cache";
const OFFLINE_URLS = ["/", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(OFFLINE_URLS))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((stale) => caches.delete(stale))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches
            .open(CACHE)
            .then((cache) => cache.put(event.request, responseClone))
            .catch(() => {});
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE);
          if (event.request.mode === "navigate") {
            return (await cache.match("/")) ?? Response.error();
          }
          return (await cache.match(event.request)) ?? (await cache.match("/")) ?? Response.error();
        });
    }),
  );
});
