export type TemplateCategory = "alltag" | "gesundheit" | "dev" | "business" | "kreativ" | "leer";

export interface TemplateMeta {
  id: string;
  title: string;
  purpose: string;
  tags: string[];
  category: TemplateCategory;
  systemPrompt?: string;
}

const STORAGE_ACTIVE = "disa:activeTemplateId";
const STORAGE_DEFAULT = "disa:defaultTemplateId";

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "empty",
    title: "Leerer Chat",
    purpose: "Ohne Vorgaben direkt starten.",
    tags: ["neutral"],
    category: "leer",
  },
  {
    id: "everyday",
    title: "Alltag",
    purpose: "Kurze Antworten für Orga & Alltag.",
    tags: ["schnell", "de"],
    category: "alltag",
  },
  {
    id: "dev",
    title: "Dev",
    purpose: "Code-Snippets, Fehlersuche, Reviews.",
    tags: ["code"],
    category: "dev",
    systemPrompt:
      "Du bist ein präziser, knapper Entwicklungsassistent. Antworte mit lauffähigem Code und kurzen Begründungen.",
  },
  {
    id: "business",
    title: "Business",
    purpose: "Mails, Konzepte, kurze Analysen.",
    tags: ["klar", "de"],
    category: "business",
  },
  {
    id: "health",
    title: "Gesundheit",
    purpose: "Allgemeine Tipps – ersetzt keinen Arzt.",
    tags: ["vorsicht"],
    category: "gesundheit",
  },
  {
    id: "creative",
    title: "Kreativ",
    purpose: "Texte, Ideen, Umschreiben.",
    tags: ["schreiben"],
    category: "kreativ",
  },
];

export function getTemplateById(id?: string | null) {
  return id ? TEMPLATES.find((t) => t.id === id) : undefined;
}
export function setActiveTemplate(id: string | null) {
  if (!id) localStorage.removeItem(STORAGE_ACTIVE);
  else if (getTemplateById(id)) localStorage.setItem(STORAGE_ACTIVE, id);
}
export function getActiveTemplateId(): string | null {
  return localStorage.getItem(STORAGE_ACTIVE);
}
export function setDefaultTemplate(id: string | null) {
  if (!id) localStorage.removeItem(STORAGE_DEFAULT);
  else if (getTemplateById(id)) localStorage.setItem(STORAGE_DEFAULT, id);
}
export function getDefaultTemplateId(): string | null {
  return localStorage.getItem(STORAGE_DEFAULT);
}
export function resolveStartTemplate() {
  return (
    getTemplateById(getActiveTemplateId() || undefined) ??
    getTemplateById(getDefaultTemplateId() || undefined) ??
    null
  );
}
