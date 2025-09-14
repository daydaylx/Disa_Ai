import type { ChatMessage } from "../../types/chat";
import type { Conversation } from "./indexedDB";
import { conversationDB } from "./indexedDB";

interface LegacyConversation {
  id: string;
  title?: string;
  messages: ChatMessage[];
  timestamp?: number;
  createdAt?: number;
  updatedAt?: number;
}

function generateConversationTitle(messages: ChatMessage[]): string {
  const firstUserMessage = messages.find((m) => m.role === "user");
  if (firstUserMessage) {
    const text = firstUserMessage.content.trim();
    if (text.length > 50) {
      return text.substring(0, 47) + "...";
    }
    return text;
  }
  return "Neue Unterhaltung";
}

function normalizeConversation(legacy: LegacyConversation): Conversation {
  const now = Date.now();
  const createdAt = legacy.createdAt || legacy.timestamp || now;
  const updatedAt = legacy.updatedAt || legacy.timestamp || now;

  return {
    id: legacy.id,
    title: legacy.title || generateConversationTitle(legacy.messages),
    messages: legacy.messages || [],
    createdAt,
    updatedAt,
  };
}

function findLocalStorageConversations(): LegacyConversation[] {
  const conversations: LegacyConversation[] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Look for conversation-like keys
      if (key.startsWith("disa:") || key.startsWith("chat:") || key.includes("conversation")) {
        try {
          const value = localStorage.getItem(key);
          if (!value) continue;

          const parsed = JSON.parse(value);

          // Check if it looks like a conversation
          if (parsed && typeof parsed === "object") {
            if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
              conversations.push({
                id: parsed.id || key,
                title: parsed.title,
                messages: parsed.messages,
                timestamp: parsed.timestamp,
                createdAt: parsed.createdAt,
                updatedAt: parsed.updatedAt,
              });
            } else if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].role) {
              // Direct message array
              conversations.push({
                id: key,
                messages: parsed,
              });
            }
          }
        } catch (error) {
          console.warn(`Failed to parse localStorage item ${key}:`, error);
        }
      }
    }

    // Also check for common conversation storage patterns
    const commonKeys = [
      "conversations",
      "chatHistory",
      "messages",
      "disa-conversations",
      "chat-sessions",
    ];

    for (const key of commonKeys) {
      try {
        const value = localStorage.getItem(key);
        if (!value) continue;

        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && typeof item === "object" && Array.isArray(item.messages)) {
              conversations.push({
                id: item.id || `migrated-${Date.now()}-${Math.random()}`,
                title: item.title,
                messages: item.messages,
                timestamp: item.timestamp,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              });
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to parse localStorage array ${key}:`, error);
      }
    }
  } catch (error) {
    console.warn("Failed to scan localStorage:", error);
  }

  return conversations;
}

export async function migrateFromLocalStorage(): Promise<{
  found: number;
  migrated: number;
  errors: number;
}> {
  console.warn("Starting migration from localStorage to IndexedDB...");

  const stats = {
    found: 0,
    migrated: 0,
    errors: 0,
  };

  try {
    // First check if we already have conversations in IndexedDB
    const existingCount = await conversationDB.count();
    if (existingCount > 0) {
      console.warn(
        `Found ${existingCount} existing conversations in IndexedDB, skipping migration`,
      );
      return stats;
    }

    // Find legacy conversations
    const legacyConversations = findLocalStorageConversations();
    stats.found = legacyConversations.length;

    if (legacyConversations.length === 0) {
      console.warn("No legacy conversations found in localStorage");
      return stats;
    }

    console.warn(`Found ${legacyConversations.length} conversations to migrate`);

    // Migrate each conversation
    for (const legacy of legacyConversations) {
      try {
        const normalized = normalizeConversation(legacy);

        // Check if conversation already exists
        const existing = await conversationDB.getConversation(normalized.id);
        if (!existing) {
          await conversationDB.putConversation(normalized);
          stats.migrated++;
        } else {
          console.warn(`Conversation ${normalized.id} already exists, skipping`);
        }
      } catch (error) {
        console.warn(`Failed to migrate conversation ${legacy.id}:`, error);
        stats.errors++;
      }
    }

    console.warn(`Migration complete: ${stats.migrated} migrated, ${stats.errors} errors`);

    // Optionally clean up localStorage after successful migration
    if (stats.migrated > 0 && stats.errors === 0) {
      cleanupLocalStorageAfterMigration();
    }
  } catch (error) {
    console.error("Migration failed:", error);
    stats.errors++;
  }

  return stats;
}

function cleanupLocalStorageAfterMigration(): void {
  try {
    const keysToRemove: string[] = [];

    // Collect keys that look like conversation storage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      if (
        key.startsWith("disa:") ||
        key.startsWith("chat:") ||
        key.includes("conversation") ||
        key === "conversations" ||
        key === "chatHistory" ||
        key === "messages" ||
        key === "disa-conversations" ||
        key === "chat-sessions"
      ) {
        keysToRemove.push(key);
      }
    }

    // Remove the keys
    for (const key of keysToRemove) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove localStorage key ${key}:`, error);
      }
    }

    console.warn(`Cleaned up ${keysToRemove.length} localStorage keys after migration`);
  } catch (error) {
    console.warn("Failed to cleanup localStorage:", error);
  }
}

// Run migration automatically on app start
let migrationPromise: Promise<void> | null = null;

export function runMigrationOnce(): Promise<void> {
  if (!migrationPromise) {
    migrationPromise = (async () => {
      try {
        await migrateFromLocalStorage();
      } catch (error) {
        console.error("Auto-migration failed:", error);
      }
    })();
  }
  return migrationPromise;
}
