import React from "react";
import { Link, useLocation } from "react-router-dom";

import { NetworkBanner } from "../NetworkBanner";
import { Icon } from "../ui/Icon";

/** Kleiner globaler Toast, unabhängig vom App-CSS – garantiert sichtbar */
function showGlobalCopyToast(message: string, ms = 2000) {
  const id = "copy-toast-global";
  let el = document.getElementById(id) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.style.position = "fixed";
    el.style.zIndex = "60";
    el.style.top = "12px";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.background = "rgba(16,185,129,0.95)"; // emerald-500/95
    el.style.color = "#111827";                    // gray-900
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

  // 1) aria-label
  const byAria = el.closest('[aria-label="Code kopieren"]');
  if (byAria) return true;

  // 2) title
  const byTitle = el.closest('[title="Code kopieren"]');
  if (byTitle) return true;

  // 3) sichtbarer Textinhalt in Buttons oder role=button
  const target = el.closest('button,[role="button"]');
  if (target) {
    const text = (target.textContent || "").replace(/\s+/g, " ").trim();
    if (text.toLowerCase() === "code kopieren") return true;
  }

  return false;
}

export function TabBar() {
  const ref = React.useRef<HTMLElement | null>(null);
  const loc = useLocation();

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    document.body.classList.add("has-tabbar");
    const setH = () => {
      const h = el.offsetHeight || 56;
      document.documentElement.style.setProperty("--tabbar-h", `${h}px`);
    };
    setH();
    const ro = new ResizeObserver(setH);
    ro.observe(el);

    // Global: Klick + Tastatur auf "Code kopieren" abfangen => "Kopiert" zeigen
    const onClick = (evt: Event) => {
      const t = evt.target as Element | null;
      if (isCopyButton(t)) showGlobalCopyToast("Kopiert", 2000);
    };
    const onKey = (evt: KeyboardEvent) => {
      if (evt.key !== "Enter" && evt.key !== " ") return;
      const t = evt.target as Element | null;
      if (isCopyButton(t)) showGlobalCopyToast("Kopiert", 2000);
    };

    window.addEventListener("click", onClick, { capture: true });
    window.addEventListener("keydown", onKey, { capture: true });

    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--tabbar-h");
      document.body.classList.remove("has-tabbar");
      window.removeEventListener("click", onClick, { capture: true } as any);
      window.removeEventListener("keydown", onKey, { capture: true } as any);
    };
  }, []);

  return (
    <>
      {/* Banner im App-Shell, damit e2e/offline.spec.ts ihn findet */}
      <NetworkBanner />

      <nav
        ref={ref as any}
        className="tabbar safe-pad safe-bottom sticky bottom-0 z-40 py-2 bg-black/40 backdrop-blur flex gap-2"
        aria-label="Hauptnavigation"
      >
        <Link
          to="/"
          data-discover="true"
          aria-current={loc.pathname === "/" ? "page" : undefined}
          className="flex-1 text-center py-2 tap pill bg-white/5 mx-1 btn-glow text-black"
        >
          Chat
        </Link>
        <Link
          to="/settings"
          data-discover="true"
          className="flex-1 text-center py-2 tap pill bg-white/5 mx-1 text-white/90"
        >
          Einstellungen
        </Link>
        <Link
          to="/about"
          data-discover="true"
          className="flex-1 text-center py-2 tap pill bg-white/5 mx-1 text-white/90"
          aria-label="Info"
          title="Info"
        >
          <Icon name="info" width="18" height="18" />
        </Link>
      </nav>
    </>
  );
}

export default TabBar;
