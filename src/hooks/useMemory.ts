import { useCallback, useEffect, useState } from "react";

import type { ChatMemory, GlobalMemory, MemorySettings } from "../lib/memory/memoryService";
import { memoryService } from "../lib/memory/memoryService";

export function useMemory() {
  const [settings, setSettings] = useState<MemorySettings>(memoryService.getSettings());
  const [globalMemory, setGlobalMemory] = useState<GlobalMemory | null>(null);

  // Load initial data
  useEffect(() => {
    setGlobalMemory(memoryService.getGlobalMemory());
  }, [settings.enabled]);

  // Settings management
  const updateSettings = useCallback((newSettings: Partial<MemorySettings>) => {
    memoryService.updateSettings(newSettings);
    const updated = memoryService.getSettings();
    setSettings(updated);

    // Reload global memory when enabling/disabling
    if ("enabled" in newSettings) {
      setGlobalMemory(memoryService.getGlobalMemory());
    }
  }, []);

  const toggleMemory = useCallback(() => {
    updateSettings({ enabled: !settings.enabled });
  }, [settings.enabled, updateSettings]);

  // Global memory management
  const updateGlobalMemory = useCallback(
    (updates: Partial<Omit<GlobalMemory, "lastUpdated">>) => {
      if (!settings.enabled) return;

      memoryService.updateGlobalMemory(updates);
      setGlobalMemory(memoryService.getGlobalMemory());
    },
    [settings.enabled],
  );

  const clearGlobalMemory = useCallback(() => {
    memoryService.clearGlobalMemory();
    setGlobalMemory(null);
  }, []);

  // Chat memory management
  const getChatMemory = useCallback((chatId: string): ChatMemory | null => {
    return memoryService.getChatMemory(chatId);
  }, []);

  const updateChatMemory = useCallback(
    (chatId: string, messages: ChatMemory["messages"], context?: string) => {
      if (!settings.enabled) return;
      memoryService.updateChatMemory(chatId, messages, context);
    },
    [settings.enabled],
  );

  const deleteChatMemory = useCallback((chatId: string) => {
    memoryService.deleteChatMemory(chatId);
  }, []);

  // Utility functions
  const getChatList = useCallback(() => {
    return memoryService.getChatList();
  }, []);

  const exportMemory = useCallback(() => {
    return memoryService.exportAllMemory();
  }, []);

  const clearAllMemory = useCallback(() => {
    memoryService.clearAllMemory();
    setGlobalMemory(null);
  }, []);

  const getMemoryStats = useCallback(() => {
    return memoryService.getMemoryStats();
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
