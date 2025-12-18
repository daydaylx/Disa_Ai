import { useCallback, useEffect, useState } from "react";

import { STORAGE_KEYS } from "@/config/storageKeys";

import { MemoryStore } from "../lib/memory/memoryService";

interface GlobalMemory {
  name?: string;
  hobbies?: string[];
  background?: string;
  preferences?: Record<string, any>;
}

export function useMemory() {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEMORY_ENABLED);
      // Fresh install default: ON (only when no explicit preference exists)
      if (stored == null) return true;
      return stored === "true";
    } catch {
      // If storage is unavailable, default to ON to match fresh-install behavior.
      return true;
    }
  });

  const [globalMemory, setGlobalMemory] = useState<GlobalMemory | null>(null);

  // Initialize memory
  useEffect(() => {
    if (isEnabled) {
      try {
        const memory = MemoryStore.getGlobalMemory();
        setGlobalMemory(memory);
      } catch (error) {
        console.error("Failed to load global memory:", error);
      }
    }
  }, [isEnabled]);

  const toggleMemory = useCallback(() => {
    setIsEnabled((prev) => {
      const newEnabled = !prev;
      try {
        // Persist explicit preference either way, so "OFF" stays OFF across reloads.
        localStorage.setItem(STORAGE_KEYS.MEMORY_ENABLED, newEnabled ? "true" : "false");
      } catch (error) {
        console.error("Failed to save memory preference:", error);
      }
      return newEnabled;
    });
  }, []);

  const updateGlobalMemory = useCallback(
    (updates: Partial<GlobalMemory>) => {
      if (!isEnabled) return;

      try {
        setGlobalMemory((prev) => {
          const base = prev || {};
          const updated = { ...base, ...updates };
          MemoryStore.saveGlobalMemory(updated);
          return updated;
        });
      } catch (error) {
        console.error("Failed to update global memory:", error);
      }
    },
    [isEnabled],
  );

  const clearAllMemory = useCallback(() => {
    try {
      MemoryStore.clearAll();
      setGlobalMemory(null);
    } catch (error) {
      console.error("Failed to clear memory:", error);
    }
  }, []);

  return {
    isEnabled,
    globalMemory,
    toggleMemory,
    updateGlobalMemory,
    clearAllMemory,
  };
}
