export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/**
 * Alias für ältere/andere Call-Sites, die ChatMessageLike erwarten.
 * Entspricht aktuell exakt ChatMessage.
 */
export type ChatMessageLike = ChatMessage;
