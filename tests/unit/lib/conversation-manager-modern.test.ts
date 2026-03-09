import type { MockedFunction } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  bulkDeleteConversations,
  cleanupOldConversations,
  type Conversation,
  type ConversationMetadata,
  deleteConversation,
  exportConversations,
  getAllConversations,
  getConversation,
  getConversationStats,
  importConversations,
  saveConversation,
  searchConversations,
  toggleFavorite,
  updateConversation,
} from "@/lib/conversation-manager-modern";

vi.mock("@/lib/storage-layer", () => ({
  modernStorage: {
    getConversationStats: vi.fn(),
    getAllConversations: vi.fn(),
    getConversation: vi.fn(),
    saveConversation: vi.fn(),
    deleteConversation: vi.fn(),
    cleanupOldConversations: vi.fn(),
    exportConversations: vi.fn(),
    importConversations: vi.fn(),
  },
}));

import { modernStorage } from "@/lib/storage-layer";

const mockGetConversationStats = modernStorage.getConversationStats as MockedFunction<
  typeof modernStorage.getConversationStats
>;
const mockGetAllConversations = modernStorage.getAllConversations as MockedFunction<
  typeof modernStorage.getAllConversations
>;
const mockGetConversation = modernStorage.getConversation as MockedFunction<
  typeof modernStorage.getConversation
>;
const mockSaveConversation = modernStorage.saveConversation as MockedFunction<
  typeof modernStorage.saveConversation
>;
const mockDeleteConversation = modernStorage.deleteConversation as MockedFunction<
  typeof modernStorage.deleteConversation
>;
const mockCleanupOldConversations = modernStorage.cleanupOldConversations as MockedFunction<
  typeof modernStorage.cleanupOldConversations
>;
const mockExportConversations = modernStorage.exportConversations as MockedFunction<
  typeof modernStorage.exportConversations
>;
const mockImportConversations = modernStorage.importConversations as MockedFunction<
  typeof modernStorage.importConversations
>;

describe("Conversation Manager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns stats from the storage layer", async () => {
    const mockStats = {
      totalConversations: 5,
      totalMessages: 25,
      averageMessagesPerConversation: 5,
      modelsUsed: ["gpt-3.5", "gpt-4"],
      storageSize: 1024000,
    };

    mockGetConversationStats.mockResolvedValue(mockStats);

    await expect(getConversationStats()).resolves.toEqual(mockStats);
    expect(mockGetConversationStats).toHaveBeenCalled();
  });

  it("returns conversations from the storage layer", async () => {
    const mockConversations: ConversationMetadata[] = [
      {
        id: "1",
        title: "Test Conversation",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 5,
      },
    ];

    mockGetAllConversations.mockResolvedValue(mockConversations);

    await expect(getAllConversations()).resolves.toEqual(mockConversations);
    expect(mockGetAllConversations).toHaveBeenCalled();
  });

  it("returns a conversation by id", async () => {
    const mockConversation: Conversation = {
      id: "1",
      title: "Test Conversation",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      model: "gpt-3.5",
      messageCount: 5,
      messages: [{ role: "user", content: "Hello" }],
    };

    mockGetConversation.mockResolvedValue(mockConversation);

    await expect(getConversation("1")).resolves.toEqual(mockConversation);
    expect(mockGetConversation).toHaveBeenCalledWith("1");
  });

  it("saves a conversation via the storage layer", async () => {
    const conversation: Conversation = {
      id: "1",
      title: "Test Conversation",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      model: "gpt-3.5",
      messageCount: 5,
      messages: [{ role: "user", content: "Hello" }],
    };

    await saveConversation(conversation);

    expect(mockSaveConversation).toHaveBeenCalledWith(conversation);
  });

  it("deletes a conversation via the storage layer", async () => {
    await deleteConversation("1");

    expect(mockDeleteConversation).toHaveBeenCalledWith("1");
  });

  it("cleans up old conversations via the storage layer", async () => {
    mockCleanupOldConversations.mockResolvedValue(3);

    await expect(cleanupOldConversations(30)).resolves.toBe(3);
    expect(mockCleanupOldConversations).toHaveBeenCalledWith(30);
  });

  it("exports conversations via the storage layer", async () => {
    const mockExportData = {
      version: "2.0",
      metadata: {
        exportedAt: "2024-01-01T00:00:00Z",
        totalConversations: 1,
        appVersion: "2.0.0",
      },
      conversations: [],
    };

    mockExportConversations.mockResolvedValue(mockExportData);

    await expect(exportConversations()).resolves.toEqual(mockExportData);
    expect(mockExportConversations).toHaveBeenCalled();
  });

  it("imports conversations via the storage layer", async () => {
    const importData = {
      version: "2.0",
      metadata: {
        exportedAt: "2024-01-01T00:00:00Z",
        totalConversations: 1,
        appVersion: "2.0.0",
      },
      conversations: [],
    };

    const mockResult = {
      success: true,
      importedCount: 1,
      errors: [],
    };

    mockImportConversations.mockResolvedValue(mockResult);

    await expect(importConversations(importData, { overwrite: false })).resolves.toEqual(
      mockResult,
    );
    expect(mockImportConversations).toHaveBeenCalledWith(importData, { overwrite: false });
  });

  it("updates a conversation successfully", async () => {
    const existingConversation: Conversation = {
      id: "1",
      title: "Original Title",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      model: "gpt-3.5",
      messageCount: 5,
      messages: [{ role: "user", content: "Hello" }],
    };

    mockGetConversation.mockResolvedValue(existingConversation);
    mockSaveConversation.mockResolvedValue(undefined);

    await updateConversation("1", { title: "Updated Title" });

    expect(mockGetConversation).toHaveBeenCalledWith("1");
    expect(mockSaveConversation).toHaveBeenCalledWith({
      ...existingConversation,
      title: "Updated Title",
      updatedAt: expect.any(String),
    });
  });

  it("throws when updating a missing conversation", async () => {
    mockGetConversation.mockResolvedValue(null);

    await expect(updateConversation("nonexistent", { title: "New Title" })).rejects.toThrow(
      "Conversation nonexistent not found",
    );
  });

  it("toggles favorite status successfully", async () => {
    const existingConversation: Conversation = {
      id: "1",
      title: "Test Conversation",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      model: "gpt-3.5",
      messageCount: 5,
      messages: [{ role: "user", content: "Hello" }],
      isFavorite: false,
    };

    mockGetConversation.mockResolvedValue(existingConversation);
    mockSaveConversation.mockResolvedValue(undefined);

    await toggleFavorite("1");

    expect(mockGetConversation).toHaveBeenCalledWith("1");
    expect(mockSaveConversation).toHaveBeenCalledWith({
      ...existingConversation,
      isFavorite: true,
      updatedAt: expect.any(String),
    });
  });

  it("throws when toggling favorite on a missing conversation", async () => {
    mockGetConversation.mockResolvedValue(null);

    await expect(toggleFavorite("nonexistent")).rejects.toThrow(
      "Conversation nonexistent not found",
    );
  });

  it("searches conversations by title and model", async () => {
    const mockConversations: ConversationMetadata[] = [
      {
        id: "1",
        title: "GPT-4 Discussion",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-4",
        messageCount: 5,
      },
      {
        id: "2",
        title: "GPT-3.5 Tutorial",
        createdAt: "2024-01-02T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 3,
      },
    ];

    mockGetAllConversations.mockResolvedValue(mockConversations);

    await expect(searchConversations("GPT-4")).resolves.toEqual([mockConversations[0]]);
  });

  it("returns an empty array when search has no matches", async () => {
    const mockConversations: ConversationMetadata[] = [
      {
        id: "1",
        title: "Test Conversation",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        model: "gpt-3.5",
        messageCount: 5,
      },
    ];

    mockGetAllConversations.mockResolvedValue(mockConversations);

    await expect(searchConversations("nonexistent")).resolves.toEqual([]);
  });

  it("deletes multiple conversations successfully", async () => {
    mockDeleteConversation.mockResolvedValue(undefined);

    await expect(bulkDeleteConversations(["1", "2", "3"])).resolves.toEqual({
      deleted: 3,
      errors: [],
    });
    expect(mockDeleteConversation).toHaveBeenCalledTimes(3);
  });

  it("collects delete errors during bulk delete", async () => {
    mockDeleteConversation
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("Delete failed"))
      .mockResolvedValueOnce(undefined);

    await expect(bulkDeleteConversations(["1", "2", "3"])).resolves.toEqual({
      deleted: 2,
      errors: ["Failed to delete conversation 2: Error: Delete failed"],
    });
  });
});
