import type { StyleKey } from "../../config/settings";
import { getRoleById } from "../../config/promptTemplates";

/** Style-Mapping (nur für bekannte Keys). Unbekannte fallen auf den Default zurück. */
const STYLE_SNIPPETS: Partial<Record<StyleKey, string>> = {
  concise:
    "Du bist ein sachlicher, hilfreicher Assistent. Antworte klar, strukturiert und ohne Floskeln. Verwende kurze Sätze.",
  blunt_de:
    "Antworte direkt, ehrlich, kritisch. Risiken/Schwächen zuerst. Kein Motivationssprech. Kein Smalltalk.",
  friendly:
    "Antworte kollegial und respektvoll, aber präzise. Verwende Alltagssprache und halte dich kurz.",
  creative_light:
    "Erkläre mit kurzen Analogien/Beispielen. Bleibe präzise und handlungsorientiert.",
  minimal:
    "Antworte so kurz wie möglich, ohne Informationsverlust. Keine Ausschmückungen.",
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
  const r = getRoleById(roleId as any) as any;
  const purpose: string = r?.purpose ?? r?.description ?? r?.desc ?? "";
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

  const styleText =
    STYLE_SNIPPETS[style] ??
    "Antworte präzise, strukturiert und ohne unnötige Floskeln.";

  const nsfwText = nsfwPreamble(allowNSFW);
  const roleText = useRoleStyle ? roleOverlay(roleId) : "";

  return [styleText, roleText, nsfwText].filter(Boolean).join(" ");
}
