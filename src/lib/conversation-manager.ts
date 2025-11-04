// Real implementation of conversation manager functions using localStorage

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
  model: string;
  messageCount: number;
  messages?: any[];
  isFavorite?: boolean;
}

interface ConversationMetadata {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  messageCount: number;
}

interface ExportData {
  version: string;
  metadata: {
    exportedAt: string;
    totalConversations: number;
    appVersion: string;
  };
  conversations: any[];
}

const CONVERSATIONS_KEY = "disa:conversations";
const CONVERSATIONS_METADATA_KEY = "disa:conversations:metadata";

function getStoredConversations(): Record<string, Conversation> {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to parse conversations from localStorage:", error);
    return {};
  }
}

function getStoredMetadata(): Record<string, ConversationMetadata> {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_METADATA_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to parse conversation metadata from localStorage:", error);
    return {};
  }
}

function saveStoredConversations(conversations: Record<string, Conversation>): void {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error("Failed to save conversations to localStorage:", error);
  }
}

function saveStoredMetadata(metadata: Record<string, ConversationMetadata>): void {
  try {
    localStorage.setItem(CONVERSATIONS_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error("Failed to save conversation metadata to localStorage:", error);
  }
}

export function getConversationStats() {
  const conversations = getStoredConversations();

  const conversationIds = Object.keys(conversations);
  const totalConversations = conversationIds.length;

  let totalMessages = 0;
  const modelsUsed: string[] = [];
  let storageSize = 0;

  for (const conversation of Object.values(conversations)) {
    if (conversation.messages) {
      totalMessages += conversation.messages.length;
    }

    if (!modelsUsed.includes(conversation.model)) {
      modelsUsed.push(conversation.model);
    }
  }

  // Estimate storage size (rough approximation)
  try {
    storageSize = new Blob([JSON.stringify(conversations)]).size;
  } catch (error) {
    console.error("Failed to calculate storage size:", error);
  }

  const averageMessagesPerConversation =
    totalConversations > 0 ? totalMessages / totalConversations : 0;

  return {
    totalConversations,
    totalMessages,
    averageMessagesPerConversation,
    modelsUsed,
    storageSize,
  };
}

export function getAllConversations(): ConversationMetadata[] {
  const metadata = getStoredMetadata();
  return Object.values(metadata).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getConversation(id: string): Conversation | null {
  const conversations = getStoredConversations();
  return conversations[id] || null;
}

export function saveConversation(conversation: Conversation): void {
  try {
    const conversations = getStoredConversations();
    const metadata = getStoredMetadata();

    // Save full conversation
    conversations[conversation.id] = conversation;

    // Save metadata
    metadata[conversation.id] = {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      model: conversation.model,
      messageCount: conversation.messageCount,
    };

    saveStoredConversations(conversations);
    saveStoredMetadata(metadata);
  } catch (error) {
    console.error(`Failed to save conversation ${conversation.id}:`, error);
  }
}

export function deleteConversation(id: string): void {
  try {
    const conversations = getStoredConversations();
    const metadata = getStoredMetadata();

    delete conversations[id];
    delete metadata[id];

    saveStoredConversations(conversations);
    saveStoredMetadata(metadata);
  } catch (error) {
    console.error(`Failed to delete conversation ${id}:`, error);
  }
}

export function cleanupOldConversations(days: number): number {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const conversations = getStoredConversations();
    const metadata = getStoredMetadata();
    let deletedCount = 0;

    for (const [id, conversation] of Object.entries(conversations)) {
      const lastActivity = conversation.lastActivity || conversation.updatedAt;
      const conversationDate = new Date(lastActivity);

      if (conversationDate < cutoffDate) {
        delete conversations[id];
        delete metadata[id];
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      saveStoredConversations(conversations);
      saveStoredMetadata(metadata);
    }

    return deletedCount;
  } catch (error) {
    console.error(`Failed to cleanup old conversations:`, error);
    return 0;
  }
}

export function exportConversations(): ExportData {
  try {
    const conversations = getStoredConversations();
    const conversationList = Object.values(conversations);

    return {
      version: "1.0",
      metadata: {
        exportedAt: new Date().toISOString(),
        totalConversations: conversationList.length,
        appVersion: "1.0.0",
      },
      conversations: conversationList,
    };
  } catch (error) {
    console.error("Failed to export conversations:", error);
    return {
      version: "1.0",
      metadata: {
        exportedAt: new Date().toISOString(),
        totalConversations: 0,
        appVersion: "1.0.0",
      },
      conversations: [],
    };
  }
}

export function importConversations(
  data: ExportData,
  options: { overwrite?: boolean; merge?: boolean },
) {
  try {
    const conversations = getStoredConversations();
    const metadata = getStoredMetadata();
    let importedCount = 0;
    const errors: string[] = [];

    for (const conversation of data.conversations) {
      try {
        // Check if conversation already exists
        const exists = !!conversations[conversation.id];

        if (exists && !options.overwrite && !options.merge) {
          continue; // Skip existing conversations
        }

        // Save conversation
        conversations[conversation.id] = conversation;
        metadata[conversation.id] = {
          id: conversation.id,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          model: conversation.model,
          messageCount: conversation.messageCount,
        };

        importedCount++;
      } catch (error) {
        errors.push(`Failed to import conversation ${conversation.id}: ${error}`);
      }
    }

    if (importedCount > 0) {
      saveStoredConversations(conversations);
      saveStoredMetadata(metadata);
    }

    return {
      success: errors.length === 0,
      importedCount,
      errors,
    };
  } catch (error) {
    console.error("Failed to import conversations:", error);
    return {
      success: false,
      importedCount: 0,
      errors: [`Failed to import conversations: ${error}`],
    };
  }
}
