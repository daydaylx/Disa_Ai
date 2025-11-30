import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useToasts } from "@/ui";

import { useConversationStats } from "../../../hooks/use-storage";
import {
  type Conversation,
  deleteConversation,
  getAllConversations,
} from "../../../lib/conversation-manager-modern";

export function useChatHistory(isOpen: boolean, currentConversationId?: string) {
  const navigate = useNavigate();
  const toasts = useToasts();
  const { stats } = useConversationStats();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleSelect = useCallback(
    (id: string, onClose: () => void) => {
      // If already on this conversation, just close
      if (id === currentConversationId) {
        onClose();
        return;
      }

      // Navigate to chat with this conversation
      void navigate("/chat", { state: { conversationId: id } });
      onClose();
    },
    [navigate, currentConversationId],
  );

  const handleNewChat = useCallback(
    (onClose: () => void) => {
      void navigate("/chat", { state: { conversationId: null } });
      onClose();
    },
    [navigate],
  );

  const handleDelete = useCallback(
    async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();

      if (
        !confirm(
          "Konversation wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
        )
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
    },
    [currentConversationId, loadConversations, navigate, toasts],
  );

  return {
    conversations,
    loading,
    handleSelect,
    handleNewChat,
    handleDelete,
  };
}
