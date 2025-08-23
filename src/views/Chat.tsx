import React from "react";
import { Shell } from "../components/Shell";
import { Card } from "../components/Card";
import { ChatBubble } from "../components/ChatBubble";
import { Textarea } from "../components/Input";
import { Button } from "../components/Button";

export default function Chat() {
  return (
    <Shell>
      <Card className="p-0 overflow-hidden">
        <div className="max-h-[60vh] overflow-y-auto space-y-4 p-5">
          <ChatBubble role="assistant">Hallo, ich bin <b>Disa AI</b>. Womit soll ich anfangen?</ChatBubble>
          <ChatBubble role="user">Gib mir eine Zusammenfassung von Datei X.</ChatBubble>
          <ChatBubble role="assistant">Klar. Ich brauche dafür Leserechte auf den Ordner. Soll ich scannen?</ChatBubble>
        </div>
        <div className="border-t border-white/10 p-3 md:p-4">
          <div className="flex items-center gap-2">
            <Textarea placeholder="Schreibe hier …" className="flex-1" />
            <Button className="shrink-0">Senden</Button>
          </div>
        </div>
      </Card>
    </Shell>
  );
}
