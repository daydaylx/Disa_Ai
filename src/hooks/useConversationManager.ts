import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useToasts } from "@/ui";

import { STORAGE_KEYS } from "../config/storageKeys";
import {
  deleteConversation as deleteFromDb,
  getAllConversations,
  getConversation as getFromDb,
  saveConversation,
  updateConversation,
} from "../lib/conversation-manager-modern";
import { safeStorage } from "../lib/safeStorage";
import { debounceWithCancel } from "../lib/utils/debounce";
import { safeError } from "../lib/utils/production-logger";
import type { ChatMessageType, Conversation } from "../types";

interface ConversationManagerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  setMessages: (messages: ChatMessageType[]) => void;
  setCurrentSystemPrompt: (prompt: string | undefined) => void;
  onNewConversation: () => void;
  saveEnabled?: boolean;
  restoreEnabled?: boolean;
}

export function useConversationManager({
  messages,
  isLoading,
  setMessages,
  setCurrentSystemPrompt,
  onNewConversation,
  saveEnabled = true,
  restoreEnabled = true,
}: ConversationManagerProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const toasts = useToasts();
  const navigate = useNavigate();
  const location = useLocation();
  const lastSavedSignatureRef = useRef<string | null>(null);
  const hydratedFromStorageRef = useRef(false);

  const persistLastConversationId = useCallback((id: string | null) => {
    if (id) {
      safeStorage.setItem(STORAGE_KEYS.LAST_CONVERSATION, id);
    } else {
      safeStorage.removeItem(STORAGE_KEYS.LAST_CONVERSATION);
    }
  }, []);

  const readLastConversationId = useCallback((): string | null => {
    return safeStorage.getItem(STORAGE_KEYS.LAST_CONVERSATION);
  }, []);

  const refreshConversations = useCallback(async () => {
    try {
      const conversations = await getAllConversations();
      setConversations(conversations);
      if (
        conversations.length > 0 &&
        activeConversationId &&
        !conversations.some((conv) => conv.id === activeConversationId)
      ) {
        setActiveConversationId(null);
        persistLastConversationId(null);
      }
    } catch (error) {
      safeError("Failed to refresh conversations", error);
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: "Konversationen konnten nicht geladen werden",
      });
    }
  }, [activeConversationId, persistLastConversationId, toasts]);

  useEffect(() => {
    if (messages.length === 0) {
      lastSavedSignatureRef.current = null;
    }
  }, [messages.length]);

  // Create stable refs for values that debounced function needs
  const messagesRef = useRef(messages);
  const activeConversationIdRef = useRef(activeConversationId);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    messagesRef.current = messages;
    activeConversationIdRef.current = activeConversationId;
    isLoadingRef.current = isLoading;
  }, [messages, activeConversationId, isLoading]);

  // Debounced auto-save function (500ms delay to avoid excessive writes)
  // This function is stable and uses refs to access latest values
  const debouncedSave = useMemo(
    () =>
      debounceWithCancel(async () => {
        const currentMessages = messagesRef.current;
        const currentConversationId = activeConversationIdRef.current;
        const currentIsLoading = isLoadingRef.current;

        const lastMessage = currentMessages[currentMessages.length - 1];

        if (!saveEnabled || !lastMessage || currentMessages.length === 0) return;

        const lastMessageRole = lastMessage.role;
        const isAssistantCompleted = lastMessageRole === "assistant" && !currentIsLoading;
        const isUserDraft = lastMessageRole === "user";

        // Only save when assistant is done or user just sent a message
        if (!isAssistantCompleted && !isUserDraft) return;

        // Don't persist half-finished assistant replies
        if (lastMessageRole === "assistant" && currentIsLoading) return;

        const storageMessages = currentMessages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          model: msg.model,
        }));

        try {
          const signature = `${storageMessages.length}:${lastMessage.id}:${lastMessage.role}:${lastMessage.content}`;
          if (lastSavedSignatureRef.current === signature) return;

          const now = new Date().toISOString();
          const messageCount = storageMessages.length;
          const model = lastMessage.model || "default";

          const firstUserMessage = storageMessages.find((msg) => msg.role === "user");
          const fallbackTitle = `Conversation ${new Date().toLocaleDateString()}`;
          const titleFromUser = firstUserMessage?.content?.slice(0, 80).trim() || fallbackTitle;

          let conversationId = currentConversationId;

          if (conversationId) {
            await updateConversation(conversationId, {
              messages: storageMessages,
              updatedAt: now,
              messageCount,
              model,
              title: titleFromUser,
            });
          } else {
            conversationId = crypto.randomUUID();
            const conversation = {
              id: conversationId,
              title: titleFromUser,
              messages: storageMessages,
              createdAt: now,
              updatedAt: now,
              model,
              messageCount,
            };
            await saveConversation(conversation);
            setActiveConversationId(conversationId);
          }

          persistLastConversationId(conversationId ?? null);
          lastSavedSignatureRef.current = signature;
          await refreshConversations();
        } catch (error) {
          safeError("Failed to auto-save", error);
          toasts.push({
            kind: "warning",
            title: "Speichern fehlgeschlagen",
            message: "Die Konversation konnte nicht automatisch gespeichert werden",
          });
        }
      }, 500),
    [saveEnabled, setActiveConversationId, persistLastConversationId, refreshConversations, toasts],
  );

  // Trigger debounced save when messages or loading state changes
  useEffect(() => {
    if (!saveEnabled) return;

    debouncedSave();

    // Cleanup: cancel pending saves when component unmounts
    return () => {
      debouncedSave.cancel();
    };
  }, [messages, isLoading, saveEnabled, debouncedSave]);

  useEffect(() => {
    if (isHistoryOpen) {
      void refreshConversations();
    }
  }, [isHistoryOpen, refreshConversations]);

  const handleSelectConversation = useCallback(
    async (id: string, opts?: { silent?: boolean }) => {
      try {
        const conversation = await getFromDb(id);

        if (!conversation?.messages || !Array.isArray(conversation.messages)) {
          if (!opts?.silent) {
            toasts.push({
              kind: "error",
              title: "Fehler",
              message: "Konversation ist beschädigt oder konnte nicht geladen werden",
            });
          }
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
          if (!opts?.silent) {
            toasts.push({
              kind: "warning",
              title: "Konversation leer",
              message: "Diese Konversation enthält keine gültigen Nachrichten",
            });
          }
          return;
        }

        setMessages(chatMessages);
        setActiveConversationId(id);
        persistLastConversationId(id);
        onNewConversation(); // Resets discussion context etc.

        const systemMessage = chatMessages.find((msg) => msg.role === "system");
        setCurrentSystemPrompt(systemMessage?.content);
        setIsHistoryOpen(false);

        const lastMsg = chatMessages[chatMessages.length - 1];
        if (lastMsg) {
          lastSavedSignatureRef.current = `${chatMessages.length}:${lastMsg.id}:${lastMsg.role}:${lastMsg.content}`;
        }

        if (!opts?.silent) {
          toasts.push({
            kind: "success",
            title: "Konversation geladen",
            message: `${conversation.title} wurde geladen`,
          });
        }
      } catch (error) {
        safeError("Failed to load conversation", error);
        if (!opts?.silent) {
          toasts.push({
            kind: "error",
            title: "Fehler",
            message: "Konversation konnte nicht geladen werden",
          });
        }
      }
    },
    [setMessages, setCurrentSystemPrompt, onNewConversation, persistLastConversationId, toasts],
  );

  useEffect(() => {
    if (!saveEnabled || !restoreEnabled) return;
    if (hydratedFromStorageRef.current) return;
    if (messages.length > 0 || isLoading) return;

    const lastId = readLastConversationId();
    if (!lastId) return;

    hydratedFromStorageRef.current = true;
    void handleSelectConversation(lastId, { silent: true }).catch(() => {
      persistLastConversationId(null);
    });
  }, [
    handleSelectConversation,
    isLoading,
    messages.length,
    persistLastConversationId,
    readLastConversationId,
    saveEnabled,
    restoreEnabled,
  ]);

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
        persistLastConversationId(null);
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
      persistLastConversationId,
      toasts,
    ],
  );

  const handleNewConversation = useCallback(() => {
    onNewConversation();
    setMessages([]);
    setActiveConversationId(null);
    persistLastConversationId(null);
    setCurrentSystemPrompt(undefined);
    toasts.push({
      kind: "info",
      title: "Neue Unterhaltung",
      message: "Bereit für eine neue Unterhaltung",
    });
  }, [onNewConversation, persistLastConversationId, setMessages, setCurrentSystemPrompt, toasts]);

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
