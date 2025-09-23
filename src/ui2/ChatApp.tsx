import React, { useEffect, useRef, useState } from "react";

import { chatStream } from "../api/openrouter";
import PersonaQuickBar from "../components/PersonaQuickBar";
import { useToasts } from "../components/ui/Toast";
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
    <header className="safe-pt safe-px sticky top-0 z-20 backdrop-blur-xl" role="banner">
      <div className="mx-auto max-w-4xl">
        <div className="glass-bg--medium flex items-center justify-between rounded-2xl border border-border-secondary px-6 py-4 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div
              className="grid size-10 place-items-center rounded-xl border border-border-tertiary bg-gradient-to-br from-interactive-secondary/20 to-interactive-primary/20"
              aria-hidden
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="text-interactive-primary">
                <path
                  fill="currentColor"
                  d="M12 2a7 7 0 0 0-7 7v4l-1.5 3A1 1 0 0 0 4.4 17H19.6a1 1 0 0 0 .9-1.5L19 13V9a7 7 0 0 0-7-7Z"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-caption text-text-muted">Chat</span>
              <h1 className="text-h3 font-bold text-text-primary">{title}</h1>
            </div>
          </div>
          <button
            onClick={onOpenModels}
            className="glass-button glass-button--secondary glass-button--sm hover:bg-interactive-primary/8 rounded-xl px-4 py-3 text-label font-medium transition-all duration-200"
            aria-label="Modell auswählen"
          >
            {modelName}
          </button>
        </div>
      </div>
    </header>
  );
}

/** ====== UI: Message Bubble ====== */
function MessageBubble({ msg }: { msg: Message }) {
  const mine = msg.role === "user";
  const base =
    "max-w-[85%] rounded-2xl px-5 py-3 text-body leading-relaxed break-words transition-all duration-200";
  const mineCls =
    "ml-auto rounded-br-lg glass-tint--cyan text-white shadow-xl backdrop-blur-md border border-interactive-primary/40";
  const otherCls =
    "glass-bg--medium border border-border-secondary rounded-bl-lg text-text-primary shadow-lg backdrop-blur-md";

  const segs = segmentMessage(msg.content);

  return (
    <div className={`flex w-full ${mine ? "justify-end" : "justify-start"} group`}>
      <div
        className={`chat-bubble ${base} ${mine ? mineCls : otherCls} transition-transform hover:shadow-xl group-hover:scale-[1.01]`}
      >
        {segs.map((s, i) =>
          s.type === "text" ? (
            <div key={i} className="whitespace-pre-wrap">
              {s.content}
            </div>
          ) : (
            <div key={i} className="-mx-2 mt-4">
              <CodeBlock code={s.content} lang={s.lang} />
            </div>
          ),
        )}
        <div className="mt-3 text-caption font-medium text-text-muted/70">
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
  canSend,
}: {
  value: string;
  onChange: (s: string) => void;
  onSend: () => void;
  onStop: () => void;
  streaming: boolean;
  canSend: boolean;
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
    <div className="safe-px sticky z-10" style={{ bottom: "calc(var(--bottom-nav-h) + 16px)" }}>
      <div className="mx-auto max-w-4xl">
        <div className="glass-bg--medium rounded-2xl border border-border-secondary p-6 shadow-lg backdrop-blur-xl">
          <div id="composer-help" className="sr-only">
            Geben Sie Ihre Nachricht ein und drücken Sie Senden oder Enter
          </div>
          <div className="flex items-end gap-4">
            <div className="flex min-h-[44px] flex-1 items-center">
              <textarea
                ref={taRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Schreib was Sinnvolles…"
                rows={1}
                className="w-full resize-none bg-transparent text-body leading-relaxed text-text-primary outline-none ring-0 placeholder:text-text-muted/60 focus:ring-0"
                aria-label="Nachricht eingeben"
                aria-describedby="composer-help"
                data-testid="composer-input"
              />
            </div>
            {!streaming ? (
              <button
                onClick={onSend}
                disabled={!value.trim() || !canSend}
                className="glass-button glass-button--primary glass-button--sm shrink-0 px-6 py-3 disabled:cursor-not-allowed disabled:opacity-50"
                data-testid="composer-send"
              >
                Senden
              </button>
            ) : (
              <button
                onClick={onStop}
                className="glass-button glass-button--danger glass-button--sm shrink-0 px-6 py-3"
                aria-label="Stopp"
                data-testid="composer-stop"
              >
                Stop
              </button>
            )}
          </div>
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
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition ${open ? "opacity-100" : "opacity-0"}`}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`safe-px safe-pb absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto transition-transform duration-200 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="glass-bg--strong border-glass-border-medium rounded-t-2xl border p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-h4 font-semibold text-text-primary">Modell wählen</h2>
            <button
              ref={closeBtn}
              onClick={onClose}
              className="glass-button glass-button--ghost glass-button--xs"
            >
              Schließen
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onSelect(m);
                  onClose();
                }}
                className={`glass-card--interactive glass-bg--soft rounded-xl border p-4 text-left transition-all ${
                  currentId === m.id
                    ? "glass-tint--cyan border-interactive-primary/60"
                    : "border-glass-border-soft hover:border-glass-border-medium"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-text-primary">{m.label}</div>
                  <div className="glass-badge glass-badge--accent">
                    {(m.pricing?.in ?? 0) === 0 ? "free" : `${m.pricing?.in ?? 0}$/1k`}
                  </div>
                </div>
                <div className="mt-2 text-label text-text-muted">
                  Kontext: {(m.ctx ?? 0).toLocaleString()} Tokens
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.tags.map((t) => (
                    <span key={t} className="glass-badge">
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
  const toasts = useToasts();

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
    if (!text || streaming) return;

    if (!model) {
      toasts.push({
        kind: "error",
        title: "Kein Modell verfügbar",
        message: "Bitte wähle zunächst ein Modell aus, bevor du eine Nachricht sendest.",
      });
      return;
    }

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
      toasts.push({
        kind: "error",
        title: "Antwort fehlgeschlagen",
        message: errorMessage,
      });
    }
  };

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStreaming(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
      <Header
        title="Disa AI"
        modelName={model?.label ?? "Lade..."}
        onOpenModels={() => setSheetOpen(true)}
      />
      <div className="safe-px py-content-gap">
        <div className="mx-auto max-w-4xl">
          <PersonaQuickBar />
        </div>
      </div>
      <main className="flex-1 overflow-hidden" role="main" aria-label="Chat-Verlauf">
        <div className="h-full px-4">
          <div className="mx-auto h-full max-w-4xl">
            <VirtualMessageList
              items={messages}
              renderItem={(m) => <MessageBubble msg={m} />}
              className="space-y-4 py-4"
            />
          </div>
        </div>
      </main>
      <section role="region" aria-label="Nachricht eingeben">
        <Composer
          value={input}
          onChange={setInput}
          onSend={send}
          onStop={stop}
          streaming={streaming}
          canSend={Boolean(model)}
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
