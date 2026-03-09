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

export async function syncMetadataFromConversations(): Promise<{
  synced: number;
  alreadySynced: number;
  errors: string[];
}> {
  return modernStorage.syncMetadataFromConversations();
}
