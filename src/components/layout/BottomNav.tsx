import React from "react";

function useHash(): string {
  const [h, setH] = React.useState<string>(() => (typeof location !== "undefined" ? location.hash || "#/chat" : "#/chat"));
  React.useEffect(() => {
    const on = () => setH(location.hash || "#/chat");
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return h;
}

export default function BottomNav() {
  const h = useHash().toLowerCase();
  const is = (p: string) => h.startsWith(p);
  const to = (p: string) => (location.hash = p);

  const ref = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setVar = () => {
      const h = el.offsetHeight || 56;
      document.documentElement.style.setProperty("--bottomnav-h", `${h}px`);
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--bottomnav-h");
    };
  }, []);

  return (
    <nav
      ref={ref as any}
      className="fixed inset-x-3 bottom-3 z-30 glass rounded-2xl px-2 py-2 backdrop-blur safe-bottom"
      role="navigation"
      aria-label="Hauptnavigation unten"
      style={{ WebkitBackdropFilter: "saturate(140%) blur(18px)" }}
    >
      <ul className="grid grid-cols-4 items-center gap-1 text-sm">
        <li>
          <button
            onClick={() => to("#/chat")}
            className={`tap w-full rounded-xl px-3 py-2 ${is("#/chat") ? "nav-pill--active" : "nav-pill"}`}
            aria-current={is("#/chat") ? "page" : undefined}
            data-testid="nav-bottom-chat"
          >
            Chat
          </button>
        </li>
        <li>
          <button
            onClick={() => to("#/chats")}
            className={`tap w-full rounded-xl px-3 py-2 ${is("#/chats") ? "nav-pill--active" : "nav-pill"}`}
            aria-current={is("#/chats") ? "page" : undefined}
            data-testid="nav-bottom-chats"
          >
            Unterhaltungen
          </button>
        </li>
        <li>
          <button
            onClick={() => to("#/quickstart")}
            className={`tap w-full rounded-xl px-3 py-2 ${is("#/quickstart") ? "nav-pill--active" : "nav-pill"}`}
            aria-current={is("#/quickstart") ? "page" : undefined}
            data-testid="nav-bottom-quickstart"
          >
            Quickstart
          </button>
        </li>
        <li>
          <button
            onClick={() => to("#/settings")}
            className={`tap w-full rounded-xl px-3 py-2 ${is("#/settings") ? "nav-pill--active" : "nav-pill"}`}
            aria-current={is("#/settings") ? "page" : undefined}
            data-testid="nav-bottom-settings"
          >
            Einstellungen
          </button>
        </li>
      </ul>
    </nav>
  );
}
