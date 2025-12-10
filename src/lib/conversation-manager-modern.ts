// Modern conversation manager using IndexedDB via Dexie
import {
  type Conversation,
  type ConversationMetadata,
  type ExportData,
  type ImportResult,
  modernStorage,
} from "./storage-layer";

// Re-export types for use by other modules
export type { Conversation, ConversationMetadata, ExportData, ImportResult };

export interface ConversationStats {
  totalConversations: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
  modelsUsed: string[];
  storageSize: number;
}

export function getConversationStats(): Promise<ConversationStats> {
  return modernStorage.getConversationStats();
}

export function getAllConversations(): Promise<ConversationMetadata[]> {
  return modernStorage.getAllConversations();
}

export function getConversation(id: string): Promise<Conversation | null> {
  return modernStorage.getConversation(id);
}

export function saveConversation(conversation: Conversation): Promise<void> {
  return modernStorage.saveConversation(conversation);
}

export function deleteConversation(id: string): Promise<void> {
  return modernStorage.deleteConversation(id);
}

export async function searchConversations(query: string): Promise<ConversationMetadata[]> {
  const allConversations = await getAllConversations();
  const lowercaseQuery = query.toLowerCase();

  return allConversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(lowercaseQuery) ||
      conv.model.toLowerCase().includes(lowercaseQuery),
  );
}

export async function bulkDeleteConversations(
  ids: string[],
): Promise<{ deleted: number; errors: string[] }> {
  const errors: string[] = [];
  let deleted = 0;

  for (const id of ids) {
    try {
      await deleteConversation(id);
      deleted++;
    } catch (error) {
      errors.push(`Failed to delete conversation ${id}: ${error}`);
    }
  }

  return { deleted, errors };
}

export async function bulkUpdateConversations(
  updates: Array<{ id: string; updates: Partial<Conversation> }>,
): Promise<{ updated: number; errors: string[] }> {
  const errors: string[] = [];
  let updated = 0;

  for (const { id, updates: convUpdates } of updates) {
    try {
      await updateConversation(id, convUpdates);
      updated++;
    } catch (error) {
      errors.push(`Failed to update conversation ${id}: ${error}`);
    }
  }

  return { updated, errors };
}

export function cleanupOldConversations(days: number): Promise<number> {
  return modernStorage.cleanupOldConversations(days);
}

export function exportConversations(): Promise<ExportData> {
  return modernStorage.exportConversations();
}

export function importConversations(
  data: ExportData,
  options: { overwrite?: boolean; merge?: boolean },
): Promise<ImportResult> {
  return modernStorage.importConversations(data, options);
}

// Utility functions for backward compatibility
export async function getConversationById(id: string): Promise<Conversation | null> {
  return getConversation(id);
}

export async function updateConversation(
  id: string,
  updates: Partial<Conversation>,
): Promise<void> {
  const existing = await getConversation(id);
  if (!existing) {
    throw new Error(`Conversation ${id} not found`);
  }

  const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  await saveConversation(updated);
}

export async function toggleFavorite(id: string): Promise<void> {
  const existing = await getConversation(id);
  if (!existing) {
    throw new Error(`Conversation ${id} not found`);
  }

  const updated = {
    ...existing,
    isFavorite: !existing.isFavorite,
    updatedAt: new Date().toISOString(),
  };
  await saveConversation(updated);
}

// Async initialization check
export async function isStorageReady(): Promise<boolean> {
  try {
    await modernStorage.getConversationStats();
    return true;
  } catch (error) {
    console.error("Storage not ready:", error);
    return false;
  }
}

// Migration helper from localStorage
export async function migrateFromLocalStorage(): Promise<{ migrated: number; errors: string[] }> {
  try {
    // Check if localStorage has data
    const localConversations = localStorage.getItem("disa:conversations");
    if (!localConversations) {
      return { migrated: 0, errors: [] };
    }

    const parsed = JSON.parse(localConversations);
    const conversations: Conversation[] = Object.values(parsed);
    const errors: string[] = [];
    let migrated = 0;

    for (const conversation of conversations) {
      try {
        await saveConversation(conversation);
        migrated++;
      } catch (error) {
        errors.push(`Failed to migrate conversation ${conversation.id}: ${error}`);
      }
    }

    // Optionally clear localStorage after successful migration
    if (migrated > 0) {
      localStorage.removeItem("disa:conversations");
      localStorage.removeItem("disa:conversations:metadata");
    }

    return { migrated, errors };
  } catch (error) {
    return { migrated: 0, errors: [`Migration failed: ${error}`] };
  }
}

// Performance monitoring
export async function getStoragePerformance(): Promise<{
  readTime: number;
  writeTime: number;
  totalOperations: number;
}> {
  const start = performance.now();
  await getAllConversations();
  const readTime = performance.now() - start;

  const testConversation: Conversation = {
    id: `perf-test-${Date.now()}`,
    title: "Performance Test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    model: "test",
    messageCount: 0,
  };

  const writeStart = performance.now();
  await saveConversation(testConversation);
  const writeTime = performance.now() - writeStart;

  // Clean up test conversation
  await deleteConversation(testConversation.id);

  return {
    readTime,
    writeTime,
    totalOperations: 2,
  };
}

export async function syncMetadataFromConversations(): Promise<{
  synced: number;
  alreadySynced: number;
  errors: string[];
}> {
  return modernStorage.syncMetadataFromConversations();
}
