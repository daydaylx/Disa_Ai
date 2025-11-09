// Conversation manager with dual storage support (localStorage + IndexedDB)
// This file provides backward compatibility while allowing migration to modern storage
import {
  getAllConversations as getAllModern,
  getConversation as getConversationFromModern,
  getConversationStats as getModernStats,
} from "./conversation-manager-modern";
import type { Conversation, ConversationMetadata, ExportData } from "./storage-layer";
import { modernStorage } from "./storage-layer";

// Legacy localStorage implementation for fallback
const CONVERSATIONS_KEY = "disa:conversations";
const CONVERSATIONS_METADATA_KEY = "disa:conversations:metadata";

function getStoredConversations(): Record<string, Conversation> {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to parse conversations from localStorage:", error);
    return {};
  }
}

function getStoredMetadata(): Record<string, ConversationMetadata> {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_METADATA_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to parse conversation metadata from localStorage:", error);
    return {};
  }
}

function saveStoredConversations(conversations: Record<string, Conversation>): void {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error("Failed to save conversations to localStorage:", error);
  }
}

function saveStoredMetadata(metadata: Record<string, ConversationMetadata>): void {
  try {
    localStorage.setItem(CONVERSATIONS_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error("Failed to save conversation metadata to localStorage:", error);
  }
}

// Storage layer detection and migration
let useModernStorage = false;

async function initializeStorageLayer(): Promise<boolean> {
  try {
    // Try to use modern storage (IndexedDB)
    await modernStorage.getConversationStats();
    useModernStorage = true;
    console.warn("Using modern IndexedDB storage layer");
    return true;
  } catch (error) {
    console.warn("Modern storage layer unavailable, falling back to localStorage:", error);
    useModernStorage = false;
    return false;
  }
}

// Initialize on module load
void initializeStorageLayer();

// Modern storage layer functions (async)
async function getModernConversationStats() {
  return await getModernStats();
}

async function getAllModernConversations() {
  return await getAllModern();
}

async function getModernConversation(id: string) {
  return await getConversationFromModern(id);
}

async function saveModernConversation(conversation: Conversation) {
  return await modernStorage.saveConversation(conversation);
}

async function deleteModernConversation(id: string) {
  return await modernStorage.deleteConversation(id);
}

async function cleanupOldModernConversations(days: number) {
  return await modernStorage.cleanupOldConversations(days);
}

async function exportModernConversations() {
  return await modernStorage.exportConversations();
}

async function importModernConversations(
  data: ExportData,
  options: { overwrite?: boolean; merge?: boolean },
) {
  return await modernStorage.importConversations(data, options);
}

// Legacy localStorage functions (sync)
function getLegacyConversationStats() {
  const conversations = getStoredConversations();

  const conversationIds = Object.keys(conversations);
  const totalConversations = conversationIds.length;

  let totalMessages = 0;
  const modelsUsed: string[] = [];
  let storageSize = 0;

  for (const conversation of Object.values(conversations)) {
    if (conversation.messages) {
      totalMessages += conversation.messages.length;
    }

    if (!modelsUsed.includes(conversation.model)) {
      modelsUsed.push(conversation.model);
    }
  }

  // Estimate storage size (rough approximation)
  try {
    storageSize = new Blob([JSON.stringify(conversations)]).size;
  } catch (error) {
    console.error("Failed to calculate storage size:", error);
  }

  const averageMessagesPerConversation =
    totalConversations > 0 ? totalMessages / totalConversations : 0;

  return {
    totalConversations,
    totalMessages,
    averageMessagesPerConversation,
    modelsUsed,
    storageSize,
  };
}

function getAllLegacyConversations(): ConversationMetadata[] {
  const metadata = getStoredMetadata();
  return Object.values(metadata).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

function getLegacyConversation(id: string): Conversation | null {
  const conversations = getStoredConversations();
  return conversations[id] || null;
}

function saveLegacyConversation(conversation: Conversation): void {
  try {
    const conversations = getStoredConversations();
    const metadata = getStoredMetadata();

    // Save full conversation
    conversations[conversation.id] = conversation;

    // Save metadata
    metadata[conversation.id] = {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      model: conversation.model,
      messageCount: conversation.messageCount,
    };

    saveStoredConversations(conversations);
    saveStoredMetadata(metadata);
  } catch (error) {
    console.error(`Failed to save conversation ${conversation.id}:`, error);
  }
}

function deleteLegacyConversation(id: string): void {
  try {
    const conversations = getStoredConversations();
    const metadata = getStoredMetadata();

    delete conversations[id];
    delete metadata[id];

    saveStoredConversations(conversations);
    saveStoredMetadata(metadata);
  } catch (error) {
    console.error(`Failed to delete conversation ${id}:`, error);
  }
}

function cleanupOldLegacyConversations(days: number): number {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const conversations = getStoredConversations();
    const metadata = getStoredMetadata();
    let deletedCount = 0;

    for (const [id, conversation] of Object.entries(conversations)) {
      const lastActivity = conversation.lastActivity || conversation.updatedAt;
      const conversationDate = new Date(lastActivity);

      if (conversationDate < cutoffDate) {
        delete conversations[id];
        delete metadata[id];
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      saveStoredConversations(conversations);
      saveStoredMetadata(metadata);
    }

    return deletedCount;
  } catch (error) {
    console.error(`Failed to cleanup old conversations:`, error);
    return 0;
  }
}

function exportLegacyConversations(): ExportData {
  try {
    const conversations = getStoredConversations();
    const conversationList = Object.values(conversations);

    return {
      version: "1.0",
      metadata: {
        exportedAt: new Date().toISOString(),
        totalConversations: conversationList.length,
        appVersion: "1.0.0",
      },
      conversations: conversationList,
    };
  } catch (error) {
    console.error("Failed to export conversations:", error);
    return {
      version: "1.0",
      metadata: {
        exportedAt: new Date().toISOString(),
        totalConversations: 0,
        appVersion: "1.0.0",
      },
      conversations: [],
    };
  }
}

function importLegacyConversations(
  data: ExportData,
  options: { overwrite?: boolean; merge?: boolean },
) {
  try {
    const conversations = getStoredConversations();
    const metadata = getStoredMetadata();
    let importedCount = 0;
    const errors: string[] = [];

    for (const conversation of data.conversations) {
      try {
        // Check if conversation already exists
        const exists = !!conversations[conversation.id];

        if (exists && !options.overwrite && !options.merge) {
          continue; // Skip existing conversations
        }

        // Save conversation
        conversations[conversation.id] = conversation;
        metadata[conversation.id] = {
          id: conversation.id,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          model: conversation.model,
          messageCount: conversation.messageCount,
        };

        importedCount++;
      } catch (error) {
        errors.push(`Failed to import conversation ${conversation.id}: ${error}`);
      }
    }

    if (importedCount > 0) {
      saveStoredConversations(conversations);
      saveStoredMetadata(metadata);
    }

    return {
      success: errors.length === 0,
      importedCount,
      errors,
    };
  } catch (error) {
    console.error("Failed to import conversations:", error);
    return {
      success: false,
      importedCount: 0,
      errors: [`Failed to import conversations: ${error}`],
    };
  }
}

// Unified API that automatically uses the best available storage layer
export async function getConversationStats() {
  if (useModernStorage) {
    return await getModernConversationStats();
  } else {
    return getLegacyConversationStats();
  }
}

export async function getAllConversations(): Promise<ConversationMetadata[]> {
  if (useModernStorage) {
    return await getAllModernConversations();
  } else {
    return getAllLegacyConversations();
  }
}

export async function getConversation(id: string): Promise<Conversation | null> {
  if (useModernStorage) {
    return await getModernConversation(id);
  } else {
    return getLegacyConversation(id);
  }
}

export async function saveConversation(conversation: Conversation): Promise<void> {
  if (useModernStorage) {
    return await saveModernConversation(conversation);
  } else {
    return saveLegacyConversation(conversation);
  }
}

export async function deleteConversation(id: string): Promise<void> {
  if (useModernStorage) {
    return await deleteModernConversation(id);
  } else {
    return deleteLegacyConversation(id);
  }
}

export async function cleanupOldConversations(days: number): Promise<number> {
  if (useModernStorage) {
    return await cleanupOldModernConversations(days);
  } else {
    return cleanupOldLegacyConversations(days);
  }
}

export async function exportConversations(): Promise<ExportData> {
  if (useModernStorage) {
    return await exportModernConversations();
  } else {
    return exportLegacyConversations();
  }
}

export async function importConversations(
  data: ExportData,
  options: { overwrite?: boolean; merge?: boolean },
) {
  if (useModernStorage) {
    return await importModernConversations(data, options);
  } else {
    return importLegacyConversations(data, options);
  }
}

// Utility functions for storage layer management
export async function forceModernStorage(): Promise<boolean> {
  useModernStorage = await initializeStorageLayer();
  return useModernStorage;
}

export function forceLegacyStorage(): void {
  useModernStorage = false;
}

export function isUsingModernStorage(): boolean {
  return useModernStorage;
}

export async function migrateToModernStorage(): Promise<{ migrated: number; errors: string[] }> {
  if (useModernStorage) {
    return { migrated: 0, errors: [] };
  }

  try {
    const legacyConversations = getStoredConversations();
    const conversations = Object.values(legacyConversations);
    const errors: string[] = [];
    let migrated = 0;

    for (const conversation of conversations) {
      try {
        await saveModernConversation(conversation);
        migrated++;
      } catch (error) {
        errors.push(`Failed to migrate conversation ${conversation.id}: ${error}`);
      }
    }

    if (migrated > 0) {
      useModernStorage = true;
    }

    return { migrated, errors };
  } catch (error) {
    return { migrated: 0, errors: [`Migration failed: ${error}`] };
  }
}
