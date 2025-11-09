import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useToasts } from "../components/ui/toast/ToastsProvider";
import {
  deleteConversation as deleteFromDb,
  getAllConversations,
  getConversation as getFromDb,
} from "../lib/conversation-manager-modern";
import type { ChatMessageType, Conversation } from "../types";

interface ConversationManagerProps {
  setMessages: (messages: ChatMessageType[]) => void;
  setCurrentSystemPrompt: (prompt: string | undefined) => void;
  onNewConversation: () => void;
}

export function useConversationManager({
  setMessages,
  setCurrentSystemPrompt,
  onNewConversation,
}: ConversationManagerProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const toasts = useToasts();
  const navigate = useNavigate();
  const location = useLocation();

  const refreshConversations = useCallback(async () => {
    try {
      const conversations = await getAllConversations();
      setConversations(conversations);
    } catch (error) {
      console.error("Failed to refresh conversations:", error);
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: "Konversationen konnten nicht geladen werden",
      });
    }
  }, [toasts]);

  useEffect(() => {
    if (isHistoryOpen) {
      void refreshConversations();
    }
  }, [isHistoryOpen, refreshConversations]);

  const handleSelectConversation = useCallback(
    async (id: string) => {
      try {
        const conversation = await getFromDb(id);

        if (!conversation?.messages || !Array.isArray(conversation.messages)) {
          toasts.push({
            kind: "error",
            title: "Fehler",
            message: "Konversation ist beschädigt oder konnte nicht geladen werden",
          });
          return;
        }

        const chatMessages: ChatMessageType[] = conversation.messages
          .filter((msg) => ["user", "assistant", "system"].includes(msg.role))
          .map((msg) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant" | "system",
            content: msg.content,
            timestamp: msg.timestamp,
            model: msg.model,
          }));

        if (chatMessages.length === 0) {
          toasts.push({
            kind: "warning",
            title: "Konversation leer",
            message: "Diese Konversation enthält keine gültigen Nachrichten",
          });
          return;
        }

        setMessages(chatMessages);
        setActiveConversationId(id);
        onNewConversation(); // Resets discussion context etc.

        const systemMessage = chatMessages.find((msg) => msg.role === "system");
        setCurrentSystemPrompt(systemMessage?.content);
        setIsHistoryOpen(false);

        toasts.push({
          kind: "success",
          title: "Konversation geladen",
          message: `${conversation.title} wurde geladen`,
        });
      } catch (error) {
        console.error("Failed to load conversation:", error);
        toasts.push({
          kind: "error",
          title: "Fehler",
          message: "Konversation konnte nicht geladen werden",
        });
      }
    },
    [setMessages, setCurrentSystemPrompt, onNewConversation, toasts],
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      if (
        !confirm(
          "Möchtest du diese Konversation wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
        )
      ) {
        return;
      }

      await deleteFromDb(id);
      await refreshConversations();
      if (activeConversationId === id) {
        setActiveConversationId(null);
        setCurrentSystemPrompt(undefined);
        setMessages([]);
        onNewConversation();
      }
      toasts.push({
        kind: "success",
        title: "Gelöscht",
        message: "Konversation wurde gelöscht",
      });
    },
    [
      activeConversationId,
      refreshConversations,
      setMessages,
      setCurrentSystemPrompt,
      onNewConversation,
      toasts,
    ],
  );

  const handleNewConversation = useCallback(() => {
    onNewConversation();
    setMessages([]);
    setActiveConversationId(null);
    setCurrentSystemPrompt(undefined);
    toasts.push({
      kind: "info",
      title: "Neue Unterhaltung",
      message: "Bereit für eine neue Unterhaltung",
    });
  }, [onNewConversation, setMessages, setCurrentSystemPrompt, toasts]);

  // Effect to load conversation from URL
  useEffect(() => {
    const state = location.state as { conversationId?: string } | null;
    const conversationId = state?.conversationId;
    if (conversationId) {
      void handleSelectConversation(conversationId);
      // Clean up state from location
      const { conversationId: _omit, ...rest } = state;
      void navigate(location.pathname, { replace: true, state: rest });
    }
  }, [location, navigate, handleSelectConversation]);

  return {
    isHistoryOpen,
    openHistory: () => setIsHistoryOpen(true),
    closeHistory: () => setIsHistoryOpen(false),
    conversations,
    activeConversationId,
    selectConversation: handleSelectConversation,
    deleteConversation: handleDeleteConversation,
    newConversation: handleNewConversation,
    setActiveConversationId,
    refreshConversations,
  };
}
