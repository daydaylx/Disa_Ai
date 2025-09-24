import { getRoleById } from "../../config/promptTemplates";
import type { StyleKey } from "../../config/settings";

/** Style-Mapping für alle StyleKey-Werte. */
const STYLE_SNIPPETS: Record<StyleKey, string> = {
  neutral:
    "Antworte sachlich, ausgewogen und objektiv. Nutze neutrale Sprache ohne emotionale Färbung.",
  blunt_de:
    "Antworte direkt, ehrlich, kritisch. Risiken/Schwächen zuerst. Kein Motivationssprech. Kein Smalltalk.",
  concise:
    "Du bist ein sachlicher, hilfreicher Assistent. Antworte klar, strukturiert und ohne Floskeln. Verwende kurze Sätze.",
  friendly:
    "Antworte kollegial und respektvoll, aber präzise. Verwende Alltagssprache und halte dich kurz.",
  creative_light:
    "Erkläre mit kurzen Analogien/Beispielen. Bleibe präzise und handlungsorientiert.",
  minimal: "Antworte so kurz wie möglich, ohne Informationsverlust. Keine Ausschmückungen.",
  technical_precise:
    "Verwende präzise Fachterminologie. Strukturiere technische Erklärungen logisch und vollständig.",
  socratic:
    "Leite durch gezielte Fragen zur Erkenntnis. Fördere eigenständiges Denken statt direkter Antworten.",
  bullet: "Strukturiere Antworten als prägnante Bullet Points. Maximal 6 Punkte pro Liste.",
  step_by_step:
    "Erkläre in numerierten, aufeinander aufbauenden Schritten. Jeder Schritt klar und vollständig.",
  formal_de:
    "Verwende formelle deutsche Sprache. Höflich, respektvoll, sachlich. Sie-Form verwenden.",
  casual_de:
    "Lockere, umgangssprachliche deutsche Kommunikation. Du-Form, entspannt aber hilfreich.",
  detailed:
    "Liefere umfassende, detaillierte Erklärungen. Berücksichtige Kontext, Alternativen und Hintergründe.",
  no_taboos:
    "Antworte offen zu allen Themen ohne inhaltliche Beschränkungen. Sachlich und informativ.",
};

/** Optionales NSFW-Präfix, wenn Filter nicht gelockert ist */
function nsfwPreamble(allowNSFW: boolean): string {
  if (allowNSFW) return "";
  return [
    "Inhalte: Beachte übliche Plattform-Richtlinien. Keine expliziten sexuellen Inhalte, keine Gewaltverherrlichung, keine Hassrede.",
    "Wenn der Nutzer nach unzulässigem Inhalt fragt: freundlich ablehnen, kurz begründen und sichere Alternative vorschlagen.",
  ].join(" ");
}

/** Rollenschnipsel (aus älteren Ständen abgeleitete Vorschau) */
function roleOverlay(roleId: string | null): string {
  if (!roleId) return "";
  const r = getRoleById(roleId);
  const purpose: string =
    r && typeof (r as any).purpose === "string"
      ? ((r as any).purpose as string)
      : (r &&
          (typeof (r as any).description === "string"
            ? ((r as any).description as string)
            : typeof (r as any).desc === "string"
              ? ((r as any).desc as string)
              : "")) ||
        "";
  const base = [
    "Feintuning: Ton=medium, Kürze=balanced, Humor=none, Emojis=nein.",
    "Priorität: Ehrlichkeit → Klarheit → Kürze.",
    "Struktur: Ziel → Plan → Monitoring.",
    "Listen: prefer (max. 6 Punkte).",
    "Vermeiden: Floskeln, Motivationssprech.",
  ].join(" ");
  return [base, purpose].filter(Boolean).join(" ");
}

/** Baut den finalen Systemprompt aus Stil + optionaler Rollenüberlagerung + NSFW-Policy */
export function composeSystemPrompt(params: {
  style: StyleKey;
  useRoleStyle: boolean;
  roleId: string | null;
  allowNSFW: boolean;
}): string {
  const { style, useRoleStyle, roleId, allowNSFW } = params;

  const styleText = STYLE_SNIPPETS[style];

  const nsfwText = nsfwPreamble(allowNSFW);
  const roleText = useRoleStyle ? roleOverlay(roleId) : "";

  return [styleText, roleText, nsfwText].filter(Boolean).join(" ");
}
