import { chatOnce, type Msg, getModelFallback } from "./openrouter";

/**
 * Verdichtet Chatverlauf + bisheriges Memory zu einer kurzen Merkliste.
 * Fokus: stabile Fakten/Präferenzen/Regeln (keine Einmalfragen).
 * Output: kurze Bullet-Liste (max. 12 Punkte), Deutsch.
 */
export async function updateMemorySummary(params: {
  previousMemory: string;
  recentWindow: Array<{ role: "user" | "assistant"; content: string }>;
  signal?: AbortSignal;
  model?: string;
}) {
  const { previousMemory, recentWindow, signal, model } = params;
  const chosen = model ?? getModelFallback();

  const sys: Msg = {
    role: "system",
    content:
`Du extrahierst dauerhaft nützliche Nutzer-Merkpunkte aus einem Chatverlauf.
Gib ausschließlich eine kurze, präzise Bullet-Liste in DEUTSCH zurück.
Regeln:
- Nur stabile Fakten/Präferenzen/Ziele/Verbote/Arbeitsstil.
- Keine Einmalfragen, keine temporären Details, kein Smalltalk.
- Maximal 12 Punkte, jeweils 1 Zeile.`
  };

  const user: Msg = {
    role: "user",
    content:
`Bisheriges Memory:
${previousMemory || "(leer)"}

Neue Nachrichten (neueste unten):
${recentWindow.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

Aktualisiere die Merkliste.`
  };

  const { text } = await chatOnce([sys, user], { model: chosen, signal });
  return (text || "").trim();
}

/**
 * Explizites Merken: Nutzer markiert Text, der in die Memory-Liste soll.
 * - Deduplication & Kürzung auf max. 12 Bullet-Punkte
 * - Deutsch, 1 Zeile pro Punkt
 */
export async function addExplicitMemory(params: {
  previousMemory: string;
  note: string;             // der zu merkende Text
  signal?: AbortSignal;
  model?: string;
}) {
  const { previousMemory, note, signal, model } = params;
  const chosen = model ?? getModelFallback();

  const sys: Msg = {
    role: "system",
    content:
`Du bist ein strenger Kurator einer dauerhaften Merkliste (DEUTSCH).
Aufgabe: Integriere den neuen Hinweis in die bestehende Liste.
Regeln:
- Nur stabile, wiederverwendbare Fakten/Präferenzen/Regeln behalten.
- Keine Einmalaufgaben, keine temporären Details.
- Entferne Dubletten, fasse redundant Kram zusammen.
- Maximal 12 Bullet-Punkte, jeweils 1 kurze Zeile.`
  };

  const user: Msg = {
    role: "user",
    content:
`Bestehende Merkliste:
${previousMemory || "(leer)"}

Neuer Hinweis (vom Nutzer markiert):
${note}

Gib NUR die aktualisierte Bullet-Liste aus.`
  };

  const { text } = await chatOnce([sys, user], { model: chosen, signal });
  return (text || "").trim();
}
