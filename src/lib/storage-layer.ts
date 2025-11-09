// Modern storage layer using IndexedDB via Dexie
import Dexie from 'dexie';

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

const db = new Dexie('DisaAI') as DisaDB;

// Define schema
db.version(1).stores({
  conversations: 'id, title, createdAt, updatedAt, lastActivity, model, messageCount, isFavorite',
  metadata: 'id, title, createdAt, updatedAt, model, messageCount'
});

// Initialize database
db.open().catch(err => {
  console.error('Failed to open IndexedDB:', err);
});

export class ModernStorageLayer {
  private db: DisaDB;

  constructor() {
    this.db = db;
  }

  async getConversationStats(): Promise<StorageStats> {
    try {
      const conversations = await this.db.conversations.toArray();
      const totalConversations = conversations.length;
      
      let totalMessages = 0;
      const modelsUsed: string[] = [];
      
      for (const conversation of conversations) {
        if (conversation.messages) {
          totalMessages += conversation.messages.length;
        }
        
        if (!modelsUsed.includes(conversation.model)) {
          modelsUsed.push(conversation.model);
        }
      }
      
      const averageMessagesPerConversation = 
        totalConversations > 0 ? totalMessages / totalConversations : 0;
      
      // Estimate storage size
      let storageSize = 0;
      try {
        const data = JSON.stringify(conversations);
        storageSize = new Blob([data]).size;
      } catch (error) {
        console.error('Failed to calculate storage size:', error);
      }
      
      return {
        totalConversations,
        totalMessages,
        averageMessagesPerConversation,
        modelsUsed,
        storageSize
      };
    } catch (error) {
      console.error('Failed to get conversation stats:', error);
      return {
        totalConversations: 0,
        totalMessages: 0,
        averageMessagesPerConversation: 0,
        modelsUsed: [],
        storageSize: 0
      };
    }
  }

  async getAllConversations(): Promise<ConversationMetadata[]> {
    try {
      return await this.db.metadata
        .orderBy('updatedAt')
        .reverse()
        .toArray();
    } catch (error) {
      console.error('Failed to get all conversations:', error);
      return [];
    }
  }

  async getConversation(id: string): Promise<Conversation | null> {
    try {
      return await this.db.conversations.get(id) || null;
    } catch (error) {
      console.error(`Failed to get conversation ${id}:`, error);
      return null;
    }
  }

  async saveConversation(conversation: Conversation): Promise<void> {
    try {
      await this.db.transaction('rw', this.db.conversations, this.db.metadata, async () => {
        // Save full conversation
        await this.db.conversations.put(conversation);
        
        // Save metadata
        await this.db.metadata.put({
          id: conversation.id,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          model: conversation.model,
          messageCount: conversation.messageCount
        });
      });
    } catch (error) {
      console.error(`Failed to save conversation ${conversation.id}:`, error);
      throw error;
    }
  }

  async deleteConversation(id: string): Promise<void> {
    try {
      await this.db.transaction('rw', this.db.conversations, this.db.metadata, async () => {
        await this.db.conversations.delete(id);
        await this.db.metadata.delete(id);
      });
    } catch (error) {
      console.error(`Failed to delete conversation ${id}:`, error);
      throw error;
    }
  }

  async cleanupOldConversations(days: number): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const oldConversations = await this.db.conversations
        .filter(conv => {
          const lastActivity = conv.lastActivity || conv.updatedAt;
          return new Date(lastActivity) < cutoffDate;
        })
        .toArray();
      
      const idsToDelete = oldConversations.map(conv => conv.id);
      
      if (idsToDelete.length > 0) {
        await this.db.transaction('rw', this.db.conversations, this.db.metadata, async () => {
          await this.db.conversations.bulkDelete(idsToDelete);
          await this.db.metadata.bulkDelete(idsToDelete);
        });
      }
      
      return idsToDelete.length;
    } catch (error) {
      console.error('Failed to cleanup old conversations:', error);
      return 0;
    }
  }

  async exportConversations(): Promise<ExportData> {
    try {
      const conversations = await this.db.conversations.toArray();
      
      return {
        version: '2.0',
        metadata: {
          exportedAt: new Date().toISOString(),
          totalConversations: conversations.length,
          appVersion: '2.0.0'
        },
        conversations
      };
    } catch (error) {
      console.error('Failed to export conversations:', error);
      return {
        version: '2.0',
        metadata: {
          exportedAt: new Date().toISOString(),
          totalConversations: 0,
          appVersion: '2.0.0'
        },
        conversations: []
      };
    }
  }

  async importConversations(
    data: ExportData,
    options: { overwrite?: boolean; merge?: boolean }
  ): Promise<ImportResult> {
    try {
      let importedCount = 0;
      const errors: string[] = [];
      
      await this.db.transaction('rw', this.db.conversations, this.db.metadata, async () => {
        for (const conversation of data.conversations) {
          try {
            const exists = await this.db.conversations.get(conversation.id);
            
            if (exists && !options.overwrite && !options.merge) {
              continue; // Skip existing conversations
            }
            
            // Save conversation
            await this.db.conversations.put(conversation);
            
            // Save metadata
            await this.db.metadata.put({
              id: conversation.id,
              title: conversation.title,
              createdAt: conversation.createdAt,
              updatedAt: conversation.updatedAt,
              model: conversation.model,
              messageCount: conversation.messageCount
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
        errors
      };
    } catch (error) {
      console.error('Failed to import conversations:', error);
      return {
        success: false,
        importedCount: 0,
        errors: [`Failed to import conversations: ${error}`]
      };
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await this.db.transaction('rw', this.db.conversations, this.db.metadata, async () => {
        await this.db.conversations.clear();
        await this.db.metadata.clear();
      });
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }

  async getStorageUsage(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0
        };
      } catch (error) {
        console.error('Failed to get storage usage:', error);
      }
    }
    
    return { used: 0, quota: 0 };
  }
}

// Export singleton instance
export const modernStorage = new ModernStorageLayer();