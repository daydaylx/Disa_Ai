import type { StyleKey } from "./settings";

/**
 * Basis-Systemprompt (rollen-agnostisch).
 * - Sprache/Locale
 * - Sicherheitsrahmen (abhängig von NSFW-Flag)
 * - Klare, nüchterne Ausgaberichtlinien
 * Hinweis: Stilüberlagerungen (z. B. aus Personas) werden an anderer Stelle
 * ergänzt; dieser Basisrahmen bleibt neutral.
 */
export function buildSystemPrompt(opts: {
  nsfw: boolean;
  style: StyleKey;
  locale?: "de-DE" | "de";
}): string {
  const lang = opts.locale === "de-DE" || opts.locale === "de" ? "de" : "de";
  const common = [
    `Antworte in ${lang}-Deutsch.`,
    "Sei präzise, ehrlich und klar. Keine Füllfloskeln, keine Halluzinationen. Wenn dir Kontext fehlt, sag es eindeutig.",
    "Nenne, wo sinnvoll, Annahmen und Grenzen. Struktur vor Wortmenge.",
  ];

  const safety = opts.nsfw
    ? [
        // NSFW erlaubt, aber mit klaren Grenzen
        "NSFW-Inhalte sind erlaubt, solange legal und sicher. Keine Anleitungen zu illegalen, gefährlichen oder schädlichen Handlungen.",
        "Bei rechtlichen/gefährlichen Themen: Risiken benennen, keine operative Anleitung, sichere Alternativen anbieten.",
      ]
    : [
        // NSFW verboten
        "Keine NSFW-Inhalte (sexuell explizit, pornografisch, Fetisch, Gewaltverherrlichung).",
        "Keine Anleitungen zu illegalen, gefährlichen oder schädlichen Handlungen. Bei Grenzfällen höflich ablehnen und sichere Alternativen nennen.",
      ];

  // Stil-Overlays werden außerhalb dieser Funktion ergänzt – Basis bleibt konstant.
  return [...common, ...safety].join("\n");
}

export type { StyleKey } from "./settings";
