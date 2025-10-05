/**
 * Memory Service - Implementiert persistente Gedächtnis-Funktion für Chats
 *
 * Features:
 * - Pro-Chat Verlauf & Kontext speichern
 * - Globale User-Infos (Name, Präferenzen, etc.)
 * - Optional aktivierbar/deaktivierbar
 * - Verwaltung gespeicherter Daten
 */

export interface GlobalMemory {
  name?: string;
  preferences?: Record<string, unknown>;
  hobbies?: string[];
  background?: string;
  summary?: string;
  lastUpdated: number;
}

export interface ChatMemory {
  chatId: string;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }>;
  context?: string;
  lastUpdated: number;
  messageCount: number;
}

export interface MemorySettings {
  enabled: boolean;
  maxChatMessages: number; // Limit pro Chat
  maxChatHistory: number; // Anzahl gespeicherter Chats
  retentionDays: number; // Wie lange Chats behalten werden
}

const STORAGE_KEYS = {
  GLOBAL_MEMORY: "disa:memory:global",
  CHAT_MEMORY_PREFIX: "disa:memory:chat:",
  SETTINGS: "disa:memory:settings",
  CHAT_LIST: "disa:memory:chats",
} as const;

const DEFAULT_SETTINGS: MemorySettings = {
  enabled: false, // Standardmäßig deaktiviert für Privacy
  maxChatMessages: 50, // 50 Nachrichten pro Chat
  maxChatHistory: 20, // Maximal 20 gespeicherte Chats
  retentionDays: 30, // 30 Tage Aufbewahrung
};

class MemoryService {
  private settings: MemorySettings;

  constructor() {
    this.settings = this.loadSettings();
  }

  // === Settings Management ===

  getSettings(): MemorySettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<MemorySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  private loadSettings(): MemorySettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn("Failed to load memory settings:", error);
    }
    return DEFAULT_SETTINGS;
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch (error) {
      console.warn("Failed to save memory settings:", error);
    }
  }

  // === Global Memory Management ===

  getGlobalMemory(): GlobalMemory | null {
    if (!this.settings.enabled) return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GLOBAL_MEMORY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn("Failed to load global memory:", error);
      return null;
    }
  }

  updateGlobalMemory(updates: Partial<Omit<GlobalMemory, "lastUpdated">>): void {
    if (!this.settings.enabled) return;

    const current = this.getGlobalMemory() || { lastUpdated: Date.now() };
    const updated: GlobalMemory = {
      ...current,
      ...updates,
      lastUpdated: Date.now(),
    };

    try {
      localStorage.setItem(STORAGE_KEYS.GLOBAL_MEMORY, JSON.stringify(updated));
    } catch (error) {
      console.warn("Failed to save global memory:", error);
    }
  }

  clearGlobalMemory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.GLOBAL_MEMORY);
    } catch (error) {
      console.warn("Failed to clear global memory:", error);
    }
  }

  // === Chat Memory Management ===

  getChatMemory(chatId: string): ChatMemory | null {
    if (!this.settings.enabled) return null;

    try {
      const stored = localStorage.getItem(`${STORAGE_KEYS.CHAT_MEMORY_PREFIX}${chatId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn(`Failed to load chat memory for ${chatId}:`, error);
      return null;
    }
  }

  updateChatMemory(chatId: string, messages: ChatMemory["messages"], context?: string): void {
    if (!this.settings.enabled) return;

    // Truncate messages if too many
    const truncatedMessages = messages.slice(-this.settings.maxChatMessages);

    const chatMemory: ChatMemory = {
      chatId,
      messages: truncatedMessages,
      context,
      lastUpdated: Date.now(),
      messageCount: truncatedMessages.length,
    };

    try {
      localStorage.setItem(
        `${STORAGE_KEYS.CHAT_MEMORY_PREFIX}${chatId}`,
        JSON.stringify(chatMemory),
      );
      this.updateChatList(chatId);
      this.cleanupOldChats();
    } catch (error) {
      console.warn(`Failed to save chat memory for ${chatId}:`, error);
    }
  }

  deleteChatMemory(chatId: string): void {
    try {
      localStorage.removeItem(`${STORAGE_KEYS.CHAT_MEMORY_PREFIX}${chatId}`);
      this.removeChatFromList(chatId);
    } catch (error) {
      console.warn(`Failed to delete chat memory for ${chatId}:`, error);
    }
  }

  // === Chat List Management ===

  getChatList(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHAT_LIST);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn("Failed to load chat list:", error);
      return [];
    }
  }

  private updateChatList(chatId: string): void {
    const chatList = this.getChatList();
    const filtered = chatList.filter((id) => id !== chatId);
    const updated = [chatId, ...filtered]; // Most recent first

    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_LIST, JSON.stringify(updated));
    } catch (error) {
      console.warn("Failed to update chat list:", error);
    }
  }

  private removeChatFromList(chatId: string): void {
    const chatList = this.getChatList();
    const filtered = chatList.filter((id) => id !== chatId);

    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_LIST, JSON.stringify(filtered));
    } catch (error) {
      console.warn("Failed to remove chat from list:", error);
    }
  }

  // === Cleanup & Maintenance ===

  private cleanupOldChats(): void {
    const chatList = this.getChatList();
    const now = Date.now();
    const retentionMs = this.settings.retentionDays * 24 * 60 * 60 * 1000;

    // Remove chats that exceed max history limit
    if (chatList.length > this.settings.maxChatHistory) {
      const toRemove = chatList.slice(this.settings.maxChatHistory);
      toRemove.forEach((chatId) => this.deleteChatMemory(chatId));
    }

    // Remove old chats based on retention period
    const remainingChats = chatList.slice(0, this.settings.maxChatHistory);
    remainingChats.forEach((chatId) => {
      const memory = this.getChatMemory(chatId);
      if (memory && now - memory.lastUpdated > retentionMs) {
        this.deleteChatMemory(chatId);
      }
    });
  }

  // === Import/Export ===

  exportAllMemory(): Record<string, unknown> {
    const chatList = this.getChatList();
    const chatMemories: Record<string, ChatMemory> = {};

    chatList.forEach((chatId) => {
      const memory = this.getChatMemory(chatId);
      if (memory) {
        chatMemories[chatId] = memory;
      }
    });

    return {
      global: this.getGlobalMemory(),
      chats: chatMemories,
      settings: this.getSettings(),
      exportedAt: Date.now(),
    };
  }

  clearAllMemory(): void {
    // Clear global memory
    this.clearGlobalMemory();

    // Clear all chat memories
    const chatList = this.getChatList();
    chatList.forEach((chatId) => {
      try {
        localStorage.removeItem(`${STORAGE_KEYS.CHAT_MEMORY_PREFIX}${chatId}`);
      } catch (error) {
        console.warn(`Failed to delete chat ${chatId}:`, error);
      }
    });

    // Clear chat list
    try {
      localStorage.removeItem(STORAGE_KEYS.CHAT_LIST);
    } catch (error) {
      console.warn("Failed to clear chat list:", error);
    }
  }

  // === Status & Stats ===

  getMemoryStats(): {
    enabled: boolean;
    chatCount: number;
    totalMessages: number;
    globalMemoryExists: boolean;
    storageUsed: number; // in bytes (estimated)
  } {
    const chatList = this.getChatList();
    let totalMessages = 0;
    let storageUsed = 0;

    chatList.forEach((chatId) => {
      const memory = this.getChatMemory(chatId);
      if (memory) {
        totalMessages += memory.messageCount;
        storageUsed += JSON.stringify(memory).length;
      }
    });

    const globalMemory = this.getGlobalMemory();
    if (globalMemory) {
      storageUsed += JSON.stringify(globalMemory).length;
    }

    return {
      enabled: this.settings.enabled,
      chatCount: chatList.length,
      totalMessages,
      globalMemoryExists: !!globalMemory,
      storageUsed,
    };
  }
}

// Singleton instance
export const memoryService = new MemoryService();
