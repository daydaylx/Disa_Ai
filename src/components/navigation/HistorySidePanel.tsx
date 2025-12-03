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
    <div className="fixed inset-0 z-drawer z-[100]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Panel - Slide in from right */}
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-xs sm:max-w-sm bg-bg-page shadow-2xl transition-transform duration-300 ease-out transform",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-ink/10 bg-bg-page z-10">
          <h2 className="text-lg font-serif font-bold text-ink-primary tracking-wide">
            Inhaltsverzeichnis
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-ink-secondary hover:text-ink-primary"
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
                ? "border-accent text-accent bg-accent/5"
                : "border-transparent text-ink-secondary hover:text-ink-primary hover:bg-surface-2",
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
                ? "border-accent text-accent bg-accent/5"
                : "border-transparent text-ink-secondary hover:text-ink-primary hover:bg-surface-2",
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
                  "w-full text-left px-4 py-3 rounded-lg transition-all group",
                  "hover:bg-surface-2",
                  activeId === chat.id
                    ? "bg-accent/5 border-l-4 border-accent pl-3"
                    : "border-l-4 border-transparent",
                )}
              >
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "font-medium truncate",
                      activeId === chat.id
                        ? "text-accent"
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
        <div className="absolute bottom-0 w-full p-4 border-t border-border-ink/10 bg-bg-page">
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
