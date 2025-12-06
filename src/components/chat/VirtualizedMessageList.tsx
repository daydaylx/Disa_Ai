import React, { useCallback, useMemo, useState } from "react";

import { useStickToBottom } from "../../hooks/useStickToBottom";
import { cn } from "../../lib/utils";
import type { ChatMessageType } from "../../types/chatMessage";
import { ChatMessage } from "./ChatMessage";

// Memoized ChatMessage for performance optimization
const MemoizedChatMessage = React.memo(ChatMessage, (prevProps, nextProps) => {
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.timestamp === nextProps.message.timestamp &&
    prevProps.isLast === nextProps.isLast
  );
});

interface VirtualizedMessageListProps {
  messages: ChatMessageType[];
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onFollowUp?: (prompt: string) => void;
  isLoading?: boolean;
  className?: string;
  initialRenderCount?: number;
  loadMoreCount?: number;
  virtualizationThreshold?: number;
  scrollContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

export function VirtualizedMessageList({
  messages,
  onRetry,
  onCopy,
  onEdit,
  onFollowUp,
  isLoading = false,
  className,
  initialRenderCount = 50,
  loadMoreCount = 30,
  virtualizationThreshold = 20,
  scrollContainerRef,
}: VirtualizedMessageListProps) {
  const [visibleCount, setVisibleCount] = useState(initialRenderCount);
  const { scrollRef, isSticking, scrollToBottom } = useStickToBottom({
    threshold: 0.8,
    enabled: true,
    containerRef: scrollContainerRef,
  });

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
      const container = scrollRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight * 0.2;
      }
    });
  }, [messages.length, loadMoreCount, scrollRef]);

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

  const attachInternalRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!scrollContainerRef) {
        scrollRef.current = node;
      }
    },
    [scrollContainerRef, scrollRef],
  );

  return (
    <div data-testid="message-list" className={cn("flex flex-col gap-6", className)}>
      <div ref={scrollContainerRef ? undefined : attachInternalRef} className="flex flex-col">
        {shouldVirtualize && hiddenCount > 0 && (
          <div className="flex justify-center py-4">
            <button
              onClick={loadOlderMessages}
              className="text-xs text-ink-tertiary hover:text-ink-primary transition-colors px-3 py-1 rounded-full bg-surface-2 hover:bg-surface-3"
              data-testid="load-older-messages"
            >
              ↑ {hiddenCount} ältere Nachrichten laden
            </button>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {visibleMessages.map((message, index) => (
            <div key={message.id} data-testid="message-bubble">
              <MemoizedChatMessage
                message={message}
                isLast={index === visibleMessages.length - 1 && !isLoading}
                onRetry={handleRetry}
                onCopy={handleCopy}
                onEdit={onEdit}
                onFollowUp={onFollowUp}
              />
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-start gap-4 py-4 animate-fade-in">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink-tertiary">
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
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex gap-1.5 h-6 items-center">
                <span className="text-xs font-medium text-ink-tertiary">Disa denkt nach</span>
                <div className="flex gap-1 ml-1">
                  <div
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-tertiary"
                    style={{ animationDelay: "0s" }}
                  />
                  <div
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-tertiary"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-tertiary"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll to Bottom FAB */}
        {!isSticking && (
          <div className="pointer-events-none fixed bottom-32 left-1/2 z-fab -translate-x-1/2 animate-fade-in">
            <button
              onClick={() => scrollToBottom()}
              className="pointer-events-auto flex h-10 items-center gap-2 rounded-full bg-surface-3/80 px-4 text-sm font-medium text-ink-primary backdrop-blur hover:bg-surface-3 shadow-lg"
              aria-label="Zu neuen Nachrichten scrollen"
            >
              ↓ Neueste
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
