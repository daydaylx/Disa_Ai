import * as React from "react";
import type { UseConversations, ConversationMeta } from "../hooks/useConversations";

interface Props {
  conv: UseConversations;
}

/**
 * Dezentes Session-Menü:
 * - Button "Chats" im Header
 * - Dropdown Panel: Suche, Liste, Neu, Umbenennen, Duplizieren, Löschen
 * - Keine Layout-Verschiebung, keine Sidebar
 */
export default function SessionMenu({ conv }: Props): JSX.Element {
  const {
    list,
    activeId,
    createConversation,
    duplicateConversation,
    renameConversation,
    deleteConversation,
    setActiveConversation,
  } = conv;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");

  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => c.title.toLowerCase().includes(q));
  }, [list, query]);

  function startEdit(c: ConversationMeta): void {
    setEditingId(c.id);
    setEditValue(c.title);
  }
  function commitEdit(): void {
    if (!editingId) return;
    renameConversation(editingId, editValue);
    setEditingId(null);
    setEditValue("");
  }
  function cancelEdit(): void {
    setEditingId(null);
    setEditValue("");
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-sm px-3 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Chats verwalten"
      >
        Chats
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xl"
        >
          <div className="p-2 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Chats suchen…"
                className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 caret-neutral-700 dark:caret-neutral-200 py-1.5 px-2 outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Chats suchen"
              />
              <button
                type="button"
                onClick={() => {
                  const id = createConversation({ makeActive: true });
                  setActiveConversation(id);
                }}
                className="shrink-0 rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-sm text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                title="Neuer Chat"
                aria-label="Neuer Chat"
              >
                Neu
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="text-xs text-neutral-500 px-2 py-3">Keine Treffer</div>
            ) : (
              <ul className="space-y-1">
                {filtered.map((c) => {
                  const isActive = c.id === activeId;
                  return (
                    <li key={c.id}>
                      <div
                        className={`group rounded-md px-2 py-2 text-sm cursor-pointer border border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 ${
                          isActive ? "bg-neutral-100 dark:bg-neutral-900" : ""
                        }`}
                        onClick={() => {
                          setActiveConversation(c.id);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {editingId === c.id ? (
                            <input
                              className="w-full bg-transparent outline-none border-b border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") commitEdit();
                                if (e.key === "Escape") cancelEdit();
                              }}
                              onBlur={commitEdit}
                              autoFocus
                            />
                          ) : (
                            <span className="flex-1 truncate" title={c.title}>
                              {c.title}
                            </span>
                          )}
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                            {new Date(c.updatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            type="button"
                            className="text-xs rounded border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5"
                            title="Umbenennen"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(c);
                            }}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="text-xs rounded border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5"
                            title="Duplizieren"
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateConversation(c.id);
                            }}
                          >
                            ⧉
                          </button>
                          <button
                            type="button"
                            className="text-xs rounded border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-1.5 py-0.5"
                            title="Löschen"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Konversation löschen?")) {
                                deleteConversation(c.id);
                              }
                            }}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
