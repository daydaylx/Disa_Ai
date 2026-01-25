/* eslint-disable import/no-mutable-exports */
// Modern storage layer using IndexedDB via Dexie
import Dexie from "dexie";

import { schemaMigration } from "./storage-schema-migration";

const isTestEnvironment =
  typeof process !== "undefined" &&
  (process.env?.NODE_ENV === "test" || Boolean(process.env?.VITEST));

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
  model: string;
  messageCount: number;
  messages?: any[];
  isFavorite?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  isPinned?: boolean;
}

export interface ConversationMetadata {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  messageCount: number;
}

export interface ExportData {
  version: string;
  metadata: {
    exportedAt: string;
    totalConversations: number;
    appVersion: string;
  };
  conversations: Conversation[];
}

export interface StorageStats {
  totalConversations: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
  modelsUsed: string[];
  storageSize: number;
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  errors: string[];
}

// Simple Dexie database setup
interface DisaDB extends Dexie {
  conversations: Dexie.Table<Conversation, string>;
  metadata: Dexie.Table<ConversationMetadata, string>;
}

const supportsIndexedDB = (() => {
  try {
    const globalRef = globalThis as any;
    return Boolean(globalRef?.indexedDB || globalRef?.window?.indexedDB);
  } catch {
    return false;
  }
})();

const isDexieMock = (() => {
  const candidate = Dexie as unknown as { _isMockFunction?: boolean; mock?: unknown };
  return Boolean(candidate && (candidate._isMockFunction || candidate.mock));
})();

const persistentStorage = (() => {
  try {
    const globalRef = globalThis as any;
    const storage: Storage | undefined = globalRef?.localStorage ?? globalRef?.sessionStorage;
    if (!storage) return null;
    const testKey = "__disa_storage_probe__";
    storage.setItem(testKey, "ok");
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
})();

const FALLBACK_CONVERSATIONS_KEY = "disa:fallback:conversations";
const FALLBACK_METADATA_KEY = "disa:fallback:metadata";

const fallbackStore = {
  conversations: new Map<string, Conversation>(),
  metadata: new Map<string, ConversationMetadata>(),
};

function loadFallbackStore() {
  if (!persistentStorage) return;
  try {
    const convRaw = persistentStorage.getItem(FALLBACK_CONVERSATIONS_KEY);
    if (convRaw) {
      const parsed = JSON.parse(convRaw) as Record<string, Conversation>;
      Object.entries(parsed).forEach(([id, conv]) => fallbackStore.conversations.set(id, conv));
    }
    const metaRaw = persistentStorage.getItem(FALLBACK_METADATA_KEY);
    if (metaRaw) {
      const parsedMeta = JSON.parse(metaRaw) as Record<string, ConversationMetadata>;
      Object.entries(parsedMeta).forEach(([id, meta]) => fallbackStore.metadata.set(id, meta));
    }
  } catch (error) {
    console.warn("Failed to read fallback conversation storage:", error);
  }
}

function persistFallbackStore() {
  if (!persistentStorage) return;
  try {
    const convObj: Record<string, Conversation> = {};
    fallbackStore.conversations.forEach((value, key) => {
      convObj[key] = value;
    });
    persistentStorage.setItem(FALLBACK_CONVERSATIONS_KEY, JSON.stringify(convObj));

    const metaObj: Record<string, ConversationMetadata> = {};
    fallbackStore.metadata.forEach((value, key) => {
      metaObj[key] = value;
    });
    persistentStorage.setItem(FALLBACK_METADATA_KEY, JSON.stringify(metaObj));
  } catch (error) {
    console.warn("Failed to persist fallback conversation storage:", error);
  }
}

if (persistentStorage) {
  loadFallbackStore();
}

export class ModernStorageLayer {
  private db: DisaDB | null = null;
  private dbInitialized: boolean = false;
  private dbInitializationPromise: Promise<DisaDB | null> | null = null;

  constructor(initialDb?: DisaDB | null) {
    if (initialDb) {
      this.db = initialDb;
      this.dbInitialized = true;
      if (isTestEnvironment) {
        registerModernStorageOverride(this);
      }
      return;
    }
    void this.initializeDB();
  }

  private async initializeDB(): Promise<DisaDB | null> {
    if (this.dbInitialized) {
      return this.db;
    }

    if (this.dbInitializationPromise) {
      return this.dbInitializationPromise;
    }

    this.dbInitializationPromise = this.performDBInitialization();
    const result = await this.dbInitializationPromise;
    this.db = result;
    this.dbInitialized = true;
    return result;
  }

  private async performDBInitialization(): Promise<DisaDB | null> {
    if (!supportsIndexedDB && !isDexieMock) {
      console.warn("[Storage] IndexedDB not available, falling back to memory/localStorage.");
      return null;
    }

    try {
      // Initialize with latest schema version
      const database = new Dexie("DisaAI") as DisaDB;
      const latestVersion = schemaMigration.getLatestVersion();

      // Apply all migrations up to latest version
      database.version(latestVersion).stores({
        conversations:
          "id, title, createdAt, updatedAt, lastActivity, model, messageCount, isFavorite, isArchived, archivedAt, isPinned",
        metadata: "id, title, createdAt, updatedAt, model, messageCount",
      });

      this.db = database;

      // Asynchronously open with proper error handling
      await database.open();

      // Check if migration is needed and apply it
      if (await schemaMigration.needsMigration(database)) {
        console.warn("[Storage] Schema migration required");
        const migrationResult = await schemaMigration.migrate(database);
        if (migrationResult.success) {
          console.warn(
            `[Storage] Schema migration completed: v${migrationResult.fromVersion} � v${migrationResult.toVersion}`,
          );
        } else {
          console.error("[Storage] Schema migration failed:", migrationResult.errors);
        }
      }

      console.warn("[Storage] IndexedDB initialized successfully");
      return database;
    } catch (error) {
      this.db = null;
      console.warn("[Storage] Failed to initialize IndexedDB, falling back to memory:", error);
      return null;
    }
  }

  private async ensureDB(): Promise<DisaDB | null> {
    if (!this.dbInitialized) {
      await this.initializeDB();
    }
    return this.db;
  }

  async getConversationStats(): Promise<StorageStats> {
    const canEstimateStorageUsage =
      typeof navigator !== "undefined" && "storage" in navigator && "estimate" in navigator.storage;

    const db = await this.ensureDB();
    if (!db) {
      const conversations = Array.from(fallbackStore.conversations.values());
      const totalConversations = conversations.length;
      const totalMessages = conversations.reduce(
        (count, conv) => count + (conv.messages?.length ?? 0),
        0,
      );
      const modelsUsed = Array.from(new Set(conversations.map((conv) => conv.model)));
      const averageMessagesPerConversation =
        totalConversations > 0 ? totalMessages / totalConversations : 0;

      let storageSize = 0;
      try {
        storageSize = new Blob([JSON.stringify(conversations)]).size;
      } catch {
        /* ignore */
      }

      if (!canEstimateStorageUsage && totalConversations === 0) {
        storageSize = 0;
      }

      return {
        totalConversations,
        totalMessages,
        averageMessagesPerConversation,
        modelsUsed,
        storageSize,
      };
    }

    try {
      const conversations = await db.conversations.toArray();
      const totalConversations = conversations.length;

      let totalMessages = 0;
      // Use Set for O(1) lookup instead of O(n) array.includes()
      const modelsUsedSet = new Set<string>();

      for (const conversation of conversations) {
        if (conversation.messages) {
          totalMessages += conversation.messages.length;
        }

        if (conversation.model) {
          modelsUsedSet.add(conversation.model);
        }
      }

      const modelsUsed = Array.from(modelsUsedSet);
      const averageMessagesPerConversation =
        totalConversations > 0 ? totalMessages / totalConversations : 0;

      // Estimate storage size
      let storageSize = 0;
      try {
        const data = JSON.stringify(conversations);
        storageSize = new Blob([data]).size;
      } catch (error) {
        console.error("Failed to calculate storage size:", error);
      }

      if (!canEstimateStorageUsage && totalConversations === 0) {
        storageSize = 0;
      }

      return {
        totalConversations,
        totalMessages,
        averageMessagesPerConversation,
        modelsUsed,
        storageSize,
      };
    } catch (error) {
      console.error("Failed to get conversation stats:", error);
      return {
        totalConversations: 0,
        totalMessages: 0,
        averageMessagesPerConversation: 0,
        modelsUsed: [],
        storageSize: 0,
      };
    }
  }

  async getAllConversations(): Promise<ConversationMetadata[]> {
    const db = await this.ensureDB();
    if (!db) {
      return Array.from(fallbackStore.metadata.values()).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    }

    try {
      return await db.metadata.orderBy("updatedAt").reverse().toArray();
    } catch (error) {
      console.error("Failed to get all conversations:", error);
      return [];
    }
  }

  async getConversation(id: string): Promise<Conversation | null> {
    const db = await this.ensureDB();
    if (!db) {
      return fallbackStore.conversations.get(id) ?? null;
    }

    try {
      return (await db.conversations.get(id)) || null;
    } catch (error) {
      console.error(`Failed to get conversation ${id}:`, error);
      return null;
    }
  }

  async saveConversation(conversation: Conversation): Promise<void> {
    const db = await this.ensureDB();
    if (!db) {
      fallbackStore.conversations.set(conversation.id, conversation);
      fallbackStore.metadata.set(conversation.id, {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        model: conversation.model,
        messageCount: conversation.messageCount,
      });
      persistFallbackStore();
      return;
    }

    try {
      await db.transaction("rw", db.conversations, db.metadata, async () => {
        await db.conversations.put(conversation);
        await db.metadata.put({
          id: conversation.id,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          model: conversation.model,
          messageCount: conversation.messageCount,
        });
      });
    } catch (error) {
      console.error(`Failed to save conversation ${conversation.id}:`, error);
      throw error;
    }
  }

  // Exposed for conversation-manager-modern: atomic update by id
  async updateConversation(id: string, updates: Partial<Conversation>): Promise<void> {
    const db = await this.ensureDB();
    const patch: Partial<Conversation> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!db) {
      const existing = fallbackStore.conversations.get(id);
      if (!existing) {
        throw new Error(`Conversation ${id} not found`);
      }
      const merged = { ...existing, ...patch };
      fallbackStore.conversations.set(id, merged);
      fallbackStore.metadata.set(id, {
        id: merged.id,
        title: merged.title,
        createdAt: merged.createdAt,
        updatedAt: merged.updatedAt,
        model: merged.model,
        messageCount: merged.messageCount,
      });
      persistFallbackStore();
      return;
    }

    try {
      await db.transaction("rw", db.conversations, db.metadata, async () => {
        const existing = await db.conversations.get(id);
        if (!existing) {
          throw new Error(`Conversation ${id} not found`);
        }
        const merged: Conversation = { ...existing, ...patch };
        await db.conversations.put(merged);
        await db.metadata.put({
          id: merged.id,
          title: merged.title,
          createdAt: merged.createdAt,
          updatedAt: merged.updatedAt,
          model: merged.model,
          messageCount: merged.messageCount,
        });
      });
    } catch (error) {
      console.error(`Failed to update conversation ${id}:`, error);
      throw error;
    }
  }

  // Exposed for conversation-manager-modern: atomic favorite toggle
  async toggleFavorite(id: string): Promise<void> {
    const db = await this.ensureDB();

    if (!db) {
      const existing = fallbackStore.conversations.get(id);
      if (!existing) {
        throw new Error(`Conversation ${id} not found`);
      }
      const updated: Conversation = {
        ...existing,
        isFavorite: !existing.isFavorite,
        updatedAt: new Date().toISOString(),
      };
      fallbackStore.conversations.set(id, updated);
      const meta = fallbackStore.metadata.get(id);
      if (meta) {
        fallbackStore.metadata.set(id, {
          ...meta,
          updatedAt: updated.updatedAt,
        });
      }
      persistFallbackStore();
      return;
    }

    try {
      await db.transaction("rw", db.conversations, db.metadata, async () => {
        const existing = await db.conversations.get(id);
        if (!existing) {
          throw new Error(`Conversation ${id} not found`);
        }
        const updated: Conversation = {
          ...existing,
          isFavorite: !existing.isFavorite,
          updatedAt: new Date().toISOString(),
        };
        await db.conversations.put(updated);
        await db.metadata.update(id, { updatedAt: updated.updatedAt });
      });
    } catch (error) {
      console.error(`Failed to toggle favorite for conversation ${id}:`, error);
      throw error;
    }
  }

  async searchConversations(query: string): Promise<ConversationMetadata[]> {
    const lowercaseQuery = query.toLowerCase();
    const db = await this.ensureDB();

    if (!db) {
      const all = Array.from(fallbackStore.metadata.values());
      return all.filter(
        (conv) =>
          conv.title.toLowerCase().includes(lowercaseQuery) ||
          conv.model.toLowerCase().includes(lowercaseQuery),
      );
    }

    try {
      const all = await db.metadata.orderBy("updatedAt").reverse().toArray();
      return all.filter(
        (conv) =>
          conv.title.toLowerCase().includes(lowercaseQuery) ||
          conv.model.toLowerCase().includes(lowercaseQuery),
      );
    } catch (error) {
      console.error("Failed to search conversations:", error);
      return [];
    }
  }

  async bulkDeleteConversations(ids: string[]): Promise<{ deleted: number; errors: string[] }> {
    const db = await this.ensureDB();
    const errors: string[] = [];

    if (!db) {
      let deleted = 0;
      for (const id of ids) {
        if (fallbackStore.conversations.delete(id)) {
          fallbackStore.metadata.delete(id);
          deleted++;
        }
      }
      if (deleted > 0) {
        persistFallbackStore();
      }
      return { deleted, errors };
    }

    try {
      await db.transaction("rw", db.conversations, db.metadata, async () => {
        await db.conversations.bulkDelete(ids);
        await db.metadata.bulkDelete(ids);
      });
      return { deleted: ids.length, errors };
    } catch (error) {
      errors.push(String(error));
      console.error("Failed bulk delete conversations:", error);
      return { deleted: 0, errors };
    }
  }

  async bulkUpdateConversations(
    updates: Array<{ id: string; updates: Partial<Conversation> }>,
  ): Promise<{ updated: number; errors: string[] }> {
    const db = await this.ensureDB();
    const errors: string[] = [];

    if (!db) {
      let updated = 0;
      for (const { id, updates: convUpdates } of updates) {
        const existing = fallbackStore.conversations.get(id);
        if (!existing) {
          errors.push(`Conversation ${id} not found`);
          continue;
        }
        const merged: Conversation = {
          ...existing,
          ...convUpdates,
          updatedAt: new Date().toISOString(),
        };
        fallbackStore.conversations.set(id, merged);
        fallbackStore.metadata.set(id, {
          id: merged.id,
          title: merged.title,
          createdAt: merged.createdAt,
          updatedAt: merged.updatedAt,
          model: merged.model,
          messageCount: merged.messageCount,
        });
        updated++;
      }
      if (updated > 0) {
        persistFallbackStore();
      }
      return { updated, errors };
    }

    try {
      await db.transaction("rw", db.conversations, db.metadata, async () => {
        for (const { id, updates: convUpdates } of updates) {
          const existing = await db.conversations.get(id);
          if (!existing) {
            errors.push(`Conversation ${id} not found`);
            continue;
          }
          const merged: Conversation = {
            ...existing,
            ...convUpdates,
            updatedAt: new Date().toISOString(),
          };
          await db.conversations.put(merged);
          await db.metadata.put({
            id: merged.id,
            title: merged.title,
            createdAt: merged.createdAt,
            updatedAt: merged.updatedAt,
            model: merged.model,
            messageCount: merged.messageCount,
          });
        }
      });
      const successful = updates.length - errors.length;
      return { updated: successful, errors };
    } catch (error) {
      errors.push(String(error));
      console.error("Failed bulk update conversations:", error);
      return { updated: 0, errors };
    }
  }

  async deleteConversation(id: string): Promise<void> {
    const db = await this.ensureDB();
    if (!db) {
      fallbackStore.conversations.delete(id);
      fallbackStore.metadata.delete(id);
      persistFallbackStore();
      return;
    }

    try {
      await db.transaction("rw", db.conversations, db.metadata, async () => {
        await db.conversations.delete(id);
        await db.metadata.delete(id);
      });
    } catch (error) {
      console.error(`Failed to delete conversation ${id}:`, error);
      throw error;
    }
  }

  async cleanupOldConversations(days: number): Promise<number> {
    const db = await this.ensureDB();
    if (!db) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const idsToDelete: string[] = [];
      fallbackStore.conversations.forEach((conv, id) => {
        const lastActivity = conv.lastActivity || conv.updatedAt;
        if (new Date(lastActivity) < cutoffDate) {
          idsToDelete.push(id);
        }
      });

      idsToDelete.forEach((id) => {
        fallbackStore.conversations.delete(id);
        fallbackStore.metadata.delete(id);
      });
      if (idsToDelete.length > 0) {
        persistFallbackStore();
      }
      return idsToDelete.length;
    }

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const oldConversations = await db.conversations
        .filter((conv) => {
          const lastActivity = conv.lastActivity || conv.updatedAt;
          return new Date(lastActivity) < cutoffDate;
        })
        .toArray();

      const idsToDelete = oldConversations.map((conv) => conv.id);

      if (idsToDelete.length > 0) {
        await db.transaction("rw", db.conversations, db.metadata, async () => {
          await db.conversations.bulkDelete(idsToDelete);
          await db.metadata.bulkDelete(idsToDelete);
        });
      }

      return idsToDelete.length;
    } catch (error) {
      console.error("Failed to cleanup old conversations:", error);
      return 0;
    }
  }

  async exportConversations(): Promise<ExportData> {
    const db = await this.ensureDB();
    if (!db) {
      const conversations = Array.from(fallbackStore.conversations.values());
      return {
        version: "2.0",
        metadata: {
          exportedAt: new Date().toISOString(),
          totalConversations: conversations.length,
          appVersion: "2.0.0",
        },
        conversations,
      };
    }

    try {
      const conversations = await db.conversations.toArray();

      return {
        version: "2.0",
        metadata: {
          exportedAt: new Date().toISOString(),
          totalConversations: conversations.length,
          appVersion: "2.0.0",
        },
        conversations,
      };
    } catch (error) {
      console.error("Failed to export conversations:", error);
      return {
        version: "2.0",
        metadata: {
          exportedAt: new Date().toISOString(),
          totalConversations: 0,
          appVersion: "2.0.0",
        },
        conversations: [],
      };
    }
  }

  async importConversations(
    data: ExportData,
    options: { overwrite?: boolean; merge?: boolean },
  ): Promise<ImportResult> {
    const db = await this.ensureDB();
    if (!db) {
      let importedCount = 0;
      const errors: string[] = [];

      for (const conversation of data.conversations) {
        try {
          const exists = fallbackStore.conversations.get(conversation.id);
          if (exists && !options.overwrite && !options.merge) {
            continue;
          }
          fallbackStore.conversations.set(conversation.id, conversation);
          fallbackStore.metadata.set(conversation.id, {
            id: conversation.id,
            title: conversation.title,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            model: conversation.model,
            messageCount: conversation.messageCount,
          });
          importedCount++;
        } catch (error) {
          errors.push(`Failed to import conversation ${conversation.id}: ${error}`);
        }
      }

      if (importedCount > 0) {
        persistFallbackStore();
      }

      return {
        success: errors.length === 0,
        importedCount,
        errors,
      };
    }

    try {
      let importedCount = 0;
      const errors: string[] = [];

      await db.transaction("rw", db.conversations, db.metadata, async () => {
        for (const conversation of data.conversations) {
          try {
            const exists = await db.conversations.get(conversation.id);

            if (exists && !options.overwrite && !options.merge) {
              continue; // Skip existing conversations
            }

            // Save conversation
            await db.conversations.put(conversation);

            // Save metadata
            await db.metadata.put({
              id: conversation.id,
              title: conversation.title,
              createdAt: conversation.createdAt,
              updatedAt: conversation.updatedAt,
              model: conversation.model,
              messageCount: conversation.messageCount,
            });

            importedCount++;
          } catch (error) {
            errors.push(`Failed to import conversation ${conversation.id}: ${error}`);
          }
        }
      });

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

  async clearAllData(): Promise<void> {
    const db = await this.ensureDB();
    if (!db) {
      fallbackStore.conversations.clear();
      fallbackStore.metadata.clear();
      persistFallbackStore();
      return;
    }

    try {
      await db.transaction("rw", db.conversations, db.metadata, async () => {
        await db.conversations.clear();
        await db.metadata.clear();
      });
    } catch (error) {
      console.error("Failed to clear all data:", error);
      throw error;
    }
  }

  async getStorageUsage(): Promise<{ used: number; quota: number }> {
    const db = await this.ensureDB();
    if (!db) {
      try {
        const data = JSON.stringify(Array.from(fallbackStore.conversations.values()));
        return {
          used: new Blob([data]).size,
          quota: persistentStorage ? 5 * 1024 * 1024 : 0, // assume 5MB if localStorage exists
        };
      } catch {
        return { used: 0, quota: persistentStorage ? 5 * 1024 * 1024 : 0 };
      }
    }

    if (
      typeof navigator !== "undefined" &&
      "storage" in navigator &&
      "estimate" in navigator.storage
    ) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0,
        };
      } catch (error) {
        console.error("Failed to get storage usage:", error);
      }
    }

    return { used: 0, quota: 0 };
  }

  async syncMetadataFromConversations(): Promise<{
    synced: number;
    alreadySynced: number;
    errors: string[];
  }> {
    const db = await this.ensureDB();
    const result = {
      synced: 0,
      alreadySynced: 0,
      errors: [] as string[],
    };

    if (!db) {
      const conversationIds = new Set(fallbackStore.conversations.keys());
      const metadataIds = new Set(fallbackStore.metadata.keys());

      for (const id of conversationIds) {
        if (metadataIds.has(id)) {
          result.alreadySynced++;
          continue;
        }

        const conversation = fallbackStore.conversations.get(id);
        if (!conversation) continue;

        try {
          fallbackStore.metadata.set(id, {
            id: conversation.id,
            title: conversation.title,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            model: conversation.model,
            messageCount: conversation.messageCount,
          });
          result.synced++;
        } catch (error) {
          result.errors.push(`Failed to sync metadata for conversation ${id}: ${error}`);
        }
      }

      if (result.synced > 0) {
        persistFallbackStore();
      }

      return result;
    }

    try {
      const conversations = await db.conversations.toArray();
      const existingMetadata = await db.metadata.toArray();
      const existingMetadataIds = new Set(existingMetadata.map((m) => m.id));

      const missingMetadata: ConversationMetadata[] = [];

      for (const conversation of conversations) {
        if (existingMetadataIds.has(conversation.id)) {
          result.alreadySynced++;
          continue;
        }

        missingMetadata.push({
          id: conversation.id,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          model: conversation.model,
          messageCount: conversation.messageCount,
        });
      }

      if (missingMetadata.length > 0) {
        await db.transaction("rw", db.metadata, async () => {
          for (const metadata of missingMetadata) {
            try {
              await db.metadata.put(metadata);
              result.synced++;
            } catch (error) {
              result.errors.push(`Failed to sync metadata for ${metadata.id}: ${error}`);
            }
          }
        });

        console.warn(
          `[Storage] Synced ${result.synced} missing metadata entries from conversations table`,
        );
      }

      return result;
    } catch (error) {
      console.error("Failed to sync metadata from conversations:", error);
      result.errors.push(`Sync failed: ${error}`);
      return result;
    }
  }
}

let modernStorageInstance = new ModernStorageLayer();

export function setModernStorageInstance(instance: ModernStorageLayer): void {
  modernStorageInstance = instance;
}

export function getModernStorageInstance(): ModernStorageLayer {
  return modernStorageInstance;
}

function registerModernStorageOverride(instance: ModernStorageLayer): void {
  setModernStorageInstance(instance);
}

// Export singleton instance (needs to stay mutable for Vitest overrides)
export { modernStorageInstance as modernStorage };
