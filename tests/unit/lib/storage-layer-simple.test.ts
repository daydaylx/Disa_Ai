// Simplified unit tests for modern storage layer (ESM-compatible mock)
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type Conversation,
  type ConversationMetadata,
  ModernStorageLayer,
} from "@/lib/storage-layer";

describe("ModernStorageLayer (Simplified)", () => {
  let storage: ModernStorageLayer;
  let mockDb: ReturnType<typeof createMockDatabase>;

  function createMockDatabase() {
    return {
      conversations: {
        put: vi.fn().mockResolvedValue(undefined),
        get: vi.fn().mockResolvedValue(null),
        delete: vi.fn().mockResolvedValue(undefined),
        bulkDelete: vi.fn().mockResolvedValue(undefined),
        clear: vi.fn().mockResolvedValue(undefined),
        filter: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        reverse: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([]),
      },
      metadata: {
        put: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
        bulkDelete: vi.fn().mockResolvedValue(undefined),
        clear: vi.fn().mockResolvedValue(undefined),
        orderBy: vi.fn().mockReturnThis(),
        reverse: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([]),
      },
      transaction: vi.fn().mockImplementation((...args) => {
        const callback = args[args.length - 1];
        if (typeof callback === "function") {
          return Promise.resolve(callback());
        }
        return Promise.resolve();
      }),
      open: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
      version: vi.fn().mockReturnThis(),
      stores: vi.fn().mockReturnThis(),
    };
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    mockDb = createMockDatabase();
    storage = new ModernStorageLayer(mockDb as any);
  });

  describe("getConversationStats", () => {
    it("should return empty stats when no conversations exist", async () => {
      mockDb.conversations.toArray.mockResolvedValue([]);

      const stats = await storage.getConversationStats();

      expect(stats).toEqual({
        totalConversations: 0,
        totalMessages: 0,
        averageMessagesPerConversation: 0,
        modelsUsed: [],
        storageSize: expect.any(Number), // Blob size of "[]"
      });
    });

    it("should calculate stats correctly for existing conversations", async () => {
      const mockConversations: Conversation[] = [
        {
          id: "1",
          title: "Test 1",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 2, // This is metadata, messages array length is the source of truth
          messages: [
            { role: "user", content: "Hello" },
            { role: "assistant", content: "Hi!" },
          ],
        },
        {
          id: "2",
          title: "Test 2",
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
          model: "gpt-4",
          messageCount: 1,
          messages: [{ role: "user", content: "Test" }],
        },
      ];

      mockDb.conversations.toArray.mockResolvedValue(mockConversations);

      const stats = await storage.getConversationStats();

      expect(stats).toEqual({
        totalConversations: 2,
        totalMessages: 3, // 2 + 1
        averageMessagesPerConversation: 1.5,
        modelsUsed: ["gpt-3.5", "gpt-4"],
        storageSize: expect.any(Number),
      });
    });
  });

  describe("getAllConversations", () => {
    it("should return conversations sorted by updatedAt descending", async () => {
      const mockMetadata: ConversationMetadata[] = [
        {
          id: "2",
          title: "New Conversation",
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
          model: "gpt-4",
          messageCount: 3,
        },
        {
          id: "1",
          title: "Old Conversation",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 5,
        },
      ];

      // Simulate the chained calls: db.metadata.orderBy().reverse().toArray()
      mockDb.metadata.orderBy.mockReturnThis();
      mockDb.metadata.reverse.mockReturnThis();
      mockDb.metadata.toArray.mockResolvedValue(mockMetadata);

      const conversations = await storage.getAllConversations();

      expect(conversations).toEqual(mockMetadata);
      expect(mockDb.metadata.orderBy).toHaveBeenCalledWith("updatedAt");
      expect(mockDb.metadata.reverse).toHaveBeenCalled();
    });
  });

  describe("getConversation", () => {
    it("should return conversation when found", async () => {
      const mockConversation: Conversation = {
        id: "1",
        title: "Test Conversation",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 2,
        messages: [{ role: "user", content: "Hello" }],
      };

      mockDb.conversations.get.mockResolvedValue(mockConversation);

      const result = await storage.getConversation("1");

      expect(result).toEqual(mockConversation);
      expect(mockDb.conversations.get).toHaveBeenCalledWith("1");
    });

    it("should return null when conversation not found", async () => {
      mockDb.conversations.get.mockResolvedValue(null);

      const result = await storage.getConversation("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("saveConversation", () => {
    it("should save conversation and metadata successfully", async () => {
      const conversation: Conversation = {
        id: "1",
        title: "Test Conversation",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 2,
        messages: [{ role: "user", content: "Hello" }],
      };

      await storage.saveConversation(conversation);

      expect(mockDb.transaction).toHaveBeenCalled();
      expect(mockDb.conversations.put).toHaveBeenCalledWith(conversation);
      expect(mockDb.metadata.put).toHaveBeenCalledWith({
        id: "1",
        title: "Test Conversation",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 2,
      });
    });

    it("should throw error when save fails", async () => {
      const conversation: Conversation = {
        id: "1",
        title: "Test Conversation",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 2,
        messages: [{ role: "user", content: "Hello" }],
      };

      const saveError = new Error("Save failed");
      mockDb.conversations.put.mockRejectedValue(saveError);

      await expect(storage.saveConversation(conversation)).rejects.toThrow("Save failed");
    });
  });

  describe("deleteConversation", () => {
    it("should delete conversation and metadata", async () => {
      await storage.deleteConversation("1");

      expect(mockDb.transaction).toHaveBeenCalled();
      expect(mockDb.conversations.delete).toHaveBeenCalledWith("1");
      expect(mockDb.metadata.delete).toHaveBeenCalledWith("1");
    });

    it("should throw error when delete fails", async () => {
      const deleteError = new Error("Delete failed");
      mockDb.conversations.delete.mockRejectedValue(deleteError);

      await expect(storage.deleteConversation("1")).rejects.toThrow("Delete failed");
    });
  });

  describe("cleanupOldConversations", () => {
    it("should delete conversations older than specified days", async () => {
      const mockOldConversations: Conversation[] = [
        {
          id: "old1",
          title: "Old Conversation",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 1,
        },
      ];

      mockDb.conversations.filter.mockReturnThis();
      mockDb.conversations.toArray.mockResolvedValue(mockOldConversations);

      const deletedCount = await storage.cleanupOldConversations(7);

      expect(deletedCount).toBe(1);
      expect(mockDb.transaction).toHaveBeenCalled();
      expect(mockDb.conversations.bulkDelete).toHaveBeenCalledWith(["old1"]);
      expect(mockDb.metadata.bulkDelete).toHaveBeenCalledWith(["old1"]);
    });

    it("should return 0 when no conversations to delete", async () => {
      mockDb.conversations.filter.mockReturnThis();
      mockDb.conversations.toArray.mockResolvedValue([]);

      const deletedCount = await storage.cleanupOldConversations(7);

      expect(deletedCount).toBe(0);
    });
  });

  describe("exportConversations", () => {
    it("should export conversations in correct format", async () => {
      const mockConversations: Conversation[] = [
        {
          id: "1",
          title: "Test Conversation",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 2,
          messages: [{ role: "user", content: "Hello" }],
        },
      ];

      mockDb.conversations.toArray.mockResolvedValue(mockConversations);

      const exportData = await storage.exportConversations();

      expect(exportData).toEqual({
        version: "2.0",
        metadata: {
          exportedAt: expect.any(String),
          totalConversations: 1,
          appVersion: "2.0.0",
        },
        conversations: mockConversations,
      });
    });
  });

  describe("importConversations", () => {
    it("should import conversations successfully", async () => {
      const importData = {
        version: "2.0",
        metadata: {
          exportedAt: "2024-01-01T00:00:00Z",
          totalConversations: 1,
          appVersion: "2.0.0",
        },
        conversations: [
          {
            id: "1",
            title: "Test Conversation",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            model: "gpt-3.5",
            messageCount: 2,
            messages: [{ role: "user", content: "Hello" }],
          },
        ],
      };

      mockDb.conversations.get.mockResolvedValue(null);

      const result = await storage.importConversations(importData, {
        overwrite: false,
        merge: false,
      });

      expect(result).toEqual({
        success: true,
        importedCount: 1,
        errors: [],
      });
      expect(mockDb.transaction).toHaveBeenCalled();
    });

    it("should skip existing conversations when not overwriting", async () => {
      const importData = {
        version: "2.0",
        metadata: {
          exportedAt: "2024-01-01T00:00:00Z",
          totalConversations: 1,
          appVersion: "2.0.0",
        },
        conversations: [
          {
            id: "1",
            title: "Test Conversation",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            model: "gpt-3.5",
            messageCount: 2,
            messages: [{ role: "user", content: "Hello" }],
          },
        ],
      };

      mockDb.conversations.get.mockResolvedValue({ id: "1" });

      const result = await storage.importConversations(importData, {
        overwrite: false,
        merge: false,
      });

      expect(result).toEqual({
        success: true,
        importedCount: 0,
        errors: [],
      });
    });
  });

  describe("clearAllData", () => {
    it("should clear all conversations and metadata", async () => {
      await storage.clearAllData();

      expect(mockDb.transaction).toHaveBeenCalled();
      expect(mockDb.conversations.clear).toHaveBeenCalled();
      expect(mockDb.metadata.clear).toHaveBeenCalled();
    });

    it("should throw error when clear fails", async () => {
      const clearError = new Error("Clear failed");
      mockDb.conversations.clear.mockRejectedValue(clearError);

      await expect(storage.clearAllData()).rejects.toThrow("Clear failed");
    });
  });

  describe("getStorageUsage", () => {
    it("should return storage usage when available", async () => {
      // Mock navigator.storage.estimate
      vi.stubGlobal("navigator", {
        storage: {
          estimate: vi.fn().mockResolvedValue({
            usage: 1024000,
            quota: 5242880,
          }),
        },
      });

      const usage = await storage.getStorageUsage();

      expect(usage).toEqual({
        used: 1024000,
        quota: 5242880,
      });
    });

    it("should return zeros when storage API not available", async () => {
      vi.stubGlobal("navigator", {});

      const usage = await storage.getStorageUsage();

      expect(usage).toEqual({
        used: 0,
        quota: 0,
      });
    });
  });
});
