import { useRef } from "react";
import { createPortal } from "react-dom";

import { Plus, X } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button, Card, Typography } from "@/ui";

import { ChatHistoryEmpty } from "./components/ChatHistoryEmpty";
import { ChatHistoryItem } from "./components/ChatHistoryItem";
import { ChatHistoryLoading } from "./components/ChatHistoryLoading";
import { useChatHistory } from "./hooks/useChatHistory";
import { useDrawerEffects } from "./hooks/useDrawerEffects";
import { QuickSettingsPanel } from "./QuickSettingsPanel";

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentConversationId?: string;
  swipeStack?: string[]; // New prop
}

export function ChatHistoryDrawer({
  isOpen,
  onClose,
  currentConversationId,
  swipeStack = [],
}: ChatHistoryDrawerProps) {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const { conversations, loading, handleSelect, handleNewChat, handleDelete } = useChatHistory(
    isOpen,
    currentConversationId,
  );

  useDrawerEffects(isOpen, onClose);

  if (!isOpen) return null;

  // Split conversations
  const activePages = conversations.filter((c) => swipeStack.includes(c.id));
  // Sort active pages by stack order
  activePages.sort((a, b) => swipeStack.indexOf(a.id) - swipeStack.indexOf(b.id));

  const archivedPages = conversations.filter((c) => !swipeStack.includes(c.id));

  const drawer = (
    <div className="fixed inset-0 z-drawer bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={cn(
          "fixed inset-y-0 right-0 flex justify-end p-0 sm:p-[var(--spacing-4)]",
          "transition-all duration-200 ease-out",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Card
          variant="hero"
          padding="none"
          className={cn(
            "h-full w-[85vw] sm:w-[clamp(20rem,30vw,24rem)] sm:rounded-3xl rounded-none",
            "flex flex-col overflow-hidden bg-surface-1 shadow-raiseLg",
            "motion-safe:animate-[slideInRight_200ms_ease-out]",
          )}
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Chat Verlauf"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-2 bg-surface-1 shrink-0">
            <Typography variant="h3" className="text-base font-semibold">
              Verlauf
            </Typography>
            <button
              onClick={onClose}
              ref={closeButtonRef}
              className="p-2 rounded-full text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors"
              aria-label="Schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4 pb-2 shrink-0">
            <Button
              className="w-full justify-start gap-2"
              variant="primary"
              onClick={() => handleNewChat(onClose)}
            >
              <Plus className="h-4 w-4" />
              Neuer Chat
            </Button>
          </div>

          {/* Quick Settings Panel */}
          <div className="px-4 pb-2 shrink-0">
            <QuickSettingsPanel />
          </div>

          {/* Content List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {loading ? (
              <ChatHistoryLoading />
            ) : conversations.length === 0 ? (
              <ChatHistoryEmpty />
            ) : (
              <>
                {/* Active Pages (Stack) */}
                {activePages.length > 0 && (
                  <div className="space-y-2">
                    <Typography
                      variant="body-xs"
                      className="text-text-secondary uppercase tracking-wider font-semibold"
                    >
                      Aktive Seiten
                    </Typography>
                    <div className="space-y-1">
                      {activePages.map((conv) => (
                        <ChatHistoryItem
                          key={conv.id}
                          conversation={conv}
                          isActive={currentConversationId === conv.id}
                          onSelect={(id) => handleSelect(id, onClose)}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Archived Pages */}
                <div className="space-y-2">
                  {activePages.length > 0 && (
                    <Typography
                      variant="body-xs"
                      className="text-text-secondary uppercase tracking-wider font-semibold"
                    >
                      Archiv
                    </Typography>
                  )}
                  <div className="space-y-1">
                    {archivedPages.map((conv) => (
                      <ChatHistoryItem
                        key={conv.id}
                        conversation={conv}
                        isActive={currentConversationId === conv.id}
                        onSelect={(id) => handleSelect(id, onClose)}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer with Stats */}
          <div className="p-3 border-t border-surface-2 bg-surface-1/50 text-center shrink-0">
            <Typography variant="body-xs" className="text-text-secondary">
              {conversations.length} Chats gespeichert
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  );

  if (typeof document === "undefined") return drawer;
  return createPortal(drawer, document.body);
}
