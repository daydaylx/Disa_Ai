import * as React from "react";

function useHash(): string {
  const [h, setH] = React.useState<string>(() =>
    typeof location !== "undefined" ? location.hash || "#/chat" : "#/chat",
  );
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
      ref={(el) => {
        ref.current = el;
      }}
      className="glass safe-bottom fixed inset-x-3 bottom-3 z-30 rounded-2xl px-2 py-2 backdrop-blur"
      role="navigation"
      aria-label="Hauptnavigation"
      style={{
        WebkitBackdropFilter: "saturate(140%) blur(18px)",
        paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
      }}
      data-version={import.meta.env.VITE_APP_VERSION}
    >
      <ul className="grid grid-cols-4 items-center gap-1 text-sm">
        <li>
          <button
            onClick={() => to("#/chat")}
            className={`flex min-h-[48px] w-full items-center justify-center ${is("#/chat") ? "tab--active" : "tab"}`}
            aria-current={is("#/chat") ? "page" : undefined}
            aria-label="Chat öffnen"
            data-testid="nav-bottom-chat"
          >
            <span className="text-xs">Chat</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => to("#/chats")}
            className={`flex min-h-[48px] w-full items-center justify-center ${is("#/chats") ? "tab--active" : "tab"}`}
            aria-current={is("#/chats") ? "page" : undefined}
            aria-label="Alle Unterhaltungen"
            data-testid="nav-bottom-chats"
          >
            <span className="text-xs">Chats</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => to("#/quickstart")}
            className={`flex min-h-[48px] w-full items-center justify-center ${is("#/quickstart") ? "tab--active" : "tab"}`}
            aria-current={is("#/quickstart") ? "page" : undefined}
            aria-label="Schnellstart"
            data-testid="nav-bottom-quickstart"
          >
            <span className="text-xs">Start</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => to("#/settings")}
            className={`flex min-h-[48px] w-full items-center justify-center ${is("#/settings") ? "tab--active" : "tab"}`}
            aria-current={is("#/settings") ? "page" : undefined}
            aria-label="Einstellungen öffnen"
            data-testid="nav-bottom-settings"
          >
            <span className="text-xs">Settings</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
