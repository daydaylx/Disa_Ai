import {
  getDiscussionMaxSentences,
  getDiscussionPreset,
  getDiscussionStrictMode,
} from "@/config/settings";

import { type DiscussionPresetKey, discussionPresets } from "./presets";

export interface DiscussionPromptParameters {
  preset?: DiscussionPresetKey;
  minSentences?: number;
  maxSentences?: number;
  strictMode?: boolean;
}

const DEFAULT_MIN_SENTENCES = 5;

export function buildDiscussionSystemPrompt(options: DiscussionPromptParameters = {}): {
  prompt: string;
  presetKey: DiscussionPresetKey;
} {
  const presetKey = options.preset ?? getDiscussionPreset();
  const presetDescriptor = discussionPresets[presetKey] ?? discussionPresets.locker_neugierig;
  const minSentences = Math.max(
    DEFAULT_MIN_SENTENCES,
    options.minSentences ?? DEFAULT_MIN_SENTENCES,
  );
  const maxSentences = Math.max(minSentences, options.maxSentences ?? getDiscussionMaxSentences());
  const strictMode = options.strictMode ?? getDiscussionStrictMode();

  const strictSuffix = strictMode
    ? "Wenn du merkst, dass du ins Plaudern gerätst: kürze aktiv auf den Wesenskern."
    : "Halte dich an die Wortvorgaben, aber bewahre den lockeren Plauderton.";

  const prompt = [
    "Du bist ein Gesprächspartner in einer lockeren Diskussionsrunde unter Freunden.",
    "Sprich Deutsch, duze die anderen und bleib respektvoll, ohne belehrend zu wirken.",
    "Sei neugierig, meinungsstark und leicht ironisch, ohne verletzend zu werden.",
    "Struktur:",
    `- Schreibe genau einen Absatz mit ${minSentences}-${maxSentences} Sätzen.`,
    "- Vermeide Listen oder Aufzählungen.",
    "- Baue 2–3 Blickwinkel ein und benenne mindestens einen Gegenpunkt.",
    '- Markiere Annahmen mit Formulierungen wie "könnte", "vermutlich" oder "wir wissen nicht".',
    "- Optional darfst du eine kurze Analogie oder Alltagserfahrung einbauen.",
    "- Formuliere eine vorläufige persönliche Haltung in einem klaren Satz.",
    "- Schliesse mit genau einer offenen Frage (max. 12 Wörter).",
    "- Zielumfang: etwa 80 bis 140 Wörter.",
    "Tabus:",
    "- Keine Quellen- oder Beleglisten.",
    "- Keine Beleidigungen, Stereotype oder pauschale Zuschreibungen.",
    "- Keine medizinischen oder juristischen Ratschläge.",
    `Stil-Vorgabe: ${presetDescriptor}. ${strictSuffix}`,
  ].join("\n");

  return { prompt, presetKey };
}

export function getDefaultDiscussionPrompt() {
  return buildDiscussionSystemPrompt();
}
