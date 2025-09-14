/* Disa Ai – minimaler App-Shell Service Worker */
const VERSION = "v1.0.3";
const APP_CACHE = `disa-app-${VERSION}`;
const BASE = self.registration.scope || "/";
const APP_SHELL = [
  BASE,
  new URL("index.html", BASE).pathname,
  new URL("manifest.webmanifest", BASE).pathname,
];

// Files beim Install sicher cachen
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

// Alte Caches entfernen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== APP_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Strategie:
// - statische Assets (/assets/, /icons/) → cache-first
// - App-Shell (/, /index.html) → network-first fallback cache
// - OpenRouter/API → immer Netzwerk (wir cachen KEINE Chat-Antworten)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Nur GET abfangen
  if (req.method !== "GET") return;

  // API: durchlassen
  if (url.hostname.includes("openrouter.ai")) return;

  // Assets: cache-first
  const assetsPrefix = new URL("assets/", BASE).pathname;
  const iconsPrefix = new URL("icons/", BASE).pathname;
  if (url.pathname.startsWith(assetsPrefix) || url.pathname.startsWith(iconsPrefix)) {
    event.respondWith(
      caches.match(req).then((hit) => {
        if (hit) return hit;
        return fetch(req)
          .then((res) => {
            const resCloned = res.clone();
            caches
              .open(APP_CACHE)
              .then((c) => c.put(req, resCloned))
              .catch(() => {});
            return res;
          })
          .catch(() => caches.match(req));
      }),
    );
    return;
  }

  // App-Shell: network-first mit Fallback
  if (url.pathname === BASE || url.pathname.endsWith("/index.html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resCloned = res.clone();
          caches
            .open(APP_CACHE)
            .then((c) => c.put(req, resCloned))
            .catch(() => {});
          return res;
        })
        .catch(() =>
          caches
            .match(req)
            .then((hit) => hit || caches.match(new URL("index.html", BASE).pathname)),
        ),
    );
    return;
  }

  // Sonst: try network → fallback cache
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});

// Update-Benachrichtigung für Clients
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Neue Version verfügbar → Client benachrichtigen
self.addEventListener("waiting", () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "NEW_VERSION_AVAILABLE" });
    });
  });
});
