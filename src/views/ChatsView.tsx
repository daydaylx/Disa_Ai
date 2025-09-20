import * as React from "react";

import { Button } from "../components/ui/Button";
import { useConversations } from "../hooks/useConversations";

type Props = { onOpen: (id: string) => void };

export default function ChatsView({ onOpen }: Props) {
  const conv = useConversations();
  const [title, setTitle] = React.useState("");

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Unterhaltungen</h1>
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel (optional)"
            className="input w-48 text-sm"
            aria-label="Titel der neuen Unterhaltung"
            data-testid="chats-title-input"
          />
          <Button
            variant="primary"
            onClick={() => {
              const meta = conv.create(title.trim() || "Neue Unterhaltung");
              setTitle("");
              onOpen(meta.id);
            }}
            data-testid="chats-new"
          >
            Neu
          </Button>
        </div>
      </header>

      <section className="grid gap-3">
        {conv.items.map((m) => (
          <article
            key={m.id}
            className="card text-sm transition-transform duration-fast hover:-translate-y-[1px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-text-primary">{m.title}</div>
                <div className="mt-0.5 truncate text-xs text-text-muted">
                  {new Date(m.updatedAt).toLocaleString()}
                </div>
                <div className="truncate text-xs text-text-muted">{m.id}</div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onOpen(m.id)}
                  aria-label="Öffnen"
                  data-testid="chats-open"
                >
                  Öffnen
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => conv.remove(m.id)}
                  aria-label="Löschen"
                  data-testid="chats-delete"
                >
                  Löschen
                </Button>
              </div>
            </div>
          </article>
        ))}
        {conv.items.length === 0 && (
          <div className="card text-center text-sm text-text-muted">
            Noch keine Unterhaltungen. Lege oben eine neue an.
          </div>
        )}
      </section>
    </div>
  );
}

export { ChatsView };
