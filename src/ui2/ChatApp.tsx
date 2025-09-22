import React, { useEffect, useRef, useState } from "react";

import CodeBlock from "./CodeBlock";
import { segmentMessage } from "./segment";
import type { Message, Model } from "./types";
import VirtualMessageList from "./VirtualMessageList";

/** ====== Dummy-Modelle (Bottom-Sheet) ====== */
const MODELS: Model[] = [
  {
    id: "qwen-2.5-coder-32b:free",
    name: "Qwen 2.5 Coder 32B (free)",
    pricePer1k: 0,
    context: 131072,
    tags: ["free", "code", "speed"],
  },
  {
    id: "grok-2-1212",
    name: "Grok 2 1212",
    pricePer1k: 2.0,
    context: 131072,
    tags: ["general", "long"],
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    pricePer1k: 1.0,
    context: 32000,
    tags: ["general"],
  },
];

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
      <div className="glass flex items-center justify-between rounded-xl px-3 py-2 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-lg bg-primary/20" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-primary">
              <path
                fill="currentColor"
                d="M12 2a7 7 0 0 0-7 7v4l-1.5 3A1 1 0 0 0 4.4 17H19.6a1 1 0 0 0 .9-1.5L19 13V9a7 7 0 0 0-7-7Z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted/80">Chat</span>
            <h1 className="text-base font-semibold">{title}</h1>
          </div>
        </div>
        <button
          onClick={onOpenModels}
          className="rounded-lg border border-white/10 px-2 py-1 text-sm transition hover:bg-white/5"
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
  const mineCls = "bg-primary/15 border border-white/10 ml-auto rounded-br-sm";
  const otherCls = "glass border border-white/10 rounded-bl-sm";

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
        <div className="mt-2 text-[11px] text-muted/80">
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
      <div className="glass rounded-xl p-2 shadow-sm">
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
            className="flex-1 resize-none bg-transparent text-[15px] outline-none ring-0 placeholder:text-muted/60 focus:ring-0"
            aria-label="Nachricht eingeben"
            aria-describedby="composer-help"
            data-testid="composer-input"
          />
          {!streaming ? (
            <button
              onClick={onSend}
              disabled={!value.trim()}
              className="rounded-lg border border-white/10 bg-primary/25 px-3 py-2 text-white/95 hover:bg-primary/35 disabled:opacity-50"
              data-testid="composer-send"
            >
              Senden
            </button>
          ) : (
            <button
              onClick={onStop}
              className="rounded-lg border border-white/10 bg-danger/25 px-3 py-2 text-white/95 hover:bg-danger/35"
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
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (m: Model) => void;
  currentId: string;
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
        className={`safe-px safe-pb absolute bottom-0 left-0 right-0 transition-transform duration-200 ${
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
            {MODELS.map((m) => (
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
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted/80">
                    {m.pricePer1k === 0 ? "free" : `${m.pricePer1k}$/1k`}
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted/80">
                  Kontext: {m.context.toLocaleString()} Tokens
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

/** ====== ChatApp (Demo-Logik lokal, Fokus UI) ====== */
export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState<Model>(MODELS[0]);
  const [input, setInput] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const timerRef = useRef<number | null>(null);

  const send = () => {
    const text = input.trim();
    if (!text || streaming) return;
    const now = Date.now();
    const user: Message = { id: `u_${now}`, role: "user", content: text, ts: now };
    setMessages((prev) => [...prev, user]);
    setInput("");
    // Simulierter Stream
    setStreaming(true);
    const assistId = `a_${now}`;
    const placeholder: Message = { id: assistId, role: "assistant", content: "…", ts: Date.now() };
    setMessages((prev) => [...prev, placeholder]);
    timerRef.current = window.setTimeout(() => {
      const reply = text.includes("```")
        ? "Ich sehe Code:\n\n" + text
        : `Echo (${model.name}): ${text}\n\nBeispiel-Code:\n\`\`\`ts\nconsole.log('hi');\n\`\`\``;
      setMessages((prev) => prev.map((m) => (m.id === assistId ? { ...m, content: reply } : m)));
      setStreaming(false);
      timerRef.current = null;
    }, 900);
  };

  const stop = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      setStreaming(false);
      setMessages((prev) => {
        const last = [...prev].pop();
        if (!last || last.role !== "assistant") return prev;
        return prev.map((m) =>
          m.id === last.id ? { ...m, content: m.content + " (abgebrochen)" } : m,
        );
      });
    }
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <div className="flex h-full flex-col">
      <Header title="Disa AI" modelName={model.name} onOpenModels={() => setSheetOpen(true)} />
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
        currentId={model.id}
      />
    </div>
  );
}
