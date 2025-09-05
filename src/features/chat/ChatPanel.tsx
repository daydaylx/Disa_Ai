import React from "react";
import { MessageBubble } from "@/components/MessageBubble";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/shared/ui/Toast";
import { useSettings } from "@/entities/settings/store";
import { PersonaContext } from "@/entities/persona";
import { useClient } from "@/lib/client";
import type { ChatMessage } from "@/lib/openrouter";

type Bubble = { id: string; role: "user" | "assistant"; content: string };

const uuid = () =>
  (crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function ChatPanel() {
  const [items, setItems] = React.useState<Bubble[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const settings = useSettings();
  const persona = React.useContext(PersonaContext);
  const { client, getSystemFor } = useClient();
  const toast = useToast();

  const currentStyle = React.useMemo(
    () => persona.data.styles.find((x) => x.id === (settings.personaId ?? "")) ?? null,
    [persona.data.styles, settings.personaId],
  );
  const systemMsg = React.useMemo(
    () => getSystemFor(currentStyle ?? null),
    [currentStyle, getSystemFor],
  );

  React.useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [items.length]);

  async function send() {
    if (busy) {
      try {
        abortRef.current?.abort();
      } catch {}
      return;
    }

    const content = input.trim();
    if (!content) return;

    if (!settings.modelId) {
      toast.show("Wähle zuerst ein Modell.", "error");
      return;
    }
    if (!systemMsg) {
      toast.show("Wähle zuerst einen Stil.", "error");
      return;
    }

    setBusy(true);
    const ac = new AbortController();
    abortRef.current = ac;

    const user: Bubble = { id: uuid(), role: "user", content };
    const asst: Bubble = { id: uuid(), role: "assistant", content: "" };
    setItems((prev) => [...prev, user, asst]);
    setInput("");

    let accum = "";

    try {
      const base: ChatMessage[] = [
        systemMsg,
        ...items.map(({ role, content }) => ({ role, content }) as ChatMessage),
        { role: "user", content },
      ];

      await client.send({
        model: settings.modelId!,
        messages: base,
        signal: ac.signal,
        onToken: (delta: string) => {
          accum += delta;
          setItems((prev) => prev.map((b) => (b.id === asst.id ? { ...b, content: accum } : b)));
        },
      });
    } catch (e: unknown) {
      const msg =
        String((e as Error)?.name || "").toLowerCase() === "aborterror"
          ? "⏹️ abgebrochen"
          : `❌ ${String((e as Error)?.message ?? e)}`;
      setItems((prev) =>
        prev.map((b) => (b.id === asst.id ? { ...b, content: b.content || msg } : b)),
      );
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function stop() {
    try {
      abortRef.current?.abort();
    } catch {}
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={listRef} className="flex-1 space-y-3 overflow-auto overscroll-contain px-3 py-4">
        {items.length === 0 && (
          <div className="mx-auto mt-16 max-w-md text-center opacity-70">
            <div className="text-sm">
              Starte, indem du <b>API-Key</b>, <b>Modell</b> und <b>Stil</b> wählst.
            </div>
            <div className="mt-2 text-xs">
              Der Stil wird als unveränderte System-Nachricht gesendet.
            </div>
          </div>
        )}
        {items.map((it) => (
          <div key={it.id} className="flex" role="listitem">
            <MessageBubble role={it.role}>{it.content || " "}</MessageBubble>
          </div>
        ))}
      </div>

      <ChatInput value={input} onChange={setInput} onSend={send} onStop={stop} busy={busy} />
    </div>
  );
}
