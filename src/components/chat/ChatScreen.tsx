import { useMemo, useState } from "react";

import { MaterialCard } from "@/ui";

import type { ChatMessageType } from "../../types/chatMessage";
import { ChatComposer } from "./ChatComposer";
import { ChatLiveRegion } from "./ChatLiveRegion";
import { VirtualizedMessageList } from "./VirtualizedMessageList";

interface ChatScreenProps {
  messages: ChatMessageType[];
  onSend: (value: string) => void;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  isLoading?: boolean;
}

export function ChatScreen({ messages, onSend, onRetry, onCopy, isLoading }: ChatScreenProps) {
  const [input, setInput] = useState("");

  const lastAssistantChunk = useMemo(() => {
    const reversed = [...messages].reverse();
    const last = reversed.find((m) => m.role === "assistant" && m.content.trim());
    return last?.content ?? null;
  }, [messages]);

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <MaterialCard className="relative flex-1 overflow-hidden">
        <VirtualizedMessageList
          messages={messages}
          onRetry={onRetry}
          onCopy={onCopy}
          isLoading={isLoading}
          className="px-2 py-4 sm:px-4"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg0)] via-transparent to-transparent" />
      </MaterialCard>

      <ChatComposer
        value={input}
        onChange={setInput}
        onSend={() => {
          if (input.trim()) {
            onSend(input.trim());
            setInput("");
          }
        }}
        isLoading={isLoading}
      />

      <ChatLiveRegion message={lastAssistantChunk} />
    </div>
  );
}
