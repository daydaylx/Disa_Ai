// Global: Toaster & Copy-Feedback (side-effect beim Import)

type Intent = "success" | "warning" | "error" | "info";

(function () {
  // ---- Toaster (ein Slot, 3s, aria-live) ----
  const TID = "app-global-toast";
  function ensureToaster(): HTMLDivElement {
    let el = document.getElementById(TID) as HTMLDivElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = TID;
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      Object.assign(el.style, {
        position: "fixed",
        zIndex: "9999",
        top: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "8px 12px",
        borderRadius: "10px",
        fontSize: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,.35)",
        pointerEvents: "none",
        display: "none",
        color: "#0b1220",
        background: "rgba(78,133,255,.95)", // default brand
      } as CSSStyleDeclaration);
      document.body.appendChild(el);
    }
    return el;
  }
  function colorFor(intent: Intent) {
    switch (intent) {
      case "success":
        return "rgba(16,185,129,.95)"; // green
      case "warning":
        return "rgba(245,158,11,.95)"; // amber
      case "error":
        return "rgba(239,68,68,.95)"; // red
      default:
        return "rgba(78,133,255,.95)"; // brand
    }
  }
  let hideTimer: number | null = null;
  function showToast(message: string, intent: Intent = "success", ms = 3000) {
    const el = ensureToaster();
    el.style.background = colorFor(intent);
    el.textContent = message;
    el.style.display = "block";
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      el.style.display = "none";
    }, ms);
  }

  // Öffentliche API via CustomEvent (weiter kompatibel zu deinem System)
  window.addEventListener("toast", (e: Event) => {
    const d = (e as CustomEvent).detail || {};
    const msg: string = d.message ?? "OK";
    const intent: Intent = d.intent ?? "success";
    const ms: number = d.ms ?? 3000;
    showToast(msg, intent, ms);
  });

  // ---- Copy-Buttons global abfangen -> „Kopiert“ anzeigen ----
  function isCopyButton(el: Element | null): boolean {
    if (!el) return false;
    if (el.closest('[aria-label="Code kopieren"]')) return true;
    if (el.closest('[title="Code kopieren"]')) return true;
    const target = el.closest('button,[role="button"]');
    if (target) {
      const txt = (target.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (txt === "code kopieren") return true;
    }
    return false;
  }
  window.addEventListener(
    "click",
    (evt) => {
      const t = evt.target as Element | null;
      if (isCopyButton(t)) showToast("Kopiert", "success", 2000);
    },
    { capture: true },
  );
  window.addEventListener(
    "keydown",
    (evt) => {
      if (evt.key !== "Enter" && evt.key !== " ") return;
      const t = evt.target as Element | null;
      if (isCopyButton(t)) showToast("Kopiert", "success", 2000);
    },
    { capture: true },
  );

  // ---- SW Nuke (optional): ?nuke-sw=1 killt SW + Caches und lädt frisch ----
  try {
    const s = new URLSearchParams(location.search);
    if (s.has("nuke-sw") || s.has("no-sw")) {
      navigator.serviceWorker?.getRegistrations?.().then((rs) => rs.forEach((r) => r.unregister()));
      if ("caches" in window) caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
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
