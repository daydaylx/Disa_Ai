import React from "react";

import Aurora from "./components/Aurora";
import ChatsView from "./views/ChatsView";
import ChatView from "./views/ChatView";
import QuickStartView from "./views/QuickStartView";
import SettingsView from "./views/SettingsView";

type Route = { name: "chat" | "settings" | "chats" | "quickstart"; chatId?: string | null };

function parseHash(): Route {
  const h = (location.hash || "#").slice(1); // remove '#'
  const parts = h.split("/").filter(Boolean); // ["chat", "<id>"]
  const [seg, arg] = parts;
  if (seg === "settings") return { name: "settings" };
  if (seg === "chats") return { name: "chats" };
  if (seg === "quickstart") return { name: "quickstart" };
  if (seg === "chat") return { name: "chat", chatId: arg ?? null };
  return { name: "chat", chatId: null };
}

function useHashRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = React.useState<Route>(() => parseHash());

  React.useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const nav = (r: Route) => {
    let target = "#/chat";
    if (r.name === "settings") target = "#/settings";
    else if (r.name === "chats") target = "#/chats";
    else if (r.name === "quickstart") target = "#/quickstart";
    else if (r.name === "chat") target = r.chatId ? `#/chat/${r.chatId}` : "#/chat";
    if (location.hash !== target) location.hash = target;
    setRoute(r);
  };

  return [route, nav];
}

export default function App() {
  const [route, nav] = useHashRoute();
  const index = (() => {
    switch (route.name) {
      case "chat":
        return 0;
      case "chats":
        return 1;
      case "quickstart":
        return 2;
      case "settings":
        return 3;
      default:
        return 0;
    }
  })();

  return (
    <div className="min-h-[100dvh] app-bg relative">
      <Aurora />
      <a href="#main" className="skip-link">Zum Inhalt springen</a>
      <header className="sticky top-0 z-40 mx-auto flex w-full max-w-4xl items-center justify-between gap-3 glass px-4 py-3 text-sm text-neutral-200">
        <div className="font-semibold">Disa AI</div>
        <nav className="flex gap-2">
          <a
            href="#/chat"
            onClick={(e) => { e.preventDefault(); nav({ name: "chat", chatId: null }); }}
            className={`nav-pill ${route.name === "chat" ? "nav-pill--active" : ""}`}
          >
            Chat
          </a>
          <a
            href="#/chats"
            onClick={(e) => { e.preventDefault(); nav({ name: "chats" }); }}
            className={`nav-pill ${route.name === "chats" ? "nav-pill--active" : ""}`}
          >
            Unterhaltungen
          </a>
          <a
            href="#/quickstart"
            onClick={(e) => { e.preventDefault(); nav({ name: "quickstart" }); }}
            className={`nav-pill ${route.name === "quickstart" ? "nav-pill--active" : ""}`}
          >
            Quickstart
          </a>
          <a
            href="#/settings"
            onClick={(e) => { e.preventDefault(); nav({ name: "settings" }); }}
            className={`nav-pill ${route.name === "settings" ? "nav-pill--active" : ""}`}
          >
            Einstellungen
          </a>
        </nav>
        {/* CTA entfernt, da 'Unterhaltungen' bereits als Tab vorhanden ist */}
      </header>

      <div className="pager">
        <div
          className="pager-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live="polite"
        >
          <section className="pager-panel" aria-label="Chat">
            <ChatView convId={route.name === "chat" ? route.chatId ?? null : null} />
          </section>
          <section className="pager-panel" aria-label="Unterhaltungen">
            <ChatsView onOpen={(id) => nav({ name: "chat", chatId: id })} />
          </section>
          <section className="pager-panel" aria-label="Quickstart">
            <QuickStartView />
          </section>
          <section className="pager-panel" aria-label="Einstellungen">
            <SettingsView />
          </section>
        </div>
      </div>
    </div>
  );
}
