import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { GlobalMemory } from "./memoryService";
import { MemoryStore } from "./memoryService";

// Mock localStorage for testing
const createMockStorage = () => {
  const store = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => store.get(key) || null),
    setItem: vi.fn((key: string, value: string) => store.set(key, value)),
    removeItem: vi.fn((key: string) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
    keys: vi.fn(() => Array.from(store.keys())),
  };
};

describe("MemoryStore", () => {
  let originalLocalStorage: Storage | null;
  let mockStorage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    originalLocalStorage = (global as any).localStorage;
    mockStorage = createMockStorage();
    (global as any).localStorage = mockStorage;
  });

  afterEach(() => {
    (global as any).localStorage = originalLocalStorage;
  });

  describe("getGlobalMemory", () => {
    it("should return null when no memory exists", () => {
      const result = MemoryStore.getGlobalMemory();
      expect(result).toBe(null);
    });

    it("should return parsed memory when data exists", () => {
      const memoryData: GlobalMemory = {
        name: "Test User",
        hobbies: ["reading", "coding"],
        background: "Software developer",
        preferences: { theme: "dark" },
      };

      mockStorage.setItem("disa-ai-global-memory", JSON.stringify(memoryData));

      const result = MemoryStore.getGlobalMemory();
      expect(result).toEqual(memoryData);
    });

    it("should return null when JSON parsing fails", () => {
      mockStorage.setItem("disa-ai-global-memory", "invalid json");

      const result = MemoryStore.getGlobalMemory();
      expect(result).toBe(null);
    });

    it("should return null when localStorage throws", () => {
      const brokenStorage = {
        getItem: vi.fn(() => {
          throw new Error("Storage error");
        }),
        setItem: vi.fn(() => {}),
        removeItem: vi.fn(() => {}),
        clear: vi.fn(() => {}),
        keys: vi.fn(() => []),
      };

      (global as any).localStorage = brokenStorage;

      const result = MemoryStore.getGlobalMemory();
      expect(result).toBe(null);
    });
  });

  describe("saveGlobalMemory", () => {
    it("should save memory successfully", () => {
      const memoryData: GlobalMemory = {
        name: "Test User",
        hobbies: ["reading"],
        background: "Developer",
      };

      MemoryStore.saveGlobalMemory(memoryData);

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        "disa-ai-global-memory",
        JSON.stringify(memoryData),
      );
    });

    it("should throw error when localStorage fails", () => {
      const brokenStorage = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => {
          throw new Error("Quota exceeded");
        }),
        removeItem: vi.fn(() => {}),
        clear: vi.fn(() => {}),
        keys: vi.fn(() => []),
      };

      (global as any).localStorage = brokenStorage;

      const memoryData: GlobalMemory = { name: "Test" };

      expect(() => {
        MemoryStore.saveGlobalMemory(memoryData);
      }).toThrow("Failed to save global memory:");
    });

    it("should handle complex memory objects", () => {
      const memoryData: GlobalMemory = {
        name: "Complex User",
        hobbies: ["reading", "coding", "gaming"],
        background:
          "Experienced full-stack developer with expertise in TypeScript, React, and Node.js",
        preferences: {
          theme: "dark",
          fontSize: 16,
          notifications: false,
          features: {
            advanced: true,
            experimental: false,
          },
        },
      };

      MemoryStore.saveGlobalMemory(memoryData);

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        "disa-ai-global-memory",
        JSON.stringify(memoryData),
      );
    });
  });

  describe("clearAll", () => {
    it("should clear global memory and conversation memories", () => {
      // Set up test data
      mockStorage.setItem("disa-ai-global-memory", JSON.stringify({ name: "Test" }));
      mockStorage.setItem("disa-ai-conversation-123", JSON.stringify({ messages: [] }));
      mockStorage.setItem("disa-ai-conversation-456", JSON.stringify({ messages: [] }));
      mockStorage.setItem("other-key", "should-not-be-removed");

      // Mock Object.keys to return our test keys
      const originalKeys = Object.keys;
      Object.keys = vi.fn(() => [
        "disa-ai-global-memory",
        "disa-ai-conversation-123",
        "disa-ai-conversation-456",
        "other-key",
      ]);

      MemoryStore.clearAll();

      expect(mockStorage.removeItem).toHaveBeenCalledWith("disa-ai-global-memory");
      expect(mockStorage.removeItem).toHaveBeenCalledWith("disa-ai-conversation-123");
      expect(mockStorage.removeItem).toHaveBeenCalledWith("disa-ai-conversation-456");
      expect(mockStorage.removeItem).not.toHaveBeenCalledWith("other-key");

      // Restore original Object.keys
      Object.keys = originalKeys;
    });

    it("should handle empty localStorage", () => {
      // Mock Object.keys to return empty array
      const emptyStorage = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => {}),
        removeItem: vi.fn(() => {}),
        clear: vi.fn(() => {}),
        keys: vi.fn(() => []),
      };

      (global as any).localStorage = emptyStorage;

      expect(() => {
        MemoryStore.clearAll();
      }).not.toThrow();
    });

    it("should throw error when localStorage operations fail", () => {
      const brokenStorage = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => {}),
        removeItem: vi.fn(() => {
          throw new Error("Storage error");
        }),
        clear: vi.fn(() => {}),
        keys: vi.fn(() => ["disa-ai-global-memory", "disa-ai-conversation-123"]),
      };

      (global as any).localStorage = brokenStorage;

      expect(() => {
        MemoryStore.clearAll();
      }).toThrow("Failed to clear memory:");
    });

    it("should only remove disa-ai-conversation-* keys", () => {
      // Set up test data with various keys

      mockStorage.setItem("disa-ai-global-memory", JSON.stringify({ name: "Test" }));

      mockStorage.setItem("disa-ai-conversation-123", JSON.stringify({ messages: [] }));

      mockStorage.setItem("disa-ai-conversation-abc", JSON.stringify({ messages: [] }));

      mockStorage.setItem("disa-ai-settings", "should-not-be-removed");

      mockStorage.setItem("other-app-data", "should-not-be-removed");

      // Mock Object.keys to return our test keys

      const originalKeys = Object.keys;

      Object.keys = vi.fn(() => [
        "disa-ai-global-memory",

        "disa-ai-conversation-123",

        "disa-ai-conversation-abc",

        "disa-ai-settings",

        "other-app-data",
      ]);

      MemoryStore.clearAll();

      const removeItemCalls = mockStorage.removeItem.mock.calls.flat(); // Get all arguments removeItem was called with

      expect(removeItemCalls).toContain("disa-ai-global-memory");

      expect(removeItemCalls).toContain("disa-ai-conversation-123");

      expect(removeItemCalls).toContain("disa-ai-conversation-abc");

      expect(removeItemCalls).not.toContain("disa-ai-settings");

      expect(removeItemCalls).not.toContain("other-app-data");

      expect(mockStorage.removeItem).toHaveBeenCalledTimes(3);

      // Restore original Object.keys

      Object.keys = originalKeys;
    });
  });

  describe("Integration", () => {
    it("should handle complete save-retrieve cycle", () => {
      const originalMemory: GlobalMemory = {
        name: "Integration Test User",
        hobbies: ["testing", "developing"],
        background: "Test environment",
        preferences: { testMode: true },
      };

      // Save memory
      MemoryStore.saveGlobalMemory(originalMemory);

      // Retrieve memory
      const retrievedMemory = MemoryStore.getGlobalMemory();

      expect(retrievedMemory).toEqual(originalMemory);
    });

    it("should handle save-retrieve-clear cycle", () => {
      const memoryData: GlobalMemory = { name: "Clear Test" };

      // Save memory
      MemoryStore.saveGlobalMemory(memoryData);

      // Verify it exists
      let retrievedMemory = MemoryStore.getGlobalMemory();
      expect(retrievedMemory).toEqual(memoryData);

      // Clear all memory
      MemoryStore.clearAll();

      // Verify it's gone
      retrievedMemory = MemoryStore.getGlobalMemory();
      expect(retrievedMemory).toBe(null);
    });
  });
});
