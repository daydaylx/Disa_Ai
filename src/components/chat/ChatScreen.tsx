import { useMemo, useState } from "react";

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
    <div className="flex h-full flex-col">
      <VirtualizedMessageList
        messages={messages}
        onRetry={onRetry}
        onCopy={onCopy}
        isLoading={isLoading}
      />

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
