// Performance tests for storage layer with large conversations
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Dexie for performance testing
vi.mock("dexie", () => {
  const mockVersion = {
    stores: vi.fn().mockReturnThis(),
  };

  const mockDb = {
    conversations: {
      put: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      toArray: vi.fn(),
      bulkDelete: vi.fn(),
      clear: vi.fn(),
      filter: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      reverse: vi.fn().mockReturnThis(),
    },
    metadata: {
      put: vi.fn(),
      bulkDelete: vi.fn(),
      clear: vi.fn(),
    },
    transaction: vi.fn().mockImplementation((_mode, _tables, callback) => {
      return Promise.resolve(callback());
    }),
    open: vi.fn().mockResolvedValue(undefined),
    close: vi.fn(),
    version: vi.fn().mockReturnValue(mockVersion),
  };

  return {
    default: vi.fn().mockImplementation(() => mockDb),
  };
});

import { ModernStorageLayer } from "@/lib/storage-layer";

describe("Storage Performance Tests", () => {
  let storage: ModernStorageLayer;
  let mockDb: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb = {
      conversations: {
        put: vi.fn(),
        get: vi.fn(),
        delete: vi.fn(),
        toArray: vi.fn(),
        bulkDelete: vi.fn(),
        clear: vi.fn(),
        filter: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        reverse: vi.fn().mockReturnThis(),
      },
      metadata: {
        put: vi.fn(),
        bulkDelete: vi.fn(),
        clear: vi.fn(),
      },
      transaction: vi.fn().mockImplementation((_mode, _tables, callback) => {
        return Promise.resolve(callback());
      }),
      open: vi.fn().mockResolvedValue(undefined),
      close: vi.fn(),
    };

    const Dexie = vi.mocked(require("dexie").default);
    Dexie.mockImplementation(() => mockDb);

    storage = new ModernStorageLayer();
  });

  describe("Large Conversation Performance", () => {
    it("should handle conversations with 1000+ messages efficiently", async () => {
      // Create a large conversation
      const largeConversation = {
        id: "large-conv",
        title: "Large Conversation",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 1000,
        messages: Array.from({ length: 1000 }, (_, i) => ({
          id: `msg-${i}`,
          role: i % 2 === 0 ? "user" : "assistant",
          content: `Message ${i} with some content to make it realistic`,
          timestamp: new Date(2024, 0, 1, 0, 0, i).toISOString(),
          model: "gpt-3.5",
        })),
      };

      const startTime = performance.now();
      await storage.saveConversation(largeConversation);
      const endTime = performance.now();

      // Should complete within reasonable time (less than 1 second for 1000 messages)
      expect(endTime - startTime).toBeLessThan(1000);

      // Should call put once for conversation
      expect(mockDb.conversations.put).toHaveBeenCalledTimes(1);
      expect(mockDb.metadata.put).toHaveBeenCalledTimes(1);
    });

    it("should handle bulk operations efficiently", async () => {
      // Create 100 medium-sized conversations
      const conversations = Array.from({ length: 100 }, (_, i) => ({
        id: `conv-${i}`,
        title: `Conversation ${i}`,
        createdAt: new Date(2024, 0, i).toISOString(),
        updatedAt: new Date(2024, 0, i).toISOString(),
        model: "gpt-3.5",
        messageCount: 10,
        messages: Array.from({ length: 10 }, (_, j) => ({
          id: `msg-${i}-${j}`,
          role: j % 2 === 0 ? "user" : "assistant",
          content: `Message ${j} in conversation ${i}`,
          timestamp: new Date(2024, 0, i, 0, 0, j).toISOString(),
          model: "gpt-3.5",
        })),
      }));

      const startTime = performance.now();

      // Save all conversations
      for (const conv of conversations) {
        await storage.saveConversation(conv);
      }

      const endTime = performance.now();

      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(5000);

      // Should have called put for each conversation
      expect(mockDb.conversations.put).toHaveBeenCalledTimes(100);
      expect(mockDb.metadata.put).toHaveBeenCalledTimes(100);
    });
  });

  describe("Search and Filter Performance", () => {
    it("should perform conversation search efficiently", async () => {
      const conversations = Array.from({ length: 500 }, (_, i) => ({
        id: `conv-${i}`,
        title: `Search Test Conversation ${i}`,
        createdAt: new Date(2024, 0, i).toISOString(),
        updatedAt: new Date(2024, 0, i).toISOString(),
        model: i % 2 === 0 ? "gpt-3.5" : "gpt-4",
        messageCount: 5,
        messages: [{ id: `msg-${i}`, role: "user", content: "Search test" }],
      }));

      mockDb.metadata.orderBy.mockReturnThis();
      mockDb.metadata.reverse.mockReturnThis();
      mockDb.metadata.toArray.mockResolvedValue(conversations);

      const startTime = performance.now();
      const { searchConversations } = await import("@/lib/conversation-manager-modern");
      await searchConversations("test");
      const endTime = performance.now();

      // Should complete search within reasonable time
      expect(endTime - startTime).toBeLessThan(1000);

      // Should filter by model
      expect(mockDb.metadata.orderBy).toHaveBeenCalledWith("updatedAt");
    });
  });

  describe("Export/Import Performance", () => {
    it("should export large dataset efficiently", async () => {
      const conversations = Array.from({ length: 200 }, (_, i) => ({
        id: `conv-${i}`,
        title: `Export Test ${i}`,
        createdAt: new Date(2024, 0, i).toISOString(),
        updatedAt: new Date(2024, 0, i).toISOString(),
        model: "gpt-3.5",
        messageCount: 20,
        messages: Array.from({ length: 20 }, (_, j) => ({
          id: `msg-${i}-${j}`,
          role: j % 2 === 0 ? "user" : "assistant",
          content: `Export message ${j} in conversation ${i}`,
          timestamp: new Date(2024, 0, i, 0, 0, j).toISOString(),
          model: "gpt-3.5",
        })),
      }));

      mockDb.conversations.toArray.mockResolvedValue(conversations);

      const startTime = performance.now();
      const exportData = await storage.exportConversations();
      const endTime = performance.now();

      // Should complete export within reasonable time
      expect(endTime - startTime).toBeLessThan(2000);

      // Should include all conversations
      expect(exportData.conversations).toHaveLength(200);
      expect(exportData.metadata.totalConversations).toBe(200);
    });

    it("should import large dataset efficiently", async () => {
      const exportData = {
        version: "2.0",
        metadata: {
          exportedAt: new Date().toISOString(),
          totalConversations: 100,
          appVersion: "2.0.0",
        },
        conversations: Array.from({ length: 100 }, (_, i) => ({
          id: `import-${i}`,
          title: `Import Test ${i}`,
          createdAt: new Date(2024, 0, i).toISOString(),
          updatedAt: new Date(2024, 0, i).toISOString(),
          model: "gpt-3.5",
          messageCount: 15,
          messages: Array.from({ length: 15 }, (_, j) => ({
            id: `msg-${i}-${j}`,
            role: j % 2 === 0 ? "user" : "assistant",
            content: `Import message ${j} in conversation ${i}`,
            timestamp: new Date(2024, 0, i, 0, 0, j).toISOString(),
            model: "gpt-3.5",
          })),
        })),
      };

      mockDb.conversations.get.mockResolvedValue(null);

      const startTime = performance.now();
      const result = await storage.importConversations(exportData, {
        overwrite: false,
        merge: false,
      });
      const endTime = performance.now();

      // Should complete import within reasonable time
      expect(endTime - startTime).toBeLessThan(3000);

      // Should import all conversations
      expect(result.success).toBe(true);
      expect(result.importedCount).toBe(100);
    });
  });

  describe("Memory Usage", () => {
    it("should not leak memory during repeated operations", async () => {
      const conversation = {
        id: "memory-test",
        title: "Memory Test",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 10,
        messages: Array.from({ length: 10 }, (_, i) => ({
          id: `msg-${i}`,
          role: i % 2 === 0 ? "user" : "assistant",
          content: `Memory test message ${i}`,
          timestamp: new Date(2024, 0, 1, 0, 0, i).toISOString(),
          model: "gpt-3.5",
        })),
      };

      // Perform many operations
      for (let i = 0; i < 1000; i++) {
        await storage.saveConversation(conversation);
        await storage.getConversation("memory-test");
        await storage.deleteConversation("memory-test");
      }

      // Should not throw any errors
      expect(mockDb.conversations.put).toHaveBeenCalled();
      expect(mockDb.conversations.get).toHaveBeenCalled();
      expect(mockDb.conversations.delete).toHaveBeenCalled();
    });
  });
});
