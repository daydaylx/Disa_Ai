export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  /** optionale Metadaten (nicht an die API senden) */
  meta?: {
    id?: string;
    conversationId?: string;
    timestamp?: number;
    tokenCount?: number;
    status?: "sending" | "sent" | "error";
  };
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  systemPrompt?: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  tokenCount: number;
  archived: boolean;
}
