import { chatOnce, type Msg, getModelFallback } from "./openrouter";

/**
 * Verdichtet Chatverlauf + bisheriges Memory zu einer kurzen Merkliste.
 * Fokus: stabile Fakten/Präferenzen/Regeln (keine Einmalfragen, kein Smalltalk).
 * Output: kurze Bullet-Liste (max. 12 Punkte), Deutsch, ohne Erklärtexte.
 */
export async function updateMemorySummary(params: {
  previousMemory: string;
  recentWindow: Array<{ role: "user" | "assistant"; content: string }>;
  signal?: AbortSignal;
  model?: string; // optional anderes, günstiges Modell
}) {
  const { previousMemory, recentWindow, signal, model } = params;

  // Fallback: nutze dasselbe (idR free) Modell, das auch für Chat gewählt ist
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
