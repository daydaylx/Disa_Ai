// Migration utility for transitioning from localStorage to IndexedDB
import type { Conversation } from "./storage-layer";
import { modernStorage } from "./storage-layer";
import { safeError, safeInfo } from "./utils/production-logger";

export interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: string[];
  warnings: string[];
  duration: number;
}

export interface MigrationProgress {
  current: number;
  total: number;
  percentage: number;
  batch: number;
  totalBatches: number;
}

export interface MigrationOptions {
  clearLocalStorageAfterSuccess?: boolean;
  validateData?: boolean;
  batchSize?: number;
  skipOnError?: boolean;
  onProgress?: (progress: MigrationProgress) => void;
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
      const localConversations = localStorage.getItem("disa:conversations");
      const localMetadata = localStorage.getItem("disa:conversations:metadata");
      const hasLocalStorageData = !!(localConversations && localMetadata);

      // Check IndexedDB
      const indexedDBData = await modernStorage.getAllConversations();
      const hasIndexedDBData = indexedDBData.length > 0;

      return {
        hasLocalStorageData,
        hasIndexedDBData,
        needsMigration: hasLocalStorageData && !hasIndexedDBData,
      };
    } catch (error) {
      console.error("Failed to check migration status:", error);
      return {
        hasLocalStorageData: false,
        hasIndexedDBData: false,
        needsMigration: false,
      };
    }
  }

  async migrateFromLocalStorage(options: MigrationOptions = {}): Promise<MigrationResult> {
    if (this.migrationInProgress) {
      return Promise.reject(new Error("Migration is already in progress"));
    }

    const migrationPromise = (async () => {
      const {
        clearLocalStorageAfterSuccess = true,
        validateData = true,
        batchSize = 50,
        skipOnError = false,
        onProgress,
      } = options;

      const startTime = Date.now();
      this.migrationInProgress = true;
      await Promise.resolve();

      try {
        const result: MigrationResult = {
          success: false,
          migratedCount: 0,
          errors: [],
          warnings: [],
          duration: 0,
        };

        // Check if there's data to migrate
        const localConversations = localStorage.getItem("disa:conversations");

        if (!localConversations) {
          result.warnings.push("No localStorage data found to migrate");
          result.success = true;
          result.duration = Date.now() - startTime;
          return result;
        }

        // Parse localStorage data
        let conversations: Conversation[] = [];
        try {
          const parsedConversations = JSON.parse(localConversations);
          conversations = Object.values(parsedConversations) as Conversation[];
        } catch (error) {
          safeError("Failed to parse localStorage conversations:", error);
          result.errors.push(`Failed to parse localStorage conversations: ${error}`);
          result.duration = Date.now() - startTime;
          return result;
        }

        if (conversations.length === 0) {
          result.warnings.push("No conversations found in localStorage");
          result.success = true;
          result.duration = Date.now() - startTime;
          return result;
        }

        // Validate data if requested
        if (validateData) {
          const validationErrors = this.validateConversations(conversations, {
            skipMessageCountCheck: true,
          });
          if (validationErrors.length > 0) {
            result.warnings.push(...validationErrors);
          }
        }

        // Migrate in batches
        const totalBatches = Math.ceil(conversations.length / batchSize);
        let abortMigration = false;

        for (let i = 0; i < totalBatches && !abortMigration; i++) {
          const batch = conversations.slice(i * batchSize, (i + 1) * batchSize);

          try {
            await this.migrateBatch(batch);
            result.migratedCount += batch.length;

            // Report progress
            if (onProgress) {
              const progress: MigrationProgress = {
                current: result.migratedCount,
                total: conversations.length,
                percentage: Math.round((result.migratedCount / conversations.length) * 100),
                batch: i + 1,
                totalBatches,
              };
              onProgress(progress);
            }
          } catch (error) {
            safeError(`Failed to migrate batch ${i + 1}/${totalBatches}:`, error);
            const errorMsg = `Failed to migrate batch ${i + 1}/${totalBatches}: ${error}`;
            result.errors.push(errorMsg);

            if (!skipOnError) {
              abortMigration = true;
            }
          }
        }

        // Clear localStorage if migration was successful
        result.success = result.errors.length === 0;
        if (result.success && result.migratedCount > 0 && clearLocalStorageAfterSuccess) {
          try {
            localStorage.removeItem("disa:conversations");
            localStorage.removeItem("disa:conversations:metadata");
          } catch (error) {
            safeError("Failed to clear localStorage:", error);
            result.warnings.push(`Failed to clear localStorage: ${error}`);
          }
        }

        result.duration = Date.now() - startTime;

        // Log migration result
        if (result.success) {
          safeInfo(
            `Successfully migrated ${result.migratedCount} conversations in ${result.duration}ms`,
          );
          if (result.warnings.length > 0) {
            console.warn("Migration completed with warnings:", result.warnings);
          }
        } else {
          console.error("Migration failed with errors:", result.errors);
        }

        return result;
      } finally {
        this.migrationInProgress = false;
      }
    })();

    return migrationPromise;
  }

  private async migrateBatch(conversations: Conversation[]): Promise<void> {
    for (const conversation of conversations) {
      try {
        // Sanitize conversation before saving
        const sanitizedConversation = this.sanitizeConversation(conversation);
        await modernStorage.saveConversation(sanitizedConversation);
      } catch (error) {
        throw new Error(`Failed to save conversation ${conversation.id}: ${error}`);
      }
    }
  }

  private validateConversations(
    conversations: Conversation[],
    options: { skipMessageCountCheck?: boolean } = {},
  ): string[] {
    const { skipMessageCountCheck = false } = options;
    const warnings: string[] = [];

    for (const conversation of conversations) {
      // Check required fields
      const conversationIdLabel = conversation.id ?? "";
      if (!conversation.id) {
        warnings.push(`Conversation missing ID`);
      }

      if (!conversation.title) {
        warnings.push(`Conversation ${conversationIdLabel} missing title`);
      }

      if (!conversation.createdAt) {
        warnings.push(`Conversation ${conversationIdLabel} missing createdAt`);
      }

      if (!conversation.updatedAt) {
        warnings.push(`Conversation ${conversationIdLabel} missing updatedAt`);
      }

      if (!conversation.model) {
        warnings.push(`Conversation ${conversationIdLabel} missing model`);
      }

      const hasInvalidDates =
        (conversation.createdAt && !this.isValidISODate(conversation.createdAt)) ||
        (conversation.updatedAt && !this.isValidISODate(conversation.updatedAt));
      if (hasInvalidDates) {
        warnings.push(`Conversation ${conversationIdLabel} has invalid dates`);
      }

      // Check message count consistency
      if (
        !skipMessageCountCheck &&
        conversation.messages &&
        conversation.messageCount !== conversation.messages.length
      ) {
        warnings.push(
          `Conversation ${conversationIdLabel} has inconsistent message count: ` +
            `stored ${conversation.messageCount}, actual ${conversation.messages.length}`,
        );
      }

      // Additional validation for data integrity
      if (conversation.createdAt && conversation.updatedAt) {
        const createdTime = new Date(conversation.createdAt).getTime();
        const updatedTime = new Date(conversation.updatedAt).getTime();
        if (createdTime > updatedTime) {
          warnings.push(
            `Conversation ${conversationIdLabel} has createdAt timestamp newer than updatedAt`,
          );
        }
      }
    }

    return warnings;
  }

  /**
   * Sanitize conversation data by fixing common issues
   */
  private sanitizeConversation(conversation: Conversation): Conversation {
    const sanitized = { ...conversation };

    // Ensure required fields have default values
    if (!sanitized.id) {
      sanitized.id = Math.random().toString(36).substring(2, 15);
    }

    if (!sanitized.title) {
      sanitized.title = "Unbenanntes Gespräch";
    }

    if (!sanitized.model) {
      sanitized.model = "gpt-3.5-turbo";
    }

    // Fix date issues
    if (!sanitized.createdAt || !this.isValidISODate(sanitized.createdAt)) {
      sanitized.createdAt = new Date().toISOString();
    }

    if (!sanitized.updatedAt || !this.isValidISODate(sanitized.updatedAt)) {
      sanitized.updatedAt = sanitized.createdAt;
    }

    // Ensure message count consistency
    if (sanitized.messages) {
      sanitized.messageCount = sanitized.messages.length;
    } else {
      sanitized.messageCount = sanitized.messageCount || 0;
    }

    return sanitized;
  }

  async estimateMigrationTime(): Promise<{
    estimatedDuration: number;
    conversationCount: number;
    estimatedSize: number;
  }> {
    try {
      const localConversations = localStorage.getItem("disa:conversations");
      if (!localConversations) {
        return Promise.resolve({
          estimatedDuration: 0,
          conversationCount: 0,
          estimatedSize: 0,
        });
      }

      const conversations = Object.values(JSON.parse(localConversations));
      const conversationCount = conversations.length;

      // Estimate size in bytes
      const estimatedSize = new Blob([localConversations]).size;

      // Estimate duration (rough calculation: ~10ms per conversation + size factor)
      const estimatedDuration = conversationCount * 10 + estimatedSize / 1000;

      return Promise.resolve({
        estimatedDuration,
        conversationCount,
        estimatedSize,
      });
    } catch (error) {
      console.error("Failed to estimate migration time:", error);
      return Promise.resolve({
        estimatedDuration: 0,
        conversationCount: 0,
        estimatedSize: 0,
      });
    }
  }

  async createBackup(): Promise<string | null> {
    try {
      const localConversations = localStorage.getItem("disa:conversations");
      const localMetadata = localStorage.getItem("disa:conversations:metadata");

      if (!localConversations || !localMetadata) {
        return Promise.resolve(null);
      }

      const backup = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        conversations: JSON.parse(localConversations),
        metadata: JSON.parse(localMetadata),
      };

      return Promise.resolve(JSON.stringify(backup, null, 2));
    } catch (error) {
      console.error("Failed to create backup:", error);
      return Promise.resolve(null);
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
        duration: 0,
      };

      if (!backup.conversations || !backup.metadata) {
        result.errors.push("Invalid backup format");
        return result;
      }

      const conversations: Conversation[] = Object.values(backup.conversations) as Conversation[];

      // Validate backup data
      const validationErrors = this.validateConversations(conversations, {
        skipMessageCountCheck: true,
      });
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
      const fallbackMessage =
        error instanceof Error && error.message.includes("position")
          ? error.message
          : this.formatJsonParseError(backupData);
      return {
        success: false,
        migratedCount: 0,
        errors: [`Failed to parse backup: ${fallbackMessage}`],
        warnings: [],
        duration: Date.now() - startTime,
      };
    }
  }

  isMigrationInProgress(): boolean {
    return this.migrationInProgress;
  }

  private isValidISODate(value?: string): boolean {
    if (!value) {
      return false;
    }
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp);
  }

  private formatJsonParseError(source: string): string {
    const firstNonWhitespaceIndex = source.search(/\S/);
    const position = firstNonWhitespaceIndex === -1 ? 0 : firstNonWhitespaceIndex;
    const token = source[position] ?? "";
    return `SyntaxError: Unexpected token ${token || "?"} in JSON at position ${position}`;
  }
}

// Export singleton instance
export const storageMigration = StorageMigration.getInstance();
