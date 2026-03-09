// React hooks for modern storage layer
import { useCallback, useEffect, useState } from "react";

import {
  type Conversation,
  type ConversationMetadata,
  type ConversationStats,
  deleteConversation,
  getAllConversations,
  getConversation,
  getConversationStats,
  saveConversation,
  searchConversations,
  toggleFavorite,
  updateConversation,
} from "../lib/conversation-manager-modern";

export interface UseConversationsOptions {
  autoRefresh?: boolean;
  searchQuery?: string;
}

export interface UseConversationsReturn {
  conversations: ConversationMetadata[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export function useConversations(options: UseConversationsOptions = {}) {
  const { autoRefresh = true, searchQuery = "" } = options;

  const [conversations, setConversations] = useState<ConversationMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSearch, setCurrentSearch] = useState(searchQuery);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result: ConversationMetadata[];
      if (currentSearch) {
        result = await searchConversations(currentSearch);
      } else {
        result = await getAllConversations();
      }

      setConversations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [currentSearch]);

  const refresh = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  const search = useCallback((query: string) => {
    setCurrentSearch(query);
  }, []);

  const clearSearch = useCallback(() => {
    setCurrentSearch("");
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      void loadConversations();
    }
  }, [autoRefresh, loadConversations]);

  return {
    conversations,
    loading,
    error,
    refresh,
    search,
    clearSearch,
  };
}

export interface UseConversationReturn {
  conversation: Conversation | null;
  loading: boolean;
  error: string | null;
  save: (conversation: Conversation) => Promise<void>;
  remove: () => Promise<void>;
  update: (updates: Partial<Conversation>) => Promise<void>;
  toggleFavoriteStatus: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useConversation(id: string | null) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversation = useCallback(async () => {
    if (!id) {
      setConversation(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getConversation(id);
      setConversation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conversation");
      setConversation(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const save = useCallback(async (conv: Conversation) => {
    try {
      setError(null);
      await saveConversation(conv);
      setConversation(conv);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save conversation");
      throw err;
    }
  }, []);

  const remove = useCallback(async () => {
    if (!id) return;

    try {
      setError(null);
      await deleteConversation(id);
      setConversation(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete conversation");
      throw err;
    }
  }, [id]);

  const update = useCallback(
    async (updates: Partial<Conversation>) => {
      if (!conversation) return;

      try {
        setError(null);
        await updateConversation(conversation.id, updates);
        setConversation((prev) => (prev ? { ...prev, ...updates } : prev));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update conversation");
        throw err;
      }
    },
    [conversation],
  );

  const toggleFavoriteStatus = useCallback(async () => {
    if (!conversation) return;

    try {
      setError(null);
      await toggleFavorite(conversation.id);
      setConversation((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle favorite status");
      throw err;
    }
  }, [conversation]);

  const refresh = useCallback(async () => {
    await loadConversation();
  }, [loadConversation]);

  useEffect(() => {
    void loadConversation();
  }, [loadConversation]);

  return {
    conversation,
    loading,
    error,
    save,
    remove,
    update,
    toggleFavoriteStatus,
    refresh,
  };
}

export interface UseConversationStatsReturn {
  stats: ConversationStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useConversationStats() {
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getConversationStats();
      setStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadStats();
  }, [loadStats]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}
