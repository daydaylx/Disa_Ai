export function registerSW() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const swUrl = "/sw.js";
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(swUrl).then((reg) => {
      // alle 30min nach Updates schauen
      setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);

      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        nw?.addEventListener("statechange", () => {
          // Falls du einen Update-Toast willst, kannst du hier reagieren:
          // if (nw.state === "installed" && navigator.serviceWorker.controller) { ... }
        });
      });
    }).catch(() => {});
  });
}
