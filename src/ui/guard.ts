/* Lokaler TS-Alias, um ESLint 'no-undef' für DOM-Typnamen zu vermeiden. */

/**
 * UI Guards – resize/orientation helpers ohne ESLint/TS Ärger.
 */
export function onResize(fn: () => void) {
  const handler = () => {
    try {
      fn();
    } catch {
      /* noop */
    }
  };
  window.addEventListener("resize", handler, { passive: true } as const);
  window.addEventListener("orientationchange", handler, { passive: true } as const);
  return () => {
    window.removeEventListener("resize", handler);
    window.removeEventListener("orientationchange", handler);
  };
}

export function fixTabbars() {
  const navs = document.querySelectorAll<HTMLElement>(".tabbar");
  const vh = window.visualViewport?.height ?? window.innerHeight;
  const delta = Math.max(0, vh - window.innerHeight);
  navs.forEach((el) => el.style.setProperty("--safe-bottom", `${delta}px`));
}

export function bootGuards() {
  const off = onResize(fixTabbars);
  window.addEventListener("beforeunload", () => {
    off();
  });
  fixTabbars();
}
