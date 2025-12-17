type SafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

function parsePx(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readSafeAreaInsets(): SafeAreaInsets {
  if (typeof document === "undefined") {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = [
    "position: absolute",
    "inset: 0",
    "pointer-events: none",
    "visibility: hidden",
    "padding-top: env(safe-area-inset-top, 0px)",
    "padding-right: env(safe-area-inset-right, 0px)",
    "padding-bottom: env(safe-area-inset-bottom, 0px)",
    "padding-left: env(safe-area-inset-left, 0px)",
  ].join(";");

  document.body.appendChild(probe);
  const style = getComputedStyle(probe);

  const insets: SafeAreaInsets = {
    top: parsePx(style.paddingTop),
    right: parsePx(style.paddingRight),
    bottom: parsePx(style.paddingBottom),
    left: parsePx(style.paddingLeft),
  };

  probe.remove();
  return insets;
}

function applySafeAreaInsets(insets: SafeAreaInsets): void {
  const root = document.documentElement;
  root.style.setProperty("--safe-area-top", `${insets.top}px`);
  root.style.setProperty("--safe-area-right", `${insets.right}px`);
  root.style.setProperty("--safe-area-bottom", `${insets.bottom}px`);
  root.style.setProperty("--safe-area-left", `${insets.left}px`);

  // Back-compat aliases used by some layout CSS
  root.style.setProperty("--mobile-safe-top", `${insets.top}px`);
  root.style.setProperty("--mobile-safe-right", `${insets.right}px`);
  root.style.setProperty("--mobile-safe-bottom", `${insets.bottom}px`);
  root.style.setProperty("--mobile-safe-left", `${insets.left}px`);

  const hasNotch = insets.top > 0 || insets.left > 0 || insets.right > 0;
  if (hasNotch) {
    root.dataset.hasNotch = "true";
  } else {
    delete root.dataset.hasNotch;
  }
}

function applyEffectsPreference(): void {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const saveData = Boolean(connection?.saveData);
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  const shouldReduce =
    Boolean(prefersReducedMotion) ||
    Boolean(saveData) ||
    (typeof deviceMemory === "number" && deviceMemory <= 4);

  root.dataset.effects = shouldReduce ? "reduced" : "full";
}

export function initializeDeviceSafeArea(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!document.body) return;

  let rafId = 0;
  const update = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      applySafeAreaInsets(readSafeAreaInsets());
      applyEffectsPreference();
    });
  };

  update();

  window.addEventListener("resize", update, { passive: true });
  window.addEventListener("orientationchange", update, { passive: true });

  const motionMedia = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  motionMedia?.addEventListener?.("change", update);
}

// Progressive enhancement: run on import.
if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initializeDeviceSafeArea(), { once: true });
  } else {
    initializeDeviceSafeArea();
  }
}
