import React from "react";
import { Link, useLocation } from "react-router-dom";

import { NetworkBanner } from "../NetworkBanner";
import { Icon } from "../ui/Icon";

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
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--tabbar-h");
      document.body.classList.remove("has-tabbar");
    };
  }, []);

  return (
    <>
      <NetworkBanner />
      <nav
        ref={ref as any}
        className="tabbar safe-pad safe-bottom sticky bottom-0 z-40 flex gap-2 bg-black/40 py-2 backdrop-blur"
        aria-label="Hauptnavigation"
        // HARTE Inline-Garantie: Container fängt keine Klicks
        style={{ pointerEvents: "none" }}
      >
        <Link
          to="/"
          data-discover="true"
          aria-current={loc.pathname === "/" ? "page" : undefined}
          className="tap pill btn-glow mx-1 flex-1 bg-white/5 py-2 text-center text-black"
          style={{ pointerEvents: "auto" }}
        >
          Chat
        </Link>
        <Link
          to="/settings"
          data-discover="true"
          className="tap pill mx-1 flex-1 bg-white/5 py-2 text-center text-white/90"
          style={{ pointerEvents: "auto" }}
        >
          Einstellungen
        </Link>
        <Link
          to="/about"
          data-discover="true"
          className="tap pill mx-1 flex-1 bg-white/5 py-2 text-center text-white/90"
          aria-label="Info"
          title="Info"
          style={{ pointerEvents: "auto" }}
        >
          <Icon name="info" width="18" height="18" />
        </Link>
      </nav>
    </>
  );
}

export default TabBar;
