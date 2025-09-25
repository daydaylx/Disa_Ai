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
        <div className="glass-backdrop--strong shadow-glass-strong hover:shadow-glass-strong relative overflow-hidden rounded-2xl border-glass-border-medium px-8 py-6 transition-all duration-200">
          {/* Dynamic Background Gradient */}
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-50"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-pink-400/50 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 shadow-lg shadow-pink-500/25 transition-all duration-200 hover:rotate-6 hover:scale-110">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="text-white drop-shadow-lg"
                >
                  <path
                    fill="currentColor"
                    d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8Z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                  {title}
                </h1>
                <p className="text-sm font-medium text-pink-200/90">
                  KI-Assistent für professionelle Gespräche
                </p>
              </div>
            </div>
            <button
              onClick={onOpenModels}
              className="rounded-xl border border-pink-400/30 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-400 hover:via-pink-400 hover:to-orange-400 hover:shadow-xl"
              aria-label="Modell auswählen"
              data-testid="model.select"
            >
              <span className="drop-shadow-sm">{modelName}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/** ====== UI: Message Bubble ====== */
function MessageBubble({
  msg,
  onCopy,
  onRegenerate,
  onDelete,
}: {
  msg: Message;
  onCopy: () => void;
  onRegenerate: () => void;
  onDelete: () => void;
}) {
  const mine = msg.role === "user";
  const isError = msg.content.startsWith("Fehler:");
  const isLoading = msg.content === "…";

  const base =
    "max-w-md rounded-2xl px-6 py-4 text-body leading-relaxed break-words transition-all duration-200 hover:scale-[1.01] group relative";

  const mineCls = "ml-auto bg-bg-elevated text-text-default shadow-lg";
  const otherCls = isError
    ? "bg-danger/10 text-danger border border-danger/20"
    : "bg-primary text-text-inverted shadow-[0_0_15px_rgba(168,85,247,0.5)]";

  const segs = segmentMessage(msg.content);

  return (
    <div
      className={`flex w-full ${mine ? "justify-end" : "justify-start"} group`}
      data-testid="message.item"
    >
      <div className={`chat-bubble ${base} ${mine ? mineCls : otherCls} hover:shadow-xl`}>
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
            </div>
            <span className="text-sm opacity-75">AI antwortet...</span>
          </div>
        ) : (
          segs.map((s, i) =>
            s.type === "text" ? (
              <div key={i} className="whitespace-pre-wrap">
                {s.content}
              </div>
            ) : (
              <div key={i} className="-mx-2 mt-4">
                <CodeBlock code={s.content} lang={s.lang} />
              </div>
            ),
          )
        )}

        {!isLoading && (
          <div className="text-caption text-text-muted/70 mt-3 font-medium">
            {new Date(msg.ts).toLocaleTimeString()}
          </div>
        )}

        {!isLoading && (
          <div className="absolute right-2 top-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={onCopy}
              data-testid="message.copy"
              className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-black/10 hover:text-text-default"
              title="Nachricht kopieren"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zM15 5H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7l-4-4zm3 16H8V7h7v5h5v7z"
                />
              </svg>
            </button>
            {!mine && (
              <button
                onClick={onRegenerate}
                data-testid="message.regen"
                className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-black/10 hover:text-text-default"
                title="Antwort neu generieren"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={onDelete}
              data-testid="message.delete"
              className="hover:bg-danger/10 rounded-lg p-1.5 text-text-muted transition-colors hover:text-danger"
              title="Nachricht löschen"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                />
              </svg>
            </button>
          </div>
        )}
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
    <div className="safe-px sticky z-10" style={{ bottom: "calc(var(--bottom-nav-h) + 20px)" }}>
      <div className="mx-auto max-w-4xl">
        <div className="shadow-glass-strong hover:shadow-glass-strong border-glass-stroke bg-glass-bg rounded-2xl border p-4 backdrop-blur-lg transition-all duration-200">
          <div id="composer-help" className="sr-only">
            Geben Sie Ihre Nachricht ein und drücken Sie Senden oder Enter
          </div>
          <div className="flex items-end gap-4">
            <div className="flex min-h-[44px] flex-1 items-center">
              <textarea
                ref={taRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    if (value.trim() && canSend && !streaming) {
                      onSend();
                    }
                  }
                }}
                placeholder="Schreib was Sinnvolles…"
                rows={1}
                className="text-body text-text-primary placeholder:text-text-muted/60 w-full resize-none bg-transparent leading-relaxed outline-none ring-0 focus:ring-0"
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
        <div className="glass-bg--strong rounded-t-2xl border border-glass-border-medium p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-h4 text-text-primary font-semibold">Modell wählen</h2>
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
                  <div className="text-text-primary font-medium">{m.label}</div>
                  <div className="glass-badge glass-badge--accent">
                    {(m.pricing?.in ?? 0) === 0 ? "free" : `${m.pricing?.in ?? 0}$/1k`}
                  </div>
                </div>
                <div className="text-label mt-2 text-text-muted">
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
      // Cleanup: Abort any ongoing stream when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const handleCopy = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .catch((err) => console.error("Failed to copy text: ", err));
    toasts.push({
      kind: "success",
      title: "Copied!",
      message: "Message content copied to clipboard.",
    });
  };

  const handleRegenerate = () => {
    // For now, just a placeholder
    toasts.push({
      kind: "info",
      title: "Regenerate",
      message: "This feature is not yet implemented.",
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toasts.push({
        kind: "success",
        title: "Nachricht gelöscht",
        message: "Die Nachricht wurde erfolgreich entfernt.",
      });
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    // Prevent race condition - check if already streaming
    if (streaming) return;

    if (!model) {
      toasts.push({
        kind: "error",
        title: "Kein Modell verfügbar",
        message: "Bitte wähle zunächst ein Modell aus, bevor du eine Nachricht sendest.",
      });
      return;
    }

    // Set streaming state immediately to prevent double sends
    setStreaming(true);

    const now = Date.now();
    const userMessage: Message = { id: `u_${now}`, role: "user", content: text, ts: now };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

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

      // Enhanced error handling with retry option
      const isNetworkError = error?.name === "NetworkError" || errorMessage.includes("network");
      toasts.push({
        kind: "error",
        title: isNetworkError ? "Verbindungsfehler" : "Antwort fehlgeschlagen",
        message: isNetworkError
          ? "Keine Internetverbindung. Versuche es erneut, wenn du wieder online bist."
          : errorMessage,
        action: isNetworkError
          ? {
              label: "Erneut versuchen",
              onClick: () => {
                // Remove error message and retry
                setMessages((prev) => prev.filter((m) => m.id !== assistantId));
                setInput(text);
                setTimeout(() => send(), 100);
              },
            }
          : undefined,
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
    <div className="from-background-primary via-background-secondary to-background-primary flex h-screen flex-col overflow-hidden bg-gradient-to-br">
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
              renderItem={(m) => (
                <MessageBubble
                  msg={m}
                  onCopy={() => handleCopy(m.content)}
                  onRegenerate={handleRegenerate}
                  onDelete={() => handleDelete(m.id)}
                />
              )}
              className="space-y-4 py-4"
              onSuggestionClick={(suggestion) => setInput(suggestion)}
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
