import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useToasts } from "../components/ui/toast/ToastsProvider";
import {
  deleteConversation as deleteFromDb,
  getAllConversations,
  getConversation as getFromDb,
  saveConversation,
  updateConversation,
} from "../lib/conversation-manager-modern";
import type { ChatMessageType, Conversation } from "../types";

interface ConversationManagerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  setMessages: (messages: ChatMessageType[]) => void;
  setCurrentSystemPrompt: (prompt: string | undefined) => void;
  onNewConversation: () => void;
}

export function useConversationManager({
  messages,
  isLoading,
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
  const lastSavedSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (messages.length === 0) {
      lastSavedSignatureRef.current = null;
    }
  }, [messages.length]);

  useEffect(() => {
    const saveConversationIfNeeded = async () => {
      const lastMessage = messages[messages.length - 1];

      if (!isLoading && messages.length > 0 && lastMessage?.role === "assistant") {
        const storageMessages = messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          model: msg.model,
        }));

        try {
          const signature = `${storageMessages.length}:${lastMessage.id}:${lastMessage.content}`;
          if (lastSavedSignatureRef.current === signature) return;

          const now = new Date().toISOString();

          if (activeConversationId) {
            await updateConversation(activeConversationId, {
              messages: storageMessages,
              updatedAt: now,
              messageCount: storageMessages.length,
            });
          } else {
            const conversationId = crypto.randomUUID();
            const conversation = {
              id: conversationId,
              title: `Conversation ${new Date().toLocaleDateString()}`,
              messages: storageMessages,
              createdAt: now,
              updatedAt: now,
              model: "default",
              messageCount: storageMessages.length,
            };
            await saveConversation(conversation);
            setActiveConversationId(conversationId);
          }

          lastSavedSignatureRef.current = signature;
          await refreshConversations();
        } catch (error) {
          console.error("Failed to auto-save:", error);
          toasts.push({
            kind: "warning",
            title: "Speichern fehlgeschlagen",
            message: "Die Konversation konnte nicht automatisch gespeichert werden",
          });
        }
      }
    };

    void saveConversationIfNeeded();
  }, [
    isLoading,
    messages,
    activeConversationId,
    setActiveConversationId,
    refreshConversations,
    toasts,
  ]);

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
