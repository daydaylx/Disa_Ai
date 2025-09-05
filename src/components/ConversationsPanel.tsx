import React from "react";
import { type ConversationMeta, useConversations } from "../hooks/useConversations";
import Icon from "./Icon";

type Props = {
  open: boolean;
  onClose: () => void;
  currentId: string | null;
  onSelect: (id: string) => void;
};

function formatTime(ts: number) {
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch {
    return "";
  }
}

export default function ConversationsPanel({ open, onClose, currentId, onSelect }: Props) {
  const conv = useConversations();
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = conv.items.slice().sort((a, b) => b.updatedAt - a.updatedAt);
    if (!term) return list;
    return list.filter((it) => it.title.toLowerCase().includes(term));
  }, [q, conv.items]);

  function createNew() {
    const meta = conv.create("Neue Unterhaltung");
    onSelect(meta.id);
  }

  function rename(id: string) {
    const cur = conv.getMeta(id);
    const next = prompt("Titel ändern", cur?.title ?? "");
    if (next === null) return;
    conv.rename(id, next.trim() || "Ohne Titel");
  }

  function remove(id: string) {
    if (!confirm("Unterhaltung wirklich löschen?")) return;
    conv.remove(id);
    if (currentId === id) {
      const next = conv.items[0]?.id ?? conv.create("Neue Unterhaltung").id;
      onSelect(next);
    }
  }

  return (
    <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`}>
      <div
        role="button"
        aria-label="Overlay schließen"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-[320px] p-3 transition-transform md:w-[360px] ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full rounded-2xl bg-gradient-to-tr from-neutral-500/25 via-neutral-500/10 to-transparent p-[1px]">
          <div className="flex h-full flex-col rounded-2xl border border-white/30 bg-white/65 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/55">
            <div className="flex items-center gap-2 border-b border-white/30 px-3 py-2 dark:border-white/10">
              <Icon name="sparkles" width="16" height="16" />
              <div className="text-sm font-medium">Unterhaltungen</div>
              <button
                onClick={onClose}
                className="ml-auto rounded border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-100/60 dark:border-neutral-700 dark:hover:bg-neutral-800/60"
              >
                Schließen
              </button>
            </div>
            <div className="flex items-center gap-2 p-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Suchen…"
                className="w-full rounded-xl border border-neutral-300/80 bg-white/80 px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 dark:border-neutral-700/80 dark:bg-neutral-950/40"
              />
              <button
                onClick={createNew}
                className="rounded-xl border border-blue-600 bg-blue-600 px-3 py-2 text-white hover:brightness-110"
              >
                Neu
              </button>
            </div>
            <div className="flex-1 overflow-auto px-2 pb-2">
              {filtered.length === 0 && (
                <div className="px-2 text-sm opacity-70">Keine Treffer.</div>
              )}
              <ul className="space-y-2">
                {filtered.map((it) => {
                  const active = it.id === currentId;
                  return (
                    <li
                      key={it.id}
                      className={`rounded-xl border ${active ? "border-blue-600 bg-blue-600/10" : "border-white/30 bg-white/60 dark:border-white/10 dark:bg-neutral-950/40"} backdrop-blur`}
                    >
                      <button
                        onClick={() => onSelect(it.id)}
                        className="w-full px-3 py-2 text-left"
                      >
                        <div className="truncate text-sm font-medium">{it.title}</div>
                        <div className="text-xs opacity-70">{formatTime(it.updatedAt)}</div>
                      </button>
                      <div className="flex gap-2 px-3 pb-2">
                        <button
                          onClick={() => rename(it.id)}
                          className="rounded-full border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-100/60 dark:border-neutral-700 dark:hover:bg-neutral-800/60"
                        >
                          Umbenennen
                        </button>
                        <button
                          onClick={() => remove(it.id)}
                          className="rounded-full border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-100/60 dark:border-neutral-700 dark:hover:bg-neutral-800/60"
                        >
                          Löschen
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
