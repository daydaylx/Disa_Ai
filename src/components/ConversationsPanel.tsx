import React from "react";

import { useConversations } from "../hooks/useConversations";
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
        className={`absolute left-0 top-0 h-full w-[320px] md:w-[360px] p-3 transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full rounded-2xl p-[1px] bg-gradient-to-tr from-neutral-500/25 via-neutral-500/10 to-transparent">
          <div className="h-full rounded-2xl border border-white/30 dark:border-white/10 bg-white/65 dark:bg-neutral-900/55 backdrop-blur-md shadow-lg flex flex-col">
            <div className="px-3 py-2 border-b border-white/30 dark:border-white/10 flex items-center gap-2">
              <Icon name="sparkles" width="16" height="16" />
              <div className="text-sm font-medium">Unterhaltungen</div>
              <button
                onClick={onClose}
                className="ml-auto text-xs px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60"
              >
                Schließen
              </button>
            </div>
            <div className="p-3 flex items-center gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Suchen…"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300/80 dark:border-neutral-700/80 bg-white/80 dark:bg-neutral-950/40 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 transition"
              />
              <button
                onClick={createNew}
                className="px-3 py-2 rounded-xl border border-blue-600 bg-blue-600 text-white hover:brightness-110"
              >
                Neu
              </button>
            </div>
            <div className="flex-1 overflow-auto px-2 pb-2">
              {filtered.length === 0 && (
                <div className="text-sm opacity-70 px-2">Keine Treffer.</div>
              )}
              <ul className="space-y-2">
                {filtered.map((it) => {
                  const active = it.id === currentId;
                  return (
                    <li
                      key={it.id}
                      className={`rounded-xl border ${active ? "border-blue-600 bg-blue-600/10" : "border-white/30 dark:border-white/10 bg-white/60 dark:bg-neutral-950/40"} backdrop-blur`}
                    >
                      <button
                        onClick={() => onSelect(it.id)}
                        className="w-full text-left px-3 py-2"
                      >
                        <div className="text-sm font-medium truncate">{it.title}</div>
                        <div className="text-xs opacity-70">{formatTime(it.updatedAt)}</div>
                      </button>
                      <div className="px-3 pb-2 flex gap-2">
                        <button
                          onClick={() => rename(it.id)}
                          className="text-xs px-2 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60"
                        >
                          Umbenennen
                        </button>
                        <button
                          onClick={() => remove(it.id)}
                          className="text-xs px-2 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60"
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
