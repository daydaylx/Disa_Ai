export type Role = "user" | "assistant" | "system";

export type ChatMessage = {
  id?: string;
  role: Role;
  content: string;
  ts?: number;
  meta?: Record<string, unknown>;
};

export type ConversationMeta = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};
