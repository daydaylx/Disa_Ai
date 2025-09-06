import React, { useEffect, useMemo, useRef, useState } from "react";

import Avatar from "../components/chat/Avatar";
import ScrollToEndFAB from "../components/chat/ScrollToEndFAB";
import HeroCard from "../components/hero/HeroCard";
import QuickActions from "../components/hero/QuickActions";
import InstallBanner from "../components/InstallBanner";
import SettingsFAB from "../components/nav/SettingsFAB";
import OrbStatus from "../components/status/OrbStatus";
import { loadSettings } from "../features/settings/storage";

type Msg = { id: string; role: "assistant" | "user"; content: string };
const uid = () => Math.random().toString(36).slice(2);
const DEMO_ANSWER = [
  "Gerne. Hier ein Beispiel:",
  "",
  "```ts",
  "export function greet(name: string) {",
  "  return `Hello, ${name}!`",
  "}",
  "```",
].join("\n");

const Toast: React.FC<{ text: string; onDone?: () => void }> = ({ text, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone ?? (() => {}), 1200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="glass fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl px-3 py-2 text-sm">
      {text}
    </div>
  );
};

const CodeBlock: React.FC<{ code: string; lang?: string; onCopied: () => void }> = ({
  code,
  lang = "txt",
  onCopied,
}) => (
  <div className="codeblock relative my-2">
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        onCopied();
      }}
      className="tap pill btn-glow absolute right-2 top-2 px-3 py-1 text-xs"
      aria-label="Code kopieren"
    >
      Code kopieren
    </button>
    <pre className="overflow-auto rounded-lg border border-white/15 bg-black/40 p-3">
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  </div>
);

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
    <div className="msg my-2">
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
  const [toast, setToast] = useState<string | null>(null);
  const [showScrollFab, setShowScrollFab] = useState(false);
  const abortRef = useRef<number | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  // Modellabel aus Settings
  const modelLabel = useMemo(() => {
    try {
      const s = loadSettings();
      return s?.defaultModelId ?? "–";
    } catch {
      return "–";
    }
  }, []);

  // Scroll-FAB: sichtbar wenn nicht nahe am Seitenende
  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 64;
      setShowScrollFab(!nearBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handlePick = (t: string) => setText(t);
  const focusComposer = () => composerRef.current?.focus();

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setMsgs((m) => [...m, { id: uid(), role: "user", content: trimmed }]);
    setText("");
    setSending(true);
    const id = window.setTimeout(() => {
      setMsgs((m) => [...m, { id: uid(), role: "assistant", content: DEMO_ANSWER }]);
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
        className="chat-body main-offset mx-auto w-full max-w-4xl px-4 pb-36 pt-4"
      >
        {/* Install-Banner + Statusleiste */}
        <InstallBanner />
        <OrbStatus streaming={sending} modelLabel={modelLabel} />

        {msgs.length <= 1 && (
          <>
            <HeroCard onStart={focusComposer} />
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
      <div className="safe-pad safe-bottom fixed bottom-0 left-0 right-0 z-40">
        <div className="glass card-round mx-auto w-full max-w-3xl p-2">
          <div className="flex items-end gap-2">
            <textarea
              ref={composerRef}
              data-testid="composer-input"
              className="input h-[56px] w-full resize-none"
              placeholder="Nachricht eingeben… (Shift+Enter = Zeilenumbruch)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
            />
            {sending ? (
              <button
                data-testid="composer-stop"
                className="tap pill glass px-4 py-2 text-sm font-semibold"
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

      {/* FABs */}
      <SettingsFAB />
      <ScrollToEndFAB
        visible={showScrollFab}
        onClick={() =>
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
        }
      />

      {toast && <Toast text={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

export default ChatView;
export { ChatView };
