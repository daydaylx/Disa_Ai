import * as React from "react";
import type { UseConversations, ConversationMeta } from "../hooks/useConversations";

interface Props {
  conv: UseConversations;
  onSelect?: (id: string) => void;
}

export default function SessionSidebar({ conv, onSelect }: Props): JSX.Element {
  const {
    list, activeId,
    createConversation, duplicateConversation, renameConversation, deleteConversation, setActiveConversation,
  } = conv;

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState<string>("");

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
    <aside className="w-full md:w-72 border-r border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 supports-[backdrop-filter]:dark:bg-neutral-950/40">
      <div className="p-3 flex items-center justify-between">
        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          onClick={() => {
            const id = createConversation({ makeActive: true });
            if (onSelect) onSelect(id);
          }}
          title="Neuer Chat"
        >
          + Neuer Chat
        </button>
      </div>

      <div className="px-2 pb-2 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <ul className="space-y-1">
          {list.map((c) => {
            const isActive = c.id === activeId;
            const baseCls =
              "group flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer";
            return (
              <li key={c.id}>
                <div
                  className={`${baseCls} ${isActive ? "bg-neutral-100 dark:bg-neutral-900" : ""}`}
                  onClick={() => {
                    setActiveConversation(c.id);
                    if (onSelect) onSelect(c.id);
                  }}
                >
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
                    {new Date(c.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
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
      </div>
    </aside>
  );
}
