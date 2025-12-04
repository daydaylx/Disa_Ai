import { useState } from "react";

import { Book, Database, X } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import type { Conversation } from "../../types";

interface HistorySidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

export function HistorySidePanel({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: HistorySidePanelProps) {
  // Sort conversations by date (newest first)
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  // "Active Pages" logic: Let's say the last 5 edited are "Active Pages" (Bookmarks)
  // and the rest is "Archive"
  const activePages = sortedConversations.slice(0, 5);
  const archivedPages = sortedConversations.slice(5);

  const [activeTab, setActiveTab] = useState<"bookmarks" | "archive">("bookmarks");

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Panel - Slide in from right with Chalk Texture */}
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-xs sm:max-w-sm bg-[var(--bg-slate)] border-l border-[var(--border-chalk)] shadow-[0_0_0_1px_var(--border-chalk),0_18px_40px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out transform",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-chalk)] bg-[var(--bg-slate)] z-10">
          <h2 className="text-lg font-semibold text-[var(--ink-primary)] tracking-[0.04em]">
            Inhaltsverzeichnis
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--border-chalk)]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-ink/10">
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors border-b-2",
              activeTab === "bookmarks"
                ? "border-[var(--border-chalk-strong)] text-text-primary bg-[rgba(255,255,255,0.04)]"
                : "border-transparent text-ink-secondary hover:text-ink-primary hover:bg-[rgba(255,255,255,0.03)]",
            )}
          >
            <Book className="h-4 w-4 inline-block mr-2 mb-0.5" />
            Lesezeichen
          </button>
          <button
            onClick={() => setActiveTab("archive")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors border-b-2",
              activeTab === "archive"
                ? "border-[var(--border-chalk-strong)] text-text-primary bg-[rgba(255,255,255,0.04)]"
                : "border-transparent text-ink-secondary hover:text-ink-primary hover:bg-[rgba(255,255,255,0.03)]",
            )}
          >
            <Database className="h-4 w-4 inline-block mr-2 mb-0.5" />
            Archiv
          </button>
        </div>

        {/* Content List */}
        <div className="overflow-y-auto h-[calc(100%-130px)] p-4 space-y-1">
          {(activeTab === "bookmarks" ? activePages : archivedPages).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-ink-tertiary">
              <p>Keine Einträge gefunden.</p>
              {activeTab === "bookmarks" && (
                <Button variant="link" onClick={onNewChat} className="mt-2 text-accent">
                  Neue Seite beginnen
                </Button>
              )}
            </div>
          ) : (
            (activeTab === "bookmarks" ? activePages : archivedPages).map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelect(chat.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-all group border border-[color:hsla(0,0%,92%,0.35)]",
                  "hover:border-[var(--border-chalk-strong)] hover:bg-[rgba(255,255,255,0.03)]",
                  activeId === chat.id
                    ? "bg-[rgba(255,255,255,0.05)] border-l-4 border-[var(--accent-primary)] pl-3 shadow-[0_0_0_1px_var(--border-chalk-strong)]"
                    : "border-l-4 border-transparent",
                )}
              >
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "font-medium truncate",
                      activeId === chat.id
                        ? "text-text-primary"
                        : "text-ink-primary group-hover:text-ink-primary",
                    )}
                  >
                    {chat.title || "Unbenanntes Gespräch"}
                  </span>
                  <span className="text-xs text-ink-tertiary mt-1">
                    {new Date(chat.updatedAt).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer Action */}
        <div className="absolute bottom-0 w-full p-4 border-t border-[var(--border-chalk)] bg-[rgba(19,19,20,0.96)]">
          <Button
            variant="primary"
            className="w-full shadow-md"
            onClick={() => {
              onNewChat();
              onClose();
            }}
          >
            Neue Seite aufschlagen
          </Button>
        </div>
      </div>
    </div>
  );
}
