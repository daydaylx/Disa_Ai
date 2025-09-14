import type { ChatMessage } from "../../types/chat";

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

const DB_NAME = "DisaAI";
const DB_VERSION = 1;
const STORE_NAME = "conversations";

class IndexedDBWrapper {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
            store.createIndex("updatedAt", "updatedAt", { unique: false });
            store.createIndex("createdAt", "createdAt", { unique: false });
          }
        };
      });
    }
    return this.dbPromise;
  }

  async getConversation(id: string): Promise<Conversation | null> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || null);
      });
    } catch (error) {
      console.warn("Failed to get conversation:", error);
      return null;
    }
  }

  async putConversation(conversation: Conversation): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(conversation);

      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.warn("Failed to put conversation:", error);
      throw error;
    }
  }

  async listConversations(): Promise<Conversation[]> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("updatedAt");
      const request = index.openCursor(null, "prev"); // Most recent first

      return new Promise((resolve, reject) => {
        const conversations: Conversation[] = [];

        request.onerror = () => reject(request.error);
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            conversations.push(cursor.value);
            cursor.continue();
          } else {
            resolve(conversations);
          }
        };
      });
    } catch (error) {
      console.warn("Failed to list conversations:", error);
      return [];
    }
  }

  async deleteConversation(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.warn("Failed to delete conversation:", error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.warn("Failed to clear conversations:", error);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.count();

      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    } catch (error) {
      console.warn("Failed to count conversations:", error);
      return 0;
    }
  }
}

// Singleton instance
export const conversationDB = new IndexedDBWrapper();
