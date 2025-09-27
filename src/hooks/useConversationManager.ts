import { useEffect, useRef, useState } from "react";

import {
  type Conversation,
  getAllConversations,
  saveConversation,
} from "../lib/conversation-manager";
import type { Message } from "../ui/types";

/**
 * Hook to manage conversation persistence and auto-saving
 */
export function useConversationManager() {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load conversations on mount
  useEffect(() => {
    setConversations(getAllConversations());
  }, []);

  /**
   * Auto-save conversation with debouncing
   */
  const autoSaveConversation = (messages: Message[], conversationId?: string) => {
    if (messages.length === 0) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (debounced by 2 seconds)
    autoSaveTimeoutRef.current = setTimeout(() => {
      const savedId = saveConversation(messages, conversationId);
      setCurrentConversationId(savedId);
      setConversations(getAllConversations()); // Refresh conversation list
    }, 2000);
  };

  /**
   * Immediately save conversation (for critical moments)
   */
  const saveConversationNow = (messages: Message[], conversationId?: string): string => {
    // Clear auto-save timeout since we're saving now
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    const savedId = saveConversation(messages, conversationId);
    setCurrentConversationId(savedId);
    setConversations(getAllConversations());
    return savedId;
  };

  /**
   * Load a specific conversation
   */
  const loadConversation = (conversation: Conversation): Message[] => {
    setCurrentConversationId(conversation.id);
    return conversation.messages;
  };

  /**
   * Start a new conversation
   */
  const startNewConversation = () => {
    setCurrentConversationId(null);

    // Save any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
  };

  /**
   * Get current conversation details
   */
  const getCurrentConversation = (): Conversation | null => {
    if (!currentConversationId) return null;
    return conversations.find((c) => c.id === currentConversationId) || null;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    currentConversationId,
    conversations,
    autoSaveConversation,
    saveConversationNow,
    loadConversation,
    startNewConversation,
    getCurrentConversation,
    refreshConversations: () => setConversations(getAllConversations()),
  };
}
