/* Lightweight UI guard: safe for eslint without DOM type names */
export function ensureNavGuards(): void {
  const fixTabbars = () => { /* noop: reserved for future layout fixes */ };
  const onr = () => { fixTabbars(); };

  if (typeof window !== "undefined") {
    // keine DOM-Typen im Codepfad, damit eslint no-undef nicht triggert
    window.addEventListener("resize", onr as any, { passive: true } as any);
    window.addEventListener("beforeunload", () => {
      window.removeEventListener("resize", onr as any);
    });
  }
}

(function init() {
  if (typeof document === "undefined") return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ensureNavGuards(), { once: true } as any);
  } else {
    ensureNavGuards();
  }
})();
