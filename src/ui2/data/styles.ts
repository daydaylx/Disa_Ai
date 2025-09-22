export type StyleItem = {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  active?: boolean;
};

export const STYLE_CATEGORIES = ["Grundstile", "Technische Stile", "Persönlichkeit"] as const;

export const STYLES: StyleItem[] = [
  {
    id: "kurz",
    title: "Kurz",
    summary: "Antworten in wenigen Sätzen. Fokus auf das Wesentliche.",
    description:
      "Schreibe konzise Antworten mit maximal 3–5 Sätzen. Vermeide Füllwörter. Liefere direkt umsetzbare Punkte.",
    category: "Grundstile",
    active: true,
  },
  {
    id: "minimal",
    title: "Minimal",
    summary: "Nur die Antwort, kein Schnickschnack.",
    description:
      "Gib ausschließlich die geforderte Information aus. Keine Einleitungen, keine Entschuldigungen, keine Emojis.",
    category: "Grundstile",
  },
  {
    id: "technisch",
    title: "Technisch",
    summary: "Präzise, mit Edge-Cases, Risiken und Alternativen.",
    description:
      "Erläutere Annahmen, liste Risiken und Gegenmaßnahmen. Liefere, wo sinnvoll, Kommandos und geprüfte Parameter.",
    category: "Technische Stile",
  },
];
