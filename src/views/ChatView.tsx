import React, { useEffect, useMemo, useRef, useState } from "react";

import Avatar from "../components/chat/Avatar";
import ScrollToEndFAB from "../components/chat/ScrollToEndFAB";
import CodeBlock from "../components/CodeBlock";
import HeroCard from "../components/hero/HeroCard";
import QuickActions from "../components/hero/QuickActions";
import InstallBanner from "../components/InstallBanner";
import OrbStatus from "../components/status/OrbStatus";
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
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

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

  const handlePick = (t: string) => setText(t);
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

    setMsgs((m) => [...m, { id: uid(), role: "user", content: trimmed }]);
    setText("");
    setSending(true);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const apiKey = getApiKey();

    let accum = "";
    const chunkQueue: string[] = [];
    let rafId: number | null = null;
    sendChat({
      apiKey,
      model: modelId,
      messages: buildMessages(trimmed),
      signal: ac.signal,
      onChunk: (t) => {
        // Chunks sammeln und Updates auf ~1x pro Frame drosseln
        chunkQueue.push(t);
        if (rafId != null) return;
        rafId = requestAnimationFrame(() => {
          const delta = chunkQueue.join("");
          chunkQueue.length = 0;
          accum += delta;
          setMsgs((m) => {
            const last = m[m.length - 1];
            if (last?.role === "assistant" && last.content !== "Bereit.") {
              const copy = m.slice(0, -1);
              copy.push({ ...last, content: accum });
              return copy;
            }
            return [...m, { id: uid(), role: "assistant", content: accum }];
          });
          rafId = null;
        });
      },
      onDone: () => {
        setSending(false);
        abortRef.current = null;
        if (rafId != null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      onError: (err) => {
        setSending(false);
        abortRef.current = null;
        if (rafId != null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        setMsgs((m) => [
          ...m,
          {
            id: uid(),
            role: "assistant",
            content: `Fehler: ${(err as Error)?.message ?? String(err)}`,
          },
        ]);
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
          {msgs.map((m) => {
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
                <div className="max-w-[min(90%,48rem)]">
                  <Message msg={m} onCopied={() => setToast("Kopiert")} />
                </div>
                {mine && <Avatar kind="user" />}
              </div>
            );
          })}
        </section>
      </main>

      {/* Composer */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-auto w-full max-w-3xl border-t border-neutral-800 bg-neutral-950/70 px-2 py-2 backdrop-blur">
          <div className="flex items-end gap-2">
            <textarea
              ref={composerRef}
              className="h-[56px] w-full resize-none rounded-md border border-neutral-800 bg-neutral-900/80 p-3 text-neutral-100 outline-none"
              placeholder="Nachricht eingeben… (Shift+Enter = Zeilenumbruch)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
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
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-neutral-700 bg-neutral-900/80 px-3 py-1 text-sm">
          {toast}
        </div>
      )}
    </div>
  );
};

export default ChatView;
export { ChatView };
