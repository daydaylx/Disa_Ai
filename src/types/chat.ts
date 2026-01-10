export type Role = "system" | "user" | "assistant" | "tool";

export type ChatMessage = {
  role: Role;
  content: string;
};

/**
 * Represents an image attachment for vision-enabled chat
 */
export interface VisionAttachment {
  id: string;
  dataUrl: string;
  mimeType: string;
  filename?: string;
  timestamp: number;
  size?: number; // Original file size in bytes
}