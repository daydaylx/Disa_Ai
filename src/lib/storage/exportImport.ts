import type { Conversation } from "./indexedDB";
import { conversationDB } from "./indexedDB";

export interface ExportData {
  version: string;
  exportedAt: number;
  conversations: Conversation[];
}

export interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: number;
  duplicates: string[];
}

const EXPORT_VERSION = "1.0";

export async function exportConversations(): Promise<string> {
  try {
    const conversations = await conversationDB.listConversations();

    const exportData: ExportData = {
      version: EXPORT_VERSION,
      exportedAt: Date.now(),
      conversations,
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error("Export failed:", error);
    throw new Error("Export fehlgeschlagen");
  }
}

export async function downloadConversationsAsJson(): Promise<void> {
  try {
    const jsonData = await exportConversations();
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `disa-ai-conversations-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Download fehlgeschlagen");
  }
}

function generateConversationFingerprint(conversation: Conversation): string {
  // Create a fingerprint based on content that uniquely identifies a conversation
  // Use first and last message content + timestamp to detect duplicates
  const messages = conversation.messages;
  if (messages.length === 0) return conversation.id;

  const firstMessage = messages[0];
  const lastMessage = messages[messages.length - 1];

  const fingerprint = [
    firstMessage.role,
    firstMessage.content.substring(0, 100),
    lastMessage.role,
    lastMessage.content.substring(0, 100),
    messages.length,
    conversation.createdAt,
  ].join("|");

  return btoa(fingerprint).substring(0, 32);
}

function areConversationsSimilar(conv1: Conversation, conv2: Conversation): boolean {
  // Check if conversations are duplicates/similar
  if (conv1.id === conv2.id) return true;

  // Check fingerprint match
  if (generateConversationFingerprint(conv1) === generateConversationFingerprint(conv2)) {
    return true;
  }

  // Check if message count and timing are very similar
  if (
    conv1.messages.length === conv2.messages.length &&
    Math.abs(conv1.createdAt - conv2.createdAt) < 60000
  ) {
    // Within 1 minute

    // Check if first messages are identical
    if (conv1.messages.length > 0 && conv2.messages.length > 0) {
      const msg1 = conv1.messages[0];
      const msg2 = conv2.messages[0];
      if (msg1.role === msg2.role && msg1.content === msg2.content) {
        return true;
      }
    }
  }

  return false;
}

export async function importConversations(
  jsonData: string,
  options: {
    overwriteDuplicates?: boolean;
    skipDuplicates?: boolean;
  } = {},
): Promise<ImportResult> {
  const result: ImportResult = {
    total: 0,
    imported: 0,
    skipped: 0,
    errors: 0,
    duplicates: [],
  };

  try {
    const data = JSON.parse(jsonData) as ExportData;

    if (!data.conversations || !Array.isArray(data.conversations)) {
      throw new Error("Ungültiges Export-Format");
    }

    result.total = data.conversations.length;

    // Get existing conversations for duplicate detection
    const existingConversations = await conversationDB.listConversations();
    const fingerprints = new Map<string, Conversation>();

    // Create fingerprint map of existing conversations
    for (const existing of existingConversations) {
      const fingerprint = generateConversationFingerprint(existing);
      fingerprints.set(fingerprint, existing);
    }

    for (const conversation of data.conversations) {
      try {
        // Validate conversation structure
        if (!conversation.id || !Array.isArray(conversation.messages)) {
          console.warn("Invalid conversation structure, skipping:", conversation);
          result.errors++;
          continue;
        }

        // Check for duplicates
        const fingerprint = generateConversationFingerprint(conversation);
        const existingByFingerprint = fingerprints.get(fingerprint);

        let isDuplicate = false;
        let existingMatch: Conversation | null = null;

        // Check by fingerprint first
        if (existingByFingerprint) {
          isDuplicate = true;
          existingMatch = existingByFingerprint;
        } else {
          // Check by ID
          existingMatch = await conversationDB.getConversation(conversation.id);
          if (existingMatch) {
            isDuplicate = areConversationsSimilar(conversation, existingMatch);
          }
        }

        if (isDuplicate && existingMatch) {
          result.duplicates.push(conversation.id);

          if (options.skipDuplicates) {
            result.skipped++;
            continue;
          }

          if (!options.overwriteDuplicates) {
            // Default behavior: generate new ID for import
            const originalId = conversation.id;
            conversation.id = `${originalId}-imported-${Date.now()}`;
            conversation.title = `${conversation.title} (Importiert)`;
          }
        }

        // Import the conversation
        await conversationDB.putConversation({
          ...conversation,
          // Ensure timestamps are valid
          createdAt: conversation.createdAt || Date.now(),
          updatedAt: conversation.updatedAt || Date.now(),
        });

        result.imported++;

        // Update fingerprint map
        fingerprints.set(generateConversationFingerprint(conversation), conversation);
      } catch (error) {
        console.error(`Failed to import conversation ${conversation.id}:`, error);
        result.errors++;
      }
    }
  } catch (error) {
    console.error("Import failed:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Ungültige JSON-Datei");
    }
    throw new Error("Import fehlgeschlagen");
  }

  return result;
}

export async function importFromFile(
  file: File,
  options?: {
    overwriteDuplicates?: boolean;
    skipDuplicates?: boolean;
  },
): Promise<ImportResult> {
  try {
    const text = await file.text();
    return await importConversations(text, options);
  } catch (error) {
    console.error("File import failed:", error);
    throw new Error("Datei konnte nicht gelesen werden");
  }
}

export function createImportFileInput(
  onImport: (result: ImportResult) => void,
  options?: {
    overwriteDuplicates?: boolean;
    skipDuplicates?: boolean;
  },
): HTMLInputElement {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.style.display = "none";

  input.addEventListener("change", async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const result = await importFromFile(file, options);
      onImport(result);
    } catch (error) {
      console.error("Import failed:", error);
      onImport({
        total: 0,
        imported: 0,
        skipped: 0,
        errors: 1,
        duplicates: [],
      });
    }

    // Reset input
    input.value = "";
  });

  return input;
}
