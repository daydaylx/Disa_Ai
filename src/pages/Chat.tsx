import React, { useEffect, useRef, useState } from "react";

import { chatStream } from "../api/openrouter";
import { useStudio } from "../app/state/StudioContext";
import CodeBlock from "../components/CodeBlock";
import { Composer } from "../components/Composer";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { chooseDefaultModel, loadModelCatalog } from "../config/models";
import ModelSelectionSheet from "../ui/ModelSheet";
import { segmentMessage } from "../ui/segment";
import type { Message, Model } from "../ui/types";
import VirtualMessageList from "../ui/VirtualMessageList";

/** ====== UI: Header ====== */
function Header({
  title,
  modelName,
  onOpenModels,
  activePersonaName,
}: {
  title: string;
  modelName: string;
  onOpenModels: () => void;
  activePersonaName: string | null;
}) {
  return (
    <header className="safe-pt safe-px sticky top-0 z-20 backdrop-blur-2xl" role="banner">
      <div className="mx-auto max-w-4xl">
        <div className="group relative overflow-hidden rounded-2xl border-outline bg-surface-variant px-8 py-6 transition-all duration-300">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 via-slate-500/10 to-slate-600/10"></div>
            <div className="via-white/3 absolute inset-0 bg-gradient-to-br from-transparent to-transparent"></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-outline bg-surface shadow-[0_0_15px_rgba(71,85,105,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(71,85,105,0.3)]">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  className="text-on-surface drop-shadow-sm"
                >
                  <path
                    fill="currentColor"
                    d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8Z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-on-surface">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {activePersonaName && <span className="badge badge-accent">{activePersonaName}</span>}
              <button
                onClick={onOpenModels}
                className="shadow-glass-medium hover:scale-102 hover:shadow-glass-strong hover:border-glass-border-strong rounded-xl border-outline bg-surface px-6 py-3 font-semibold text-on-surface transition-all duration-300 hover:bg-surface-variant"
                aria-label="Modell auswählen"
                data-testid="model.select"
              >
                <span className="drop-shadow-sm">{modelName}</span>
              </button>
            </div>
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
    "max-w-xs sm:max-w-sm md:max-w-md rounded-2xl px-4 py-4 sm:px-6 sm:py-5 leading-relaxed break-words transition-all duration-300 group relative overflow-hidden touch-manipulation";

  const mineCls = mine ? "ml-auto bg-primary text-on-primary rounded-3xl" : "";

  const otherCls = !mine
    ? isError
      ? "bg-error text-on-error rounded-3xl"
      : "bg-surface-variant text-on-surface rounded-3xl glass"
    : "";

  const segs = segmentMessage(msg.content);

  return (
    <div
      className={`flex w-full ${mine ? "justify-end" : "justify-start"} group`}
      data-testid="message.item"
    >
      <div className={`chat-bubble ${base} ${mine ? mineCls : otherCls}`}>
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
            </div>
            <span className="text-sm opacity-75">KI antwortet...</span>
          </div>
        ) : (
          segs.map((s, i) =>
            s.type === "text" ? (
              <div key={i} className="whitespace-pre-wrap">
                {s.content}
              </div>
            ) : (
              <div key={i} className="-mx-2 mt-4">
                <CodeBlock code={s.content} lang={s.lang ?? undefined} />
              </div>
            ),
          )
        )}

        {!isLoading && (
          <div className="text-caption mt-3 font-medium text-on-surface/70">
            {msg.ts ? new Date(msg.ts).toLocaleTimeString() : new Date().toLocaleTimeString()}
          </div>
        )}

        {!isLoading && (
          <div className="touch:opacity-100 absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:right-3 sm:top-3 md:group-hover:opacity-100">
            <button
              onClick={onCopy}
              data-testid="message.copy"
              className="touch-manipulation rounded-lg border-outline bg-surface-variant/50 p-2 text-on-surface/70 transition-all duration-200 hover:scale-110 hover:border-outline/80 hover:bg-surface-variant hover:text-on-surface active:scale-95 active:bg-surface-variant/80 sm:p-2.5"
              title="Nachricht kopieren"
            >
              <svg
                width="12"
                height="12"
                className="sm:h-4 sm:w-4"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
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
                className="touch-manipulation rounded-lg border-outline bg-surface-variant/50 p-2 text-on-surface/70 transition-all duration-200 hover:scale-110 hover:border-outline/80 hover:bg-surface-variant hover:text-on-surface active:scale-95 active:bg-surface-variant/80 sm:p-2.5"
                title="Antwort neu generieren"
              >
                <svg
                  width="12"
                  height="12"
                  className="sm:h-4 sm:w-4"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
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
              className="touch-manipulation rounded-lg border-outline bg-surface-variant/50 p-2 text-on-surface/70 transition-all duration-200 hover:scale-110 hover:border-error/40 hover:bg-error/20 hover:text-error active:scale-95 active:bg-error/30 sm:p-2.5"
              title="Nachricht löschen"
            >
              <svg
                width="12"
                height="12"
                className="sm:h-4 sm:w-4"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
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

/** ====== ChatApp ====== */
export default function ChatPage() {
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
  const { activePersona, typographyScale, borderRadius, accentColor } = useStudio();

  useEffect(() => {
    if (activePersona) {
      setMessages([
        {
          id: "system-prompt",
          role: "system",
          content: activePersona.systemPrompt,
          ts: Date.now(),
          timestamp: Date.now(),
        },
      ]);
    }
  }, [activePersona]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", `${typographyScale}`);
    document.documentElement.style.setProperty("--border-radius", `${borderRadius}rem`);
    document.documentElement.style.setProperty("--accent-color", accentColor);
  }, [typographyScale, borderRadius, accentColor]);

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
      .catch((err) => console.error("Konnte Text nicht kopieren: ", err));
    toasts.push({
      kind: "success",
      title: "Kopiert!",
      message: "Nachricht in die Zwischenablage kopiert.",
    });
  };

  const handleRegenerate = async (messageId: string) => {
    // Find the message to regenerate (must be an AI message)
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    const messageToRegenerate = messages[messageIndex];

    if (!messageToRegenerate || messageToRegenerate.role !== "assistant") {
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: "Nur KI-Antworten können regeneriert werden.",
      });
      return;
    }

    // Find the last user message before this AI response
    const userMessages = messages.slice(0, messageIndex).filter((m) => m.role === "user");
    if (userMessages.length === 0) {
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: "Keine Benutzer-Nachricht zum Regenerieren gefunden.",
      });
      return;
    }

    if (!model) {
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: "Kein Modell ausgewählt.",
      });
      return;
    }

    try {
      setStreaming(true);

      // Remove the current AI message being regenerated
      setMessages((prev) => prev.filter((m) => m.id !== messageId));

      // Prepare context: all messages up to the user message we're responding to
      const contextMessages = messages.slice(0, messageIndex);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Create new message for regenerated response
      const newMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "",
        model: model.id,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newMessage]);

      // Stream the regenerated response
      await chatStream(
        contextMessages.map((m) => ({ role: m.role, content: m.content })),
        (chunk: string) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === newMessage.id ? { ...m, content: m.content + chunk } : m)),
          );
        },
        {
          model: model.id,
          signal: abortController.signal,
          onDone: () => {
            setStreaming(false);
            abortControllerRef.current = null;
          },
        },
      );

      toasts.push({
        kind: "success",
        title: "Regeneriert",
        message: "Die Antwort wurde erfolgreich regeneriert.",
      });
    } catch (error: any) {
      setStreaming(false);
      abortControllerRef.current = null;

      // Remove failed regeneration message
      setMessages((prev) => prev.filter((m) => m.id !== messageToRegenerate.id));
      // Restore original message
      setMessages((prev) => [
        ...prev.slice(0, messageIndex),
        messageToRegenerate,
        ...prev.slice(messageIndex),
      ]);

      toasts.push({
        kind: "error",
        title: "Regeneration fehlgeschlagen",
        message: error.message || "Unbekannter Fehler bei der Regeneration.",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Sind Sie sicher, dass Sie diese Nachricht löschen möchten?")) {
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
    const userMessage: Message = {
      id: `u_${now}`,
      role: "user",
      content: text,
      ts: now,
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const assistantId = `a_${now}`;
    const placeholder: Message = {
      id: assistantId,
      role: "assistant",
      content: "…",
      ts: Date.now(),
      timestamp: Date.now(),
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
    <>
      <Header
        title="Disa KI"
        modelName={model?.label ?? "Lade..."}
        onOpenModels={() => setSheetOpen(true)}
        activePersonaName={activePersona?.name ?? null}
      />

      <main className="flex h-screen flex-col overflow-hidden bg-surface text-on-surface">
        {/* Chat Area */}
        <section className="flex-1 overflow-hidden" aria-label="Chat-Verlauf">
          <div className="h-full px-3 sm:px-4">
            <div className="mx-auto h-full max-w-4xl">
              <VirtualMessageList
                items={messages}
                renderItem={(m) => (
                  <MessageBubble
                    msg={m}
                    onCopy={() => handleCopy(m.content)}
                    onRegenerate={() => handleRegenerate(m.id)}
                    onDelete={() => handleDelete(m.id)}
                  />
                )}
                className="space-y-3 py-4 sm:space-y-4"
                onSuggestionClick={(suggestion) => setInput(suggestion)}
              />
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section role="region" aria-label="Nachricht eingeben" className="safe-pb">
          <Composer
            value={input}
            onChange={setInput}
            onSend={send}
            onStop={stop}
            streaming={streaming}
            canSend={Boolean(model)}
          />
        </section>
      </main>

      {/* Model Selection Sheet */}
      <ModelSelectionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={setModel}
        currentId={model?.id ?? ""}
        models={models}
      />
    </>
  );
}
