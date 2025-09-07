import React from "react";

import { Button } from "../components/ui/Button";
import { useConversations } from "../hooks/useConversations";

type Props = { onOpen: (id: string) => void };

export default function ChatsView({ onOpen }: Props) {
  const conv = useConversations();
  const [title, setTitle] = React.useState("");

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl leading-7 font-semibold">Unterhaltungen</h1>
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel (optional)"
            className="input w-48 text-sm"
            aria-label="Titel der neuen Unterhaltung"
            data-testid="chats-title-input"
          />
          <button
            className="btn-glow tilt-on-press"
            onClick={() => {
              const meta = conv.create(title.trim() || "Neue Unterhaltung");
              setTitle("");
              onOpen(meta.id);
            }}
            data-testid="chats-new"
          >
            Neu
          </button>
        </div>
      </header>

      <section className="grid gap-3">
        {conv.items.map((m) => (
          <article key={m.id} className="rounded-2xl border border-white/30 bg-white/65 p-3 text-sm text-slate-600 backdrop-blur-lg shadow-soft transition-transform hover:-translate-y-[1px]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-slate-900">{m.title}</div>
                <div className="mt-0.5 truncate text-xs text-slate-500">{new Date(m.updatedAt).toLocaleString()}</div>
                <div className="truncate text-xs text-slate-500">{m.id}</div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="primary" onClick={() => onOpen(m.id)} aria-label="Öffnen" data-testid="chats-open">
                  Öffnen
                </Button>
                <Button size="sm" variant="destructive" onClick={() => conv.remove(m.id)} aria-label="Löschen" data-testid="chats-delete">
                  Löschen
                </Button>
              </div>
            </div>
          </article>
        ))}
        {conv.items.length === 0 && (
          <div className="rounded-2xl border border-white/30 bg-white/65 p-4 text-center text-sm text-slate-600 backdrop-blur-lg">Noch keine Unterhaltungen. Lege oben eine neue an.</div>
        )}
      </section>
    </main>
  );
}

export { ChatsView };
