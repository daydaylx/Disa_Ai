import React, { useEffect, useRef, useState } from "react";

import { chatStream } from "../api/openrouter";
import { chooseDefaultModel, loadModelCatalog } from "../config/models";
import CodeBlock from "./CodeBlock";
import { segmentMessage } from "./segment";
import type { Message, Model } from "./types";
import VirtualMessageList from "./VirtualMessageList";

/** ====== UI: Header ====== */
function Header({
  title,
  modelName,
  onOpenModels,
}: {
  title: string;
  modelName: string;
  onOpenModels: () => void;
}) {
  return (
    <header className="safe-pt safe-px sticky top-0 z-10" role="banner">
      <div className="glass flex items-center justify-between rounded-xl px-3 py-2 shadow-glass">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-xl bg-accent-teal/20" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-primary">
              <path
                fill="currentColor"
                d="M12 2a7 7 0 0 0-7 7v4l-1.5 3A1 1 0 0 0 4.4 17H19.6a1 1 0 0 0 .9-1.5L19 13V9a7 7 0 0 0-7-7Z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-text-muted/80">Chat</span>
            <h1 className="text-base font-semibold text-text-primary">{title}</h1>
          </div>
        </div>
        <button
          onClick={onOpenModels}
          className="hover:bg-accent-teal/12 rounded-xl border border-glass-border/25 px-3 py-2 text-sm text-text-secondary/90 transition-colors hover:border-accent-teal/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet/40"
          aria-label="Modell auswählen"
        >
          {modelName}
        </button>
      </div>
    </header>
  );
}

/** ====== UI: Message Bubble ====== */
function MessageBubble({ msg }: { msg: Message }) {
  const mine = msg.role === "user";
  const base = "max-w-[82%] rounded-xl px-3 py-2 text-[15px] leading-relaxed break-words";
  const mineCls =
    "ml-auto rounded-br-sm border border-accent-teal/45 bg-accent-teal/25 text-text-primary shadow-[0_18px_38px_-22px_rgba(38,198,218,0.65)]";
  const otherCls = "glass border border-glass-border/20 rounded-bl-sm text-text-primary";

  const segs = segmentMessage(msg.content);

  return (
    <div className={`flex w-full ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`chat-bubble ${base} ${mine ? mineCls : otherCls}`}>
        {segs.map((s, i) =>
          s.type === "text" ? (
            <div key={i} className="whitespace-pre-wrap">
              {s.content}
            </div>
          ) : (
            <div key={i} className="mt-2">
              <CodeBlock code={s.content} lang={s.lang} />
            </div>
          ),
        )}
        <div className="mt-2 text-[11px] text-text-muted/80">
          {new Date(msg.ts).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

/** ====== UI: Composer (autogrow + Stop) ====== */
function Composer({
  value,
  onChange,
  onSend,
  onStop,
  streaming,
}: {
  value: string;
  onChange: (s: string) => void;
  onSend: () => void;
  onStop: () => void;
  streaming: boolean;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Autogrow bis max 5 Zeilen
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    const max = 5 * 22;
    ta.style.height = Math.min(ta.scrollHeight, max) + "px";
  }, [value]);

  return (
    <div className="safe-px safe-pb sticky bottom-0 z-10">
      <div className="glass rounded-xl p-2 shadow-glass">
        <div id="composer-help" className="sr-only">
          Geben Sie Ihre Nachricht ein und drücken Sie Senden oder Enter
        </div>
        <div className="flex items-end gap-2">
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Schreib was Sinnvolles…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-[15px] text-text-primary outline-none ring-0 placeholder:text-text-muted/60 focus:ring-0"
            aria-label="Nachricht eingeben"
            aria-describedby="composer-help"
            data-testid="composer-input"
          />
          {!streaming ? (
            <button
              onClick={onSend}
              disabled={!value.trim()}
              className="hover:bg-accent-teal/28 rounded-xl border border-accent-teal/45 bg-accent-teal/20 px-3 py-2 text-text-primary transition-colors hover:border-accent-teal/55 disabled:cursor-not-allowed disabled:opacity-60"
              data-testid="composer-send"
            >
              Senden
            </button>
          ) : (
            <button
              onClick={onStop}
              className="rounded-xl border border-danger/55 bg-danger/25 px-3 py-2 text-text-primary transition-colors hover:bg-danger/30"
              aria-label="Stopp"
              data-testid="composer-stop"
            >
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** ====== UI: Bottom Sheet für Modelle mit A11y ====== */
function ModelSheet({
  open,
  onClose,
  onSelect,
  currentId,
  models,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (m: Model) => void;
  currentId: string;
  models: Model[];
}) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Focus-Management
  useEffect(() => {
    if (open) closeBtn.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // rudimentärer Focus-Trap
        const focusables = sheetRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Modell-Auswahl"
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition ${open ? "opacity-100" : "opacity-0"}`}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`safe-px safe-pb absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto transition-transform duration-200 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="glass rounded-t-2xl p-3 shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Modell wählen</h2>
            <button
              ref={closeBtn}
              onClick={onClose}
              className="text-sm opacity-80 hover:opacity-100"
            >
              Schließen
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onSelect(m);
                  onClose();
                }}
                className={`rounded-xl border border-white/10 p-3 text-left transition hover:bg-white/5 ${
                  currentId === m.id ? "ring-2 ring-violet-400" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{m.label}</div>
                  <div className="text-xs text-muted/80">
                    {(m.pricing?.in ?? 0) === 0 ? "free" : `${m.pricing?.in ?? 0}$/1k`}
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted/80">
                  Kontext: {(m.ctx ?? 0).toLocaleString()} Tokens
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {m.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** ====== ChatApp ====== */
export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Support test data injection
    if (typeof window !== "undefined" && (window as any).__testMessages) {
      return (window as any).__testMessages;
    }
    return [];
  });
  const [models, setModels] = useState<Model[]>([]);
  const [model, setModel] = useState<Model | null>(null);
  const [input, setInput] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const catalog = await loadModelCatalog();
      if (!alive) return;
      setModels(catalog);
      const defaultModelId = chooseDefaultModel(catalog, { preferFree: true });
      const defaultModel = catalog.find((m) => m.id === defaultModelId);
      setModel(defaultModel ?? catalog[0] ?? null);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming || !model) return;

    const now = Date.now();
    const userMessage: Message = { id: `u_${now}`, role: "user", content: text, ts: now };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStreaming(true);

    const assistantId = `a_${now}`;
    const placeholder: Message = {
      id: assistantId,
      role: "assistant",
      content: "…",
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, placeholder]);

    abortControllerRef.current = new AbortController();
    const messagesForApi = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      await chatStream(
        messagesForApi,
        (delta) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: m.content === "…" ? delta : m.content + delta }
                : m,
            ),
          );
        },
        {
          model: model.id,
          signal: abortControllerRef.current.signal,
          onDone: () => {
            setStreaming(false);
            abortControllerRef.current = null;
          },
        },
      );
    } catch (error: any) {
      setStreaming(false);
      abortControllerRef.current = null;
      const errorMessage = error?.message || "Ein Fehler ist aufgetreten.";
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: `Fehler: ${errorMessage}` } : m)),
      );
    }
  };

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStreaming(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Header
        title="Disa AI"
        modelName={model?.label ?? "Lade..."}
        onOpenModels={() => setSheetOpen(true)}
      />
      <main className="flex-1 overflow-hidden" role="main" aria-label="Chat-Verlauf">
        <VirtualMessageList items={messages} renderItem={(m) => <MessageBubble msg={m} />} />
      </main>
      <section role="region" aria-label="Nachricht eingeben">
        <Composer
          value={input}
          onChange={setInput}
          onSend={send}
          onStop={stop}
          streaming={streaming}
        />
      </section>
      <ModelSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={setModel}
        currentId={model?.id ?? ""}
        models={models}
      />
    </div>
  );
}
