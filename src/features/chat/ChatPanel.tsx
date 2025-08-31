import { useEffect, useMemo, useState } from "react";
import { useClient } from "@/lib/client";
import type { ChatMessage } from "@/types/chat";
import { useConversations } from "@/hooks/useConversations";
import { buildMessages } from "@/utils/buildMessages";

function ChatInput(props: { value: string; onChange: (v: string) => void; busy: boolean }) {
  const { value, onChange, busy } = props;
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 border rounded px-2 py-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nachricht eingeben…"
        disabled={busy}
      />
    </div>
  );
}

export default function ChatPanel() {
  const client = useClient();
  const conv = useConversations();
  const [input, setInput] = useState("");
  const busy = false;

  const messages: ChatMessage[] = useMemo(() => conv.messages, [conv.messages]);

  // Dummy-Send, nur um Typfehler zu beseitigen (kein echter API-Call hier)
  useEffect(() => {
    /* no-op */
  }, []);

  return (
    <div className="p-3 space-y-3">
      <div className="text-xs text-zinc-500">Client ready: {String(client.ready)}</div>

      <div className="space-y-2 max-h-[50vh] overflow-auto border rounded p-2">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>

      <ChatInput value={input} onChange={setInput} busy={busy} />

      <button
        className="px-3 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700"
        onClick={() => {
          if (!conv.activeId) conv.create("Neue Unterhaltung");
          conv.append(conv.activeId!, { role: "user", content: input });
          setInput("");
        }}
        disabled={busy || !input.trim()}
      >
        Senden
      </button>
    </div>
  );
}
