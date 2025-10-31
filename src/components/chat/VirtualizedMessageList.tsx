import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useStickToBottom } from "../../hooks/useStickToBottom";
import { cn } from "../../lib/cn";
import type { ChatMessageType } from "../../types/chatMessage";
import { Card } from "../ui/card";
import { ChatMessage } from "./ChatMessage";

interface VirtualizedMessageListProps {
  messages: ChatMessageType[];
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  isLoading?: boolean;
  className?: string;
  initialRenderCount?: number;
  loadMoreCount?: number;
  virtualizationThreshold?: number;
}

export function VirtualizedMessageList({
  messages,
  onRetry,
  onCopy,
  isLoading = false,
  className,
  initialRenderCount = 50,
  loadMoreCount = 30,
  virtualizationThreshold = 20,
}: VirtualizedMessageListProps) {
  const [visibleCount, setVisibleCount] = useState(initialRenderCount);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollRef, isSticking, scrollToBottom } = useStickToBottom({
    threshold: 0.8,
    enabled: true,
  });

  const setRefs = useCallback(
    (element: HTMLDivElement | null) => {
      containerRef.current = element;
      scrollRef.current = element;
    },
    [scrollRef],
  );

  useEffect(() => {
    if (isSticking && messages.length > 0) {
      setTimeout(() => scrollToBottom(), 50);
    }
  }, [messages.length, isSticking, scrollToBottom]);

  const { visibleMessages, shouldVirtualize, hiddenCount } = useMemo(() => {
    const shouldVirtualize = messages.length > virtualizationThreshold;

    if (!shouldVirtualize) {
      return {
        visibleMessages: messages,
        shouldVirtualize: false,
        hiddenCount: 0,
      };
    }

    const start = Math.max(0, messages.length - visibleCount);
    const visible = messages.slice(start);
    const hidden = messages.length - visible.length;

    return {
      visibleMessages: visible,
      shouldVirtualize: true,
      hiddenCount: hidden,
    };
  }, [messages, visibleCount, virtualizationThreshold]);

  const loadOlderMessages = useCallback(() => {
    setVisibleCount((prev) => Math.min(messages.length, prev + loadMoreCount));

    requestAnimationFrame(() => {
      const container = containerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight * 0.2;
      }
    });
  }, [messages.length, loadMoreCount]);

  const handleCopy = useCallback(
    (content: string) => {
      onCopy?.(content);
    },
    [onCopy],
  );

  const handleRetry = useCallback(
    (messageId: string) => {
      onRetry?.(messageId);
    },
    [onRetry],
  );

  return (
    <div
      ref={setRefs}
      className={cn("flex-1 overflow-y-auto scroll-smooth", className)}
      role="log"
      aria-label="Chat messages"
      data-testid="virtualized-chat-log"
    >
      {shouldVirtualize && hiddenCount > 0 && (
        <div className="sticky top-0 z-10 flex justify-center py-2">
          <button
            onClick={loadOlderMessages}
            className="border-border bg-card text-text-secondary hover:bg-surface-subtle focus-visible:ring-brand rounded-full border px-4 py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2"
            data-testid="load-older-messages"
          >
            ↑ {hiddenCount} ältere Nachrichten laden
          </button>
        </div>
      )}

      <div className="space-y-0">
        {visibleMessages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLast={index === visibleMessages.length - 1 && !isLoading}
            onRetry={handleRetry}
            onCopy={handleCopy}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex items-start gap-4 px-4 py-6">
          <Card className="border-border text-text-secondary flex h-9 w-9 items-center justify-center rounded-full border">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3a9 9 0 019 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-60"
              />
              <path
                d="M21 12a9 9 0 01-9 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-20"
              />
            </svg>
          </Card>
          <Card className="border-border text-text-secondary flex-1 rounded-lg border p-4 text-sm">
            <div className="text-text-secondary flex items-center gap-2 text-xs uppercase tracking-wider">
              <span>Assistent</span>
              <span className="bg-text-1 inline-flex h-1.5 w-1.5 animate-pulse rounded-full" />
              <span>Schreibt …</span>
            </div>
            <div className="mt-3 flex gap-1">
              <div className="bg-text-1 h-2 w-2 animate-pulse rounded-full" />
              <div
                className="bg-text-1 h-2 w-2 animate-pulse rounded-full"
                style={{ animationDelay: "0.15s" }}
              />
              <div
                className="bg-text-1 h-2 w-2 animate-pulse rounded-full"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </Card>
        </div>
      )}

      {!isSticking && (
        <div className="flex justify-center py-2">
          <button
            onClick={() => scrollToBottom()}
            className="border-border bg-card text-text-secondary hover:bg-surface-subtle inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors"
            aria-label="Zu neuen Nachrichten scrollen"
          >
            ↓ Nach unten
          </button>
        </div>
      )}
    </div>
  );
}
