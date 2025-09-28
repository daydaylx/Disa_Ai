export type Role = "user" | "assistant" | "system" | "role";
export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  language?: string;
}
