import React from "react";

import ChatView from "./views/ChatView";
import SettingsView from "./views/SettingsView";

type Route = "chat" | "settings";

function useHashRoute(_defaultRoute: Route = "chat"): [Route, (r: Route) => void] {
  const [route, setRoute] = React.useState<Route>(() => {
    const h = (location.hash || "").toLowerCase();
    if (h.includes("settings")) return "settings";
    return "chat";
  });

  React.useEffect(() => {
    const onHash = () => {
      const h = (location.hash || "").toLowerCase();
      setRoute(h.includes("settings") ? "settings" : "chat");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const nav = (r: Route) => {
    const target = r === "settings" ? "#/settings" : "#/chat";
    if (location.hash !== target) location.hash = target;
    setRoute(r);
  };

  return [route, nav];
}

export default function App() {
  const [route, nav] = useHashRoute("chat");

  return (
    <div className="min-h-[100dvh]">
      <a href="#main" className="skip-link">Zum Inhalt springen</a>
      <header className="sticky top-0 z-40 mx-auto flex w-full max-w-4xl items-center justify-between gap-3 bg-neutral-950/70 px-4 py-3 text-sm text-neutral-200 backdrop-blur">
        <div className="font-semibold">Disa AI</div>
        <nav className="flex gap-2">
          <a
            href="#/chat"
            onClick={(e) => { e.preventDefault(); nav("chat"); }}
            className={`rounded-full border px-3 py-1 ${route === "chat" ? "border-violet-600 bg-violet-600/20" : "border-neutral-800 bg-neutral-900/60"}`}
          >
            Chat
          </a>
          <a
            href="#/settings"
            onClick={(e) => { e.preventDefault(); nav("settings"); }}
            className={`rounded-full border px-3 py-1 ${route === "settings" ? "border-violet-600 bg-violet-600/20" : "border-neutral-800 bg-neutral-900/60"}`}
          >
            Einstellungen
          </a>
        </nav>
        <a
          href="#/chat"
          className="rounded-full bg-violet-600 px-3 py-1 font-semibold text-white"
          onClick={(e) => { e.preventDefault(); nav("chat"); }}
        >
          Loslegen
        </a>
      </header>

      {route === "settings" ? <SettingsView /> : <ChatView />}
    </div>
  );
}
