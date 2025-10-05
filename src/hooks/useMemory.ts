import { useCallback, useEffect, useState } from "react";

import { addExplicitMemory, updateMemorySummary } from "../api/memory";
import type { ChatMessage } from "../types/chat";

interface UseMemoryOptions {
  threadId?: string;
  autoUpdate?: boolean;
  model?: string;
}

interface UseMemoryReturn {
  memory: string;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  addNote: (note: string) => Promise<void>;
  updateFromMessages: (messages: ChatMessage[]) => Promise<void>;
  setMemory: (memory: string) => void;
  clearMemory: () => void;
}

const MEMORY_STORAGE_PREFIX = "disa-memory:";

export function useMemory(options: UseMemoryOptions = {}): UseMemoryReturn {
  const { threadId, autoUpdate = false, model } = options;
  const [memory, setMemoryState] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = threadId
    ? `${MEMORY_STORAGE_PREFIX}${threadId}`
    : `${MEMORY_STORAGE_PREFIX}default`;

  // Load memory from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setMemoryState(stored);
      }
    } catch (err) {
      console.error("Failed to load memory from storage:", err);
    }
  }, [storageKey]);

  // Save memory to localStorage when it changes
  const saveMemory = useCallback(
    (newMemory: string) => {
      try {
        if (newMemory.trim()) {
          localStorage.setItem(storageKey, newMemory);
        } else {
          localStorage.removeItem(storageKey);
        }
        setMemoryState(newMemory);
      } catch (err) {
        console.error("Failed to save memory to storage:", err);
      }
    },
    [storageKey],
  );

  const addNote = useCallback(
    async (note: string) => {
      if (!note.trim()) return;

      setIsUpdating(true);
      setError(null);

      try {
        const updatedMemory = await addExplicitMemory({
          previousMemory: memory,
          note: note.trim(),
          model,
        });
        saveMemory(updatedMemory);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to add note";
        setError(errorMessage);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [memory, model, saveMemory],
  );

  const updateFromMessages = useCallback(
    async (messages: ChatMessage[]) => {
      if (messages.length === 0) return;

      setIsUpdating(true);
      setError(null);

      try {
        // Get recent user/assistant messages for memory update
        const recentWindow = messages
          .filter((msg) => msg.role === "user" || msg.role === "assistant")
          .slice(-6) // Last 6 messages for context
          .map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          }));

        if (recentWindow.length > 0) {
          const updatedMemory = await updateMemorySummary({
            previousMemory: memory,
            recentWindow,
            model,
          });
          saveMemory(updatedMemory);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update memory";
        setError(errorMessage);
        console.error("Memory update failed:", err);
      } finally {
        setIsUpdating(false);
      }
    },
    [memory, model, saveMemory],
  );

  const setMemory = useCallback(
    (newMemory: string) => {
      saveMemory(newMemory);
    },
    [saveMemory],
  );

  const clearMemory = useCallback(() => {
    saveMemory("");
  }, [saveMemory]);

  return {
    memory,
    isLoading,
    isUpdating,
    error,
    addNote,
    updateFromMessages,
    setMemory,
    clearMemory,
  };
}
