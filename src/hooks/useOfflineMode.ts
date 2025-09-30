import { useCallback, useEffect, useState } from "react";

import {
  addToOfflineQueue,
  autoSaveDraft,
  deleteDraft,
  getAllDrafts,
  getDraftForConversation,
  getOfflineStorageStats,
  getPendingSyncMessages,
  getReadyQueueItems,
  initializeOfflineStorage,
  isOffline,
  type MessageDraft,
  type OfflineStorageStats,
  processQueueItem,
  saveOfflineMessage,
  updateLastSync,
  updateMessageSyncStatus,
} from "../lib/offline-storage";
import type { Message } from "../ui/types";

/**
 * Hook for offline mode functionality
 */
export function useOfflineMode() {
  const [isOfflineMode, setIsOfflineMode] = useState(isOffline());
  const [pendingSync, setPendingSync] = useState<Message[]>([]);
  const [drafts, setDrafts] = useState<MessageDraft[]>([]);
  const [stats, setStats] = useState<OfflineStorageStats | null>(null);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  /**
   * Refresh offline data
   */
  const refreshData = useCallback(() => {
    setPendingSync(getPendingSyncMessages());
    setDrafts(getAllDrafts());
    setStats(getOfflineStorageStats());
  }, []);

  /**
   * Update message sync status
   */
  const updateSyncStatus = useCallback(
    (localId: string, status: "pending" | "synced" | "failed" | "draft") => {
      updateMessageSyncStatus(localId, status);
      refreshData();
    },
    [refreshData],
  );

  /**
   * Process message send from queue
   */
  const processMessageSend = useCallback(
    (payload: any): boolean => {
      try {
        // This would integrate with your actual API call
        // For now, we'll simulate success
        // Process offline message send

        // Update sync status
        if (payload.localId) {
          updateSyncStatus(payload.localId, "synced");
        }

        return true;
      } catch (error) {
        console.error("Failed to send offline message:", error);
        return false;
      }
    },
    [updateSyncStatus],
  );

  /**
   * Process regenerate from queue
   */
  const processRegenerate = useCallback((_payload: any): boolean => {
    // Process offline regenerate
    return true;
  }, []);

  /**
   * Process conversation save from queue
   */
  const processConversationSave = useCallback((_payload: any): boolean => {
    // Process offline conversation save
    return true;
  }, []);

  /**
   * Process offline queue when back online
   */
  const processOfflineQueue = useCallback(() => {
    if (isOfflineMode || isProcessingQueue) return;

    setIsProcessingQueue(true);

    try {
      const readyItems = getReadyQueueItems();

      for (const item of readyItems) {
        try {
          let success = false;

          switch (item.type) {
            case "send_message":
              // Process message send
              success = processMessageSend(item.payload);
              break;
            case "regenerate":
              // Process regeneration
              success = processRegenerate(item.payload);
              break;
            case "conversation_save":
              // Process conversation save
              success = processConversationSave(item.payload);
              break;
          }

          processQueueItem(item.id, success);
        } catch (error) {
          console.error(`Failed to process queue item ${item.id}:`, error);
          processQueueItem(item.id, false);
        }
      }

      updateLastSync();
      refreshData();
    } catch (error) {
      console.error("Failed to process offline queue:", error);
    } finally {
      setIsProcessingQueue(false);
    }
  }, [
    isOfflineMode,
    isProcessingQueue,
    processMessageSend,
    processRegenerate,
    processConversationSave,
    refreshData,
  ]);

  // Initialize offline storage
  useEffect(() => {
    initializeOfflineStorage();
    refreshData();

    // Listen for online/offline changes
    const handleOnline = () => {
      setIsOfflineMode(false);
      void processOfflineQueue();
    };

    const handleOffline = () => {
      setIsOfflineMode(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [processOfflineQueue, refreshData]);

  /**
   * Save message for offline use
   */
  const saveMessageOffline = (message: Message, sentOffline = false): string => {
    const localId = saveOfflineMessage(message, sentOffline);
    refreshData();
    return localId;
  };

  /**
   * Save draft with auto-save
   */
  const saveDraftWithAutoSave = (content: string, conversationId?: string) => {
    autoSaveDraft(content, conversationId);
    // Refresh after delay to show auto-saved draft
    setTimeout(refreshData, 3500);
  };

  /**
   * Get draft for specific conversation
   */
  const getDraftFor = (conversationId?: string): MessageDraft | null => {
    return getDraftForConversation(conversationId);
  };

  /**
   * Delete specific draft
   */
  const removeDraft = (draftId: string) => {
    if (deleteDraft(draftId)) {
      refreshData();
      return true;
    }
    return false;
  };

  /**
   * Add action to offline queue
   */
  const queueOfflineAction = (
    type: "send_message" | "regenerate" | "conversation_save",
    payload: any,
  ): string => {
    const queueId = addToOfflineQueue(type, payload);
    refreshData();
    return queueId;
  };

  /**
   * Manually trigger queue processing
   */
  const retrySync = () => {
    if (!isOfflineMode) {
      void processOfflineQueue();
    }
  };

  /**
   * Get offline status indicator
   */
  const getOfflineStatus = () => {
    if (isOfflineMode) {
      return {
        status: "offline",
        message: "You're offline. Messages will be saved locally.",
        color: "orange",
      };
    }

    if (pendingSync.length > 0) {
      return {
        status: "syncing",
        message: `Syncing ${pendingSync.length} messages...`,
        color: "blue",
      };
    }

    if (isProcessingQueue) {
      return {
        status: "processing",
        message: "Processing offline queue...",
        color: "blue",
      };
    }

    return {
      status: "online",
      message: "Connected",
      color: "green",
    };
  };

  /**
   * Check if features should be limited due to offline mode
   */
  const shouldLimitFeatures = () => {
    return isOfflineMode;
  };

  return {
    // State
    isOfflineMode,
    pendingSync,
    drafts,
    stats,
    isProcessingQueue,

    // Actions
    saveMessageOffline,
    updateSyncStatus,
    saveDraftWithAutoSave,
    getDraftFor,
    removeDraft,
    queueOfflineAction,
    processOfflineQueue,
    retrySync,
    refreshData,

    // Helpers
    getOfflineStatus,
    shouldLimitFeatures,
  };
}
