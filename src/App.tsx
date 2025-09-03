import React from "react";
import { subscribeNav, type AppTab } from "./lib/nav";
import ChatView from "./views/ChatView";
import Settings from "./views/Settings";
import HeaderBadges from "./components/HeaderBadges";

export default function App() {
  const [tab, setTab] = React.useState<AppTab>("chat");

  React.useEffect(() => {
    return subscribeNav((t) => setTab(t));
  }, []);

  return (
    <div className="min-h-[100svh] flex flex-col">
      <div className="px-3 sm:px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="font-semibold">Disa</div>
        <HeaderBadges />
        <div className="flex items-center gap-2">
          <button
            className={`chip ${tab === "chat" ? "bg-white/20" : ""}`}
            onClick={() => setTab("chat")}
          >
            Chat
          </button>
          <button
            className={`chip ${tab === "settings" ? "bg-white/20" : ""}`}
            onClick={() => setTab("settings")}
          >
            Einstellungen
          </button>
        </div>
      </div>

      <main className="flex-1">
        {tab === "settings" ? <Settings /> : <ChatView />}
      </main>
    </div>
  );
}
