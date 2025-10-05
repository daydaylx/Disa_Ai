import { useCallback, useEffect, useState } from "react";

import type { ChatMemory, GlobalMemory, MemorySettings } from "../lib/memory/memoryService";

// Lazy-load memory service instance
let memoryServiceInstance: any = null;
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

  // Load initial data
  useEffect(() => {
    const loadService = async () => {
      try {
        const service = await getMemoryService();
        setSettings(service.getSettings());
        setGlobalMemory(service.getGlobalMemory());
      } catch (error) {
        console.warn("Failed to load memory service:", error);
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
    } catch (error) {
      console.warn("Failed to update settings:", error);
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
      } catch (error) {
        console.warn("Failed to update global memory:", error);
      }
    },
    [settings.enabled],
  );

  const clearGlobalMemory = useCallback(async () => {
    try {
      const service = await getMemoryService();
      service.clearGlobalMemory();
      setGlobalMemory(null);
    } catch (error) {
      console.warn("Failed to clear global memory:", error);
    }
  }, []);

  // Chat memory management
  const getChatMemory = useCallback(async (chatId: string): Promise<ChatMemory | null> => {
    try {
      const service = await getMemoryService();
      return service.getChatMemory(chatId);
    } catch (error) {
      console.warn("Failed to get chat memory:", error);
      return null;
    }
  }, []);

  const updateChatMemory = useCallback(
    async (chatId: string, messages: ChatMemory["messages"], context?: string) => {
      if (!settings.enabled) return;

      try {
        const service = await getMemoryService();
        service.updateChatMemory(chatId, messages, context);
      } catch (error) {
        console.warn("Failed to update chat memory:", error);
      }
    },
    [settings.enabled],
  );

  const deleteChatMemory = useCallback(async (chatId: string) => {
    try {
      const service = await getMemoryService();
      service.deleteChatMemory(chatId);
    } catch (error) {
      console.warn("Failed to delete chat memory:", error);
    }
  }, []);

  // Utility functions
  const getChatList = useCallback(async () => {
    try {
      const service = await getMemoryService();
      return service.getChatList();
    } catch (error) {
      console.warn("Failed to get chat list:", error);
      return [];
    }
  }, []);

  const exportMemory = useCallback(async () => {
    try {
      const service = await getMemoryService();
      return service.exportAllMemory();
    } catch (error) {
      console.warn("Failed to export memory:", error);
      return {};
    }
  }, []);

  const clearAllMemory = useCallback(async () => {
    try {
      const service = await getMemoryService();
      service.clearAllMemory();
      setGlobalMemory(null);
    } catch (error) {
      console.warn("Failed to clear all memory:", error);
    }
  }, []);

  const getMemoryStats = useCallback(async () => {
    try {
      const service = await getMemoryService();
      return service.getMemoryStats();
    } catch (error) {
      console.warn("Failed to get memory stats:", error);
      return {
        enabled: false,
        chatCount: 0,
        totalMessages: 0,
        globalMemoryExists: false,
        storageUsed: 0,
      };
    }
  }, []);

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

    // Computed
    isEnabled: settings.enabled,
    hasGlobalMemory: !!globalMemory,
  };
}
