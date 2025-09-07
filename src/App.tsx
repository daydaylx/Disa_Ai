import React from "react";

import AndroidNoticeBanner from "./components/AndroidNoticeBanner";
import Aurora from "./components/Aurora";
import BottomNav from "./components/layout/BottomNav";
import NetworkBanner from "./components/NetworkBanner";
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

  return (
    <div className="min-h-[100svh] relative bg-gradient-to-b from-[#0f172a] to-[#020617] text-[#e5e7eb]">
      <Aurora />
      <NetworkBanner />
      <AndroidNoticeBanner />
      <header className="sticky top-0 z-40 mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-3 text-sm text-[#f3f4f6] backdrop-blur-md bg-white/5 border-b border-white/10 shadow-[0_2px_20px_rgba(255,0,255,0.08)]">
        <div className="font-semibold">Disa AI</div>
        <nav className="flex gap-2">
          <a
            href="#/chat"
            onClick={(e) => { e.preventDefault(); nav({ name: "chat", chatId: null }); }}
            className={`nav-pill ${route.name === "chat" ? "nav-pill--active" : ""} text-[#f3f4f6] hover:shadow-[0_0_18px_#00ffff66]`}
            data-testid="nav-top-chat"
          >
            Chat
          </a>
          <a
            href="#/chats"
            onClick={(e) => { e.preventDefault(); nav({ name: "chats" }); }}
            className={`nav-pill ${route.name === "chats" ? "nav-pill--active" : ""} text-[#f3f4f6] hover:shadow-[0_0_18px_#00ffff66]`}
            data-testid="nav-top-chats"
          >
            Unterhaltungen
          </a>
          <a
            href="#/quickstart"
            onClick={(e) => { e.preventDefault(); nav({ name: "quickstart" }); }}
            className={`nav-pill ${route.name === "quickstart" ? "nav-pill--active" : ""} text-[#f3f4f6] hover:shadow-[0_0_18px_#ff00ff66]`}
            data-testid="nav-top-quickstart"
          >
            Quickstart
          </a>
          <a
            href="#/settings"
            onClick={(e) => { e.preventDefault(); nav({ name: "settings" }); }}
            className={`nav-pill ${route.name === "settings" ? "nav-pill--active" : ""} text-[#f3f4f6] hover:shadow-[0_0_18px_#ff00ff66]`}
            data-testid="nav-top-settings"
          >
            Einstellungen
          </a>
        </nav>
        {/* CTA entfernt, da 'Unterhaltungen' bereits als Tab vorhanden ist */}
      </header>

      {route.name === "settings" ? (
        <SettingsView />
      ) : route.name === "chats" ? (
        <ChatsView onOpen={(id) => nav({ name: "chat", chatId: id })} />
      ) : route.name === "quickstart" ? (
        <QuickStartView />
      ) : (
        <ChatView convId={route.chatId ?? null} />
      )}

      <BottomNav />
    </div>
  );
}
