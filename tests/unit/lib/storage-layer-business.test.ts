// Simple unit tests for storage layer business logic
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the Dexie dependency
vi.mock("dexie", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
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
      transaction: vi.fn().mockImplementation((mode, tables, callback) => {
        return Promise.resolve(callback());
      }),
      open: vi.fn().mockResolvedValue(undefined),
      close: vi.fn(),
      version: vi.fn().mockReturnThis(),
      stores: vi.fn().mockReturnThis(),
    })),
  };
});

// Import after mocking
import { ModernStorageLayer } from "@/lib/storage-layer";

describe("ModernStorageLayer Business Logic", () => {
  let storage: ModernStorageLayer;
  let mockDb: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create a fresh mock database instance
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
      transaction: vi.fn().mockImplementation((mode, tables, callback) => {
        return Promise.resolve(callback());
      }),
      open: vi.fn().mockResolvedValue(undefined),
      close: vi.fn(),
    };

    // Replace the module's database instance
    const Dexie = vi.mocked(require("dexie").default);
    Dexie.mockImplementation(() => mockDb);

    storage = new ModernStorageLayer();
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
        storageSize: 0,
      });
    });

    it("should calculate stats correctly for existing conversations", async () => {
      const mockConversations = [
        {
          id: "1",
          title: "Test 1",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 5,
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
          messageCount: 3,
          messages: [{ role: "user", content: "Test" }],
        },
      ];

      mockDb.conversations.toArray.mockResolvedValue(mockConversations);

      const stats = await storage.getConversationStats();

      expect(stats).toEqual({
        totalConversations: 2,
        totalMessages: 3,
        averageMessagesPerConversation: 1.5,
        modelsUsed: ["gpt-3.5", "gpt-4"],
        storageSize: expect.any(Number),
      });
    });
  });

  describe("getAllConversations", () => {
    it("should return conversations sorted by updatedAt descending", async () => {
      const mockMetadata = [
        {
          id: "1",
          title: "Old Conversation",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 5,
        },
        {
          id: "2",
          title: "New Conversation",
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
          model: "gpt-4",
          messageCount: 3,
        },
      ];

      const reverseMock = {
        toArray: vi.fn().mockResolvedValue(mockMetadata),
      };

      const orderByMock = {
        reverse: vi.fn().mockReturnValue(reverseMock),
      };

      mockDb.metadata.orderBy.mockReturnValue(orderByMock);

      const conversations = await storage.getAllConversations();

      expect(conversations).toEqual(mockMetadata);
      expect(mockDb.metadata.orderBy).toHaveBeenCalledWith("updatedAt");
      expect(orderByMock.reverse).toHaveBeenCalled();
    });
  });

  describe("getConversation", () => {
    it("should return conversation when found", async () => {
      const mockConversation = {
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
      const conversation = {
        id: "1",
        title: "Test Conversation",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 2,
        messages: [{ role: "user", content: "Hello" }],
      };

      await storage.saveConversation(conversation);

      expect(mockDb.conversations.put).toHaveBeenCalledWith(conversation);
      expect(mockDb.metadata.put).toHaveBeenCalledWith({
        id: "1",
        title: "Test Conversation",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 2,
      });
      expect(mockDb.transaction).toHaveBeenCalled();
    });

    it("should throw error when save fails", async () => {
      const conversation = {
        id: "1",
        title: "Test Conversation",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 2,
        messages: [{ role: "user", content: "Hello" }],
      };

      mockDb.conversations.put.mockRejectedValue(new Error("Save failed"));

      await expect(storage.saveConversation(conversation)).rejects.toThrow("Save failed");
    });
  });

  describe("deleteConversation", () => {
    it("should delete conversation and metadata", async () => {
      await storage.deleteConversation("1");

      expect(mockDb.conversations.delete).toHaveBeenCalledWith("1");
      expect(mockDb.metadata.delete).toHaveBeenCalledWith("1");
      expect(mockDb.transaction).toHaveBeenCalled();
    });

    it("should throw error when delete fails", async () => {
      mockDb.conversations.delete.mockRejectedValue(new Error("Delete failed"));

      await expect(storage.deleteConversation("1")).rejects.toThrow("Delete failed");
    });
  });

  describe("cleanupOldConversations", () => {
    it("should delete conversations older than specified days", async () => {
      const mockOldConversations = [
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
      expect(mockDb.conversations.bulkDelete).toHaveBeenCalledWith(["old1"]);
      expect(mockDb.metadata.bulkDelete).toHaveBeenCalledWith(["old1"]);
      expect(mockDb.transaction).toHaveBeenCalled();
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
      const mockConversations = [
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

      expect(mockDb.conversations.clear).toHaveBeenCalled();
      expect(mockDb.metadata.clear).toHaveBeenCalled();
      expect(mockDb.transaction).toHaveBeenCalled();
    });

    it("should throw error when clear fails", async () => {
      mockDb.conversations.clear.mockRejectedValue(new Error("Clear failed"));

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
