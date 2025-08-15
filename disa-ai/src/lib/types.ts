export type Persona = {
  id: string;
  label: string;
  description?: string;
  system: string;
};

export type ModelInfo = {
  id: string;
  label: string;
  provider?: string;
};

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
