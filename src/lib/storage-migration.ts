// Migration utility for transitioning from localStorage to IndexedDB
import { modernStorage } from './storage-layer';
import type { Conversation } from './storage-layer';

export interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: string[];
  warnings: string[];
  duration: number;
}

export interface MigrationOptions {
  clearLocalStorageAfterSuccess?: boolean;
  validateData?: boolean;
  batchSize?: number;
  skipOnError?: boolean;
}

export class StorageMigration {
  private static instance: StorageMigration;
  private migrationInProgress = false;

  static getInstance(): StorageMigration {
    if (!StorageMigration.instance) {
      StorageMigration.instance = new StorageMigration();
    }
    return StorageMigration.instance;
  }

  async checkMigrationStatus(): Promise<{
    hasLocalStorageData: boolean;
    hasIndexedDBData: boolean;
    needsMigration: boolean;
  }> {
    try {
      // Check localStorage
      const localConversations = localStorage.getItem('disa:conversations');
      const localMetadata = localStorage.getItem('disa:conversations:metadata');
      const hasLocalStorageData = !!(localConversations && localMetadata);

      // Check IndexedDB
      const indexedDBData = await modernStorage.getAllConversations();
      const hasIndexedDBData = indexedDBData.length > 0;

      return {
        hasLocalStorageData,
        hasIndexedDBData,
        needsMigration: hasLocalStorageData && !hasIndexedDBData
      };
    } catch (error) {
      console.error('Failed to check migration status:', error);
      return {
        hasLocalStorageData: false,
        hasIndexedDBData: false,
        needsMigration: false
      };
    }
  }

  async migrateFromLocalStorage(options: MigrationOptions = {}): Promise<MigrationResult> {
    if (this.migrationInProgress) {
      throw new Error('Migration is already in progress');
    }

    const {
      clearLocalStorageAfterSuccess = true,
      validateData = true,
      batchSize = 50,
      skipOnError = false
    } = options;

    const startTime = Date.now();
    this.migrationInProgress = true;

    try {
      const result: MigrationResult = {
        success: false,
        migratedCount: 0,
        errors: [],
        warnings: [],
        duration: 0
      };

      // Check if there's data to migrate
      const localConversations = localStorage.getItem('disa:conversations');
      const localMetadata = localStorage.getItem('disa:conversations:metadata');

      if (!localConversations || !localMetadata) {
        result.warnings.push('No localStorage data found to migrate');
        result.success = true;
        return result;
      }

      // Parse localStorage data
      let conversations: Conversation[] = [];
      try {
        const parsedConversations = JSON.parse(localConversations);
        conversations = Object.values(parsedConversations);
      } catch (error) {
        result.errors.push(`Failed to parse localStorage conversations: ${error}`);
        return result;
      }

      if (conversations.length === 0) {
        result.warnings.push('No conversations found in localStorage');
        result.success = true;
        return result;
      }

      // Validate data if requested
      if (validateData) {
        const validationErrors = this.validateConversations(conversations);
        if (validationErrors.length > 0) {
          result.warnings.push(...validationErrors);
        }
      }

      // Migrate in batches
      const totalBatches = Math.ceil(conversations.length / batchSize);
      
      for (let i = 0; i < totalBatches; i++) {
        const batch = conversations.slice(i * batchSize, (i + 1) * batchSize);
        
        try {
          await this.migrateBatch(batch);
          result.migratedCount += batch.length;
        } catch (error) {
          const errorMsg = `Failed to migrate batch ${i + 1}/${totalBatches}: ${error}`;
          result.errors.push(errorMsg);
          
          if (!skipOnError) {
            throw new Error(errorMsg);
          }
        }
      }

      // Clear localStorage if migration was successful
      if (result.migratedCount > 0 && clearLocalStorageAfterSuccess) {
        try {
          localStorage.removeItem('disa:conversations');
          localStorage.removeItem('disa:conversations:metadata');
        } catch (error) {
          result.warnings.push(`Failed to clear localStorage: ${error}`);
        }
      }

      result.success = result.errors.length === 0;
      result.duration = Date.now() - startTime;

      return result;
    } finally {
      this.migrationInProgress = false;
    }
  }

  private async migrateBatch(conversations: Conversation[]): Promise<void> {
    for (const conversation of conversations) {
      try {
        await modernStorage.saveConversation(conversation);
      } catch (error) {
        throw new Error(`Failed to save conversation ${conversation.id}: ${error}`);
      }
    }
  }

  private validateConversations(conversations: Conversation[]): string[] {
    const warnings: string[] = [];

    for (const conversation of conversations) {
      // Check required fields
      if (!conversation.id) {
        warnings.push(`Conversation missing ID`);
        continue;
      }

      if (!conversation.title) {
        warnings.push(`Conversation ${conversation.id} missing title`);
      }

      if (!conversation.createdAt) {
        warnings.push(`Conversation ${conversation.id} missing createdAt`);
      }

      if (!conversation.updatedAt) {
        warnings.push(`Conversation ${conversation.id} missing updatedAt`);
      }

      if (!conversation.model) {
        warnings.push(`Conversation ${conversation.id} missing model`);
      }

      // Check date validity
      try {
        new Date(conversation.createdAt);
        new Date(conversation.updatedAt);
      } catch (error) {
        warnings.push(`Conversation ${conversation.id} has invalid dates`);
      }

      // Check message count consistency
      if (conversation.messages && conversation.messageCount !== conversation.messages.length) {
        warnings.push(
          `Conversation ${conversation.id} has inconsistent message count: ` +
          `stored ${conversation.messageCount}, actual ${conversation.messages.length}`
        );
      }
    }

    return warnings;
  }

  async estimateMigrationTime(): Promise<{
    estimatedDuration: number;
    conversationCount: number;
    estimatedSize: number;
  }> {
    try {
      const localConversations = localStorage.getItem('disa:conversations');
      if (!localConversations) {
        return {
          estimatedDuration: 0,
          conversationCount: 0,
          estimatedSize: 0
        };
      }

      const conversations = Object.values(JSON.parse(localConversations));
      const conversationCount = conversations.length;
      
      // Estimate size in bytes
      const estimatedSize = new Blob([localConversations]).size;
      
      // Estimate duration (rough calculation: ~10ms per conversation + size factor)
      const estimatedDuration = (conversationCount * 10) + (estimatedSize / 1000);

      return {
        estimatedDuration,
        conversationCount,
        estimatedSize
      };
    } catch (error) {
      console.error('Failed to estimate migration time:', error);
      return {
        estimatedDuration: 0,
        conversationCount: 0,
        estimatedSize: 0
      };
    }
  }

  async createBackup(): Promise<string | null> {
    try {
      const localConversations = localStorage.getItem('disa:conversations');
      const localMetadata = localStorage.getItem('disa:conversations:metadata');

      if (!localConversations || !localMetadata) {
        return null;
      }

      const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        conversations: JSON.parse(localConversations),
        metadata: JSON.parse(localMetadata)
      };

      return JSON.stringify(backup, null, 2);
    } catch (error) {
      console.error('Failed to create backup:', error);
      return null;
    }
  }

  async restoreFromBackup(backupData: string): Promise<MigrationResult> {
    const startTime = Date.now();
    
    try {
      const backup = JSON.parse(backupData);
      const result: MigrationResult = {
        success: false,
        migratedCount: 0,
        errors: [],
        warnings: [],
        duration: 0
      };

      if (!backup.conversations || !backup.metadata) {
        result.errors.push('Invalid backup format');
        return result;
      }

      const conversations: Conversation[] = Object.values(backup.conversations);
      
      // Validate backup data
      const validationErrors = this.validateConversations(conversations);
      if (validationErrors.length > 0) {
        result.warnings.push(...validationErrors);
      }

      // Migrate conversations
      for (const conversation of conversations) {
        try {
          await modernStorage.saveConversation(conversation);
          result.migratedCount++;
        } catch (error) {
          result.errors.push(`Failed to restore conversation ${conversation.id}: ${error}`);
        }
      }

      result.success = result.errors.length === 0;
      result.duration = Date.now() - startTime;

      return result;
    } catch (error) {
      return {
        success: false,
        migratedCount: 0,
        errors: [`Failed to parse backup: ${error}`],
        warnings: [],
        duration: Date.now() - startTime
      };
    }
  }

  isMigrationInProgress(): boolean {
    return this.migrationInProgress;
  }
}

// Export singleton instance
export const storageMigration = StorageMigration.getInstance();