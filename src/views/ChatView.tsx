import React, { useEffect, useMemo, useRef, useState } from "react";

import Avatar from "../components/chat/Avatar";
import ScrollToEndFAB from "../components/chat/ScrollToEndFAB";
import { TypingIndicator } from "../components/chat/TypingIndicator";
import CodeBlock from "../components/CodeBlock";
import HeroCard from "../components/hero/HeroCard";
import QuickActions from "../components/hero/QuickActions";
import { InlineNote } from "../components/InlineNote";
import InstallBanner from "../components/InstallBanner";
import OrbStatus from "../components/status/OrbStatus";
import { useToasts } from "../components/ui/Toast";
import {
  getNSFW,
  getSelectedModelId,
  getStyle,
  getTemplateId,
  getUseRoleStyle,
} from "../config/settings";
import { composeSystemPrompt } from "../features/prompt/composeSystemPrompt";
import { sendChat } from "../services/chatService";
import { getApiKey } from "../services/openrouter";
import type { ChatMessage } from "../types/chat";

type Msg = { id: string; role: "assistant" | "user"; content: string };
const uid = () => Math.random().toString(36).slice(2);

const Message: React.FC<{ msg: Msg; onCopied: () => void }> = ({ msg, onCopied }) => {
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
          <CodeBlock key={i} code={p.content} lang={p.lang ?? "txt"} onCopied={onCopied} />
        ) : (
          <p key={i} className="whitespace-pre-wrap leading-relaxed">
            {p.content.trim()}
          </p>
        ),
      )}
    </div>
  );
};

const ChatView: React.FC = () => {
  const [msgs, setMsgs] = useState<Msg[]>([{ id: uid(), role: "assistant", content: "Bereit." }]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showScrollFab, setShowScrollFab] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
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

  function mapQuickAction(id: string): string {
    const M: Record<string, string> = {
      summarize: "Fasse den folgenden Text prägnant in 5–7 Bulletpoints zusammen. Nenne Kernaussagen und ggf. Risiken. Text:",
      code_help: "Erkläre den folgenden Code Schritt für Schritt. Gehe auf Logik, Randfälle und Komplexität ein. Code:",
      brainstorm: "Erstelle 8–10 verschiedene Ideen/Vorschläge zu folgendem Thema. Gruppiere sinnvoll. Thema:",
      translate: "Übersetze den folgenden Text präzise und idiomatisch ins Deutsche. Erhalte Formatierung. Text:",
      optimize: "Verbessere den folgenden Code auf Lesbarkeit und Performance. Zeige vorher/nachher und begründe kurz: ",
      spec: "Erstelle eine kurze Feature-Spezifikation mit Akzeptanzkriterien (Given/When/Then) für: ",
    };
    return M[id] ?? id;
  }
  const handlePick = (t: string) => setText(mapQuickAction(t));
  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  function buildMessages(userText: string): ChatMessage[] {
    const system = composeSystemPrompt({
      style,
      useRoleStyle,
      roleId,
      allowNSFW,
    });
    const out: ChatMessage[] = [];
    if (system) out.push({ role: "system", content: system });
    out.push(
      ...msgs
        .filter((m) => m.content.trim().length > 0)
        .map<ChatMessage>((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userText },
    );
    return out;
  }

  function send() {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setMsgs((m) => trimHistory([...m, { id: uid(), role: "user", content: trimmed }]));
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

  return (
    <div className="min-h-[100dvh]">
      <main id="main" role="main" className="mx-auto w-full max-w-4xl px-4 pb-36 pt-4">
        <InstallBanner />
        <OrbStatus streaming={sending} modelLabel={modelLabel} />

        {msgs.length <= 1 && (
          <>
            <HeroCard onStart={() => composerRef.current?.focus()} />
            <QuickActions onPick={handlePick} />
          </>
        )}

        <section aria-label="Verlauf">
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
                        "my-3 flex items-start gap-2",
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
                      className="rounded-md border border-border bg-background/50 px-2 py-1"
                      onClick={() => {
                        navigator.clipboard.writeText(m.content).then(() =>
                          toasts.push({ kind: "success", title: "Kopiert", message: "Nachricht kopiert." }),
                        );
                      }}
                      aria-label="Nachricht kopieren"
                    >
                      Kopieren
                    </button>
                    <button
                      className="rounded-md border border-border bg-background/50 px-2 py-1"
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
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div
          className="mx-auto w-full max-w-3xl border-t border-neutral-800 bg-neutral-950/70 px-2 py-2 backdrop-blur"
          style={{ paddingBottom: `max(env(safe-area-inset-bottom), 8px)` }}
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={composerRef}
              className="w-full resize-none rounded-md border border-neutral-800 bg-neutral-900/80 p-3 text-neutral-100 outline-none"
              placeholder="Nachricht eingeben… (Shift+Enter = Zeilenumbruch)"
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
            {sending ? (
              <button
                className="rounded-md border border-neutral-700 bg-neutral-900/70 px-4 py-2 text-sm"
                onClick={stop}
                aria-label="Stop"
              >
                Stop
              </button>
            ) : (
              <button
                className="rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={send}
                aria-label="Senden"
              >
                Senden
              </button>
            )}
          </div>
        </div>
      </div>

      <ScrollToEndFAB
        visible={showScrollFab}
        onClick={() =>
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
        }
      />
      {toast && null}
    </div>
  );
};

export default ChatView;
export { ChatView };
