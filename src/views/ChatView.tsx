import { useEffect, useState } from "react";

import { chooseDefaultModel, loadModelCatalog } from "../config/models";
import { type ChatMessage, useConversations } from "../hooks/useConversations";

export default function ChatView() {
  const conv = useConversations();
  const [convId, setConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    (async () => {
      const list = await loadModelCatalog(); // keine falschen Parametertypen
      const _default = chooseDefaultModel(list, true);
      // (hier nur zur Illustration; UI-Selektor sitzt in Settings)
      void _default;
    })();
  }, []);

  useEffect(() => {
    const first = conv.items[0]?.id ?? null;
    if (first) {
      setConvId(first);
      setMessages(conv.getMessages(first));
    } else {
      const meta = conv.create("Neue Unterhaltung");
      setConvId(meta.id);
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (convId) setMessages(conv.getMessages(convId));
    else setMessages([]);
  }, [convId, conv.messages, conv.items]);

  return (
    <div className="p-4">
      <div className="text-sm mb-2">Konversationen: {conv.items.length}</div>
      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>
      <div className="mt-3">
        <button
          className="px-2 py-1 border rounded"
          onClick={() => {
            const meta = conv.create("Neue Unterhaltung");
            setConvId(meta.id);
          }}
        >
          Neu
        </button>
      </div>
    </div>
  );
}
