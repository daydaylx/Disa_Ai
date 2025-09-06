import React from "react";

import { type ConversationMeta, useConversations } from "../hooks/useConversations";

export default function SessionSidebar() {
  const { items } = useConversations();
  const [q, setQ] = React.useState("");
  const filtered = React.useMemo(
    () => items.filter((c: ConversationMeta) => c.title.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  );
  return (
    <aside className="w-64 border-r p-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Suchen…"
        className="mb-2 w-full rounded border px-2 py-1"
      />
      <ul className="space-y-1">
        {filtered.map((c: ConversationMeta) => (
          <li key={c.id} className="text-sm">
            {c.title}
          </li>
        ))}
      </ul>
    </aside>
  );
}
