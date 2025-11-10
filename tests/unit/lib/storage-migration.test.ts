// Unit tests for storage migration
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Dexie first to prevent issues with storage-layer imports
vi.mock("dexie", () => {
  const createMockDatabase = () => ({
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
      // Dexie transaction takes (mode, table1, table2, ..., callback)
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
  });

  const MockDexieClass = vi.fn().mockImplementation(createMockDatabase);
  // Mark as mock so isDexieMock detection works
  MockDexieClass._isMockFunction = true;

  return {
    default: MockDexieClass,
    Table: vi.fn(),
  };
});

import { modernStorage } from "../../../src/lib/storage-layer";
import { StorageMigration } from "../../../src/lib/storage-migration";

// Mock the modernStorage module
vi.mock("../../../src/lib/storage-layer", () => {
  const mockModernStorage = {
    getAllConversations: vi.fn(),
    saveConversation: vi.fn(),
    deleteConversation: vi.fn(),
    clearAllData: vi.fn(),
    getConversation: vi.fn(),
    exportConversations: vi.fn(),
  };

  return {
    modernStorage: mockModernStorage,
  };
});

describe("StorageMigration", () => {
  let migration: StorageMigration;
  let mockModernStorage: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockModernStorage = {
      getAllConversations: vi.fn(),
      saveConversation: vi.fn(),
      deleteConversation: vi.fn(),
      clearAllData: vi.fn(),
      getConversation: vi.fn(),
      exportConversations: vi.fn(),
    };

    // Update the module mock
    vi.mocked(modernStorage).getAllConversations = mockModernStorage.getAllConversations;
    vi.mocked(modernStorage).saveConversation = mockModernStorage.saveConversation;
    vi.mocked(modernStorage).deleteConversation = mockModernStorage.deleteConversation;
    vi.mocked(modernStorage).clearAllData = mockModernStorage.clearAllData;
    vi.mocked(modernStorage).getConversation = mockModernStorage.getConversation;
    vi.mocked(modernStorage).exportConversations = mockModernStorage.exportConversations;

    migration = StorageMigration.getInstance();
  });

  describe("checkMigrationStatus", () => {
    it("should detect localStorage data and no IndexedDB data", async () => {
      // Mock localStorage
      vi.stubGlobal("localStorage", {
        getItem: vi.fn((key) => {
          if (key === "disa:conversations") return JSON.stringify({ "1": { id: "1" } });
          if (key === "disa:conversations:metadata") return JSON.stringify({ "1": { id: "1" } });
          return null;
        }),
      });

      // Mock IndexedDB empty
      mockModernStorage.getAllConversations.mockResolvedValue([]);

      const status = await migration.checkMigrationStatus();

      expect(status).toEqual({
        hasLocalStorageData: true,
        hasIndexedDBData: false,
        needsMigration: true,
      });
    });

    it("should detect no localStorage data", async () => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn().mockReturnValue(null),
      });

      mockModernStorage.getAllConversations.mockResolvedValue([]);

      const status = await migration.checkMigrationStatus();

      expect(status).toEqual({
        hasLocalStorageData: false,
        hasIndexedDBData: false,
        needsMigration: false,
      });
    });

    it("should detect existing IndexedDB data", async () => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn().mockReturnValue(null),
      });

      mockModernStorage.getAllConversations.mockResolvedValue([{ id: "1" }]);

      const status = await migration.checkMigrationStatus();

      expect(status).toEqual({
        hasLocalStorageData: false,
        hasIndexedDBData: true,
        needsMigration: false,
      });
    });

    it("should handle localStorage parse errors", async () => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn((key) => {
          if (key === "disa:conversations") return "invalid json";
          return null;
        }),
      });

      mockModernStorage.getAllConversations.mockResolvedValue([]);

      const status = await migration.checkMigrationStatus();

      expect(status).toEqual({
        hasLocalStorageData: false,
        hasIndexedDBData: false,
        needsMigration: false,
      });
    });
  });

  describe("migrateFromLocalStorage", () => {
    it("should migrate conversations successfully", async () => {
      const mockConversations = [
        {
          id: "1",
          title: "Test Conversation 1",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 5,
          messages: [{ role: "user", content: "Hello" }],
        },
        {
          id: "2",
          title: "Test Conversation 2",
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
          model: "gpt-4",
          messageCount: 3,
          messages: [{ role: "user", content: "Test" }],
        },
      ];

      vi.stubGlobal("localStorage", {
        getItem: vi.fn((key) => {
          if (key === "disa:conversations")
            return JSON.stringify({
              "1": mockConversations[0],
              "2": mockConversations[1],
            });
          if (key === "disa:conversations:metadata")
            return JSON.stringify({
              "1": { id: "1", title: "Test Conversation 1" },
              "2": { id: "2", title: "Test Conversation 2" },
            });
          return null;
        }),
        removeItem: vi.fn(),
      });

      mockModernStorage.saveConversation.mockResolvedValue(undefined);

      const result = await migration.migrateFromLocalStorage({
        clearLocalStorageAfterSuccess: true,
        validateData: true,
        batchSize: 50,
        skipOnError: false,
      });

      expect(result).toEqual({
        success: true,
        migratedCount: 2,
        errors: [],
        warnings: [],
        duration: expect.any(Number),
      });

      expect(mockModernStorage.saveConversation).toHaveBeenCalledTimes(2);
      expect(localStorage.removeItem).toHaveBeenCalledWith("disa:conversations");
      expect(localStorage.removeItem).toHaveBeenCalledWith("disa:conversations:metadata");
    });

    it("should handle migration with validation warnings", async () => {
      const invalidConversations = [
        {
          id: "1",
          title: "", // Missing title
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 5,
          messages: [{ role: "user", content: "Hello" }],
        },
      ];

      vi.stubGlobal("localStorage", {
        getItem: vi.fn((key) => {
          if (key === "disa:conversations")
            return JSON.stringify({
              "1": invalidConversations[0],
            });
          return null;
        }),
        removeItem: vi.fn(),
      });

      mockModernStorage.saveConversation.mockResolvedValue(undefined);

      const result = await migration.migrateFromLocalStorage({
        validateData: true,
      });

      expect(result.success).toBe(true);
      expect(result.migratedCount).toBe(1);
      expect(result.warnings).toContain("Conversation 1 missing title");
    });

    it("should handle migration failures", async () => {
      const mockConversations = [
        {
          id: "1",
          title: "Test Conversation",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 5,
          messages: [{ role: "user", content: "Hello" }],
        },
      ];

      vi.stubGlobal("localStorage", {
        getItem: vi.fn((key) => {
          if (key === "disa:conversations")
            return JSON.stringify({
              "1": mockConversations[0],
            });
          return null;
        }),
        removeItem: vi.fn(),
      });

      mockModernStorage.saveConversation.mockRejectedValue(new Error("Save failed"));

      const result = await migration.migrateFromLocalStorage({
        skipOnError: false,
      });

      expect(result.success).toBe(false);
      expect(result.migratedCount).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should skip errors when skipOnError is true", async () => {
      const mockConversations = [
        {
          id: "1",
          title: "Test Conversation 1",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 5,
          messages: [{ role: "user", content: "Hello" }],
        },
        {
          id: "2",
          title: "Test Conversation 2",
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
          model: "gpt-4",
          messageCount: 3,
          messages: [{ role: "user", content: "Test" }],
        },
      ];

      vi.stubGlobal("localStorage", {
        getItem: vi.fn((key) => {
          if (key === "disa:conversations")
            return JSON.stringify({
              "1": mockConversations[0],
              "2": mockConversations[1],
            });
          return null;
        }),
        removeItem: vi.fn(),
      });

      mockModernStorage.saveConversation
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error("Save failed"));

      const result = await migration.migrateFromLocalStorage({
        skipOnError: true,
        batchSize: 1,
      });

      expect(result.success).toBe(false);
      expect(result.migratedCount).toBe(1);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should not clear localStorage when migration fails", async () => {
      const mockConversations = [
        {
          id: "1",
          title: "Test Conversation",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 5,
          messages: [{ role: "user", content: "Hello" }],
        },
      ];

      vi.stubGlobal("localStorage", {
        getItem: vi.fn((key) => {
          if (key === "disa:conversations")
            return JSON.stringify({
              "1": mockConversations[0],
            });
          return null;
        }),
        removeItem: vi.fn(),
      });

      mockModernStorage.saveConversation.mockRejectedValue(new Error("Save failed"));

      await migration.migrateFromLocalStorage({
        clearLocalStorageAfterSuccess: true,
      });

      expect(localStorage.removeItem).not.toHaveBeenCalled();
    });

    it("should prevent concurrent migrations", async () => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn().mockReturnValue(null),
      });

      // Start first migration
      const firstMigration = migration.migrateFromLocalStorage();

      // Try to start second migration
      await expect(migration.migrateFromLocalStorage()).rejects.toThrow(
        "Migration is already in progress",
      );

      // Wait for first migration to complete
      await firstMigration;
    });
  });

  describe("validateConversations", () => {
    it("should validate conversations correctly", () => {
      const validConversations = [
        {
          id: "1",
          title: "Valid Conversation",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 2,
          messages: [
            { role: "user", content: "Hello" },
            { role: "assistant", content: "Hi!" },
          ],
        },
      ];

      const warnings = (migration as any).validateConversations(validConversations);

      expect(warnings).toEqual([]);
    });

    it("should detect missing required fields", () => {
      const invalidConversations = [
        {
          id: "", // Missing ID
          title: "", // Missing title
          createdAt: "", // Missing createdAt
          updatedAt: "", // Missing updatedAt
          model: "", // Missing model
          messageCount: 5,
          messages: [{ role: "user", content: "Hello" }],
        },
      ];

      const warnings = (migration as any).validateConversations(invalidConversations);

      expect(warnings).toContain("Conversation missing ID");
      expect(warnings).toContain("Conversation  missing title");
      expect(warnings).toContain("Conversation  missing createdAt");
      expect(warnings).toContain("Conversation  missing updatedAt");
      expect(warnings).toContain("Conversation  missing model");
    });

    it("should detect invalid dates", () => {
      const invalidConversations = [
        {
          id: "1",
          title: "Test Conversation",
          createdAt: "invalid-date",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 5,
          messages: [{ role: "user", content: "Hello" }],
        },
      ];

      const warnings = (migration as any).validateConversations(invalidConversations);

      expect(warnings).toContain("Conversation 1 has invalid dates");
    });

    it("should detect message count inconsistencies", () => {
      const invalidConversations = [
        {
          id: "1",
          title: "Test Conversation",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 5, // Says 5 messages
          messages: [{ role: "user", content: "Hello" }], // But only has 1
        },
      ];

      const warnings = (migration as any).validateConversations(invalidConversations);

      expect(warnings).toContain(
        "Conversation 1 has inconsistent message count: stored 5, actual 1",
      );
    });
  });

  describe("estimateMigrationTime", () => {
    it("should estimate migration time correctly", async () => {
      const mockConversations = Array.from({ length: 100 }, (_, i) => ({
        id: `conv-${i}`,
        title: `Conversation ${i}`,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 5,
        messages: [{ role: "user", content: "Hello" }],
      }));

      vi.stubGlobal("localStorage", {
        getItem: vi.fn((key) => {
          if (key === "disa:conversations")
            return JSON.stringify(Object.fromEntries(mockConversations.map((c) => [c.id, c])));
          return null;
        }),
      });

      const estimate = await migration.estimateMigrationTime();

      expect(estimate).toEqual({
        estimatedDuration: expect.any(Number),
        conversationCount: 100,
        estimatedSize: expect.any(Number),
      });

      expect(estimate.conversationCount).toBe(100);
      expect(estimate.estimatedDuration).toBeGreaterThan(0);
      expect(estimate.estimatedSize).toBeGreaterThan(0);
    });

    it("should return zeros when no localStorage data", async () => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn().mockReturnValue(null),
      });

      const estimate = await migration.estimateMigrationTime();

      expect(estimate).toEqual({
        estimatedDuration: 0,
        conversationCount: 0,
        estimatedSize: 0,
      });
    });
  });

  describe("createBackup", () => {
    it("should create backup successfully", async () => {
      const mockConversations = {
        "1": {
          id: "1",
          title: "Test Conversation",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 5,
          messages: [{ role: "user", content: "Hello" }],
        },
      };

      const mockMetadata = {
        "1": {
          id: "1",
          title: "Test Conversation",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          model: "gpt-3.5",
          messageCount: 5,
        },
      };

      vi.stubGlobal("localStorage", {
        getItem: vi.fn((key) => {
          if (key === "disa:conversations") return JSON.stringify(mockConversations);
          if (key === "disa:conversations:metadata") return JSON.stringify(mockMetadata);
          return null;
        }),
      });

      const backup = await migration.createBackup();

      expect(backup).toBeTruthy();
      const parsed = JSON.parse(backup!);
      expect(parsed.version).toBe("1.0");
      expect(parsed.timestamp).toBeTruthy();
      expect(parsed.conversations).toEqual(mockConversations);
      expect(parsed.metadata).toEqual(mockMetadata);
    });

    it("should return null when no data to backup", async () => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn().mockReturnValue(null),
      });

      const backup = await migration.createBackup();

      expect(backup).toBeNull();
    });
  });

  describe("restoreFromBackup", () => {
    it("should restore from backup successfully", async () => {
      const backupData = JSON.stringify({
        version: "1.0",
        timestamp: "2024-01-01T00:00:00Z",
        conversations: {
          "1": {
            id: "1",
            title: "Test Conversation",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            model: "gpt-3.5",
            messageCount: 5,
            messages: [{ role: "user", content: "Hello" }],
          },
        },
        metadata: {
          "1": {
            id: "1",
            title: "Test Conversation",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            model: "gpt-3.5",
            messageCount: 5,
          },
        },
      });

      mockModernStorage.saveConversation.mockResolvedValue(undefined);

      const result = await migration.restoreFromBackup(backupData);

      expect(result).toEqual({
        success: true,
        migratedCount: 1,
        errors: [],
        warnings: [],
        duration: expect.any(Number),
      });

      expect(mockModernStorage.saveConversation).toHaveBeenCalledWith({
        id: "1",
        title: "Test Conversation",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 5,
        messages: [{ role: "user", content: "Hello" }],
      });
    });

    it("should handle invalid backup format", async () => {
      const invalidBackup = "invalid json";

      const result = await migration.restoreFromBackup(invalidBackup);

      expect(result).toEqual({
        success: false,
        migratedCount: 0,
        errors: ["Failed to parse backup: SyntaxError: Unexpected token i in JSON at position 0"],
        warnings: [],
        duration: expect.any(Number),
      });
    });

    it("should handle missing conversations or metadata", async () => {
      const incompleteBackup = JSON.stringify({
        version: "1.0",
        timestamp: "2024-01-01T00:00:00Z",
        // Missing conversations and metadata
      });

      const result = await migration.restoreFromBackup(incompleteBackup);

      expect(result.success).toBe(false);
      expect(result.errors).toContain("Invalid backup format");
    });
  });

  describe("isMigrationInProgress", () => {
    it("should return false when no migration in progress", () => {
      expect(migration.isMigrationInProgress()).toBe(false);
    });

    it("should return true when migration is in progress", async () => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn().mockReturnValue(null),
      });

      // Start migration
      const migrationPromise = migration.migrateFromLocalStorage();

      expect(migration.isMigrationInProgress()).toBe(true);

      // Wait for completion
      await migrationPromise;

      expect(migration.isMigrationInProgress()).toBe(false);
    });
  });
});
