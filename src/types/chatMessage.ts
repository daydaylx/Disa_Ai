export interface ChatMessageType {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  tokens?: number;
  model?: string;
  isError?: boolean; // For error messages
}

export type ChatMessageRole = ChatMessageType["role"];
