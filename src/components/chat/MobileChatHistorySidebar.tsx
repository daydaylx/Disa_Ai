import { History, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Conversation } from "../../lib/conversation-manager";
import { deleteConversation } from "../../lib/conversation-manager";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToasts } from "../ui/toast/ToastsProvider";

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MobileChatHistorySidebar({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelect,
  onDelete,
}: ChatHistorySidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const toasts = useToasts();
  const navigate = useNavigate();

  const handleNewConversation = useCallback(() => {
    onClose();
    void navigate("/chat");
  }, [navigate, onClose]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      onClose();
      onSelect(id);
    },
    [onClose, onSelect],
  );

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !confirm(
        "Möchtest du diese Konversation wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
      )
    ) {
      return;
    }

    deleteConversation(id);
    toasts.push({
      kind: "success",
      title: "Gelöscht",
      message: "Konversation wurde gelöscht",
    });
    onDelete(id);
  };

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return conversations.filter((conversation) => {
      if (!normalizedSearch) return true;
      const haystack = `${conversation.title} ${
        conversation.messages?.map((msg) => msg.content)?.join(" ") || ""
      }`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [conversations, searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Close sidebar when pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="mobile-chat-history-sidebar fixed inset-0 z-50 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-history-title"
    >
      <div
        className="mobile-chat-history-content animate-in slide-in-from-bottom fixed inset-x-0 bottom-0 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pb-2 pt-3">
          <div className="bg-surface-subtle h-1 w-10 rounded-full" />
        </div>

        <div className="border-border flex items-center justify-between border-b px-6 py-4">
          <h2 id="chat-history-title" className="text-text-primary text-xl font-semibold">
            Chat-Verlauf
          </h2>
          <button
            onClick={onClose}
            className="tap-target bg-surface-subtle text-text-secondary hover:bg-surface-subtle hover:text-text-primary flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-hidden p-4">
          {/* Mobile-optimized search bar */}
          <div className="mb-4 relative">
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Konversationen suchen..."
              className="border-border bg-surface-card text-text-primary placeholder:text-text-secondary focus:border-brand focus:ring-brand min-h-[48px] w-full rounded-lg border py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 touch-target"
              aria-label="Konversationen suchen"
            />
            <History className="text-text-secondary pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="text-text-secondary absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 touch-target"
                aria-label="Suche löschen"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Mobile-optimized new conversation button */}
          <div className="mb-4">
            <Button
              onClick={handleNewConversation}
              variant="brand"
              className="w-full shadow-neon touch-target"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Neue Konversation</span>
            </Button>
          </div>

          {/* Mobile-optimized conversation list */}
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="border-border bg-surface-card text-text-secondary space-y-3 rounded-lg border p-6 text-center text-sm touch-target">
                <p>Keine Konversationen gefunden</p>
                <p className="text-text-secondary text-xs">Versuche es mit anderen Suchbegriffen</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const isActive = activeId === conversation.id;
                const messageCount = conversation.messages?.length || 0;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={cn(
                      "border-border bg-surface-card flex cursor-pointer flex-col gap-2 rounded-lg border p-3 transition-colors duration-150 ease-out motion-reduce:transition-none touch-target",
                      isActive
                        ? "border-brand bg-brand/10 hover:bg-brand/15"
                        : "hover:border-border-strong hover:bg-surface-subtle",
                    )}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectConversation(conversation.id);
                      }
                    }}
                    aria-label={`Konversation vom ${new Date(conversation.createdAt).toLocaleDateString()}`}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-text-primary text-sm font-semibold [hyphens:auto]">
                        {conversation.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                        className="text-text-secondary hover:bg-surface-subtle hover:text-text-primary h-8 w-8 touch-target"
                        aria-label={`Konversation "${conversation.title}" löschen`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">
                        {messageCount} {messageCount === 1 ? "Nachricht" : "Nachrichten"}
                      </span>
                      <span className="text-text-tertiary">
                        {new Date(conversation.updatedAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
