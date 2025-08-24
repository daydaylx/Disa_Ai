import * as React from "react";
import ChatView from "./views/ChatView";
import Settings from "./views/Settings";

/**
 * Leichtgewichtige App-Shell ohne Router:
 * Tabs: Chat | Einstellungen
 */
type Tab = "chat" | "settings";

export default function App(): JSX.Element {
  const [tab, setTab] = React.useState<Tab>("chat");

  return (
    <div className="h-screen w-screen flex flex-col">
      <nav className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2 bg-white dark:bg-neutral-950">
        <button
          type="button"
          onClick={() => setTab("chat")}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            tab === "chat"
              ? "border-indigo-600 text-white bg-indigo-600"
              : "border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          }`}
          title="Chat"
        >
          Chat
        </button>
        <button
          type="button"
          onClick={() => setTab("settings")}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            tab === "settings"
              ? "border-indigo-600 text-white bg-indigo-600"
              : "border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          }`}
          title="Einstellungen"
        >
          Einstellungen
        </button>

        <div className="ml-auto text-xs text-neutral-500 dark:text-neutral-400">
          Disa AI
        </div>
      </nav>

      <div className="flex-1 min-h-0">
        {tab === "chat" ? <ChatView /> : <Settings />}
      </div>
    </div>
  );
}
