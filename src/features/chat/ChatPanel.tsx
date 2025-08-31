import { useMemo, useState } from "react";
import { useClient } from "@/lib/client";
import type { ChatMessage } from "@/types/chat";
import { useConversations } from "@/hooks/useConversations";
import { buildMessages } from "@/utils/buildMessages";
import { sendChatCompletion } from "@/services/openrouterClient";
import { useModel } from "@/hooks/useModel";

function ChatInput(props: { value: string; onChange: (v: string) => void; busy: boolean; onSend: () => void }) {
  const { value, onChange, busy, onSend } = props;
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 border rounded px-2 py-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nachricht eingeben…"
        disabled={busy}
      />
      <button
        className="px-3 py-1 rounded bg-zinc-800 text-white disabled:opacity-50"
        onClick={onSend}
        disabled={busy || !value.trim()}
      >
        Senden
      </button>
    </div>
  );
}

export default function ChatPanel() {
  const client = useClient();
  const { modelId } = useModel();
  const conv = useConversations();

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const messages: ChatMessage[] = useMemo(() => conv.messages, [conv.messages]);

  async function handleSend() {
    if (!input.trim()) return;
    if (!conv.activeId) conv.create("Neue Unterhaltung");

    // append user
    conv.append(conv.activeId!, { role: "user", content: input });
    const userText = input;
    setInput("");

    // guard: api key vorhanden?
    const apiKey = client.apiKey ?? null;
    if (!apiKey) {
      conv.append(conv.activeId!, { role: "assistant", content: "Kein OpenRouter API-Key gesetzt. Öffne Einstellungen." });
      return;
    }

    setBusy(true);
    try {
      const reply = await sendChatCompletion({
        apiKey,
        model: modelId,
        messages: conv.getMessages(conv.activeId!),
        temperature: 0.7
      });
      conv.append(conv.activeId!, { role: "assistant", content: reply });
    } catch (err: any) {
      const msg = (err?.message || String(err)).slice(0, 500);
      conv.append(conv.activeId!, { role: "assistant", content: `Fehler vom Modell: ${msg}` });
      // fallback: setze Eingabe zurück, falls User neu senden will
      setInput(userText);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-3 space-y-3">
      <div className="text-xs text-zinc-500">Client ready: {String(client.ready)} | Model: <code>{modelId}</code></div>

      <div className="space-y-2 max-h-[50vh] overflow-auto border rounded p-2">
        {messages.map((m) => (
          <div key={m.id} className="text-sm whitespace-pre-wrap">
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>

      <ChatInput value={input} onChange={setInput} busy={busy} onSend={handleSend} />
    </div>
  );
}
