/**
 * Conversation Management System
 *
 * Handles chat history persistence, export/import, and conversation organization
 */

import type { Message } from "../ui/types";

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model?: string;
  messageCount: number;
  lastActivity: number;
}

export interface ConversationExport {
  version: string;
  exportDate: number;
  conversations: Conversation[];
  metadata: {
    totalConversations: number;
    totalMessages: number;
    appVersion: string;
  };
}

const STORAGE_KEY = "disa:conversations";
const MAX_CONVERSATIONS = 100; // Limit to prevent storage bloat
const _AUTO_TITLE_THRESHOLD = 3; // Generate title after 3+ messages (reserved for future use)

/**
 * Generate conversation title from messages
 */
function generateConversationTitle(messages: Message[]): string {
  // Find first meaningful user message
  const userMessage = messages.find((m) => m.role === "user" && m.content.trim().length > 5);

  if (!userMessage) {
    return `Untitled Conversation - ${new Date().toLocaleDateString()}`;
  }

  // Extract first 50 characters and clean up
  let title = userMessage.content.trim().substring(0, 50);

  // Remove markdown and special characters
  title = title.replace(/[#*`_~]/g, "").trim();

  // Add ellipsis if truncated
  if (userMessage.content.length > 50) {
    title += "...";
  }

  return title || `Conversation - ${new Date().toLocaleDateString()}`;
}

/**
 * Get all conversations from storage
 */
export function getAllConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const conversations = (JSON.parse(stored) as Conversation[]).map((conv) => {
      if (conv && typeof conv.lastActivity !== "number") {
        conv.lastActivity = conv.updatedAt || conv.createdAt || Date.now();
      }
      return conv;
    });

    // Sort by last activity (most recent first)
    return conversations.sort((a, b) => b.lastActivity - a.lastActivity);
  } catch (error) {
    console.error("Failed to load conversations:", error);
    return [];
  }
}

/**
 * Get specific conversation by ID
 */
export function getConversation(id: string): Conversation | null {
  const conversations = getAllConversations();
  return conversations.find((c) => c.id === id) || null;
}

/**
 * Save conversation to storage
 */
export function saveConversation(messages: Message[], conversationId?: string): string {
  if (messages.length === 0) return "";

  const conversations = getAllConversations();
  const now = Date.now();
  const id = conversationId || `conv_${now}_${Math.random().toString(36).substring(2)}`;

  // Find existing conversation or create new one
  const existingIndex = conversations.findIndex((c) => c.id === id);

  const conversation: Conversation = {
    id,
    title: generateConversationTitle(messages),
    messages: [...messages], // Deep copy to avoid mutations
    createdAt: existingIndex >= 0 ? conversations[existingIndex].createdAt : now,
    updatedAt: now,
    model: messages.find((m) => m.model)?.model,
    messageCount: messages.length,
    lastActivity: now,
  };

  if (existingIndex >= 0) {
    conversations[existingIndex] = conversation;
  } else {
    conversations.unshift(conversation);
  }

  // Limit total conversations
  if (conversations.length > MAX_CONVERSATIONS) {
    conversations.splice(MAX_CONVERSATIONS);
  }

  // Save to storage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error("Failed to save conversation:", error);

    // If storage full, try removing oldest conversations
    if (error instanceof DOMException && error.code === 22) {
      const reducedConversations = conversations.slice(0, Math.floor(MAX_CONVERSATIONS / 2));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedConversations));
      } catch (retryError) {
        console.error("Failed to save even after cleanup:", retryError);
      }
    }
  }

  return id;
}

/**
 * Delete conversation by ID
 */
export function deleteConversation(id: string): boolean {
  const conversations = getAllConversations();
  const filteredConversations = conversations.filter((c) => c.id !== id);

  if (filteredConversations.length === conversations.length) {
    return false; // Conversation not found
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredConversations));
    return true;
  } catch (error) {
    console.error("Failed to delete conversation:", error);
    return false;
  }
}

/**
 * Update conversation title
 */
export function updateConversationTitle(id: string, title: string): boolean {
  const conversations = getAllConversations();
  const conversation = conversations.find((c) => c.id === id);

  if (!conversation) return false;

  conversation.title = title.trim() || generateConversationTitle(conversation.messages);
  conversation.updatedAt = Date.now();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    return true;
  } catch (error) {
    console.error("Failed to update conversation title:", error);
    return false;
  }
}

/**
 * Export conversations to JSON
 */
export function exportConversations(conversationIds?: string[]): ConversationExport {
  const allConversations = getAllConversations();
  const conversationsToExport = conversationIds
    ? allConversations.filter((c) => conversationIds.includes(c.id))
    : allConversations;

  const exportData: ConversationExport = {
    version: "1.0",
    exportDate: Date.now(),
    conversations: conversationsToExport,
    metadata: {
      totalConversations: conversationsToExport.length,
      totalMessages: conversationsToExport.reduce((sum, c) => sum + c.messageCount, 0),
      appVersion: "1.0.0", // Could be from package.json
    },
  };

  return exportData;
}

/**
 * Import conversations from JSON
 */
export function importConversations(
  exportData: ConversationExport,
  options: {
    mergeStrategy: "replace" | "merge" | "skip-duplicates";
    createBackup?: boolean;
  } = { mergeStrategy: "merge", createBackup: true },
): { success: boolean; importedCount: number; errors: string[] } {
  const errors: string[] = [];
  let importedCount = 0;

  try {
    // Validate export data
    if (
      !exportData.version ||
      !exportData.conversations ||
      !Array.isArray(exportData.conversations)
    ) {
      return { success: false, importedCount: 0, errors: ["Invalid export format"] };
    }

    // Create backup if requested
    if (options.createBackup) {
      const backup = exportConversations();
      const backupKey = `${STORAGE_KEY}_backup_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backup));
    }

    const existingConversations = getAllConversations();
    let finalConversations: Conversation[] = [];

    // Sanitize imported data to prevent crashes
    exportData.conversations = exportData.conversations
      .filter(Boolean) // Remove null/undefined entries
      .map((conv) => {
        if (typeof conv.lastActivity !== "number") {
          conv.lastActivity = conv.updatedAt || conv.createdAt || Date.now();
        }
        return conv;
      });

    switch (options.mergeStrategy) {
      case "replace":
        finalConversations = [...exportData.conversations];
        importedCount = exportData.conversations.length;
        break;

      case "merge":
        finalConversations = [...existingConversations];
        for (const importedConv of exportData.conversations) {
          const existingIndex = finalConversations.findIndex((c) => c.id === importedConv.id);
          if (existingIndex >= 0) {
            finalConversations[existingIndex] = importedConv;
          } else {
            finalConversations.push(importedConv);
          }
          importedCount++;
        }
        break;

      case "skip-duplicates":
        finalConversations = [...existingConversations];
        for (const importedConv of exportData.conversations) {
          const exists = finalConversations.some((c) => c.id === importedConv.id);
          if (!exists) {
            finalConversations.push(importedConv);
            importedCount++;
          }
        }
        break;
    }

    // Sort by last activity
    finalConversations.sort((a, b) => b.lastActivity - a.lastActivity);

    // Limit conversations
    if (finalConversations.length > MAX_CONVERSATIONS) {
      finalConversations = finalConversations.slice(0, MAX_CONVERSATIONS);
    }

    // Save to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalConversations));

    return { success: true, importedCount, errors };
  } catch (error) {
    console.error("Import failed:", error);
    return {
      success: false,
      importedCount,
      errors: [`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}

/**
 * Search conversations by title or content
 */
export function searchConversations(query: string): Conversation[] {
  if (!query.trim()) return getAllConversations();

  const conversations = getAllConversations();
  const lowerQuery = query.toLowerCase();

  return conversations.filter((conversation) => {
    // Search in title
    if (conversation.title.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in message content
    return conversation.messages.some((message) =>
      message.content.toLowerCase().includes(lowerQuery),
    );
  });
}

/**
 * Get conversation statistics
 */
export function getConversationStats() {
  const conversations = getAllConversations();

  if (conversations.length === 0) {
    return {
      totalConversations: 0,
      totalMessages: 0,
      averageMessagesPerConversation: 0,
      oldestConversation: null,
      newestConversation: null,
      modelsUsed: [],
    };
  }

  const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0);
  const modelsUsed = [...new Set(conversations.map((c) => c.model).filter(Boolean))];

  return {
    totalConversations: conversations.length,
    totalMessages,
    averageMessagesPerConversation: Math.round(totalMessages / conversations.length),
    oldestConversation: conversations.reduce((oldest, current) =>
      current.createdAt < oldest.createdAt ? current : oldest,
    ),
    newestConversation: conversations.reduce((newest, current) =>
      current.createdAt > newest.createdAt ? current : newest,
    ),
    modelsUsed,
  };
}

/**
 * Clean up old conversations (for maintenance)
 */
export function cleanupOldConversations(daysOld: number = 30): number {
  const conversations = getAllConversations();
  const cutoffDate = Date.now() - daysOld * 24 * 60 * 60 * 1000;

  const recentConversations = conversations.filter((c) => c.lastActivity > cutoffDate);
  const removedCount = conversations.length - recentConversations.length;

  if (removedCount > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentConversations));
  }

  return removedCount;
}
