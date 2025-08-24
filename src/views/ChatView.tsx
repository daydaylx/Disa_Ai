import * as React from "react";
import { useConversations } from "../hooks/useConversations";
import { useStyleTemplate } from "../hooks/useStyleTemplate";
import SessionMenu from "../components/SessionMenu";
import QuickStyles from "../components/QuickStyles";
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
  const conv = useConversations(); // eine Instanz für Sessions
  const {
    activeId,
    messages,
    sendWithPipeline,
    active,
    renameConversation,
    createConversation,
    setActiveConversation,
  } = conv;

  const { systemText } = useStyleTemplate(); // Prompt-Injektion
  const [apiKey, setApiKey] = React.useState<string>(() => loadStr(LS_API_KEY, ""));
  const [input, setInput] = React.useState<string>("");
  const [titleDraft, setTitleDraft] = React.useState<string>("");
  const [isEditingTitle, setIsEditingTitle] = React.useState<boolean>(false);

  // mindestens eine Konversation sicherstellen
  React.useEffect(() => {
    if (!activeId) {
      const id = createConversation({ makeActive: true });
      setActiveConversation(id);
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
    <div className="w-full h-full min-h-screen flex flex-col bg-black">
      {/* Kompakter Header */}
      <header className="border-b border-neutral-800 px-4 py-3 flex items-center gap-3 bg-neutral-950/80 backdrop-blur">
        {/* Titel (inline-edit) links */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
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
              className="min-w-[12rem] rounded-md border border-neutral-700 bg-neutral-900 text-neutral-100 py-1 px-2 outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Konversationstitel bearbeiten"
              autoFocus
            />
          ) : (
            <>
              <h1
                className="text-base md:text-lg font-semibold text-neutral-100 truncate max-w-[55vw]"
                title={active?.title ?? "Neuer Chat"}
              >
                {active?.title ?? "Neuer Chat"}
              </h1>
              <button
                type="button"
                className="text-xs rounded-md border border-neutral-700 px-2 py-1 text-neutral-300 hover:bg-neutral-900"
                onClick={() => setIsEditingTitle(true)}
                aria-label="Titel bearbeiten"
                title="Titel bearbeiten"
              >
                ✎
              </button>
            </>
          )}
        </div>

        {/* Sessions + Key rechts */}
        <div className="ml-auto flex items-center gap-2">
          <SessionMenu conv={conv} />
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-or-…"
            className="w-44 sm:w-56 rounded-md border border-neutral-700 bg-neutral-900 text-neutral-100 placeholder-neutral-500 caret-neutral-200 py-1.5 px-2 outline-none focus:ring-2 focus:ring-indigo-500"
            title="OpenRouter API-Key (nur lokal)"
            aria-label="OpenRouter API-Key"
          />
        </div>
      </header>

      {/* Verlauf */}
      <section className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-sm text-neutral-400">Noch keine Nachrichten. Starte mit einer Frage.</div>
        ) : (
          messages.map((m, idx) => <MessageBubble key={idx} msg={m} />)
        )}

        {/* Schnellzugriff: Stile */}
        <QuickStyles />
      </section>

      {/* Composer – Enter sendet, Shift+Enter neue Zeile */}
      <footer className="border-t border-neutral-800 p-3 bg-neutral-950/80 backdrop-blur">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder="Schreibe etwas… (Enter sendet, Shift+Enter = neue Zeile)"
            className="flex-1 h-24 md:h-28 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-100 placeholder-neutral-500 caret-neutral-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
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
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }): JSX.Element {
  const isAssistant = msg.role === "assistant";

  const sideCls = isAssistant ? "mr-auto" : "ml-auto";
  const palette = isAssistant
    ? "bg-indigo-950/30 border-indigo-800 text-neutral-100"
    : "bg-neutral-950/30 border-neutral-800 text-neutral-100";

  return (
    <div className={`max-w-[85%] md:max-w-[70%] ${sideCls}`}>
      <div className={`rounded-xl border ${palette} p-3`}>
        <div className="text-[11px] uppercase tracking-wide text-neutral-400 mb-1">
          {msg.role}
          {msg.meta?.status === "sending" ? " · tippt …" : ""}
        </div>
        <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
      </div>
    </div>
  );
}
