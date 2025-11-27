import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import { useToasts } from "@/ui";
import { Button } from "@/ui/Button";
import { MaterialCard } from "@/ui/MaterialCard";
import { Typography } from "@/ui/Typography";

import { useConversationStats } from "../../hooks/use-storage";
import {
  type Conversation,
  deleteConversation,
  getAllConversations,
} from "../../lib/conversation-manager-modern";
import { Plus, Trash2, X } from "../../lib/icons";
import { cn } from "../../lib/utils";

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentConversationId?: string;
}

export function ChatHistoryDrawer({
  isOpen,
  onClose,
  currentConversationId,
}: ChatHistoryDrawerProps) {
  const navigate = useNavigate();
  const toasts = useToasts();
  const { stats } = useConversationStats();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getAllConversations();
      setConversations(list);
    } catch (error) {
      console.error("Failed to load conversations", error);
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: "Verlauf konnte nicht geladen werden.",
      });
    } finally {
      setLoading(false);
    }
  }, [toasts]);

  // Load conversations when drawer opens
  useEffect(() => {
    if (isOpen) {
      void loadConversations();
    }
  }, [isOpen, stats?.totalConversations, loadConversations]);

  const handleSelect = (id: string) => {
    // If already on this conversation, just close
    if (id === currentConversationId) {
      onClose();
      return;
    }

    // Navigate to chat with this conversation
    void navigate("/chat", { state: { conversationId: id } });
    onClose();
  };

  const handleNewChat = () => {
    void navigate("/chat", { state: { conversationId: null } }); // Clear state
    onClose();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    if (
      !confirm("Konversation wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")
    ) {
      return;
    }

    try {
      await deleteConversation(id);
      await loadConversations();
      toasts.push({ kind: "success", title: "Gelöscht", message: "Konversation entfernt." });

      // If we deleted the current conversation, navigate to new chat
      if (id === currentConversationId) {
        void navigate("/chat");
      }
    } catch {
      toasts.push({ kind: "error", title: "Fehler", message: "Löschen fehlgeschlagen." });
    }
  };

  // Accessibility: Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return undefined;
    if (typeof document === "undefined") return undefined;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const drawer = (
    <div className="fixed inset-0 z-drawer bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={cn(
          "fixed inset-y-0 right-0 flex justify-end p-0 sm:p-[var(--spacing-4)]",
          "transition-all duration-200 ease-out",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <MaterialCard
          variant="hero"
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
              onClick={handleNewChat}
            >
              <Plus className="h-4 w-4" />
              Neuer Chat
            </Button>
          </div>

          {/* Content List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-primary"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                <Typography variant="body-sm">Keine gespeicherten Chats.</Typography>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelect(conv.id)}
                    className={cn(
                      "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200",
                      "hover:bg-surface-2",
                      currentConversationId === conv.id
                        ? "bg-accent-primary/10 border-l-2 border-accent-primary"
                        : "border-l-2 border-transparent",
                    )}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleSelect(conv.id);
                    }}
                  >
                    <div className="flex-1 min-w-0 mr-2">
                      <Typography
                        variant="body-sm"
                        className="font-medium truncate text-text-primary"
                      >
                        {conv.title || "Neue Konversation"}
                      </Typography>
                      <Typography variant="body-xs" className="text-text-secondary truncate">
                        {new Date(conv.updatedAt || conv.createdAt || "").toLocaleDateString()}
                        {" • "}
                        {conv.messageCount ?? conv.messages?.length ?? 0} Nachrichten
                      </Typography>
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, conv.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-text-secondary hover:text-status-error hover:bg-surface-3 transition-all focus:opacity-100"
                      aria-label="Chat löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Stats */}
          <div className="p-3 border-t border-surface-2 bg-surface-1/50 text-center shrink-0">
            <Typography variant="body-xs" className="text-text-secondary">
              {conversations.length} Chats gespeichert
            </Typography>
          </div>
        </MaterialCard>
      </div>
    </div>
  );

  if (typeof document === "undefined") return drawer;
  return createPortal(drawer, document.body);
}
