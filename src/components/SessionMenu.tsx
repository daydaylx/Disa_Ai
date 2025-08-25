import React from "react"
import { useConversations, type ConversationMeta } from "../hooks/useConversations"

export default function SessionMenu() {
  const { items } = useConversations()
  const [q, setQ] = React.useState("")
  const filtered = React.useMemo(() => items.filter((c: ConversationMeta) => c.title.toLowerCase().includes(q.toLowerCase())), [items, q])
  return (
    <div className="p-2">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Suchen…" className="w-full px-2 py-1 border rounded mb-2" />
      <ul className="space-y-1">
        {filtered.map((c: ConversationMeta) => <li key={c.id} className="text-sm">{c.title}</li>)}
      </ul>
    </div>
  )
}
