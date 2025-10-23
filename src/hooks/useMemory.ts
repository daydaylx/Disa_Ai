import { useCallback, useEffect, useState } from "react";

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
      return localStorage.getItem("disa-ai-memory-enabled") === "true";
    } catch {
      return false;
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
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);

    try {
      if (newEnabled) {
        localStorage.setItem("disa-ai-memory-enabled", "true");
      } else {
        localStorage.removeItem("disa-ai-memory-enabled");
      }
    } catch (error) {
      console.error("Failed to save memory preference:", error);
    }
  }, [isEnabled]);

  const updateGlobalMemory = useCallback(
    (updates: Partial<GlobalMemory>) => {
      if (!isEnabled) return;

      try {
        const updated = { ...(globalMemory || {}), ...updates };
        MemoryStore.saveGlobalMemory(updated);
        setGlobalMemory(updated);
      } catch (error) {
        console.error("Failed to update global memory:", error);
      }
    },
    [globalMemory, isEnabled],
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
