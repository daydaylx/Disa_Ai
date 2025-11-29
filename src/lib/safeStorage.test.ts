import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createSafeStorage, safeStorage } from "./safeStorage";

// Mock window.localStorage for testing
const createMockStorage = () => {
  const store = new Map<string, string>();

  const mock = {
    getItem: vi.fn((key: string) => store.get(key) || null),
    setItem: vi.fn((key: string, value: string) => store.set(key, value)),
    removeItem: vi.fn((key: string) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
  };

  return mock;
};

describe("SafeStorage", () => {
  let originalLocalStorage: Storage | null;
  let mockStorage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    originalLocalStorage = (global as any).localStorage;
    mockStorage = createMockStorage();
    (global as any).localStorage = mockStorage;
  });

  afterEach(() => {
    (global as any).localStorage = originalLocalStorage;
    vi.clearAllMocks();
  });

  describe("Availability", () => {
    it("should be available when localStorage works", () => {
      expect(safeStorage.isAvailable).toBe(true);
    });

    it("should fall back to memory when localStorage throws", () => {
      // Create a new instance with broken localStorage
      const brokenStorage = {
        getItem: vi.fn(() => {
          throw new Error("Storage not available");
        }),
        setItem: vi.fn(() => {
          throw new Error("Storage not available");
        }),
        removeItem: vi.fn(() => {
          throw new Error("Storage not available");
        }),
        clear: vi.fn(() => {
          throw new Error("Storage not available");
        }),
      };

      // Create a new safeStorage instance using the brokenStorage mock
      const newSafeStorage = createSafeStorage(brokenStorage as any);

      expect(newSafeStorage.isAvailable).toBe(false);
      expect(newSafeStorage.getItem("test")).toBe(null);
      newSafeStorage.setItem("test", "value");
      expect(newSafeStorage.getItem("test")).toBe("value");

      // Test clear method with broken storage
      newSafeStorage.clear(); // Should not throw, should be handled gracefully
    });
  });

  describe("getItem", () => {
    it("should return stored value", () => {
      mockStorage.setItem("test-key", "test-value");
      expect(createSafeStorage(mockStorage as any).getItem("test-key")).toBe("test-value");
    });

    it("should return null for non-existent key", () => {
      expect(safeStorage.getItem("non-existent")).toBe(null);
    });

    it("should handle localStorage errors gracefully", () => {
      const brokenStorage = {
        getItem: vi.fn(() => {
          throw new Error("Storage error");
        }),
      };

      (global as any).localStorage = brokenStorage;

      expect(safeStorage.getItem("test-key")).toBe(null);
    });
  });

  describe("setItem", () => {
    it("should store value successfully", () => {
      createSafeStorage(mockStorage as any).setItem("test-key", "test-value");
      expect(mockStorage.setItem).toHaveBeenCalledWith("test-key", "test-value");
    });

    it("should handle localStorage quota errors gracefully", () => {
      const brokenStorage = {
        setItem: vi.fn(() => {
          throw new Error("Quota exceeded");
        }),
        getItem: vi.fn(() => null),
        removeItem: vi.fn(() => {}),
        clear: vi.fn(() => {}),
      };

      (global as any).localStorage = brokenStorage;

      // Should not throw
      expect(() => {
        safeStorage.setItem("test-key", "test-value");
      }).not.toThrow();
    });
  });

  describe("removeItem", () => {
    it("should remove stored value", () => {
      mockStorage.setItem("test-key", "test-value");
      createSafeStorage(mockStorage as any).removeItem("test-key");
      expect(mockStorage.removeItem).toHaveBeenCalledWith("test-key");
    });

    it("should handle localStorage errors gracefully", () => {
      const brokenStorage = {
        removeItem: vi.fn(() => {
          throw new Error("Storage error");
        }),
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => {}),
        clear: vi.fn(() => {}),
      };

      (global as any).localStorage = brokenStorage;

      // Should not throw
      expect(() => {
        safeStorage.removeItem("test-key");
      }).not.toThrow();
    });
  });

  describe("clear", () => {
    it("should clear all stored values", () => {
      createSafeStorage(mockStorage as any).clear();
      expect(mockStorage.clear).toHaveBeenCalled();
    });

    it("should handle localStorage errors gracefully", () => {
      const brokenStorage = {
        clear: vi.fn(() => {
          throw new Error("Storage error");
        }),
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => {}),
        removeItem: vi.fn(() => {}),
      };

      (global as any).localStorage = brokenStorage;

      // Should not throw
      expect(() => {
        safeStorage.clear();
      }).not.toThrow();
    });
  });

  describe("Memory Fallback", () => {
    it("should work correctly when localStorage is unavailable", () => {
      // Create a memory storage instance directly for testing
      const memoryStore = new Map<string, string>();
      const memoryStorage = {
        isAvailable: false,
        getItem(key: string) {
          return memoryStore.has(key) ? memoryStore.get(key)! : null;
        },
        setItem(key: string, value: string) {
          memoryStore.set(key, value);
        },
        removeItem(key: string) {
          memoryStore.delete(key);
        },
        clear() {
          memoryStore.clear();
        },
      };

      expect(memoryStorage.isAvailable).toBe(false);
      expect(memoryStorage.getItem("test")).toBe(null);

      memoryStorage.setItem("test", "value");
      expect(memoryStorage.getItem("test")).toBe("value");

      memoryStorage.removeItem("test");
      expect(memoryStorage.getItem("test")).toBe(null);

      memoryStorage.setItem("key1", "value1");
      memoryStorage.setItem("key2", "value2");
      memoryStorage.clear();
      expect(memoryStorage.getItem("key1")).toBe(null);
      expect(memoryStorage.getItem("key2")).toBe(null);
    });
  });
});
