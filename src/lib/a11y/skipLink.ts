import { focusMain } from "./focus";

export function installSkipLinkFocus(selector = "a.skip-link", targetId = "main") {
  if (typeof window === "undefined") return;
  const handler = (e: Event) => {
    const a = e.target as HTMLElement | null;
    if (!a) return;
    // Klick/Enter auf Skip-Link?
    if (a instanceof HTMLAnchorElement && a.matches(selector)) {
      e.preventDefault();
      // Hash aktualisieren (optional, für Back/History)
      if (a.hash) history.replaceState(null, "", a.hash);
      focusMain(targetId);
    }
  };
  // Capture: fängt auch Enter aus der Tastatur-Navigation ab
  document.addEventListener("click", handler, true);
  document.addEventListener("keydown", (ev) => {
    // Fallback für „Enter“ per Tastatur, falls click nicht feuert
    if (ev.key !== "Enter") return;
    const el = document.activeElement;
    if (el instanceof HTMLAnchorElement && el.matches(selector)) {
      ev.preventDefault();
      if (el.hash) history.replaceState(null, "", el.hash);
      focusMain(targetId);
    }
  }, true);
}
