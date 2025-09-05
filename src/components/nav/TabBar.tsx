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
        className="tabbar safe-pad safe-bottom sticky bottom-0 z-40 py-2 bg-black/40 backdrop-blur flex gap-2"
        aria-label="Hauptnavigation"
        // HARTE Inline-Garantie: Container fängt keine Klicks
        style={{ pointerEvents: "none" }}
      >
        <Link
          to="/"
          data-discover="true"
          aria-current={loc.pathname === "/" ? "page" : undefined}
          className="flex-1 text-center py-2 tap pill bg-white/5 mx-1 btn-glow text-black"
          style={{ pointerEvents: "auto" }}
        >
          Chat
        </Link>
        <Link
          to="/settings"
          data-discover="true"
          className="flex-1 text-center py-2 tap pill bg-white/5 mx-1 text-white/90"
          style={{ pointerEvents: "auto" }}
        >
          Einstellungen
        </Link>
        <Link
          to="/about"
          data-discover="true"
          className="flex-1 text-center py-2 tap pill bg-white/5 mx-1 text-white/90"
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
