import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Avatar from "../components/chat/Avatar";
import ScrollToEndFAB from "../components/chat/ScrollToEndFAB";
import { TypingIndicator } from "../components/chat/TypingIndicator";
import CodeBlock from "../components/CodeBlock";
import HeroCard from "../components/hero/HeroCard";
import { InlineNote } from "../components/InlineNote";
import InstallBanner from "../components/InstallBanner";
import OrbStatus from "../components/status/OrbStatus";
import { Button } from "../components/ui/Button";
import { useToasts } from "../components/ui/Toast";
import {
  getComposerOffset,
  getCtxMaxTokens,
  getCtxReservedTokens,
  getMemoryEnabled,
  getNSFW,
  getSelectedModelId,
  getStyle,
  getTemplateId,
  getUseRoleStyle,
} from "../config/settings";
import { appendMessage as convAppendMessage, getConversationMessages as convGetMessages } from "../hooks/useConversations";
import { buildMessages as buildPipelineMessages } from "../services/chatPipeline";
import { sendChat } from "../services/chatService";
import { ContextManager } from "../services/contextManager";
import { formatMemoryForSystem, loadMemory, updateMemory } from "../services/memory";
import { getApiKey } from "../services/openrouter";
import type { ChatMessage } from "../types/chat";

type Msg = { id: string; role: "assistant" | "user"; content: string };
const uid = () => Math.random().toString(36).slice(2);

const Message: React.FC<{ msg: Msg; onCopied: () => void }> = ({ msg, onCopied: _onCopied }) => {
  const parts = React.useMemo(() => {
    const src = msg.content;
    const out: Array<{ t: "text" | "code"; content: string; lang?: string }> = [];
    const fence = /```(\w+)?\n([\s\S]*?)```/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = fence.exec(src))) {
      if (m.index > last) out.push({ t: "text", content: src.slice(last, m.index) });
      const lang = m[1]?.trim() || "txt";
      const code = ((m[2] ?? "") + "").trimEnd();
      out.push({ t: "code", lang, content: code });
      last = m.index + m[0].length;
    }
    if (last < src.length) out.push({ t: "text", content: src.slice(last) });
    return out;
  }, [msg.content]);
  return (
    <div className="my-2">
      {parts.map((p, i) =>
        p.t === "code" ? (
          <CodeBlock key={i} code={p.content} lang={p.lang ?? "txt"} onCopied={() => {}} />
        ) : (
          <p key={i} className="whitespace-pre-wrap leading-relaxed">
            {p.content.trim()}
          </p>
        ),
      )}
    </div>
  );
};

const ChatView: React.FC<{ convId?: string | null }> = ({ convId = null }) => {
  const [msgs, setMsgs] = useState<Msg[]>([{ id: uid(), role: "assistant", content: "Bereit." }]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showScrollFab, setShowScrollFab] = useState(false);
  const toasts = useToasts();
  const [showAll, setShowAll] = useState(false);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Hartes Soft‑Limit: Nur die letzten MAX_HISTORY Nachrichten im State behalten
  const MAX_HISTORY = 200;
  const trimHistory = (arr: Msg[]) => (arr.length > MAX_HISTORY ? arr.slice(-MAX_HISTORY) : arr);

  const modelId = useMemo(() => getSelectedModelId() ?? "", []);
  const modelLabel = modelId || "—";

  // Settings für Systemprompt/Policy
  const style = useMemo(() => getStyle(), []);
  const roleId = useMemo(() => getTemplateId(), []);
  const useRoleStyle = useMemo(() => getUseRoleStyle(), []);
  const allowNSFW = useMemo(() => getNSFW(), []);
  const memEnabled = useMemo(() => getMemoryEnabled(), []);
  const ctxLimits = useMemo(() => ({ max: getCtxMaxTokens(), reserve: getCtxReservedTokens() }), []);
  const composerOffset = useMemo(() => getComposerOffset(), []);

  // Lädt vorhandene Nachrichten aus der Unterhaltung (falls convId gesetzt)
  useEffect(() => {
    if (!convId) return;
    try {
      const stored = convGetMessages(convId);
      const mapped = stored
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ id: `${m.role}-${m.createdAt}`, role: m.role as "user" | "assistant", content: m.content }));
      setMsgs(mapped.length ? mapped : [{ id: uid(), role: "assistant", content: "Bereit." }]);
    } catch {
      /* ignore */
    }
     
  }, [convId]);

  // Scroll-FAB steuern
  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 64;
      setShowScrollFab(!nearBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true } as any);
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Legacy Events: Fokus/Neue Session aus älteren Komponenten unterstützen
  useEffect(() => {
    const onFocus = () => composerRef.current?.focus();
    const onNew = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      composerRef.current?.focus();
    };
    window.addEventListener("disa:chat:focusInput", onFocus as any);
    window.addEventListener("disa:chat:newSession", onNew as any);
    return () => {
      window.removeEventListener("disa:chat:focusInput", onFocus as any);
      window.removeEventListener("disa:chat:newSession", onNew as any);
    };
  }, []);

  // Prefill aus Quickstart übernehmen
  useEffect(() => {
    try {
      const pre = localStorage.getItem("disa:prefill");
      if (pre && pre.trim().length > 0) {
        setText(pre);
        localStorage.removeItem("disa:prefill");
        setTimeout(() => composerRef.current?.focus(), 0);
      }
    } catch (_e) {
      void _e;
      /* ignore */
    }
  }, []);
  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Escape") {
      if (sending) {
        e.preventDefault();
        stop();
      }
      return;
    }
    if (e.key === "Enter") {
      // Ctrl/Cmd+Enter sendet immer
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        send();
        return;
      }
      // Enter ohne Shift sendet, Shift+Enter macht Zeilenumbruch
      if (!e.shiftKey) {
        e.preventDefault();
        send();
      }
    }
  };

  function buildMessages(userText: string): ChatMessage[] {
    const memoryText = memEnabled && convId ? formatMemoryForSystem(loadMemory(convId)) : "";
    const history = msgs
      .filter((m) => m.content.trim().length > 0)
      .map(({ role, content }) => ({ role, content }));
    const built = buildPipelineMessages({
      userInput: userText,
      history,
      nsfw: allowNSFW,
      style,
      roleTemplateId: roleId,
      useRoleStyle,
      memory: memoryText || null,
    }) as unknown as ChatMessage[];
    const cm = new ContextManager({ maxTokens: ctxLimits.max, reservedTokens: ctxLimits.reserve });
    return cm.optimize(built);
  }

  function send() {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setMsgs((m) => trimHistory([...m, { id: uid(), role: "user", content: trimmed }]));
    // Persistiere in geöffneter Unterhaltung
    if (convId) {
      convAppendMessage(convId, { role: "user", content: trimmed } as any);
    }
    setText("");
    setSending(true);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const apiKey = getApiKey();

    let accum = "";
    const chunkQueue: string[] = [];
    let rafId: number | null = null;
    let flushTimer: number | null = null;
    sendChat({
      apiKey,
      model: modelId,
      messages: buildMessages(trimmed),
      signal: ac.signal,
      onChunk: (t) => {
        // Chunks sammeln und Updates auf ~1x pro Frame drosseln
        chunkQueue.push(t);
        const flush = () => {
          const delta = chunkQueue.join("");
          chunkQueue.length = 0;
          accum += delta;
          setMsgs((m) => {
            const last = m[m.length - 1];
            if (last?.role === "assistant" && last.content !== "Bereit.") {
              const copy = m.slice(0, -1);
              copy.push({ ...last, content: accum });
              return trimHistory(copy);
            }
            return trimHistory([...m, { id: uid(), role: "assistant", content: accum }]);
          });
          rafId = null;
          if (flushTimer != null) {
            clearTimeout(flushTimer);
            flushTimer = null;
          }
        };

        if (rafId == null) rafId = requestAnimationFrame(flush);
        if (flushTimer == null) flushTimer = window.setTimeout(flush, 80);
      },
      onDone: () => {
        setSending(false);
        abortRef.current = null;
        // Persistiere Assistant-Antwort als Nachricht (final)
        if (convId && accum.trim().length > 0) {
          convAppendMessage(convId, { role: "assistant", content: accum } as any);
          const turns = convGetMessages(convId).map((t) => ({ role: t.role, content: t.content }));
          const recent = turns.slice(-10);
          updateMemory(convId, recent as any);
        }
        if (rafId != null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        if (flushTimer != null) {
          clearTimeout(flushTimer);
          flushTimer = null;
        }
      },
      onError: (err) => {
        setSending(false);
        abortRef.current = null;
        if (rafId != null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        if (flushTimer != null) {
          clearTimeout(flushTimer);
          flushTimer = null;
        }
        setMsgs((m) => trimHistory([
          ...m,
          {
            id: uid(),
            role: "assistant",
            content: `Fehler: ${(err as Error)?.message ?? String(err)}`,
          },
        ]));
      },
    });
  }

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setSending(false);
  }

  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("id", "composer-portal");
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      try {
        document.body.removeChild(el);
      } catch (e) {
        void e;
        /* ignore */
      }
      setPortalEl(null);
    };
  }, []);

  return (
    <div className="min-h-[100svh]">
      <main
        id="main"
        role="main"
        className="mx-auto w-full max-w-4xl px-4 pt-3"
        style={{ paddingBottom: "calc(var(--bottomnav-h, 56px) + 160px)" }}
      >
        <InstallBanner />
        <OrbStatus streaming={sending} modelLabel={modelLabel} />
        <div className="mx-auto mb-2 mt-1 w-full max-w-3xl px-1">
          <div className="text-xs text-neutral-400">
            Gedächtnis: {memEnabled ? "aktiv" : "inaktiv"}
            {memEnabled ? (
              <span className="ml-2 opacity-80">(max {ctxLimits.max}, Reserve {ctxLimits.reserve})</span>
            ) : null}
          </div>
        </div>

        {msgs.length <= 1 && <HeroCard onStart={() => composerRef.current?.focus()} />}

        <section aria-label="Verlauf" role="log" aria-live="polite" aria-relevant="additions" aria-atomic="false">
          {(() => {
            const LIMIT = 80;
            const hasOverflow = msgs.length > LIMIT;
            const trimmed = hasOverflow && !showAll ? msgs.slice(-LIMIT) : msgs;
            const hiddenCount = hasOverflow ? msgs.length - trimmed.length : 0;

            return (
              <>
                {hasOverflow && !showAll && (
                  <div className="my-3 text-center">
                    <InlineNote kind="warn">
                      Verlauf gekürzt: {hiddenCount} ältere Nachrichten ausgeblendet.{' '}
                      <button
                        className="underline decoration-amber-300/60 decoration-dotted underline-offset-4 hover:text-amber-200"
                        onClick={() => setShowAll(true)}
                      >
                        Anzeigen
                      </button>
                    </InlineNote>
                  </div>
                )}
                {trimmed.map((m) => {
                  const mine = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={[
                        "msg my-3 flex items-start gap-2",
                        mine ? "justify-end" : "justify-start",
                      ].join(" ")}
                    >
                      {!mine && <Avatar kind="assistant" />}
                <div
                  className={[
                    "chat-bubble max-w-[min(90%,48rem)] rounded-2xl border p-3",
                    mine
                      ? "bg-sky-950/50 border-sky-900/50"
                      : "bg-neutral-900/70 border-neutral-700",
                  ].join(" ")}
                >
                  <Message
                    msg={m}
                    onCopied={() =>
                      toasts.push({ kind: "success", title: "Kopiert", message: "In die Zwischenablage." })
                    }
                  />
                  <div
                    className={[
                      "mt-2 flex gap-2 text-xs opacity-70 transition-opacity",
                      mine ? "justify-end" : "justify-start",
                    ].join(" ")}
                  >
                    <button
                      className="nav-pill"
                      onClick={() => {
                        (async () => {
                          try {
                            await navigator.clipboard.writeText(m.content);
                          } catch {
                            try {
                              const ta = document.createElement("textarea");
                              ta.value = m.content;
                              ta.setAttribute("readonly", "");
                              ta.style.position = "fixed";
                              ta.style.top = "-9999px";
                              document.body.appendChild(ta);
                              ta.select();
                              try {
                                document.execCommand("copy");
                              } catch {
                                /* ignore */
                              }
                              document.body.removeChild(ta);
                            } catch {
                              /* ignore */
                            }
                          }
                          toasts.push({
                            kind: "success",
                            title: "Kopiert",
                            message: "Nachricht kopiert.",
                          });
                        })();
                      }}
                      aria-label="Nachricht kopieren"
                    >
                      Kopieren
                    </button>
                    <button
                      className="rounded-md border border-red-800 bg-red-900/30 px-2 py-1 text-red-200"
                      onClick={() => setMsgs((list) => list.filter((x) => x.id !== m.id))}
                      aria-label="Nachricht löschen"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
                      {mine && <Avatar kind="user" />}
                    </div>
                  );
                })}
                {hasOverflow && showAll && (
                  <div className="my-3 text-center">
                    <InlineNote kind="info">
                      Alle Nachrichten angezeigt.
                      <button
                        className="ml-2 underline decoration-blue-300/60 decoration-dotted underline-offset-4 hover:text-blue-200"
                        onClick={() => setShowAll(false)}
                      >
                        Nur die letzten {LIMIT}
                      </button>
                    </InlineNote>
                  </div>
                )}
              </>
            );
          })()}
        </section>
        {sending && (
          <div className="my-2 flex items-start gap-2">
            <Avatar kind="assistant" />
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-2">
              <TypingIndicator />
            </div>
          </div>
        )}
      </main>

      {/* Composer */}
      {portalEl &&
        createPortal(
          <div
            className="fixed left-0 right-0 z-50"
            style={{ bottom: `calc(env(safe-area-inset-bottom) + var(--bottomnav-h, 56px) + ${composerOffset}px)` }}
          >
            <div
              className="mx-auto w-full max-w-3xl border-t border-neutral-800 bg-neutral-950/70 px-2 py-2 backdrop-blur"
              style={{ paddingBottom: `max(env(safe-area-inset-bottom), 8px)` }}
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={composerRef}
                  className="w-full resize-none rounded-md border border-neutral-800 bg-neutral-900/80 p-3 text-neutral-100 outline-none"
                  data-testid="composer-input"
                  placeholder="Nachricht eingeben… (Shift+Enter = Zeilenumbruch)"
                  aria-describedby="composer-hint"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={onKeyDown}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    const max = 6 * 24; // grob 6 Zeilen à 24px
                    const next = Math.min(max, el.scrollHeight);
                    el.style.height = `${next}px`;
                  }}
                  rows={2}
                  enterKeyHint="send"
                  inputMode="text"
                />
                <span id="composer-hint" className="sr-only">
                  Enter sendet. Shift plus Enter macht einen Zeilenumbruch. Strg oder Befehlstaste plus Enter sendet ebenfalls. Escape stoppt das Laden.
                </span>
                {sending ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={stop}
                    aria-label="Stop"
                    data-testid="composer-stop"
                  >
                    Stop
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={send}
                    aria-label="Senden"
                    data-testid="composer-send"
                  >
                    Senden
                  </Button>
                )}
              </div>
            </div>
          </div>,
          portalEl,
        )}

      <ScrollToEndFAB
        visible={showScrollFab}
        onClick={() =>
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
        }
      />
    </div>
  );
};

export default ChatView;
export { ChatView };
