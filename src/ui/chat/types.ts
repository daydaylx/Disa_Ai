export type Role = "user" | "assistant" | "system";
export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  language?: string;
}
