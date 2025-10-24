/**
 * Central type definitions for the application
 * This file serves as the single source of truth for all shared types
 */

// ==================== Message Types ====================

export type Role = "user" | "assistant" | "system";

/**
 * Base message interface used throughout the application
 * Consolidates previous definitions from ChatMessageType and Message
 */
export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number; // Unix timestamp in milliseconds
  tokens?: number;
  model?: string;
  language?: string;
}

export type MessageRole = Message["role"];

// Re-export existing types for backward compatibility
export type { ChatMessageType } from "./chatMessage";

// ==================== Chat Types ====================

export interface ChatSession {
  id: string;
  title?: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// ==================== UI Component Props ====================

export interface ChatAreaProps {
  messages: Message[];
  onSend: (message: string) => void;
}
