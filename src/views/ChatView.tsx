import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/chat.css";
import { Toolbar } from "../components/chat/Toolbar";
import { MessageItem, type ChatMessage } from "../components/chat/MessageItem";
import { Composer } from "../components/chat/Composer";
import { TypingIndicator } from "../components/chat/TypingIndicator";
import { useToasts } from "../components/ui/Toast";
import { Skeleton } from "../components/feedback/Loader";
import { ErrorState } from "../components/feedback/ErrorState";
import { focusOnMount } from "../lib/a11y/focus";
import { NetworkBanner } from "../components/network/NetworkBanner";
import { sendMessage } from "../lib/chat/sendMessage";
import { RateLimitError } from "../lib/chat/types";

export const ChatView: React.FC = () => {
  const { push } = useToasts();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: crypto.randomUUID(), role: "assistant", content: "Hallo! Wie kann ich dir helfen?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | undefined>(undefined);
  const [modelId] = useState<string>(() => localStorage.getItem("default_model_id") || "qwen/qwen-2.5-coder-14b-instruct");

  const listRef = useRef<HTMLDivElement | null>(null);
  const atBottomRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { focusOnMount("main"); }, []);

  const isNearBottom = () => {
    const el = listRef.current;
    if (!el) return true;
    const threshold = 80;
    return el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => { atBottomRef.current = isNearBottom(); };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!atBottomRef.current) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (loading) return;

    setLastError(undefined);
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    try {
      const hist = [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) as Array<{role:"user"|"assistant"|"system"; content:string}>;
      const { content } = await sendMessage({
        modelId,
        messages: hist,
        signal: abortRef.current.signal
      });

      const reply: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content };
      setMessages((m) => [...m, reply]);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        push({ kind: "warning", title: "Abgebrochen", message: "Anfrage wurde gestoppt." });
      } else if (err instanceof RateLimitError) {
        push({ kind: "warning", title: "Rate-Limit", message: `Bitte warte ${Math.ceil(err.retryAfterMs/1000)}s.` });
        setLastError(err.message);
      } else {
        const msg = err?.message ?? "Unbekannter Fehler";
        setLastError(msg);
        push({ kind: "error", title: "Fehler beim Senden", message: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setLoading(false);
  };

  const onCopy = () => { push({ kind: "success", title: "Kopiert", message: "Code in Zwischenablage" }); };
  const count = useMemo(() => messages.length, [messages]);

  return (
    <div className="chat-root">
      <NetworkBanner />
      <Toolbar title={`Chat (${count})`} onMenu={() => {}} onSettings={() => {}} onModels={() => {}} />

      <main id="main" data-testid="chat-main" ref={listRef} className="chat-body mx-auto w-full max-w-5xl" role="main">
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <MessageItem key={m.id} msg={m} onCopy={onCopy} />
          ))}

          {loading ? (
            <div className="mr-auto rounded-xl border border-border bg-card p-3">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[88%]" />
                <Skeleton className="h-4 w-[72%]" />
                <Skeleton className="h-4 w-[64%]" />
              </div>
              <div className="mt-2"><TypingIndicator /></div>
            </div>
          ) : null}

          {lastError ? (
            <ErrorState
              className="mt-2"
              title="Senden fehlgeschlagen"
              message="Die letzte Antwort konnte nicht geladen werden."
              details={lastError}
              onRetry={() => { setLastError(undefined); }}
            />
          ) : null}
        </div>
      </main>

      <footer className="chat-footer">
        <Composer loading={loading} onSend={handleSend} onStop={handleStop} />
      </footer>
    </div>
  );
};

export default ChatView;
