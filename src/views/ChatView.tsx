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
  const conv = useConversations(); // eine Instanz für Sidebar + Chat
  const { activeId, messages, sendWithPipeline, active, renameConversation } = conv;

  const { systemText, selected } = useStyleTemplate(); // aktives Stil-Template
  const [apiKey, setApiKey] = React.useState<string>(() => loadStr(LS_API_KEY, ""));
  const [input, setInput] = React.useState<string>("");
  const [titleDraft, setTitleDraft] = React.useState<string>("");
  const [isEditingTitle, setIsEditingTitle] = React.useState<boolean>(false);

  // ensure at least one conversation
  React.useEffect(() => {
    if (!activeId) {
      const id = conv.createConversation({ makeActive: true });
      conv.setActiveConversation(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  React.useEffect(() => {
    if (active?.title) setTitleDraft(active.title);
  }, [active?.id, active?.title]);

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
      {/* Sidebar */}
      <SessionSidebar conv={conv} onSelect={() => void 0} />

      {/* Chat column */}
      <main className="flex-1 flex flex-col bg-white dark:bg-neutral-950">
        {/* Sticky header */}
        <header className="sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-950/85 backdrop-blur">
          <div className="px-4 py-3 flex flex-wrap items-center gap-3">
            {/* Titel (inline-edit) */}
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <>
                  <input
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (active?.id) renameConversation(active.id, titleDraft);
                        setIsEditingTitle(false);
                      }
                      if (e.key === "Escape") {
                        setTitleDraft(active?.title ?? "");
                        setIsEditingTitle(false);
                      }
                    }}
                    onBlur={() => {
                      if (active?.id) renameConversation(active.id, titleDraft);
                      setIsEditingTitle(false);
                    }}
                    className="min-w-[12rem] rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 py-1 px-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Konversationstitel bearbeiten"
                    autoFocus
                  />
                </>
              ) : (
                <>
                  <h1 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[50vw]" title={active?.title ?? "Chat"}>
                    {active?.title ?? "Chat"}
                  </h1>
                  <button
                    type="button"
                    className="text-xs rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    onClick={() => setIsEditingTitle(true)}
                    aria-label="Titel bearbeiten"
                    title="Titel bearbeiten"
                  >
                    ✎
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span
                className="inline-flex items-center rounded-full border border-neutral-300 dark:border-neutral-700 px-2 py-0.5 text-xs text-neutral-700 dark:text-neutral-300"
                title={selected?.name ?? "Stil-Template"}
              >
                Stil: {selected?.name ?? "—"}
              </span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="OpenRouter Key (sk-or-…)"
                className="w-56 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 caret-neutral-700 dark:caret-neutral-200 py-1.5 px-2 outline-none focus:ring-2 focus:ring-indigo-500"
                title="Wird nur lokal genutzt"
                aria-label="OpenRouter API-Key"
              />
            </div>
          </div>
        </header>

        {/* Messages */}
        <section className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Noch keine Nachrichten. Starte mit einer Frage.
            </div>
          ) : (
            messages.map((m, idx) => <MessageBubble key={idx} msg={m} />)
          )}
        </section>

        {/* Composer (sticky bottom) */}
        <footer className="sticky bottom-0 border-t border-neutral-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-950/85 backdrop-blur p-3">
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

  const sideCls = isAssistant ? "mr-auto" : "ml-auto";
  const palette = isAssistant
    ? "bg-indigo-50 border-indigo-200 text-neutral-900 dark:bg-indigo-950/30 dark:border-indigo-800 dark:text-neutral-100"
    : "bg-neutral-50 border-neutral-200 text-neutral-900 dark:bg-neutral-950/30 dark:border-neutral-800 dark:text-neutral-100";

  return (
    <div className={`max-w-[85%] md:max-w-[70%] ${sideCls}`}>
      <div className={`rounded-xl border ${palette} p-3`}>
        <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
          {msg.role}
          {msg.meta?.status === "sending" ? " · tippt …" : ""}
        </div>
        <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
      </div>
    </div>
  );
}
