export type PersonaModel = {
  id: string; // z.B. "openrouter/auto" oder "mistralai/mistral-small"
  label: string; // kurzer Anzeigename
  tags?: string[]; // optionale Tags
  context?: number; // optionaler Kontext (Tokens)
};
export type PersonaStyle = {
  id: string; // "neutral", "kritisch", ...
  name: string; // Anzeigename
  system: string; // Systemprompt (wird 1:1 gesendet)
  hint?: string; // UI-Hinweis
  allow?: string[]; // erlaubte Model-IDs
  deny?: string[]; // verbotene Model-IDs
};
export type PersonaData = {
  models: PersonaModel[];
  styles: PersonaStyle[];
};
