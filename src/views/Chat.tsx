import React from "react";
import { Shell } from "../components/Shell";
import { Card } from "../components/Card";
import { ChatBubble } from "../components/ChatBubble";
import { Textarea } from "../components/Input";
import { Button } from "../components/Button";
import { KeyGuard } from "../components/KeyGuard";
import { chatStream, type Msg } from "../api/openrouter";
import { useModel } from "../hooks/useModel";
import { usePersonaSelection } from "../config/personas";
import { useChatSession } from "../hooks/useChatSession";
import { updateMemorySummary } from "../api/memory";

export default function Chat() {
  const [msg, setMsg] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  const { current } = useModel();
  const { active: activePersona } = usePersonaSelection();
  const { session, append, appendAssistantPlaceholder, appendAssistantDelta, setMemory, lastWindow } = useChatSession();

  async function send() {
    if (!msg.trim() || busy) return;
    const userText = msg.trim();
    setMsg("");
    append("user", userText);
    appendAssistantPlaceholder();
    setBusy(true);

    // Kontext aufbauen: Persona + Memory + letztes Fenster
    const history: Msg[] = [];
    if (activePersona?.prompt) {
      history.push({ role: "system", content: activePersona.prompt });
    }
    if (session.memory) {
      history.push({
        role: "system",
        content:
`Nutzer-Memory (stabile Präferenzen/Regeln/Fakten):
${session.memory}`
      });
    }
    for (const m of lastWindow(24)) {
      history.push({ role: m.role, content: m.text });
    }
    history.push({ role: "user", content: userText });

    const aborter = new AbortController();
    abortRef.current = aborter;

    try {
      await chatStream(
        history,
        (delta) => {
          appendAssistantDelta(delta);
        },
        {
          signal: aborter.signal,
          onDone: async () => {
            setBusy(false);
            // Nach Abschluss Memory aktualisieren (kleines Fenster, kostet wenig Tokens)
            try {
              const summary = await updateMemorySummary({
                previousMemory: session.memory,
                recentWindow: [
                  // nimm nur die letzten ~8 Beiträge für Memory-Update
                  ...lastWindow(8).map(m => ({ role: m.role, content: m.text }))
                ],
              });
              if (summary && summary.length > 0) setMemory(summary);
            } catch {
              /* Memory-Update ist best effort; kein Abbruch bei Fehler */
            }
          },
        }
      );
    } catch (e: any) {
      setBusy(false);
      appendAssistantDelta(
        e?.message === "NO_API_KEY" ? "Kein API-Key hinterlegt." : `Fehler: ${e?.message ?? "unbekannt"}`
      );
    } finally {
      abortRef.current = null;
    }
  }

  function abort() {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
  }

  return (
    <Shell>
      <KeyGuard>
        <Card className="p-0 overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto space-y-4 p-5">
            {session.messages.length === 0 && (
              <ChatBubble role="assistant">Hi, ich bin Disa AI. Stelle deine Frage – Antworten werden live gestreamt.</ChatBubble>
            )}
            {session.messages.map((it, i) => (
              <ChatBubble key={i} role={it.role}>{it.text}</ChatBubble>
            ))}
          </div>
          <div className="border-t border-white/10 p-3 md:p-4">
            <div className="flex items-end gap-2">
              <Textarea
                placeholder="Schreibe hier …"
                className="flex-1"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => { if (!busy && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              />
              {busy ? (
                <Button variant="ghost" className="shrink-0" onClick={abort}>Abbrechen</Button>
              ) : (
                <Button className="shrink-0" onClick={send}>Senden</Button>
              )}
            </div>
            <div className="text-xs text-zinc-500 mt-2">
              Modell: <code>{current.label}</code>
              {activePersona ? <> · Stil: <code>{activePersona.label}</code></> : null}
              {session.memory ? <> · Memory: <code>{Math.min(session.memory.length, 200)} Zeichen</code></> : null}
              {" "}· Streaming aktiv
            </div>
          </div>
        </Card>
      </KeyGuard>
    </Shell>
  );
}
