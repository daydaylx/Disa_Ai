import { chatOnce, getModelFallback, type Msg } from "./openrouter";

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
    content: `Du extrahierst dauerhaft nützliche Nutzer-Merkpunkte aus einem Chatverlauf.
Gib ausschließlich eine kurze, präzise Bullet-Liste in DEUTSCH zurück.
Regeln:
- Nur stabile Fakten/Präferenzen/Ziele/Verbote/Arbeitsstil.
- Keine Einmalfragen, keine temporären Details, kein Smalltalk.
- Maximal 12 Punkte, jeweils 1 Zeile.`,
  };

  const user: Msg = {
    role: "user",
    content: `Bisheriges Memory:
${previousMemory || "(leer)"}

Neue Nachrichten (neueste unten):
${recentWindow.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

Aktualisiere die Merkliste.`,
  };

  const opts = signal ? { model: chosen, signal } : { model: chosen };
  const { text } = await chatOnce([sys, user], opts);
  return (text || "").trim();
}

export async function addExplicitMemory(params: {
  previousMemory: string;
  note: string;
  signal?: AbortSignal;
  model?: string;
}) {
  const { previousMemory, note, signal, model } = params;
  const chosen = model ?? getModelFallback();

  const sys: Msg = {
    role: "system",
    content: `Du bist ein strenger Kurator einer dauerhaften Merkliste (DEUTSCH).
Aufgabe: Integriere den neuen Hinweis in die bestehende Liste.
Regeln:
- Nur stabile, wiederverwendbare Fakten/Präferenzen/Regeln behalten.
- Keine Einmalaufgaben, keine temporären Details.
- Entferne Dubletten, fasse redundanten Inhalt zusammen.
- Maximal 12 Bullet-Punkte, jeweils 1 kurze Zeile.`,
  };

  const user: Msg = {
    role: "user",
    content: `Bestehende Merkliste:
${previousMemory || "(leer)"}

Neuer Hinweis (vom Nutzer markiert):
${note}

Gib NUR die aktualisierte Bullet-Liste aus.`,
  };

  const opts = signal ? { model: chosen, signal } : { model: chosen };
  const { text } = await chatOnce([sys, user], opts);
  return (text || "").trim();
}
