export interface Persona {
  id: string;
  name: string;
  systemPrompt: string;
  styleHints: {
    typographyScale: number;
    borderRadius: number;
    accentColor: string;
  };
}

export const defaultPersonas: Persona[] = [
  {
    id: "default",
    name: "Standard",
    systemPrompt: "Du bist ein hilfreicher Assistent.",
    styleHints: {
      typographyScale: 1,
      borderRadius: 0.5,
      accentColor: "hsl(var(--primary))",
    },
  },
  {
    id: "developer",
    name: "Entwickler",
    systemPrompt:
      "Du bist ein hilfreicher Assistent für Softwareentwickler. Du lieferst Codebeispiele und technische Erklärungen.",
    styleHints: {
      typographyScale: 1.1,
      borderRadius: 0.25,
      accentColor: "hsl(var(--success))",
    },
  },
  {
    id: "creative",
    name: "Kreativ",
    systemPrompt: "Du bist ein kreativer Assistent, der beim Schreiben und Brainstorming hilft.",
    styleHints: {
      typographyScale: 1.2,
      borderRadius: 0.75,
      accentColor: "hsl(var(--warning))",
    },
  },
];

// In-memory store for personas
let personas: Persona[] = [...defaultPersonas];

export function getPersonas(): Persona[] {
  return personas;
}

export function addPersona(persona: Persona): void {
  personas.push(persona);
}

export function updatePersona(updatedPersona: Persona): void {
  personas = personas.map((p) => (p.id === updatedPersona.id ? updatedPersona : p));
}

export function deletePersona(personaId: string): void {
  personas = personas.filter((p) => p.id !== personaId);
}
