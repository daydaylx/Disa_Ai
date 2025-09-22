export type Role = "user" | "assistant" | "tool";
export type Message = { id: string; role: Role; content: string; ts: number };
export type Model = {
  id: string;
  name: string;
  pricePer1k: number;
  context: number;
  tags: string[];
};
