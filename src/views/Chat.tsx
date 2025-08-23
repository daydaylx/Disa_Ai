import React from "react";
import { Shell } from "../components/Shell";
import { Card } from "../components/Card";
import { ChatBubble } from "../components/ChatBubble";
import { Textarea } from "../components/Input";
import { Button } from "../components/Button";

export default function Chat() {
  const [msg, setMsg] = React.useState("");
  const [items, setItems] = React.useState<Array<{role:"user"|"assistant"; text:string}>>([
    { role: "assistant", text: "Hi, ich bin Disa AI. Der Chat ist UI-fertig. Backend/Model-Call wird separat angeschlossen." }
  ]);

  function send() {
    if (!msg.trim()) return;
    setItems((a) => [...a, {role:"user", text: msg.trim()}]);
    setMsg("");
    // Kein Fake-Antwort-Echo: Wir warten auf echte OpenRouter-Integration in diesem Repo.
  }

  return (
    <Shell>
      <Card className="p-0 overflow-hidden">
        <div className="max-h-[60vh] overflow-y-auto space-y-4 p-5">
          {items.map((it, i) => (
            <ChatBubble key={i} role={it.role}>{it.text}</ChatBubble>
          ))}
        </div>
        <div className="border-t border-white/10 p-3 md:p-4">
          <div className="flex items-center gap-2">
            <Textarea
              placeholder="Schreibe hier …"
              className="flex-1"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            />
            <Button className="shrink-0" onClick={send}>Senden</Button>
          </div>
        </div>
      </Card>
    </Shell>
  );
}
