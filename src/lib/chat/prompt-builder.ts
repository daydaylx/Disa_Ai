import { type DiscussionPresetKey, discussionPresets } from "../../prompts/discussion/presets";

interface PromptSettings {
  showNSFWContent: boolean;
  language: string;
  discussionPreset: DiscussionPresetKey;
  discussionStrict: boolean;
  discussionMaxSentences: number;
}

export function buildSafetyPrompt(showNSFWContent: boolean): string {
  return showNSFWContent
    ? ""
    : "Content-Safety: Keine sexualisierten, verstörenden oder jugendgefährdenden Inhalte. Bleibe sachlich, respektvoll und filtere NSFW-Anfragen.";
}

export function buildDiscussionPrompt(settings: PromptSettings): string {
  const presetStyle = discussionPresets[settings.discussionPreset];
  const strict = settings.discussionStrict;
  const maxSentences = settings.discussionMaxSentences;
  const language = settings.language || "de";

  const parts = [
    `Antwortsprache: ${language}.`,
    presetStyle ? `Diskussionsstil: ${presetStyle}.` : "",
    `Begrenze Antworten auf maximal ${maxSentences} Sätze. Falls kürzere Antworten klarer sind, wähle prägnante Formulierungen.`,
    // WICHTIG: Sicherheits-Leitplanken für Diskussionen
    `KRITISCH: Trenne IMMER klar zwischen (1) gesicherten Fakten/wissenschaftlichem Konsens, (2) plausiblen Hypothesen mit Belegen, und (3) reiner Spekulation/Fiktion. Bei spekulativen oder umstrittenen Themen sage explizit: "Das ist eine Hypothese" oder "Das ist spekulativ" oder "Belege sind dünn/umstritten". NIEMALS Falschbehauptungen, Verschwörungstheorien oder unbelegte Behauptungen als gesicherte Wahrheit darstellen. Bei kontroversen Themen: neutral, kritisch, ausgewogen. Zeige verschiedene Perspektiven und ihre Stärken/Schwächen.`,
    strict
      ? "Strenger Moderationsmodus: filtere riskante, hetzerische oder gesetzeswidrige Inhalte, antworte neutral und verweise respektvoll auf Richtlinien."
      : "",
  ].filter(Boolean);

  return parts.join(" ");
}

export function buildSystemPrompt(
  settings: PromptSettings,
  activeRole: { systemPrompt: string } | null | undefined,
): string {
  const safetyPrompt = buildSafetyPrompt(settings.showNSFWContent);
  const discussionPrompt = buildDiscussionPrompt(settings);
  const rolePrompt = activeRole?.systemPrompt || "";

  return [safetyPrompt, discussionPrompt, rolePrompt].filter(Boolean).join("\n\n");
}
