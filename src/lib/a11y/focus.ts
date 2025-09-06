/* eslint-disable no-empty */
export function focusMain(id = "main") {
  const el = document.getElementById(id);
  if (!el) return;
  // Dauerhaft fokussierbar machen – nicht zurücksetzen!
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  (el as HTMLElement).focus({ preventScroll: true });
  // optional: sanft zum Anfang scrollen
  try {
    el.scrollIntoView({ block: "start", behavior: "smooth" });
  } catch {}
}

/** Bei Mount Fokus auf #main setzen (für echte Seitenwechsel). */
export function focusOnMount(id = "main") {
  if (typeof window === "undefined") return;
  queueMicrotask(() => focusMain(id));
}
