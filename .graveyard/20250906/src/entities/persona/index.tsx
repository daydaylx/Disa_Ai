import React from "react";

export type PersonaModel = { id: string; label: string; tags?: string[]; context?: number };
export type PersonaStyle = {
  id: string;
  name: string;
  system: string;
  hint?: string;
  allow?: string[];
  deny?: string[];
};
export type PersonaData = { models: PersonaModel[]; styles: PersonaStyle[] };

export const PersonaContext = React.createContext<{
  data: PersonaData;
  warnings: string[];
  error: string | null;
  reload: () => void;
}>({ data: { models: [], styles: [] }, warnings: [], error: null, reload: () => {} });

export function usePersona() {
  const ctx = React.useContext(PersonaContext);
  if (!ctx) throw new Error("PersonaContext fehlt");
  return ctx;
}
