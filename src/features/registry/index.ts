export interface GameScenario {
  id: string;
  title: string;
  description: string;
  roleId: string; // The AI persona to use
  systemPrompt: string; // Overrides the role's default system prompt if needed
  initialMessage: string; // First message from the user/system to trigger the AI
  preferredModel?: string; // Optional model override
}

export const SCENARIOS: Record<string, GameScenario> = {
  interview: {
    id: "interview",
    title: "Unified Interview",
    description: "Ein tiefgehendes Interview-Szenario.",
    roleId: "career_advisor", // Uses existing role as base
    systemPrompt:
      "Du bist ein professioneller Interviewer. Dein Ziel ist es, durch gezielte Fragen die Persönlichkeit und Expertise des Nutzers herauszuarbeiten. Bleibe höflich, professionell, aber hak nach, wenn Antworten vage sind. Strukturiere das Interview in: 1. Einführung, 2. Fachlicher Hintergrund, 3. Persönliche Motivation, 4. Szenario-Fragen. Beende das Interview mit einer Zusammenfassung.",
    initialMessage: "Hallo. Ich bin bereit für unser Interview. Bitte stellen Sie sich kurz vor.",
    preferredModel: "google/gemini-2.0-flash-lite-preview-02-05:free",
  },
};

export function getScenario(id: string): GameScenario | null {
  return SCENARIOS[id] || null;
}
