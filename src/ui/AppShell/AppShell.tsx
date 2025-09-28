import React, { useState } from "react";

import { Message } from "../chat/types";
import { ChatMain } from "./ChatMain";
import { ComposerDock } from "./ComposerDock";
import { RightDrawer } from "./RightDrawer";
import { SidebarLeft } from "./SidebarLeft";
import { Topbar } from "./Topbar";
export function AppShell() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "assistant",
      createdAt: new Date().toISOString(),
      content: `Willkommen in **Disa Orion**.

\`\`\`ts
function hello(){
  console.log("hi");
}
\`\`\``,
    },
  ]);
  function send(text: string) {
    const now = new Date().toISOString();
    const user: Message = { id: crypto.randomUUID(), role: "user", content: text, createdAt: now };
    setMessages((p) => [...p, user]);
    const reply: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Echo: " + text,
      createdAt: new Date().toISOString(),
    };
    setTimeout(() => setMessages((p) => [...p, reply]), 250);
  }
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background:
          "radial-gradient(120% 120% at 20% 10%, hsl(var(--accent-primary)/.18), transparent 60%), radial-gradient(120% 120% at 80% 70%, hsl(var(--accent-primary)/.12), transparent 55%)",
      }}
    >
      <h1 className="sr-only">Disa AI Chat Assistant</h1>
      <Topbar />
      <main className="flex flex-1" role="main">
        <SidebarLeft />
        <ChatMain messages={messages} />
        <RightDrawer />
      </main>
      <ComposerDock onSend={send} tokenCount={messages.reduce((n, m) => n + m.content.length, 0)} />
    </div>
  );
}
