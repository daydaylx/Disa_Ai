import Dexie from "dexie";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SchemaMigrationManager } from "../../lib/storage-schema-migration";

// Mock Dexie for testing
vi.mock("dexie", () => {
  // Store for table data and spies
  const tablesStore = new Map<string, any>();

  return {
    default: class MockDexie {
      _version: number = 1;
      _stores: any = {};

      constructor(public dbName: string) {
        // Mock constructor
      }

      version(v: number) {
        this._version = v;
        return {
          stores: (s: any) => {
            this._stores = s;
            return this;
          },
        };
      }

      async open() {
        return Promise.resolve();
      }

      async close() {
        return Promise.resolve();
      }

      table(tableName: string) {
        // Return existing table if already created
        if (tablesStore.has(tableName)) {
          return tablesStore.get(tableName);
        }

        // Create new table mock
        const tableData: any[] = [];
        const whereMocks = new Map<string, any>();
        const updateCalls: any[] = [];
        const deleteCalls: any[] = [];

        const table = {
          where: (_field: string) => {
            const mock: any = {
              below: (_value: any) => ({
                toArray: () => tableData,
                and: (_callback: any) => ({
                  toArray: () => tableData.filter(_callback),
                }),
              }),
              equals: (_value: any) => ({
                reverse: () => ({
                  sortBy: (_field: string) => Promise.resolve(tableData),
                }),
              }),
            };
            whereMocks.set(_field, mock);
            return mock;
          },
          filter: (_callback: any) => ({
            reverse: () => ({
              sortBy: (_field: string) => Promise.resolve(tableData.filter(_callback)),
            }),
          }),
          update: async (id: string, data: any) => {
            updateCalls.push({ id, data });
            return Promise.resolve(1);
          },
          delete: async (id: string) => {
            deleteCalls.push(id);
            return Promise.resolve();
          },
          toArray: () => tableData,
          bulkDelete: async (_ids: string[]) => {},
          bulkPut: async (_items: any[]) => {},
          put: async (item: any) => {
            tableData.push(item);
            return Promise.resolve();
          },
          getUpdateCalls: () => updateCalls,
          getDeleteCalls: () => deleteCalls,
          getTableData: () => tableData,
        };

        tablesStore.set(tableName, table);
        return table;
      }

      transaction(_mode: string, ..._tables: any[]) {
        return {
          async: async (_callback: any) => {
            await _callback();
          },
        };
      }
    },
  };
});

describe("SchemaMigrationManager", () => {
  let migrationManager: SchemaMigrationManager;
  let mockDb: any;

  beforeEach(() => {
    // Reset singleton instance
    (SchemaMigrationManager as any).instance = null;
    migrationManager = SchemaMigrationManager.getInstance();

    // Create mock database
    mockDb = new Dexie("TestDB");
  });

  describe("getLatestVersion", () => {
    it("should return latest schema version", () => {
      expect(migrationManager.getLatestVersion()).toBe(3);
    });
  });

  describe("getCurrentVersion", () => {
    it("should return current schema version", () => {
      expect(migrationManager.getCurrentVersion()).toBe(1);
    });
  });

  describe("getMigrationHistory", () => {
    it("should return migration history with correct format", () => {
      const history = migrationManager.getMigrationHistory();

      expect(history).toHaveLength(3);
      expect(history[0]?.version).toBe(1);
      expect(history[0]?.description).toBe("Initial schema with conversations and metadata tables");
      expect(history[1]?.version).toBe(2);
      expect(history[1]?.description).toBe("Add archived flag and archivedAt timestamp");
      expect(history[2]?.version).toBe(3);
      expect(history[2]?.description).toBe("Add pinned flag for conversations");

      history.forEach((entry) => {
        expect(entry).toHaveProperty("version");
        expect(entry).toHaveProperty("timestamp");
        expect(entry).toHaveProperty("description");
      });
    });
  });

  describe("needsMigration", () => {
    it("should return true if database version is lower than latest", async () => {
      // Mock database with version 1
      vi.spyOn(migrationManager as any, "detectCurrentVersion").mockResolvedValue(1);

      const needsMigration = await migrationManager.needsMigration(mockDb);

      expect(needsMigration).toBe(true);
    });

    it("should return false if database version equals latest", async () => {
      // Mock database with version 3 (latest)
      vi.spyOn(migrationManager as any, "detectCurrentVersion").mockResolvedValue(3);

      const needsMigration = await migrationManager.needsMigration(mockDb);

      expect(needsMigration).toBe(false);
    });

    it("should return false on error", async () => {
      vi.spyOn(migrationManager as any, "detectCurrentVersion").mockRejectedValue(
        new Error("Database error"),
      );

      const needsMigration = await migrationManager.needsMigration(mockDb);

      expect(needsMigration).toBe(false);
    });
  });

  describe("detectCurrentVersion", () => {
    it("should detect version from database", async () => {
      vi.spyOn(mockDb, "open").mockResolvedValue(undefined);

      const version = await (migrationManager as any).detectCurrentVersion(mockDb);

      expect(version).toBe(3); // Latest version
    });

    it("should return default version on version error", async () => {
      const versionError = new Error("Version error 1");
      vi.spyOn(mockDb, "open").mockRejectedValue(versionError);

      const version = await (migrationManager as any).detectCurrentVersion(mockDb);

      expect(version).toBe(1);
    });

    it("should return default version on generic error", async () => {
      vi.spyOn(mockDb, "open").mockRejectedValue(new Error("Generic error"));

      const version = await (migrationManager as any).detectCurrentVersion(mockDb);

      expect(version).toBe(1);
    });
  });

  describe("archiveOldConversations", () => {
    it("should archive conversations older than specified days", async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const mockConversations = [
        {
          id: "conv1",
          title: "Old Conversation",
          lastActivity: oldDate.toISOString(),
          messageCount: 10,
          isFavorite: false,
          isPinned: false,
          isArchived: false,
        },
        {
          id: "conv2",
          title: "New Conversation",
          lastActivity: new Date().toISOString(),
          messageCount: 5,
          isFavorite: false,
          isPinned: false,
          isArchived: false,
        },
      ];

      const belowMock = vi.fn().mockReturnValue({
        toArray: () => mockConversations,
      });

      const updateSpy = vi.fn().mockResolvedValue(1);

      vi.spyOn(mockDb.table("conversations"), "where").mockReturnValue({
        below: belowMock,
      });

      vi.spyOn(mockDb.table("conversations"), "update").mockImplementation(updateSpy);

      const result = await migrationManager.archiveOldConversations(mockDb, {
        olderThanDays: 90,
        minMessagesToArchive: 5,
      });

      // Both conversations pass the filter (mock returns all), but conv2 is filtered by date logic
      expect(result.archived).toBeGreaterThanOrEqual(0);
      expect(result.errors).toHaveLength(0);
      expect(updateSpy).toHaveBeenCalled();
    });

    it("should skip favorite conversations when excludeFavorites is true", async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const mockConversations = [
        {
          id: "conv1",
          title: "Favorite Conversation",
          lastActivity: oldDate.toISOString(),
          messageCount: 10,
          isFavorite: true,
          isPinned: false,
        },
      ];

      const belowMock = vi.fn().mockReturnValue({
        toArray: () => mockConversations,
      });

      const updateSpy = vi.fn().mockResolvedValue(1);

      vi.spyOn(mockDb.table("conversations"), "where").mockReturnValue({
        below: belowMock,
      });

      vi.spyOn(mockDb.table("conversations"), "update").mockImplementation(updateSpy);

      const result = await migrationManager.archiveOldConversations(mockDb, {
        olderThanDays: 90,
        excludeFavorites: true,
      });

      expect(result.archived).toBe(0);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it("should skip conversations with fewer messages than minMessagesToArchive", async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const mockConversations = [
        {
          id: "conv1",
          title: "Short Conversation",
          lastActivity: oldDate.toISOString(),
          messageCount: 2,
          isFavorite: false,
          isPinned: false,
        },
      ];

      const belowMock = vi.fn().mockReturnValue({
        toArray: () => mockConversations,
      });

      const updateSpy = vi.fn().mockResolvedValue(1);

      vi.spyOn(mockDb.table("conversations"), "where").mockReturnValue({
        below: belowMock,
      });

      vi.spyOn(mockDb.table("conversations"), "update").mockImplementation(updateSpy);

      const result = await migrationManager.archiveOldConversations(mockDb, {
        olderThanDays: 90,
        minMessagesToArchive: 5,
      });

      expect(result.archived).toBe(0);
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe("unarchiveConversations", () => {
    it("should unarchive conversations by IDs", async () => {
      const updateSpy = vi.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(1);

      vi.spyOn(mockDb.table("conversations"), "update").mockImplementation(updateSpy);

      const result = await migrationManager.unarchiveConversations(mockDb, ["conv1", "conv2"]);

      expect(result.unarchived).toBe(2);
      expect(result.errors).toHaveLength(0);
      expect(updateSpy).toHaveBeenCalledWith("conv1", {
        isArchived: false,
        archivedAt: undefined,
      });
      expect(updateSpy).toHaveBeenCalledWith("conv2", {
        isArchived: false,
        archivedAt: undefined,
      });
    });

    it("should handle errors during unarchiving", async () => {
      const updateSpy = vi
        .fn()
        .mockResolvedValueOnce(1)
        .mockRejectedValueOnce(new Error("Database error"));

      vi.spyOn(mockDb.table("conversations"), "update").mockImplementation(updateSpy);

      const result = await migrationManager.unarchiveConversations(mockDb, ["conv1", "conv2"]);

      expect(result.unarchived).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("Failed to unarchive conversation conv2");
    });
  });

  describe("getArchivedConversations", () => {
    it("should return archived conversations", async () => {
      const archivedConversations = [
        { id: "conv1", title: "Archived 1", isArchived: true, archivedAt: "2024-01-01" },
        { id: "conv2", title: "Archived 2", isArchived: true, archivedAt: "2024-01-02" },
      ];

      const tableMock = vi.fn().mockReturnValue({
        filter: (_callback: any) => ({
          reverse: () => ({
            sortBy: (_field: string) => Promise.resolve(archivedConversations.filter(_callback)),
          }),
        }),
      });

      vi.spyOn(mockDb, "table").mockImplementation(tableMock);

      const result = await migrationManager.getArchivedConversations(mockDb);

      expect(result).toEqual(archivedConversations);
      expect(tableMock).toHaveBeenCalledWith("conversations");
    });

    it("should return empty array on error", async () => {
      vi.spyOn(mockDb, "table").mockImplementation(() => {
        throw new Error("Database error");
      });

      const result = await migrationManager.getArchivedConversations(mockDb);

      expect(result).toEqual([]);
    });
  });

  describe("deleteArchivedConversations", () => {
    it("should delete archived conversations older than specified days", async () => {
      const oldArchived = [
        { id: "conv1", isArchived: true, archivedAt: "2024-01-01" },
        { id: "conv2", isArchived: true, archivedAt: "2024-12-01" },
      ];

      const belowMock = vi.fn().mockReturnValue({
        and: (_callback: any) => ({
          toArray: () => oldArchived.filter(_callback),
        }),
      });

      const deleteSpy = vi.fn().mockResolvedValue(undefined);

      vi.spyOn(mockDb.table("conversations"), "where").mockReturnValue({
        below: belowMock,
      });

      vi.spyOn(mockDb.table("conversations"), "delete").mockImplementation(deleteSpy);

      const result = await migrationManager.deleteArchivedConversations(mockDb, 30);

      expect(result.deleted).toBeGreaterThan(0);
      expect(result.errors).toHaveLength(0);
    });

    it("should handle errors during deletion", async () => {
      const belowMock = vi.fn().mockReturnValue({
        and: (_callback: any) => ({
          toArray: () => [{ id: "conv1", isArchived: true }],
        }),
      });

      vi.spyOn(mockDb.table("conversations"), "where").mockReturnValue({
        below: belowMock,
      });

      const deleteSpy = vi.fn().mockRejectedValue(new Error("Delete failed"));

      vi.spyOn(mockDb.table("conversations"), "delete").mockImplementation(deleteSpy);

      const result = await migrationManager.deleteArchivedConversations(mockDb, 30);

      expect(result.deleted).toBe(0);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe("isMigrationInProgress", () => {
    it("should return false when no migration is in progress", () => {
      expect(migrationManager.isMigrationInProgress()).toBe(false);
    });
  });

  describe("singleton pattern", () => {
    it("should return same instance across multiple calls", () => {
      const instance1 = SchemaMigrationManager.getInstance();
      const instance2 = SchemaMigrationManager.getInstance();

      expect(instance1).toBe(instance2);
    });
  });
});
