import React from "react";

import { ChatBubble } from "../components/ChatBubble";
import { Header } from "../components/Header";
import { InputBar } from "../components/InputBar";
import { BottomSheetButton } from "./BottomSheetButton";

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
  const handleSend = (message: string) => {
    onSend(message);
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

      {/* Bottom Sheet Button - replaces the old side panel */}
      <BottomSheetButton />
    </div>
  );
};
