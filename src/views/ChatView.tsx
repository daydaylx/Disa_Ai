import * as React from "react";
import SessionSidebar from "../components/SessionSidebar";
import { useConversations } from "../hooks/useConversations";
import { useStyleTemplate } from "../hooks/useStyleTemplate";
import type { ChatMessage } from "../types/chat";

const LS_API_KEY = "disa:settings:apiKey";

function loadStr(key: string, def = ""): string {
  if (typeof window === "undefined") return def;
  try {
    const v = window.localStorage.getItem(key);
    return v ?? def;
  } catch {
    return def;
  }
}

export default function ChatView(): JSX.Element {
  const conv = useConversations(); // EINE Instanz
  const { activeId, messages, sendWithPipeline, active } = conv;

  const { systemText } = useStyleTemplate(); // aktuelle Systemvorlage
  const [apiKey, setApiKey] = React.useState<string>(() => loadStr(LS_API_KEY, ""));
  const [input, setInput] = React.useState<string>("");

  // Wenn keine aktive Konversation existiert -> anlegen
  React.useEffect(() => {
    if (!activeId) {
      const id = conv.createConversation({ makeActive: true });
      conv.setActiveConversation(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  async function handleSend(): Promise<void> {
    const text = input.trim();
    if (!text || !activeId) return;
    await sendWithPipeline(activeId, {
      apiKey,
      model: active?.model ?? "mistral/mistral-7b-instruct",
      ...(systemText ? { systemText } : {}),
      input: text,
      stream: true,
      onDelta: () => void 0,
    });
    setInput("");
  }

  return (
    <div className="w-full h-full min-h-screen flex">
      {/* Linke Spalte: Sessions */}
      <SessionSidebar conv={conv} onSelect={() => void 0} />

      {/* Rechte Spalte: Chat */}
      <main className="flex-1 flex flex-col">
        {/* Kopf */}
        <header className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {active?.title ?? "Chat"}
            </h1>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {messages.length} Nachrichten
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="OpenRouter Key (sk-or-…)"
              className="w-56 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 caret-neutral-700 dark:caret-neutral-200 py-1.5 px-2 outline-none focus:ring-2 focus:ring-indigo-500"
              title="Wird nur lokal genutzt"
            />
          </div>
        </header>

        {/* Verlauf */}
        <section className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Noch keine Nachrichten. Starte mit einer Frage.
            </div>
          ) : (
            messages.map((m, idx) => <MessageBubble key={idx} msg={m} />)
          )}
        </section>

        {/* Eingabe */}
        <footer className="border-t border-neutral-200 dark:border-neutral-800 p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Frage stellen …"
              className="flex-1 h-24 md:h-28 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 caret-neutral-700 dark:caret-neutral-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || !activeId}
              className="shrink-0 rounded-lg border border-indigo-600 bg-indigo-600 text-white px-4 py-2 font-medium disabled:opacity-50"
              title="Senden"
            >
              Senden
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }): JSX.Element {
  const isAssistant = msg.role === "assistant";
  const bg = isAssistant
    ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800"
    : "bg-neutral-50 border-neutral-200 dark:bg-neutral-950/30 dark:border-neutral-800";

  return (
    <div className={`rounded-xl border ${bg} p-3`}>
      <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
        {msg.role}
        {msg.meta?.status === "sending" ? " · tippt …" : ""}
      </div>
      <div className="whitespace-pre-wrap text-sm text-neutral-900 dark:text-neutral-100">
        {msg.content}
      </div>
    </div>
  );
}
