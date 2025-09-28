import { Message } from "../ui/chat/types";

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  tags: string[];
}

export interface ThreadSummary {
  id: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  tags: string[];
}

const STORAGE_KEY = "disa-threads";

export class ThreadStorage {
  private static instance: ThreadStorage;
  private threads: Map<string, Thread> = new Map();

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): ThreadStorage {
    if (!ThreadStorage.instance) {
      ThreadStorage.instance = new ThreadStorage();
    }
    return ThreadStorage.instance;
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const threadsArray: Thread[] = JSON.parse(stored);
        this.threads = new Map(threadsArray.map((thread) => [thread.id, thread]));
      }
    } catch (error) {
      console.error("Failed to load threads from storage:", error);
    }
  }

  private saveToStorage(): void {
    try {
      const threadsArray = Array.from(this.threads.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threadsArray));
    } catch (error) {
      console.error("Failed to save threads to storage:", error);
    }
  }

  createThread(title: string, messages: Message[] = []): Thread {
    const now = new Date().toISOString();
    const thread: Thread = {
      id: crypto.randomUUID(),
      title: title || "Neuer Thread",
      messages,
      createdAt: now,
      updatedAt: now,
      isPinned: false,
      tags: [],
    };

    this.threads.set(thread.id, thread);
    this.saveToStorage();
    return thread;
  }

  getThread(id: string): Thread | undefined {
    return this.threads.get(id);
  }

  getAllThreads(): Thread[] {
    return Array.from(this.threads.values()).sort((a, b) => {
      // Pinned threads first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by last updated
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  getThreadSummaries(): ThreadSummary[] {
    return this.getAllThreads().map((thread) => ({
      id: thread.id,
      title: thread.title,
      lastMessage:
        thread.messages.length > 0
          ? thread.messages[thread.messages.length - 1].content.slice(0, 100) + "..."
          : "Keine Nachrichten",
      messageCount: thread.messages.length,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
      isPinned: thread.isPinned,
      tags: thread.tags,
    }));
  }

  updateThread(id: string, updates: Partial<Omit<Thread, "id" | "createdAt">>): Thread | null {
    const thread = this.threads.get(id);
    if (!thread) return null;

    const updatedThread: Thread = {
      ...thread,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.threads.set(id, updatedThread);
    this.saveToStorage();
    return updatedThread;
  }

  deleteThread(id: string): boolean {
    const deleted = this.threads.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  togglePin(id: string): Thread | null {
    const thread = this.threads.get(id);
    if (!thread) return null;

    return this.updateThread(id, { isPinned: !thread.isPinned });
  }

  searchThreads(query: string): ThreadSummary[] {
    if (!query.trim()) return this.getThreadSummaries();

    const lowerQuery = query.toLowerCase();
    const filtered = this.getAllThreads().filter((thread) => {
      // Search in title
      if (thread.title.toLowerCase().includes(lowerQuery)) return true;

      // Search in messages
      if (thread.messages.some((msg) => msg.content.toLowerCase().includes(lowerQuery)))
        return true;

      // Search in tags
      if (thread.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))) return true;

      return false;
    });

    return filtered.map((thread) => ({
      id: thread.id,
      title: thread.title,
      lastMessage:
        thread.messages.length > 0
          ? thread.messages[thread.messages.length - 1].content.slice(0, 100) + "..."
          : "Keine Nachrichten",
      messageCount: thread.messages.length,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
      isPinned: thread.isPinned,
      tags: thread.tags,
    }));
  }

  addMessageToThread(threadId: string, message: Message): Thread | null {
    const thread = this.threads.get(threadId);
    if (!thread) return null;

    const updatedMessages = [...thread.messages, message];
    return this.updateThread(threadId, { messages: updatedMessages });
  }

  // Utility functions
  getStats() {
    const threads = this.getAllThreads();
    return {
      totalThreads: threads.length,
      pinnedThreads: threads.filter((t) => t.isPinned).length,
      totalMessages: threads.reduce((sum, t) => sum + t.messages.length, 0),
      lastActivity:
        threads.length > 0
          ? Math.max(...threads.map((t) => new Date(t.updatedAt).getTime()))
          : null,
    };
  }
}
