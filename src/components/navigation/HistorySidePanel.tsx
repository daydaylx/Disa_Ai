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

  // "Active Pages" logic: Let's say the last 5 edited are "Active Pages" (History)
  // and the rest is "Archive"
  const activePages = sortedConversations.slice(0, 5);
  const archivedPages = sortedConversations.slice(5);

  const [activeTab, setActiveTab] = useState<"history" | "archive">("history");

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-drawer" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-lg transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Panel - Slide in from right with Chalk Texture */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-[85vh] w-full border-t border-white/10 transition-transform duration-300 ease-out transform flex flex-col glass-3 rounded-t-2xl",
          "sm:inset-y-0 sm:right-0 sm:bottom-auto sm:h-full sm:max-w-sm sm:border-t-0 sm:border-l sm:rounded-none",
          isOpen ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 z-10 pt-safe-top pr-safe-right">
          <div>
            <h2 className="text-base font-semibold text-ink-primary tracking-tight">
              Inhaltsverzeichnis
            </h2>
            <p className="text-xs text-ink-tertiary mt-0.5">Letzte Gespräche</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-ink-secondary hover:text-ink-primary hover:bg-surface-2 ml-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex-1 py-3.5 text-sm font-semibold transition-colors border-b-2",
              activeTab === "history"
                ? "border-accent-primary text-ink-primary bg-surface-2/60"
                : "border-transparent text-ink-secondary hover:text-ink-primary hover:bg-surface-2/40",
            )}
          >
            <Book className="h-4 w-4 inline-block mr-2 mb-0.5" />
            Chat‑Verlauf
          </button>
          <button
            onClick={() => setActiveTab("archive")}
            className={cn(
              "flex-1 py-3.5 text-sm font-semibold transition-colors border-b-2",
              activeTab === "archive"
                ? "border-accent-primary text-ink-primary bg-surface-2/60"
                : "border-transparent text-ink-secondary hover:text-ink-primary hover:bg-surface-2/40",
            )}
          >
            <Database className="h-4 w-4 inline-block mr-2 mb-0.5" />
            Archiv
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {(activeTab === "history" ? activePages : archivedPages).length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-surface-2/40 p-6 text-center text-ink-secondary">
              {activeTab === "history" ? (
                <Book className="h-6 w-6 text-ink-tertiary" />
              ) : (
                <Database className="h-6 w-6 text-ink-tertiary" />
              )}
              <p className="text-sm">
                Keine Einträge im {activeTab === "history" ? "Chat‑Verlauf" : "Archiv"}.
              </p>
              {activeTab === "history" && (
                <Button variant="secondary" size="sm" onClick={onNewChat} className="gap-2">
                  Neue Unterhaltung starten
                </Button>
              )}
            </div>
          ) : (
            (activeTab === "history" ? activePages : archivedPages).map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelect(chat.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl transition-all group border border-white/8 bg-surface-2/70",
                  "hover:border-accent-primary/50 hover:bg-surface-1/80",
                  activeId === chat.id
                    ? "border-accent-primary bg-accent-primary/10 ring-1 ring-accent-primary/20 shadow-md"
                    : "",
                )}
              >
                <div className="flex flex-col gap-1">
                  <span
                    className={cn(
                      "font-medium truncate",
                      activeId === chat.id ? "text-ink-primary" : "text-ink-primary",
                    )}
                  >
                    {chat.title || "Unbenanntes Gespräch"}
                  </span>
                  <span className="text-xs text-ink-tertiary">
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
        <div className="p-4 border-t border-white/10 mt-auto">
          <Button
            variant="primary"
            className="w-full shadow-md"
            onClick={() => {
              onNewChat();
              onClose();
            }}
          >
            Neue Unterhaltung starten
          </Button>
        </div>
      </div>
    </div>
  );
}
