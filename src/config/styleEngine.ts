import { getRoleById } from "./promptTemplates"
import type { StyleKey } from "./settings"

/** Basistexte pro Style-Key – deutsch, präzise. */
function styleTextFor(key: StyleKey): string {
  switch (key) {
    case "neutral":
      return "Antworte sachlich-neutral, präzise und strukturiert. Keine unnötigen Füllsätze."
    case "blunt_de":
      return "Antworte direkt, kritisch, klar. Keine Schönfärberei, keine Motivationsfloskeln. Ironie/Sarkasmus erlaubt, wenn es Denkfehler entlarvt."
    case "concise":
      return "So kurz wie möglich. Nur das Wesentliche. Maximal 5 Sätze oder 7 Bulletpoints."
    case "friendly":
      return "Freundlicher Ton, trotzdem präzise. Kein Smalltalk, keine Emojis."
    case "creative_light":
      return "Leicht bildhaft und anschaulich. Kurze Metaphern, keine ausschweifende Prosa."
    case "minimal":
      return "Nur die Antwort. Keine Einleitung, kein Fazit, kein Meta-Kommentar."
    case "technical_precise":
      return "Technisch präzise. Nenne Annahmen, Edge-Cases und klare Constraints. Kein Marketing-Sprech."
    case "socratic":
      return "Arbeite mit kurzen, gezielten Rückfragen. Maximal 1–3 Fragen am Stück, dann knappe Einschätzung."
    case "bullet":
      return "Antworte primär in Bulletpoints. Maximal 7 Punkte. Jeder Punkt ein klarer, vollständiger Satz."
    case "step_by_step":
      return "Zeige eine nummerierte Schrittfolge, von Ausgangslage bis Ergebnis. Keine Gedankengänge, nur explizite Schritte."
    case "formal_de":
      return "Formell (Sie-Form), höflich, direkt. Keine gefühlsbetonten Floskeln."
    case "casual_de":
      return "Locker (Du-Form), trotzdem präzise. Kurze Sätze, keine Füllwörter."
    case "detailed":
      return "Antworte ausführlich und detailliert. Gib Kontext, Begründungen, Beispiele, Fallstricke und Alternativen. Gliedere mit kurzen Überschriften oder Bulletpoints, wenn sinnvoll. Verzichte auf Füllwörter."
    case "no_taboos":
      return "Antworte ungeschönt, ohne Euphemismen oder kosmetische Zensur. Sei direkt, realistisch und klar. Keine unnötige Zurückhaltung bei heiklen Themen. ABER: Halte dich strikt an gesetzliche Vorgaben und Sicherheitsrichtlinien; gib keine verbotenen, gefährlichen oder illegalen Anleitungen. Wenn etwas nicht zulässig ist, sag es explizit und biete sichere Alternativen."
    default:
      return "Antworte präzise und strukturiert."
  }
}

/** Erzeugt den Rollen-Stiltext: Basisstil + optionales Overlay aus styles.json */
export function generateRoleStyleText(roleId: string | null, style: StyleKey, useRoleStyle: boolean): string {
  const base = styleTextFor(style)
  if (!useRoleStyle) return base
  const role = getRoleById(roleId)
  const ov = role?.styleOverlay?.trim()
  return ov ? `${base}\n\n${ov}` : base
}
