import type { ModelEntry } from "../config/models";

export type Role = "user" | "assistant" | "tool";
export type Message = { id: string; role: Role; content: string; ts: number };
export type Model = ModelEntry;
