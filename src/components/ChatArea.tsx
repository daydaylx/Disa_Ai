import React, { useState } from "react";

import { ChatBubble } from "../components/ChatBubble";
import { Header } from "../components/Header";
import { InputBar } from "../components/InputBar";
import { SidePanel } from "../components/SidePanel";

type SidePanelState = "closed" | "open";
type PanelTab = "history" | "roles" | "models" | "settings";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
  onSend: (message: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSend }) => {
  const [panelState, setPanelState] = useState<SidePanelState>("closed");
  const [panelTab, setPanelTab] = useState<PanelTab>("history");

  const handleSend = (message: string) => {
    onSend(message);
  };

  const closePanel = () => {
    setPanelState("closed");
  };

  const togglePanel = (tab: PanelTab = "history") => {
    setPanelState(panelState === "open" ? "closed" : "open");
    setPanelTab(tab);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--bg0)]">
      {/* Hintergrund-Verlauf */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(111,211,255,0.08),transparent_25%),radial-gradient(circle_at_90%_80%,rgba(255,159,111,0.08),transparent_25%),var(--bg0)]"></div>
      </div>

      {/* Hauptinhalt */}
      <div className="relative z-10 flex flex-1 flex-col">
        <Header />

        {/* Chat-Bereich mit subtilen Animationen */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="mx-auto max-w-[720px] space-y-4 py-4">
            {messages.map((message) => (
              <ChatBubble key={message.id} kind={message.role as "user" | "assistant"}>
                {message.content}
              </ChatBubble>
            ))}
          </div>
        </div>

        {/* Input-Bereich mit verstärktem Fokus-Effekt */}
        <div className="px-4 py-6">
          <InputBar onSend={handleSend} />
        </div>
      </div>

      {/* Seitliches Panel mit erweiterten Funktionen */}
      <SidePanel
        state={panelState}
        tab={panelTab}
        onClose={closePanel}
        onTabChange={setPanelTab}
        onSwipeRightToOpen={() => setPanelState("open")}
        onSwipeLeftToClose={closePanel}
      />

      {/* Trigger für das Panel (z.B. Einstellungs-Button) */}
      <button
        onClick={() => togglePanel()}
        className="glass glass--subtle hover:glass--strong fixed right-4 top-4 z-20 rounded-full border border-border/60 p-2 transition-all duration-300"
        aria-label="Einstellungen öffnen"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
        </svg>
      </button>
    </div>
  );
};
