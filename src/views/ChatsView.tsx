import React from "react";

import { Button } from "../components/ui/Button";
import { useConversations } from "../hooks/useConversations";

type Props = { onOpen: (id: string) => void };

export default function ChatsView({ onOpen }: Props) {
  const conv = useConversations();
  const [title, setTitle] = React.useState("");

  return (
    <main
      className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6"
      style={{ paddingBottom: "calc(var(--bottomnav-h, 56px) + 24px)" }}
    >
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

      <section className="rounded-xl border border-border bg-background/60 glass card-gradient" data-no-swipe>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-background/80 backdrop-blur thead-grad">
            <tr className="text-left">
              <th className="px-3 py-2">Titel</th>
              <th className="px-3 py-2">Aktualisiert</th>
              <th className="px-3 py-2">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {conv.items.map((m) => (
              <tr key={m.id} className="border-t border-border transition-colors hover:bg-white/5">
                <td className="px-3 py-2">
                  <input
                    defaultValue={m.title}
                    onBlur={(e) => conv.rename(m.id, e.target.value.trim() || m.title)}
                    className="w-full input"
                    aria-label="Titel bearbeiten"
                  />
                  <div className="mt-1 truncate text-xs opacity-60">{m.id}</div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {new Date(m.updatedAt).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => onOpen(m.id)} aria-label="Öffnen" data-testid="chats-open">
                      Öffnen
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => conv.remove(m.id)}
                      aria-label="Löschen"
                      data-testid="chats-delete"
                    >
                      Löschen
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {conv.items.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center opacity-70" colSpan={3}>
                  Noch keine Unterhaltungen. Lege oben eine neue an.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export { ChatsView };
