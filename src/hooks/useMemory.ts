import { useCallback, useEffect, useState } from "react";

import { addExplicitMemory, updateMemorySummary } from "../api/memory";
import type { ChatMemory, GlobalMemory, MemorySettings } from "../lib/memory/memoryService";
import { memoryService } from "../lib/memory/memoryService";
import type { ChatMessage } from "../types/chat";

// Lazy-load memory service instance
let memoryServiceInstance: typeof memoryService | null = null;
const getMemoryService = async () => {
  if (!memoryServiceInstance) {
    const module = await import("../lib/memory/memoryService");
    memoryServiceInstance = module.memoryService;
  }
  return memoryServiceInstance;
};

export function useMemory() {
  const [settings, setSettings] = useState<MemorySettings>({
    enabled: false,
    maxChatMessages: 50,
    maxChatHistory: 20,
    retentionDays: 30,
  });
  const [globalMemory, setGlobalMemory] = useState<GlobalMemory | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadService = async () => {
      try {
        const service = await getMemoryService();
        setSettings(service.getSettings());
        setGlobalMemory(service.getGlobalMemory());
      } catch {
        setError("Failed to load memory service");
      }
    };
    void loadService();
  }, []);

  // Settings management
  const updateSettings = useCallback(async (newSettings: Partial<MemorySettings>) => {
    try {
      const service = await getMemoryService();
      service.updateSettings(newSettings);
      const updated = service.getSettings();
      setSettings(updated);

      // Reload global memory when enabling/disabling
      if ("enabled" in newSettings) {
        setGlobalMemory(service.getGlobalMemory());
      }
    } catch {
      setError("Failed to update settings");
    }
  }, []);

  const toggleMemory = useCallback(() => {
    void updateSettings({ enabled: !settings.enabled });
  }, [settings.enabled, updateSettings]);

  // Global memory management
  const updateGlobalMemory = useCallback(
    async (updates: Partial<Omit<GlobalMemory, "lastUpdated">>) => {
      if (!settings.enabled) return;

      try {
        const service = await getMemoryService();
        service.updateGlobalMemory(updates);
        setGlobalMemory(service.getGlobalMemory());
      } catch {
        setError("Failed to update global memory");
      }
    },
    [settings.enabled],
  );

  const clearGlobalMemory = useCallback(async () => {
    try {
      const service = await getMemoryService();
      service.clearGlobalMemory();
      setGlobalMemory(null);
    } catch {
      setError("Failed to clear global memory");
    }
  }, []);

  // Chat memory management
  const getChatMemory = useCallback(async (chatId: string): Promise<ChatMemory | null> => {
    try {
      const service = await getMemoryService();
      return service.getChatMemory(chatId);
    } catch {
      setError("Failed to get chat memory");
      return null;
    }
  }, []);

  const updateChatMemory = useCallback(
    async (chatId: string, messages: ChatMemory["messages"], context?: string) => {
      if (!settings.enabled) return;

      try {
        const service = await getMemoryService();
        service.updateChatMemory(chatId, messages, context);
      } catch {
        setError("Failed to update chat memory");
      }
    },
    [settings.enabled],
  );

  const deleteChatMemory = useCallback(async (chatId: string) => {
    try {
      const service = await getMemoryService();
      service.deleteChatMemory(chatId);
    } catch {
      setError("Failed to delete chat memory");
    }
  }, []);

  // Utility functions
  const getChatList = useCallback(async () => {
    try {
      const service = await getMemoryService();
      return service.getChatList();
    } catch {
      setError("Failed to get chat list");
      return [];
    }
  }, []);

  const exportMemory = useCallback(async () => {
    try {
      const service = await getMemoryService();
      return service.exportAllMemory();
    } catch {
      setError("Failed to export memory");
      return {};
    }
  }, []);

  const clearAllMemory = useCallback(async () => {
    try {
      const service = await getMemoryService();
      service.clearAllMemory();
      setGlobalMemory(null);
    } catch {
      setError("Failed to clear all memory");
    }
  }, []);

  const getMemoryStats = useCallback(async () => {
    try {
      const service = await getMemoryService();
      return service.getMemoryStats();
    } catch {
      setError("Failed to get memory stats");
      return {
        enabled: false,
        chatCount: 0,
        totalMessages: 0,
        globalMemoryExists: false,
        storageUsed: 0,
      };
    }
  }, []);

  const addNote = useCallback(
    async (note: string, model?: string) => {
      if (!note.trim() || !settings.enabled) return;

      setIsUpdating(true);
      setError(null);

      try {
        const previousMemory = globalMemory?.summary || "";
        const updatedMemory = await addExplicitMemory({
          previousMemory,
          note: note.trim(),
          model,
        });
        await updateGlobalMemory({ summary: updatedMemory });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to add note";
        setError(errorMessage);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [globalMemory, settings.enabled, updateGlobalMemory],
  );

  const updateFromMessages = useCallback(
    async (messages: ChatMessage[], model?: string) => {
      if (messages.length === 0 || !settings.enabled) return;

      setIsUpdating(true);
      setError(null);

      try {
        const recentWindow = messages
          .filter((msg) => msg.role === "user" || msg.role === "assistant")
          .slice(-6)
          .map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          }));

        if (recentWindow.length > 0) {
          const previousMemory = globalMemory?.summary || "";
          const updatedMemory = await updateMemorySummary({
            previousMemory,
            recentWindow,
            model,
          });
          await updateGlobalMemory({ summary: updatedMemory });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update memory";
        setError(errorMessage);
      } finally {
        setIsUpdating(false);
      }
    },
    [globalMemory, settings.enabled, updateGlobalMemory],
  );

  return {
    // Settings
    settings,
    updateSettings,
    toggleMemory,

    // Global memory
    globalMemory,
    updateGlobalMemory,
    clearGlobalMemory,

    // Chat memory
    getChatMemory,
    updateChatMemory,
    deleteChatMemory,
    getChatList,

    // Utils
    exportMemory,
    clearAllMemory,
    getMemoryStats,

    // New memory functions
    addNote,
    updateFromMessages,
    isUpdating,
    error,

    // Computed
    isEnabled: settings.enabled,
    hasGlobalMemory: !!globalMemory,
  };
}
