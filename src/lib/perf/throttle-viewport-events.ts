/**
 * Zähmt Resize/Scroll/Mutation-Event-Sturm auf mobilen Browsern.
 * Einmal in deiner App initialisieren (z. B. in main.tsx).
 */
export function installViewportEventThrottles() {
  const rafThrottle = (fn: (...a: any[]) => void) => {
    let ticking = false;
    return (...args: any[]) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        try {
          fn(...args);
        } finally {
          ticking = false;
        }
      });
    };
  };

  const debouncedResize = rafThrottle(() => {
    // Platz für globale Layout-Updates, falls du welche hast
    // console.debug("[perf] resize tick");
  });

  const debouncedScroll = rafThrottle(() => {
    // console.debug("[perf] scroll tick");
  });

  window.addEventListener("resize", debouncedResize, { passive: true });
  window.addEventListener("scroll", debouncedScroll, { passive: true });

  const mo = new MutationObserver(
    rafThrottle(() => {
      // console.debug("[perf] mutation tick");
    }),
  );
  mo.observe(document.documentElement, { childList: true, subtree: true, attributes: false });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Wenn Seite im Hintergrund: Listener temporär ignorieren
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("scroll", debouncedScroll);
      mo.disconnect();
    } else {
      window.addEventListener("resize", debouncedResize, { passive: true });
      window.addEventListener("scroll", debouncedScroll, { passive: true });
      mo.observe(document.documentElement, { childList: true, subtree: true, attributes: false });
    }
  });
}
