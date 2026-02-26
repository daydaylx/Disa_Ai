import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { Book, Database, X } from "@/lib/icons";
import { getOverlayRoot, lockActiveScrollOwner } from "@/lib/overlay";
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

  // Swipe-Down to close
  const { handlers: swipeHandlersNative, dragOffset } = useSwipeGesture({
    onSwipeDown: onClose,
    threshold: 80,
    enableHaptic: true,
  });

  // Wrap native handlers for React
  const swipeHandlers = {
    onTouchStart: (e: React.TouchEvent) => swipeHandlersNative.onTouchStart(e.nativeEvent),
    onTouchMove: (e: React.TouchEvent) => swipeHandlersNative.onTouchMove(e.nativeEvent),
    onTouchEnd: () => swipeHandlersNative.onTouchEnd(),
    onTouchCancel: () => swipeHandlersNative.onTouchCancel(),
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const unlockScroll = lockActiveScrollOwner();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      unlockScroll();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const panelContent = (
    <div
      className="fixed inset-0 z-drawer pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Verlauf"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-md transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Panel */}
      <div
        {...swipeHandlers}
        className={cn(
          "glass-3 absolute inset-x-0 bottom-0 flex h-[85vh] w-full transform flex-col rounded-t-2xl border-t border-white/12 duration-300 ease-out",
          "sm:inset-y-0 sm:right-0 sm:bottom-auto sm:h-full sm:max-w-sm sm:border-t-0 sm:border-l sm:rounded-none",
          "translate-y-0 sm:translate-x-0",
        )}
        style={{
          transform: `translateY(${Math.max(0, dragOffset.y)}px)`,
          opacity: dragOffset.y > 0 ? Math.max(0.5, 1 - dragOffset.y / 200) : 1,
          background: "rgba(16, 16, 20, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transition:
            dragOffset.y > 0 ? "none" : "transform 300ms ease-out, opacity 300ms ease-out",
        }}
      >
        {/* Header */}
        <div className="z-sticky-header border-b border-white/12 px-5 py-4 pt-safe-top pr-safe-right">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-ink-primary">Verlauf</h2>
              <p className="mt-0.5 text-xs text-ink-tertiary">
                {sortedConversations.length} gespeicherte Gespräche
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
              >
                Neu
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-1 text-ink-secondary hover:bg-surface-2 hover:text-ink-primary"
                aria-label="Verlauf schließen"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 px-4 py-2">
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex flex-1 items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
              activeTab === "history"
                ? "border-accent-primary/45 bg-accent-primary/12 text-ink-primary"
                : "border-white/10 bg-surface-1/45 text-ink-secondary hover:border-white/16 hover:text-ink-primary",
            )}
          >
            <Book className="mr-2 inline-block h-4 w-4" />
            Chat‑Verlauf
          </button>
          <button
            onClick={() => setActiveTab("archive")}
            className={cn(
              "flex flex-1 items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
              activeTab === "archive"
                ? "border-accent-primary/45 bg-accent-primary/12 text-ink-primary"
                : "border-white/10 bg-surface-1/45 text-ink-secondary hover:border-white/16 hover:text-ink-primary",
            )}
          >
            <Database className="mr-2 inline-block h-4 w-4" />
            Archiv
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
          {(activeTab === "history" ? activePages : archivedPages).length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/12 bg-surface-2/35 p-6 text-center text-ink-secondary">
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
                  "group relative w-full rounded-xl border border-white/10 bg-surface-2/65 px-4 py-3.5 text-left transition-all",
                  "hover:border-accent-primary/50 hover:bg-surface-1/75",
                  activeId === chat.id
                    ? "border-accent-primary/55 bg-accent-primary/12 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.24)]"
                    : "",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-r-full transition-opacity",
                    activeId === chat.id
                      ? "bg-accent-primary opacity-100"
                      : "bg-transparent opacity-0",
                  )}
                />
                <div className="flex flex-col gap-1">
                  <span
                    className={cn(
                      "truncate pr-2 text-sm font-semibold",
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
        <div className="mt-auto border-t border-white/12 p-4">
          <Button
            variant="primary"
            className="w-full shadow-[0_8px_24px_rgba(139,92,246,0.35)]"
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

  const overlayRoot = getOverlayRoot();
  if (!overlayRoot) return panelContent;
  return createPortal(panelContent, overlayRoot);
}
