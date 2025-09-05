import React, { useEffect, useMemo, useRef, useState } from "react";

import HeroCard from "../components/hero/HeroCard";
import QuickActions from "../components/hero/QuickActions";

type Msg = { id: string; role: "assistant" | "user"; content: string };
const uid = () => Math.random().toString(36).slice(2);

const DEMO_ANSWER = [
  "Gerne. Hier ein Beispiel:",
  "",
  "```ts",
  "export function greet(name: string) {",
  '  return `Hello, ${name}!`',
  "}",
  "```",
].join("\n");

const Toast: React.FC<{ text: string; onDone?: () => void }> = ({ text, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone ?? (() => {}), 1200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-3 py-2 text-sm rounded-xl glass z-50">
      {text}
    </div>
  );
};

const CodeBlock: React.FC<{ code: string; lang?: string; onCopied: () => void }> = ({ code, lang = "txt", onCopied }) => {
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    onCopied();
  };
  return (
    <div className="relative codeblock my-2">
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 tap pill px-3 py-1 text-xs btn-glow"
        aria-label="Code kopieren"
      >
        Code kopieren
      </button>
      <pre className="overflow-auto rounded-lg border border-white/15 p-3 bg-black/40">
        <code className={`language-${lang}`}>{code}</code>
      </pre>
    </div>
  );
};

const Message: React.FC<{ msg: Msg; onCopied: () => void }> = ({ msg, onCopied }) => {
  const parts = useMemo(() => {
    const src = msg.content;
    const out: Array<{ t: "text" | "code"; content: string; lang?: string }> = [];
    const fence = /```(\w+)?\n([\s\S]*?)```/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = fence.exec(src))) {
      if (m.index > last) out.push({ t: "text", content: src.slice(last, m.index) });
      const lang = (m[1]?.trim() || "txt");           // immer string
      const code = (m[2] ?? "").trimEnd();            // gegen undefined absichern
      out.push({ t: "code", lang, content: code });
      last = m.index + m[0].length;
    }
    if (last < src.length) out.push({ t: "text", content: src.slice(last) });
    return out;
  }, [msg.content]);

  return (
    <div className="msg my-2">
      {parts.map((p, i) =>
        p.t === "code" ? (
          p.lang
            ? <CodeBlock key={i} code={p.content} lang={p.lang} onCopied={onCopied} />
            : <CodeBlock key={i} code={p.content} onCopied={onCopied} />
        ) : (
          <p key={i} className="whitespace-pre-wrap leading-relaxed">{p.content.trim()}</p>
        )
      )}
    </div>
  );
};

const ChatView: React.FC = () => {
  const [msgs, setMsgs] = useState<Msg[]>(() => [{ id: uid(), role: "assistant", content: "Bereit." }]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const abortRef = useRef<number | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  const handlePick = (t: string) => setText(t);
  const focusComposer = () => composerRef.current?.focus();

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const user: Msg = { id: uid(), role: "user", content: trimmed };
    setMsgs((m) => [...m, user]);
    setText("");
    setSending(true);

    const id = window.setTimeout(() => {
      const bot: Msg = { id: uid(), role: "assistant", content: DEMO_ANSWER };
      setMsgs((m) => [...m, bot]);
      setSending(false);
      abortRef.current = null;
    }, 600);
    abortRef.current = id;
  };

  const stop = () => {
    if (abortRef.current != null) {
      clearTimeout(abortRef.current);
      abortRef.current = null;
    }
    setSending(false);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="app-bg min-h-[100dvh]">
      <main
        id="main"
        role="main"
        data-testid="chat-main"
        tabIndex={-1}
        className="chat-body mx-auto w-full max-w-4xl px-4 pb-36 pt-4"
      >
        {msgs.length <= 1 && (
          <>
            <HeroCard onStart={focusComposer} />
            <QuickActions onPick={(t) => setText(t)} />
          </>
        )}

        <section aria-label="Verlauf">
          {msgs.map((m) => (
            <div key={m.id} className="my-3">
              <Message msg={m} onCopied={() => setToast("Kopiert")} />
            </div>
          ))}
        </section>
      </main>

      <div className="safe-pad safe-bottom fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-auto w-full max-w-3xl glass card-round p-2">
          <div className="flex items-end gap-2">
            <textarea
              ref={composerRef}
              data-testid="composer-input"
              className="input w-full h-[56px] resize-none"
              placeholder="Nachricht eingeben… (Shift+Enter = Zeilenumbruch)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
            />
            {sending ? (
              <button
                data-testid="composer-stop"
                className="tap pill px-4 py-2 text-sm font-semibold glass"
                onClick={stop}
                aria-label="Stop"
              >
                Stop
              </button>
            ) : (
              <button
                data-testid="composer-send"
                className="tap pill btn-glow px-4 py-2 text-sm font-semibold"
                onClick={send}
                aria-label="Senden"
              >
                Senden
              </button>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast text={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

export default ChatView;
export { ChatView };
