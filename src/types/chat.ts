export type Role = "system" | "user" | "assistant" | "tool";

export type ChatMessage = {
  role: Role;
  content: string;
};

export type ChatMessageLike = ChatMessage;