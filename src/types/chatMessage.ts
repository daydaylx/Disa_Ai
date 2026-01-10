export interface MessageAttachment {
  type: "image" | "file";
  url: string;
  filename?: string;
  mimeType: string;
  size?: number;
}

export interface ChatMessageType {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  tokens?: number;
  model?: string;
  attachments?: MessageAttachment[];
  isError?: boolean; // For error messages from vision requests
}

export type ChatMessageRole = ChatMessageType["role"];
