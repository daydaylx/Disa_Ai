import React from "react";
import { MessageBubble } from "@/components/MessageBubble";
import { ChatInput } from "@/components/ChatInput";
import { useSettings } from "@/entities/settings/store";
import { PersonaContext } from "@/entities/persona";
import { useClient } from "@/lib/client";
import { ruleForStyle, isModelAllowed } from "@/config/styleModelRules";
import type { ChatMessage } from "@/lib/openrouter";
import { useToast } from "@/shared/ui/Toast";

type Bubble = ChatMessage & { id: string };
const uuid = () => (crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function ChatPanel() {
  const [items, setItems] = React.useState<Bubble[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  const settings = useSettings();
  const persona = React.useContext(PersonaContext);
  const { client, getSystemFor } = useClient();
  const toast = useToast();

  const style = React.useMemo(
    () => persona.data.styles.find(s => s.id === (settings.personaId ?? "")) ?? persona.data.styles[0] ?? null,
    [persona.data.styles, settings.personaId]
  );
  const systemMsg = React.useMemo(() => getSystemFor(style), [getSystemFor, style]);

  React.useEffect(() => {
    // immer ans Ende scrollen, wenn was kommt
    const el = document.getElementById("chat-scroll");
    if (!el) return;
    el.scrollTop = el.scrollHeight + 9999;
  }, [items.length]);

  async function send() {
    if (busy) { try { abortRef.current?.abort(); } catch {} return; }

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

    // Stil→Modell-Regel prüfen
    const rule = ruleForStyle(settings.personaId ?? null);
    if (rule && !isModelAllowed(rule, settings.modelId)) {
      toast.show("Stil erfordert andere Modelle. Bitte Modell wechseln.", "error");
      return;
    }

    setBusy(true);
    const ac = new AbortController();
    abortRef.current = ac;

    const user: Bubble = { id: uuid(), role: "user", content };
    const asst: Bubble = { id: uuid(), role: "assistant", content: "" };
    setItems(prev => [...prev, user, asst]);
    setInput("");

    let accum = "";

    try {
      const messages: ChatMessage[] = [
        systemMsg,
        ...items.map(({ role, content }) => ({ role, content })),
        { role: "user", content }
      ];

      await client.send({
        model: settings.modelId!,
        messages,
        signal: ac.signal,
        onToken: (delta) => {
          accum += delta;
          setItems(prev => prev.map((b) => b.id === asst.id ? ({ ...b, content: accum }) : b));
        }
      });
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      setItems(prev => prev.map(b => b.id === asst.id ? ({ ...b, content: b.content || `❌ ${msg}` }) : b));
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div id="chat-scroll" className="flex-1 overflow-auto px-3 py-4 space-y-3">
        {items.length === 0 && (
          <div className="mx-auto mt-16 max-w-md text-center opacity-70">
            <div className="text-sm">Starte mit <b>API-Key</b>, <b>Modell</b> und <b>Stil</b>.</div>
            <div className="text-xs mt-2">Der Stil wird als unveränderte System-Nachricht gesendet.</div>
          </div>
        )}
        {items.map((it) => (
          <div key={it.id} className="flex" role="listitem">
            <MessageBubble role={it.role}>{it.content || " "}</MessageBubble>
          </div>
        ))}
      </div>
      <ChatInput value={input} onChange={setInput} onSend={send} onStop={()=>abortRef.current?.abort()} busy={busy} />
    </div>
  );
}
