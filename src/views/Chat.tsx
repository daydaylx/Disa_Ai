import React from "react";
import { Shell } from "../components/Shell";
import { Card } from "../components/Card";
import { ChatBubble } from "../components/ChatBubble";
import { Textarea } from "../components/Input";
import { Button } from "../components/Button";
import { KeyGuard } from "../components/KeyGuard";
import { chatStream, type Msg } from "../api/openrouter";

export default function Chat() {
  const [msg, setMsg] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [items, setItems] = React.useState<Array<{role:"user"|"assistant"; text:string}>>([
    { role: "assistant", text: "Hi, ich bin Disa AI. Stelle deine Frage – Antworten werden live gestreamt." }
  ]);
  const abortRef = React.useRef<AbortController | null>(null);

  async function send() {
    if (!msg.trim() || busy) return;
    const userText = msg.trim();
    setMsg("");
    setItems((a) => [...a, { role: "user", text: userText }, { role: "assistant", text: "" }]);
    setBusy(true);

    const history: Msg[] = items.map(m => ({ role: m.role, content: m.text }));
    history.push({ role: "user", content: userText });

    const aborter = new AbortController();
    abortRef.current = aborter;

    let assistantIndex = -1;
    setItems((a) => {
      assistantIndex = a.length; // index des leeren assistant-bubbles (nach push oben)
      return a;
    });

    try {
      await chatStream(
        history,
        (delta) => {
          // token anhängen
          setItems((a) => {
            const c = [...a];
            const i = c.length - 1; // letzter ist assistant
            c[i] = { ...c[i], text: c[i].text + delta };
            return c;
          });
        },
        {
          signal: aborter.signal,
          onDone: () => setBusy(false),
        }
      );
    } catch (e: any) {
      setBusy(false);
      const reason = e?.message === "NO_API_KEY" ? "Kein API-Key hinterlegt." : `Fehler: ${e?.message ?? "unbekannt"}`;
      setItems((a) => {
        const c = [...a];
        c[c.length - 1] = { role: "assistant", text: reason };
        return c;
      });
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
            {items.map((it, i) => (
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
              Modell: <code>llama-3.3-70b (free)</code> · Streaming aktiv
            </div>
          </div>
        </Card>
      </KeyGuard>
    </Shell>
  );
}
