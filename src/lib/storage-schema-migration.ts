// IndexedDB Schema Migration System
// Handles database schema upgrades and version transitions

import Dexie from "dexie";

import { safeError, safeInfo } from "./utils/production-logger";

export interface SchemaVersion {
  version: number;
  timestamp: number;
  description: string;
}

export interface MigrationResult {
  success: boolean;
  fromVersion: number;
  toVersion: number;
  migratedCount: number;
  errors: string[];
  warnings: string[];
  duration: number;
}

// Migration step interface
interface MigrationStep {
  version: number;
  description: string;
  up: (db: Dexie) => Promise<void> | void;
  down?: (db: Dexie) => Promise<void> | void;
}

// Available migrations in chronological order
const MIGRATIONS: MigrationStep[] = [
  {
    version: 1,
    description: "Initial schema with conversations and metadata tables",
    up: (db) => {
      db.version(1).stores({
        conversations:
          "id, title, createdAt, updatedAt, lastActivity, model, messageCount, isFavorite",
        metadata: "id, title, createdAt, updatedAt, model, messageCount",
      });
    },
  },
  {
    version: 2,
    description: "Add archived flag and archivedAt timestamp",
    up: (db) => {
      db.version(2).stores({
        conversations:
          "id, title, createdAt, updatedAt, lastActivity, model, messageCount, isFavorite, isArchived, archivedAt",
        metadata: "id, title, createdAt, updatedAt, model, messageCount",
      });
    },
  },
  {
    version: 3,
    description: "Add pinned flag for conversations",
    up: (db) => {
      db.version(3).stores({
        conversations:
          "id, title, createdAt, updatedAt, lastActivity, model, messageCount, isFavorite, isArchived, archivedAt, isPinned",
        metadata: "id, title, createdAt, updatedAt, model, messageCount",
      });
    },
  },
];

export class SchemaMigrationManager {
  private static instance: SchemaMigrationManager;
  private currentVersion: number = 1;
  private migrationInProgress = false;

  static getInstance(): SchemaMigrationManager {
    if (!SchemaMigrationManager.instance) {
      SchemaMigrationManager.instance = new SchemaMigrationManager();
    }
    return SchemaMigrationManager.instance;
  }

  /**
   * Get the latest schema version
   */
  getLatestVersion(): number {
    const lastMigration = MIGRATIONS[MIGRATIONS.length - 1];
    return lastMigration ? lastMigration.version : 1;
  }

  /**
   * Get current database version
   */
  getCurrentVersion(): number {
    return this.currentVersion;
  }

  /**
   * Get migration history
   */
  getMigrationHistory(): SchemaVersion[] {
    return MIGRATIONS.map((migration) => ({
      version: migration.version,
      timestamp: Date.now(),
      description: migration.description,
    }));
  }

  /**
   * Check if migration is needed
   */
  async needsMigration(db: Dexie): Promise<boolean> {
    try {
      const currentVersion = await this.detectCurrentVersion(db);
      const latestVersion = this.getLatestVersion();
      return currentVersion < latestVersion;
    } catch (error) {
      safeError("Failed to check if migration is needed:", error);
      return false;
    }
  }

  /**
   * Detect current database version
   */
  private async detectCurrentVersion(db: Dexie): Promise<number> {
    try {
      // Try to open with latest version to see what we have
      await db.open();
      return this.getLatestVersion();
    } catch (error: any) {
      // If version error, parse the current version from error
      const versionMatch = error?.message?.match(/Version error\s+(\d+)/);
      if (versionMatch) {
        return parseInt(versionMatch[1], 10);
      }
      // Default to version 1 if we can't detect
      return 1;
    }
  }

  /**
   * Perform schema migration
   */
  async migrate(db: Dexie): Promise<MigrationResult> {
    if (this.migrationInProgress) {
      return Promise.reject(new Error("Migration is already in progress"));
    }

    const startTime = Date.now();
    this.migrationInProgress = true;

    try {
      const fromVersion = await this.detectCurrentVersion(db);
      const toVersion = this.getLatestVersion();

      if (fromVersion >= toVersion) {
        return {
          success: true,
          fromVersion,
          toVersion: fromVersion,
          migratedCount: 0,
          errors: [],
          warnings: ["Database is already at latest version"],
          duration: 0,
        };
      }

      const result: MigrationResult = {
        success: false,
        fromVersion,
        toVersion,
        migratedCount: 0,
        errors: [],
        warnings: [],
        duration: 0,
      };

      // Apply migrations sequentially
      for (const migration of MIGRATIONS) {
        if (migration.version <= fromVersion) {
          continue; // Skip already applied migrations
        }

        safeInfo(`Applying migration to version ${migration.version}: ${migration.description}`);

        try {
          await migration.up(db);
          result.migratedCount++;
          this.currentVersion = migration.version;

          // Log successful migration
          await this.logMigrationResult(db, {
            version: migration.version,
            timestamp: Date.now(),
            description: migration.description,
            success: true,
          });

          safeInfo(`Successfully migrated to version ${migration.version}`);
        } catch (error) {
          const errorMsg = `Failed to apply migration to version ${migration.version}: ${error}`;
          safeError(errorMsg);
          result.errors.push(errorMsg);

          // Log failed migration
          await this.logMigrationResult(db, {
            version: migration.version,
            timestamp: Date.now(),
            description: migration.description,
            success: false,
            error: String(error),
          });

          // Stop migration on error
          break;
        }
      }

      result.success = result.errors.length === 0;
      result.duration = Date.now() - startTime;

      if (result.success) {
        safeInfo(
          `Schema migration completed: v${fromVersion} → v${toVersion} in ${result.duration}ms`,
        );
      } else {
        safeError(`Schema migration failed: ${result.errors.join(", ")}`);
      }

      return result;
    } finally {
      this.migrationInProgress = false;
    }
  }

  /**
   * Archive old conversations
   */
  async archiveOldConversations(
    db: Dexie,
    options: {
      olderThanDays?: number;
      minMessagesToArchive?: number;
      excludeFavorites?: boolean;
      excludePinned?: boolean;
    } = {},
  ): Promise<{ archived: number; errors: string[] }> {
    const {
      olderThanDays = 90,
      minMessagesToArchive = 5,
      excludeFavorites = true,
      excludePinned = true,
    } = options;

    const errors: string[] = [];
    let archived = 0;

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      // Get old conversations
      const oldConversations = await db
        .table("conversations")
        .where("lastActivity")
        .below(cutoffDate.toISOString())
        .toArray();

      for (const conversation of oldConversations) {
        try {
          // Skip if excluded
          if (excludeFavorites && conversation.isFavorite) continue;
          if (excludePinned && conversation.isPinned) continue;
          if (conversation.messageCount < minMessagesToArchive) continue;
          if (conversation.isArchived) continue; // Already archived

          // Mark as archived
          await db.table("conversations").update(conversation.id, {
            isArchived: true,
            archivedAt: new Date().toISOString(),
          });

          archived++;
        } catch (error) {
          errors.push(`Failed to archive conversation ${conversation.id}: ${error}`);
        }
      }

      safeInfo(`Archived ${archived} conversations older than ${olderThanDays} days`);

      return { archived, errors };
    } catch (error) {
      safeError("Failed to archive old conversations:", error);
      return { archived: 0, errors: [String(error)] };
    }
  }

  /**
   * Unarchive conversations
   */
  async unarchiveConversations(
    db: Dexie,
    ids: string[],
  ): Promise<{ unarchived: number; errors: string[] }> {
    const errors: string[] = [];
    let unarchived = 0;

    try {
      for (const id of ids) {
        try {
          await db.table("conversations").update(id, {
            isArchived: false,
            archivedAt: undefined,
          });

          unarchived++;
        } catch (error) {
          errors.push(`Failed to unarchive conversation ${id}: ${error}`);
        }
      }

      safeInfo(`Unarchived ${unarchived} conversations`);

      return { unarchived, errors };
    } catch (error) {
      safeError("Failed to unarchive conversations:", error);
      return { unarchived: 0, errors: [String(error)] };
    }
  }

  /**
   * Get archived conversations
   */
  async getArchivedConversations(db: Dexie): Promise<any[]> {
    try {
      return await db
        .table("conversations")
        .filter((conv) => conv.isArchived === true)
        .reverse()
        .sortBy("archivedAt");
    } catch (error) {
      safeError("Failed to get archived conversations:", error);
      return [];
    }
  }

  /**
   * Delete permanently archived conversations
   */
  async deleteArchivedConversations(
    db: Dexie,
    olderThanDays: number = 30,
  ): Promise<{ deleted: number; errors: string[] }> {
    const errors: string[] = [];
    let deleted = 0;

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const oldArchived = await db
        .table("conversations")
        .where("archivedAt")
        .below(cutoffDate.toISOString())
        .and((conv) => conv.isArchived === true)
        .toArray();

      for (const conversation of oldArchived) {
        try {
          await db.table("conversations").delete(conversation.id);

          deleted++;
        } catch (error) {
          errors.push(`Failed to delete archived conversation ${conversation.id}: ${error}`);
        }
      }

      safeInfo(`Deleted ${deleted} archived conversations older than ${olderThanDays} days`);

      return { deleted, errors };
    } catch (error) {
      safeError("Failed to delete archived conversations:", error);
      return { deleted: 0, errors: [String(error)] };
    }
  }

  isMigrationInProgress(): boolean {
    return this.migrationInProgress;
  }

  /**
   * Log migration result to database
   */
  private logMigrationResult(
    _db: Dexie,
    result: {
      version: number;
      timestamp: number;
      description: string;
      success: boolean;
      error?: string;
    },
  ): Promise<void> {
    try {
      // Store migration log in localStorage for now
      const logs = JSON.parse(localStorage.getItem("disa:migration_logs") || "[]");
      logs.push(result);
      localStorage.setItem("disa:migration_logs", JSON.stringify(logs));
    } catch (error) {
      safeError("Failed to log migration result:", error);
    }
  }

  /**
   * Get migration logs
   */
  getMigrationLogs(): any[] {
    try {
      return JSON.parse(localStorage.getItem("disa:migration_logs") || "[]");
    } catch {
      return [];
    }
  }
}

// Export singleton instance
export const schemaMigration = SchemaMigrationManager.getInstance();
