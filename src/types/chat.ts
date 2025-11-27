export type Role = "system" | "user" | "assistant" | "tool";

export type ChatMessage = {
  role: Role;
  content: string;
};

export type ChatStatus = "idle" | "streaming" | "ok" | "missing_key" | "rate_limited" | "error";
