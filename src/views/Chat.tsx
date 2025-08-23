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
import { updateMemorySummary, addExplicitMemory } from "../api/memory";
import { PersonaQuickBar } from "../components/PersonaQuickBar";
import { InlineNote } from "../components/InlineNote";

export default function Chat() {
  const [msg, setMsg] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [memBusy, setMemBusy] = React.useState<null | "inline" | number>(null); // "inline"=Textarea, number=index einer Nachricht
  const [memInfo, setMemInfo] = React.useState<null | string>(null);

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

    // Kontext: Persona + Memory + letztes Fenster
    const history: Msg[] = [];
    if (activePersona?.prompt) {
      history.push({ role: "system", content: activePersona.prompt });
    }
    if (session.memory) {
      history.push({ role: "system", content: `Nutzer-Memory (stabile Präferenzen/Regeln/Fakten):\n${session.memory}` });
    }
    for (const m of lastWindow(24)) history.push({ role: m.role, content: m.text });
    history.push({ role: "user", content: userText });

    const aborter = new AbortController();
    abortRef.current = aborter;

    try {
      await chatStream(
        history,
        (delta) => appendAssistantDelta(delta),
        {
          signal: aborter.signal,
          onDone: async () => {
            setBusy(false);
            try {
              const summary = await updateMemorySummary({
                previousMemory: session.memory,
                recentWindow: [...lastWindow(8).map(m => ({ role: m.role, content: m.text }))],
              });
              if (summary && summary.length > 0) setMemory(summary);
            } catch { /* best effort */ }
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

  async function remember(text: string, source: "inline" | number) {
    if (!text.trim()) return;
    setMemBusy(source);
    setMemInfo(null);
    try {
      const updated = await addExplicitMemory({
        previousMemory: session.memory,
        note: text.trim(),
      });
      if (updated) {
        setMemory(updated);
        setMemInfo("Gemerkte Info übernommen.");
      } else {
        setMemInfo("Nichts Relevantes übernommen.");
      }
    } catch (e: any) {
      setMemInfo(`Merken fehlgeschlagen: ${e?.message ?? "unbekannt"}`);
    } finally {
      setMemBusy(null);
      // Info nach kurzer Zeit ausblenden
      setTimeout(() => setMemInfo(null), 2000);
    }
  }

  return (
    <Shell>
      <KeyGuard>
        <Card className="p-0 overflow-hidden">
          {/* Schnellzugriff Stile */}
          <div className="px-5 pt-4">
            <PersonaQuickBar />
          </div>

          <div className="max-h-[56vh] md:max-h-[60vh] overflow-y-auto space-y-2 p-5">
            {session.messages.length === 0 && (
              <ChatBubble role="assistant">Hi, ich bin Disa AI. Stelle deine Frage – Antworten werden live gestreamt.</ChatBubble>
            )}
            {session.messages.map((it, i) => (
              <div key={i} className="space-y-1">
                <ChatBubble role={it.role}>{it.text}</ChatBubble>
                {/* Inline-"Merken"-Aktion je Nachricht */}
                <div className="pl-2">
                  <button
                    className="text-xs text-zinc-400 hover:text-zinc-200 transition"
                    onClick={() => remember(it.text, i)}
                    disabled={memBusy === i}
                  >
                    {memBusy === i ? "Merke…" : "Merken"}
                  </button>
                </div>
              </div>
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
                <>
                  <Button variant="ghost" className="shrink-0"
                    onClick={() => remember(msg, "inline")}
                    disabled={!msg.trim() || memBusy === "inline"}
                  >
                    {memBusy === "inline" ? "Merke…" : "Merken"}
                  </Button>
                  <Button className="shrink-0" onClick={send}>Senden</Button>
                </>
              )}
            </div>

            <div className="text-xs text-zinc-500 mt-2 flex flex-wrap gap-x-3 gap-y-1">
              <span>Modell: <code>{current.label}</code></span>
              {activePersona ? <span>Stil: <code>{activePersona.label}</code></span> : null}
              {session.memory ? <span>Memory: <code>{Math.min(session.memory.length, 200)} Zeichen</code></span> : null}
              <span>Streaming aktiv</span>
            </div>

            {memInfo && (
              <div className="mt-2">
                <InlineNote kind={/fehl|fail/i.test(memInfo) ? "error" : "success"}>{memInfo}</InlineNote>
              </div>
            )}
          </div>
        </Card>
      </KeyGuard>
    </Shell>
  );
}
