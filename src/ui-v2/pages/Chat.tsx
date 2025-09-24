import React from "react";
import { Link } from "react-router-dom";

import { Composer } from "../components/chat/Composer";
import { MessageItem } from "../components/chat/MessageItem";
import { ModelPicker } from "../components/chat/ModelPicker";
import { Toolbar } from "../components/chat/Toolbar";
import { useOffline } from "../hooks/useOffline";
import { useChat } from "../state/chat";
import { useSettings } from "../state/settings";

export const Chat: React.FC = () => {
  const { settings } = useSettings();
  const { state, send, abort, retry, clear, exportJson, importJson } = useChat();
  const { offline } = useOffline();

  const messages = state.messages.length > 200 ? state.messages.slice(-200) : state.messages;

  const doExport = () => {
    const data = exportJson();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url;
    a.download = `disaai-chat-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const doImport = async (file: File) => {
    try {
      const text = await file.text();
      const ok = importJson(text);
      if (!ok) alert("Import fehlgeschlagen: Unbekanntes Format.");
    } catch (err) {
      alert("Import fehlgeschlagen: " + String(err));
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-white">
      <a href="#chat-main" className="skip-link">
        Zum Inhalt springen
      </a>

      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-white/5 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold">Chat</h2>
          <div className="opacity-80">·</div>
          <ModelPicker />
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <Link className="opacity-80 hover:opacity-100" to="/settings">
            Settings
          </Link>
          <Link className="opacity-80 hover:opacity-100" to="/welcome">
            Welcome
          </Link>
        </nav>
      </header>

      <main id="chat-main" className="flex-1 space-y-4 p-4" tabIndex={-1}>
        {offline ? (
          <div
            className="rounded-xl border border-white/20 bg-danger-500/10 p-3 text-sm text-white/90"
            role="status"
            aria-live="polite"
          >
            Du bist offline. Aktionen werden ggf. fehlschlagen, bis die Verbindung zurück ist.
          </div>
        ) : null}

        {state.error ? (
          <div className="rounded-xl border border-white/20 bg-danger-500/10 p-4" role="alert">
            <p className="text-sm">Fehler: {state.error}</p>
          </div>
        ) : null}

        <div className="card p-4">
          <div className="mb-3 text-xs text-white/60">
            Modell: <b>{settings.model}</b> · Status: <b>{state.status}</b> · Nachrichten:{" "}
            <b>{state.messages.length}</b>
            {state.messages.length > 200 ? (
              <span className="ml-2 opacity-70">(zeige letzte 200)</span>
            ) : null}
          </div>

          <div
            className="max-h-[60vh] space-y-4 overflow-auto pr-1"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.length === 0 ? (
              <p className="text-sm text-text-secondary">
                Keine Nachrichten. Schreib unten etwas, um zu starten.
              </p>
            ) : (
              messages.map((m) => <MessageItem key={m.id} role={m.role} content={m.content} />)
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 p-3">
        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
          <Composer
            disabled={state.status === "streaming" || offline}
            onSend={(t) => {
              void send(t);
            }}
          />
          <Toolbar
            canStop={state.status === "streaming"}
            onStop={abort}
            onRetry={() => {
              void retry();
            }}
            onClear={clear}
            onExport={doExport}
            onImport={doImport}
          />
        </div>
      </footer>
    </div>
  );
};
