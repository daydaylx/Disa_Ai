// Global: nur SW-Reset/Nuke-Helper (keine Legacy‑Toasts mehr, React‑Toasts übernehmen)

(function () {
  // Intentionally left minimal — Toasts laufen über React (ToastsProvider).

  // ---- SW Nuke (optional): ?nuke-sw=1 killt SW + Caches und lädt frisch ----
  try {
    const s = new URLSearchParams(location.search);
    if (s.has("nuke-sw") || s.has("no-sw")) {
      void navigator.serviceWorker?.getRegistrations?.().then((rs) => rs.forEach((r) => r.unregister()));
      if ("caches" in window) void caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      const u = new URL(location.href);
      u.searchParams.delete("nuke-sw");
      u.searchParams.delete("no-sw");
      setTimeout(() => location.replace(u.toString()), 100);
    }
  } catch {
    /* ignore */
  }
})();
export {};
