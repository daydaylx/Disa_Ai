import { useCallback, useState } from "react";

import {
  type Conversation,
  deleteConversation as deleteConversationStorage,
  getAllConversations as getAllConversationsStorage,
  getConversation as getConversationStorage,
  saveConversation as saveConversationStorage,
} from "../lib/conversation-manager";
import type { ChatMessageType } from "../types/chatMessage";

export interface UseConversationManagerReturn {
  // State
  conversations: Conversation[];
  activeConversationId: string | null;

  // Actions
  loadConversation: (id: string) => Conversation | null;
  saveCurrentConversation: (messages: ChatMessageType[], systemPrompt?: string) => string;
  deleteConversation: (id: string) => void;
  refreshConversations: () => void;
  setActiveConversationId: (id: string | null) => void;
  createNewConversation: () => void;
}

/**
 * Custom hook for managing chat conversations
 *
 * Handles:
 * - Loading, saving, and deleting conversations
 * - Tracking the active conversation
 * - Auto-saving conversations
 * - Refreshing the conversation list
 *
 * @example
 * ```tsx
 * const {
 *   conversations,
 *   activeConversationId,
 *   loadConversation,
 *   saveCurrentConversation,
 *   deleteConversation
 * } = useConversationManager();
 * ```
 */
export function useConversationManager(): UseConversationManagerReturn {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    getAllConversationsStorage(),
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const refreshConversations = useCallback(() => {
    setConversations(getAllConversationsStorage());
  }, []);

  const loadConversation = useCallback((id: string): Conversation | null => {
    const conversation = getConversationStorage(id);
    if (conversation) {
      setActiveConversationId(id);
    }
    return conversation;
  }, []);

  const saveCurrentConversation = useCallback(
    (messages: ChatMessageType[], systemPrompt?: string): string => {
      // Convert messages to storage format
      const storageMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }));

      const conversation: Conversation = {
        id: activeConversationId || `conv_${Date.now()}`,
        title: messages[0]?.content.slice(0, 50) || "Neue Konversation",
        messages: storageMessages,
        systemPrompt,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        model: "default",
        messageCount: storageMessages.length,
      };

      saveConversationStorage(conversation);

      // Set as active if no active conversation
      if (!activeConversationId) {
        setActiveConversationId(conversation.id);
      }

      // Refresh the conversations list
      refreshConversations();

      return conversation.id;
    },
    [activeConversationId, refreshConversations],
  );

  const deleteConversation = useCallback(
    (id: string) => {
      deleteConversationStorage(id);
      refreshConversations();

      // Clear active conversation if it was deleted
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    },
    [activeConversationId, refreshConversations],
  );

  const createNewConversation = useCallback(() => {
    setActiveConversationId(null);
  }, []);

  return {
    conversations,
    activeConversationId,
    loadConversation,
    saveCurrentConversation,
    deleteConversation,
    refreshConversations,
    setActiveConversationId,
    createNewConversation,
  };
}
