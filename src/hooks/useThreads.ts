import { useCallback, useEffect, useState } from "react";

import type { Thread, ThreadSummary } from "../data/threads";
import { ThreadStorage } from "../data/threads";
import type { Message } from "../ui/chat/types";

export function useThreads() {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const storage = ThreadStorage.getInstance();

  // Load threads on mount
  useEffect(() => {
    setThreads(storage.getThreadSummaries());
    setIsLoading(false);
  }, [storage]);

  const refreshThreads = useCallback(() => {
    setThreads(storage.getThreadSummaries());
  }, [storage]);

  const createThread = useCallback(
    (title: string, messages: Message[] = []) => {
      const newThread = storage.createThread(title, messages);
      refreshThreads();
      return newThread;
    },
    [storage, refreshThreads],
  );

  const loadThread = useCallback(
    (threadId: string) => {
      const thread = storage.getThread(threadId);
      setCurrentThread(thread || null);
      return thread;
    },
    [storage],
  );

  const updateThread = useCallback(
    (threadId: string, updates: Partial<Omit<Thread, "id" | "createdAt">>) => {
      const updatedThread = storage.updateThread(threadId, updates);
      if (updatedThread) {
        refreshThreads();
        if (currentThread?.id === threadId) {
          setCurrentThread(updatedThread);
        }
      }
      return updatedThread;
    },
    [storage, refreshThreads, currentThread],
  );

  const deleteThread = useCallback(
    (threadId: string) => {
      const success = storage.deleteThread(threadId);
      if (success) {
        refreshThreads();
        if (currentThread?.id === threadId) {
          setCurrentThread(null);
        }
      }
      return success;
    },
    [storage, refreshThreads, currentThread],
  );

  const togglePin = useCallback(
    (threadId: string) => {
      const updatedThread = storage.togglePin(threadId);
      if (updatedThread) {
        refreshThreads();
        if (currentThread?.id === threadId) {
          setCurrentThread(updatedThread);
        }
      }
      return updatedThread;
    },
    [storage, refreshThreads, currentThread],
  );

  const searchThreads = useCallback(
    (query: string) => {
      return storage.searchThreads(query);
    },
    [storage],
  );

  const addMessageToThread = useCallback(
    (threadId: string, message: Message) => {
      const updatedThread = storage.addMessageToThread(threadId, message);
      if (updatedThread) {
        refreshThreads();
        if (currentThread?.id === threadId) {
          setCurrentThread(updatedThread);
        }
      }
      return updatedThread;
    },
    [storage, refreshThreads, currentThread],
  );

  const saveCurrentConversation = useCallback(
    (title: string, messages: Message[]) => {
      const thread = createThread(title, messages);
      setCurrentThread(thread);
      return thread;
    },
    [createThread],
  );

  const getStats = useCallback(() => {
    return storage.getStats();
  }, [storage]);

  // Generate title from first user message
  const generateThreadTitle = useCallback((messages: Message[]): string => {
    const firstUserMessage = messages.find((msg) => msg.role === "user");
    if (firstUserMessage) {
      const title = firstUserMessage.content.slice(0, 50).trim();
      return title.length > 0 ? title : "Neuer Thread";
    }
    return "Neuer Thread";
  }, []);

  return {
    // State
    threads,
    currentThread,
    isLoading,

    // Actions
    createThread,
    loadThread,
    updateThread,
    deleteThread,
    togglePin,
    searchThreads,
    addMessageToThread,
    saveCurrentConversation,
    refreshThreads,

    // Utilities
    getStats,
    generateThreadTitle,
  };
}
