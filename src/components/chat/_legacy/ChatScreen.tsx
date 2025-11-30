import { useMemo, useState } from "react";

import { MaterialCard } from "@/ui";

import type { ChatMessageType } from "../../types/chatMessage";
import { ChatInputBar } from "./ChatInputBar";
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

  // Check for recent errors to show user feedback
  const hasRecentError = useMemo(() => {
    const reversed = [...messages].reverse();
    const lastMessage = reversed[0];
    return lastMessage?.role === "assistant" && !lastMessage.content.trim() && !isLoading;
  }, [messages, isLoading]);

  return (
    <div className="flex h-full max-h-[100dvh] flex-1 flex-col gap-4 overflow-hidden">
      <MaterialCard className="relative flex-1 overflow-hidden">
        <VirtualizedMessageList
          messages={messages}
          onRetry={onRetry}
          onCopy={onCopy}
          isLoading={isLoading}
          className="px-2 py-4 sm:px-4"
        />
      </MaterialCard>

      <ChatInputBar
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

      {hasRecentError && (
        <div className="px-4 py-2">
          <div className="border-border bg-surface-subtle text-text-secondary flex items-center gap-3 rounded-lg border p-3 text-sm">
            <span className="text-text-primary font-medium">⚠️</span>
            <span>
              Verbindungsproblem erkannt. Bitte versuche es erneut oder überprüfe deine
              Internetverbindung.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
