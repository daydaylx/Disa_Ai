/**
 * Erweiterte Offline-PWA-Funktionalität für mobile Geräte
 */

import { hapticFeedback } from "../touch/haptics";

export interface OfflineData {
  conversations: any[];
  drafts: Map<string, string>;
  settings: any;
  lastSync: number;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  syncInProgress: boolean;
}

/**
 * Offline-Manager für PWA-Funktionalität
 */
export class OfflineManager {
  private static instance: OfflineManager | null = null;
  private db: IDBDatabase | null = null;
  private syncQueue: Array<() => Promise<void>> = [];
  private isOnline = navigator.onLine;
  private syncInProgress = false;
  private eventListeners = new Map<string, Set<Function>>();

  private constructor() {
    void this.initializeDB();
    this.setupOnlineListeners();
    this.startPeriodicSync();
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  /**
   * IndexedDB initialisieren
   */
  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("DisaAIOffline", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Conversations Store
        if (!db.objectStoreNames.contains("conversations")) {
          const conversationsStore = db.createObjectStore("conversations", { keyPath: "id" });
          conversationsStore.createIndex("timestamp", "timestamp");
          conversationsStore.createIndex("modified", "modified");
        }

        // Drafts Store
        if (!db.objectStoreNames.contains("drafts")) {
          db.createObjectStore("drafts", { keyPath: "id" });
        }

        // Settings Store
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }

        // Sync Queue Store
        if (!db.objectStoreNames.contains("syncQueue")) {
          const syncStore = db.createObjectStore("syncQueue", {
            keyPath: "id",
            autoIncrement: true,
          });
          syncStore.createIndex("timestamp", "timestamp");
          syncStore.createIndex("type", "type");
        }
      };
    });
  }

  /**
   * Online-Status-Listener einrichten
   */
  private setupOnlineListeners(): void {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.emit("statusChange", this.getStatus());
      void this.syncPendingChanges();

      // Haptisches Feedback für Online-Status
      hapticFeedback.success();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.emit("statusChange", this.getStatus());

      // Haptisches Feedback für Offline-Status
      hapticFeedback.warning();
    });
  }

  /**
   * Periodische Synchronisation
   */
  private startPeriodicSync(): void {
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        void this.syncPendingChanges();
      }
    }, 30000); // Alle 30 Sekunden
  }

  /**
   * Konversation offline speichern
   */
  async saveConversation(conversation: any): Promise<void> {
    if (!this.db) await this.initializeDB();

    const transaction = this.db!.transaction(["conversations"], "readwrite");
    const store = transaction.objectStore("conversations");

    const conversationWithMeta = {
      ...conversation,
      modified: Date.now(),
      offline: !this.isOnline,
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(conversationWithMeta);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Sync-Queue aktualisieren
    if (!this.isOnline) {
      void this.addToSyncQueue("updateConversation", conversation.id, conversation);
    }

    this.emit("conversationSaved", conversation);
  }

  /**
   * Konversationen laden
   */
  async getConversations(): Promise<any[]> {
    if (!this.db) await this.initializeDB();

    const transaction = this.db!.transaction(["conversations"], "readonly");
    const store = transaction.objectStore("conversations");

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Draft speichern
   */
  async saveDraft(conversationId: string, text: string): Promise<void> {
    if (!this.db) await this.initializeDB();

    const transaction = this.db!.transaction(["drafts"], "readwrite");
    const store = transaction.objectStore("drafts");

    const draft = {
      id: conversationId,
      text,
      timestamp: Date.now(),
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(draft);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Draft laden
   */
  async getDraft(conversationId: string): Promise<string | null> {
    if (!this.db) await this.initializeDB();

    const transaction = this.db!.transaction(["drafts"], "readonly");
    const store = transaction.objectStore("drafts");

    return new Promise((resolve, reject) => {
      const request = store.get(conversationId);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.text : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Einstellungen offline speichern
   */
  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.initializeDB();

    const transaction = this.db!.transaction(["settings"], "readwrite");
    const store = transaction.objectStore("settings");

    const setting = {
      key,
      value,
      timestamp: Date.now(),
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(setting);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Sync-Queue hinzufügen
   */
  private async addToSyncQueue(type: string, id: string, data: any): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(["syncQueue"], "readwrite");
    const store = transaction.objectStore("syncQueue");

    const syncItem = {
      type,
      id,
      data,
      timestamp: Date.now(),
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.add(syncItem);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Ausstehende Änderungen synchronisieren
   */
  async syncPendingChanges(): Promise<void> {
    if (!this.isOnline || this.syncInProgress || !this.db) return;

    this.syncInProgress = true;
    this.emit("syncStart");

    try {
      const transaction = this.db.transaction(["syncQueue"], "readwrite");
      const store = transaction.objectStore("syncQueue");

      const request = store.getAll();
      const syncItems = await new Promise<any[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      for (const item of syncItems) {
        try {
          await this.processSyncItem(item);

          // Item aus Queue entfernen nach erfolgreichem Sync
          const deleteRequest = store.delete(item.id);
          void new Promise<void>((resolve, reject) => {
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          });
        } catch (error) {
          console.error("Sync failed for item:", item, error);
        }
      }

      this.emit("syncComplete", { success: true, itemCount: syncItems.length });
      hapticFeedback.success();
    } catch (error) {
      this.emit("syncComplete", { success: false, error });
      hapticFeedback.error();
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Einzelnes Sync-Item verarbeiten
   */
  private async processSyncItem(item: any): Promise<void> {
    // Hier würde die tatsächliche API-Synchronisation stattfinden
    // Für jetzt simulieren wir eine erfolgreiche Synchronisation
    await new Promise((resolve) => setTimeout(resolve, 100));

    switch (item.type) {
      case "updateConversation":
        // API-Call zum Synchronisieren der Konversation
        break;
      case "deleteDraft":
        // API-Call zum Löschen des Drafts
        break;
      default:
        console.warn("Unknown sync item type:", item.type);
    }
  }

  /**
   * Status abrufen
   */
  getStatus(): SyncStatus {
    return {
      isOnline: this.isOnline,
      lastSync: this.getLastSyncTime(),
      pendingChanges: this.syncQueue.length,
      syncInProgress: this.syncInProgress,
    };
  }

  /**
   * Letzte Sync-Zeit
   */
  private getLastSyncTime(): Date | null {
    const lastSync = localStorage.getItem("lastSyncTime");
    return lastSync ? new Date(parseInt(lastSync)) : null;
  }

  /**
   * Event-System
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  /**
   * Cache-Management
   */
  async clearOldData(olderThan: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) return;

    const cutoff = Date.now() - olderThan;
    const transaction = this.db.transaction(["conversations", "drafts"], "readwrite");

    // Alte Konversationen löschen
    const conversationsStore = transaction.objectStore("conversations");
    const conversationsIndex = conversationsStore.index("modified");
    const conversationsRange = IDBKeyRange.upperBound(cutoff);

    await new Promise<void>((resolve, reject) => {
      const request = conversationsIndex.openCursor(conversationsRange);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });

    // Alte Drafts löschen
    const draftsStore = transaction.objectStore("drafts");
    const draftsRequest = draftsStore.getAll();

    await new Promise<void>((resolve, reject) => {
      draftsRequest.onsuccess = () => {
        const drafts = draftsRequest.result || [];
        const deletePromises = drafts
          .filter((draft) => draft.timestamp < cutoff)
          .map((draft) => {
            return new Promise<void>((resolve, reject) => {
              const deleteRequest = draftsStore.delete(draft.id);
              deleteRequest.onsuccess = () => resolve();
              deleteRequest.onerror = () => reject(deleteRequest.error);
            });
          });

        Promise.all(deletePromises)
          .then(() => resolve())
          .catch(reject);
      };
      draftsRequest.onerror = () => reject(draftsRequest.error);
    });
  }

  /**
   * Speicher-Nutzung abrufen
   */
  async getStorageUsage(): Promise<{ used: number; available: number; percentage: number }> {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const available = estimate.quota || 0;
      const percentage = available > 0 ? (used / available) * 100 : 0;

      return { used, available, percentage };
    }

    return { used: 0, available: 0, percentage: 0 };
  }
}

/**
 * React Hook für Offline-Funktionalität
 */
export function useOfflineManager() {
  // React Hook-Implementierung würde hier hin
  const manager = OfflineManager.getInstance();
  return {
    manager,
    status: manager.getStatus(),
    isOnline: navigator.onLine,
    sync: () => manager.syncPendingChanges(),
    saveConversation: (conversation: any) => manager.saveConversation(conversation),
    saveDraft: (conversationId: string, text: string) => manager.saveDraft(conversationId, text),
    getDraft: (conversationId: string) => manager.getDraft(conversationId),
  };
}
