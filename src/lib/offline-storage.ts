/**
 * Enhanced Offline Storage System
 *
 * Provides robust local storage for messages, drafts, and offline queues
 * with sync capabilities and storage optimization
 */

import type { Message } from "../ui/types";

export interface OfflineMessage extends Message {
  /** Local storage ID */
  localId: string;
  /** Whether message was sent while offline */
  sentOffline: boolean;
  /** Retry count for failed sends */
  retryCount: number;
  /** Last retry timestamp */
  lastRetry?: number;
  /** Sync status */
  syncStatus: "pending" | "synced" | "failed" | "draft";
}

export interface MessageDraft {
  id: string;
  content: string;
  timestamp: number;
  conversationId?: string;
  autoSaved: boolean;
}

export interface OfflineQueue {
  id: string;
  type: "send_message" | "regenerate" | "conversation_save";
  payload: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  nextRetry?: number;
}

export interface OfflineStorageStats {
  totalMessages: number;
  pendingSync: number;
  failedSync: number;
  drafts: number;
  queueSize: number;
  storageUsed: number;
  lastSync?: number;
}

const STORAGE_KEYS = {
  messages: "disa:offline-messages",
  drafts: "disa:message-drafts",
  queue: "disa:offline-queue",
  lastSync: "disa:last-sync",
  settings: "disa:offline-settings",
} as const;

const MAX_MESSAGES = 1000; // Limit offline messages
const MAX_DRAFTS = 50; // Limit drafts
const MAX_QUEUE_SIZE = 100; // Limit queue size
const RETRY_DELAYS = [1000, 5000, 15000, 60000, 300000]; // Exponential backoff
const AUTO_SAVE_DELAY = 3000; // Auto-save drafts after 3s
const STORAGE_QUOTA_WARNING = 0.8; // Warn at 80% storage usage

/**
 * Check if we're currently offline
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * Get estimated storage usage
 */
function getStorageUsage(): number {
  try {
    let totalSize = 0;
    for (const key of Object.values(STORAGE_KEYS)) {
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += new Blob([value]).size;
      }
    }
    return totalSize;
  } catch {
    return 0;
  }
}

/**
 * Check storage quota and warn if needed
 */
async function checkStorageQuota(): Promise<boolean> {
  try {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      if (estimate.quota && estimate.usage) {
        const usageRatio = estimate.usage / estimate.quota;
        if (usageRatio > STORAGE_QUOTA_WARNING) {
          console.warn(`Storage usage high: ${Math.round(usageRatio * 100)}%`);
          return false;
        }
      }
    }
    return true;
  } catch {
    return true; // Assume OK if can't check
  }
}

/**
 * Clean up old data to free storage
 */
function cleanupOldData(): void {
  try {
    // Remove old messages beyond limit
    const messages = getOfflineMessages();
    if (messages.length > MAX_MESSAGES) {
      const sortedMessages = messages.sort((a, b) => b.timestamp - a.timestamp);
      const keptMessages = sortedMessages.slice(0, MAX_MESSAGES);
      localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(keptMessages));
    }

    // Remove old drafts beyond limit
    const drafts = getAllDrafts();
    if (drafts.length > MAX_DRAFTS) {
      const sortedDrafts = drafts.sort((a, b) => b.timestamp - a.timestamp);
      const keptDrafts = sortedDrafts.slice(0, MAX_DRAFTS);
      localStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(keptDrafts));
    }

    // Remove old completed queue items
    const queue = getOfflineQueue().filter(
      (item) =>
        item.retryCount < item.maxRetries || Date.now() - item.timestamp < 24 * 60 * 60 * 1000,
    );
    localStorage.setItem(STORAGE_KEYS.queue, JSON.stringify(queue));
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
}

/**
 * Get all offline messages
 */
export function getOfflineMessages(): OfflineMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.messages);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load offline messages:", error);
    return [];
  }
}

/**
 * Save message for offline storage
 */
export function saveOfflineMessage(message: Message, sentOffline = false): string {
  try {
    const messages = getOfflineMessages();
    const localId = `offline_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    const offlineMessage: OfflineMessage = {
      ...message,
      localId,
      sentOffline,
      retryCount: 0,
      syncStatus: sentOffline ? "pending" : "synced",
    };

    messages.push(offlineMessage);

    // Cleanup if needed
    if (messages.length > MAX_MESSAGES) {
      cleanupOldData();
    }

    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
    return localId;
  } catch (error) {
    console.error("Failed to save offline message:", error);
    return "";
  }
}

/**
 * Update sync status of message
 */
export function updateMessageSyncStatus(
  localId: string,
  status: OfflineMessage["syncStatus"],
): boolean {
  try {
    const messages = getOfflineMessages();
    const messageIndex = messages.findIndex((m) => m.localId === localId);

    if (messageIndex === -1) return false;

    messages[messageIndex].syncStatus = status;
    if (status === "synced") {
      messages[messageIndex].sentOffline = false;
    }

    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error("Failed to update sync status:", error);
    return false;
  }
}

/**
 * Get messages pending sync
 */
export function getPendingSyncMessages(): OfflineMessage[] {
  return getOfflineMessages().filter((m) => m.syncStatus === "pending");
}

/**
 * Get all message drafts
 */
export function getAllDrafts(): MessageDraft[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.drafts);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load drafts:", error);
    return [];
  }
}

/**
 * Save message draft
 */
export function saveDraft(content: string, conversationId?: string, autoSaved = false): string {
  try {
    const drafts = getAllDrafts();
    const id = `draft_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    const draft: MessageDraft = {
      id,
      content: content.trim(),
      timestamp: Date.now(),
      conversationId,
      autoSaved,
    };

    // Remove existing auto-saved draft for same conversation
    if (autoSaved && conversationId) {
      const filteredDrafts = drafts.filter(
        (d) => !(d.autoSaved && d.conversationId === conversationId),
      );
      filteredDrafts.push(draft);
      localStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(filteredDrafts));
    } else {
      drafts.push(draft);
      localStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(drafts));
    }

    return id;
  } catch (error) {
    console.error("Failed to save draft:", error);
    return "";
  }
}

/**
 * Get draft for conversation
 */
export function getDraftForConversation(conversationId?: string): MessageDraft | null {
  const drafts = getAllDrafts();
  return drafts.find((d) => d.conversationId === conversationId && d.autoSaved) || null;
}

/**
 * Delete draft
 */
export function deleteDraft(draftId: string): boolean {
  try {
    const drafts = getAllDrafts();
    const filteredDrafts = drafts.filter((d) => d.id !== draftId);

    if (filteredDrafts.length === drafts.length) {
      return false; // Draft not found
    }

    localStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(filteredDrafts));
    return true;
  } catch (error) {
    console.error("Failed to delete draft:", error);
    return false;
  }
}

/**
 * Get offline queue
 */
export function getOfflineQueue(): OfflineQueue[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.queue);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load offline queue:", error);
    return [];
  }
}

/**
 * Add item to offline queue
 */
export function addToOfflineQueue(
  type: OfflineQueue["type"],
  payload: any,
  maxRetries = 5,
): string {
  try {
    const queue = getOfflineQueue();
    const id = `queue_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    const queueItem: OfflineQueue = {
      id,
      type,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries,
    };

    queue.push(queueItem);

    // Limit queue size
    if (queue.length > MAX_QUEUE_SIZE) {
      cleanupOldData();
    }

    localStorage.setItem(STORAGE_KEYS.queue, JSON.stringify(queue));
    return id;
  } catch (error) {
    console.error("Failed to add to offline queue:", error);
    return "";
  }
}

/**
 * Process offline queue item
 */
export function processQueueItem(itemId: string, success: boolean): boolean {
  try {
    const queue = getOfflineQueue();
    const itemIndex = queue.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) return false;

    const item = queue[itemIndex];

    if (success) {
      // Remove successful item
      queue.splice(itemIndex, 1);
    } else {
      // Increment retry count and set next retry time
      item.retryCount++;
      if (item.retryCount < item.maxRetries) {
        const delay = RETRY_DELAYS[Math.min(item.retryCount - 1, RETRY_DELAYS.length - 1)];
        item.nextRetry = Date.now() + delay;
      }
    }

    localStorage.setItem(STORAGE_KEYS.queue, JSON.stringify(queue));
    return true;
  } catch (error) {
    console.error("Failed to process queue item:", error);
    return false;
  }
}

/**
 * Get ready queue items (ready for retry)
 */
export function getReadyQueueItems(): OfflineQueue[] {
  const now = Date.now();
  return getOfflineQueue().filter(
    (item) => item.retryCount < item.maxRetries && (!item.nextRetry || item.nextRetry <= now),
  );
}

/**
 * Get offline storage statistics
 */
export function getOfflineStorageStats(): OfflineStorageStats {
  const messages = getOfflineMessages();
  const drafts = getAllDrafts();
  const queue = getOfflineQueue();

  const pendingSync = messages.filter((m) => m.syncStatus === "pending").length;
  const failedSync = messages.filter((m) => m.syncStatus === "failed").length;

  const lastSyncStr = localStorage.getItem(STORAGE_KEYS.lastSync);
  const lastSync = lastSyncStr ? parseInt(lastSyncStr, 10) : undefined;

  return {
    totalMessages: messages.length,
    pendingSync,
    failedSync,
    drafts: drafts.length,
    queueSize: queue.length,
    storageUsed: getStorageUsage(),
    lastSync,
  };
}

/**
 * Update last sync timestamp
 */
export function updateLastSync(): void {
  localStorage.setItem(STORAGE_KEYS.lastSync, Date.now().toString());
}

/**
 * Clear all offline data (for reset/cleanup)
 */
export function clearOfflineData(): void {
  try {
    for (const key of Object.values(STORAGE_KEYS)) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error("Failed to clear offline data:", error);
  }
}

/**
 * Export offline data for backup
 */
export function exportOfflineData() {
  return {
    version: "1.0",
    exportDate: Date.now(),
    messages: getOfflineMessages(),
    drafts: getAllDrafts(),
    queue: getOfflineQueue(),
    stats: getOfflineStorageStats(),
  };
}

/**
 * Import offline data from backup
 */
export function importOfflineData(importData: any): {
  success: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  try {
    if (importData.messages && Array.isArray(importData.messages)) {
      localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(importData.messages));
    }

    if (importData.drafts && Array.isArray(importData.drafts)) {
      localStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(importData.drafts));
    }

    if (importData.queue && Array.isArray(importData.queue)) {
      localStorage.setItem(STORAGE_KEYS.queue, JSON.stringify(importData.queue));
    }

    // Check storage after import
    void checkStorageQuota().then((hasSpace) => {
      if (!hasSpace) {
        cleanupOldData();
      }
    });

    return { success: true, errors };
  } catch (error) {
    return {
      success: false,
      errors: [`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}

/**
 * Auto-save draft with debouncing
 */
let autoSaveTimeout: NodeJS.Timeout | null = null;

export function autoSaveDraft(content: string, conversationId?: string): void {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  autoSaveTimeout = setTimeout(() => {
    if (content.trim().length > 0) {
      saveDraft(content, conversationId, true);
    }
  }, AUTO_SAVE_DELAY);
}

/**
 * Initialize offline storage system
 */
export function initializeOfflineStorage(): void {
  // Check storage quota
  void checkStorageQuota().then((hasSpace) => {
    if (!hasSpace) {
      cleanupOldData();
    }
  });

  // Listen for online/offline events
  window.addEventListener("online", () => {
    // console.log("Back online - processing offline queue");
    // Trigger queue processing (to be implemented by caller)
  });

  window.addEventListener("offline", () => {
    // console.log("Gone offline - enabling offline mode");
  });
}
