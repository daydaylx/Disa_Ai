import type { ModelEntry } from "../config/models";

export type Role = "user" | "assistant" | "tool" | "system";
export type Message = {
  id: string;
  role: Role;
  content: string;
  ts?: number;
  timestamp: number;
  model?: string;
};
export type Model = ModelEntry;
