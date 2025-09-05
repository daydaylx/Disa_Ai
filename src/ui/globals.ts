// Global initializers: Copy toast + SW nuke via ?nuke-sw=1
(function () {
  // --- tiny body toast (independent of app CSS) ---
  function showBodyToast(message: string, ms = 2000) {
    const id = "copy-toast-global";
    let el = document.getElementById(id) as HTMLDivElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.style.position = "fixed";
      el.style.zIndex = "9999";
      el.style.top = "12px";
      el.style.left = "50%";
      el.style.transform = "translateX(-50%)";
      el.style.background = "rgba(16,185,129,0.95)";
      el.style.color = "#111827";
      el.style.padding = "6px 10px";
      el.style.borderRadius = "8px";
      el.style.fontSize = "12px";
      el.style.boxShadow = "0 4px 10px rgba(0,0,0,0.25)";
      el.style.pointerEvents = "none";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.style.display = "block";
    window.setTimeout(() => { if (el) el.style.display = "none"; }, ms);
  }

  function isCopyButton(el: Element | null): boolean {
    if (!el) return false;
    const byAria = el.closest('[aria-label="Code kopieren"]');
    if (byAria) return true;
    const byTitle = el.closest('[title="Code kopieren"]');
    if (byTitle) return true;
    const target = el.closest('button,[role="button"]');
    if (target) {
      const text = (target.textContent || "").replace(/\s+/g, " ").trim();
      if (text.toLowerCase() === "code kopieren") return true;
    }
    return false;
  }

  // Global copy feedback – always show "Kopiert" when a copy button is activated
  window.addEventListener("click", (evt) => {
    const t = evt.target as Element | null;
    if (isCopyButton(t)) showBodyToast("Kopiert", 2000);
  }, { capture: true });
  window.addEventListener("keydown", (evt) => {
    if (evt.key !== "Enter" && evt.key !== " ") return;
    const t = evt.target as Element | null;
    if (isCopyButton(t)) showBodyToast("Kopiert", 2000);
  }, { capture: true });

  // --- SW Nuke: disable SW + clear caches when ?nuke-sw=1 is present ---
  if (typeof navigator !== "undefined" && typeof window !== "undefined") {
    const p = new URLSearchParams(location.search);
    if (p.has("nuke-sw") || p.has("no-sw")) {
      try {
        navigator.serviceWorker.getRegistrations?.().then((regs) => {
          regs?.forEach((r) => r.unregister());
        });
        if ("caches" in window) {
          caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
        }
        // Force reload without query to repopulate fresh assets
        const url = new URL(location.href);
        url.searchParams.delete("nuke-sw");
        url.searchParams.delete("no-sw");
        setTimeout(() => location.replace(url.toString()), 100);
      } catch {
        // ignore
      }
    }
  }
})();
export {};
