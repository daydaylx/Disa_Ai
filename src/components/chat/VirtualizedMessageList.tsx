import React, { useCallback, useMemo, useState } from "react";

import { useStickToBottom } from "../../hooks/useStickToBottom";
import { cn } from "../../lib/utils";
import type { ChatMessageType } from "../../types/chatMessage";
import { ChatMessage } from "./ChatMessage";

// Memoized ChatMessage for performance optimization
const MemoizedChatMessage = React.memo(ChatMessage, (prevProps, nextProps) => {
  // Custom comparison focusing on data that affects rendering
  // Funktions-Vergleiche entfernt - diese brechen Memoization da Funktionen oft neu erstellt werden
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
    <div data-testid="message-list" className={cn("h-full chalkboard-container", className)}>
      <div
        ref={scrollContainerRef ? undefined : attachInternalRef}
        className="chat-scroll-area h-full"
      >
        {shouldVirtualize && hiddenCount > 0 && (
          <div className="sticky top-0 z-sticky-content flex justify-center py-2">
            <button
              onClick={loadOlderMessages}
              className="chalk-button px-4 py-2 text-sm rounded-full"
              data-testid="load-older-messages"
            >
              ↑ {hiddenCount} ältere Nachrichten laden
            </button>
          </div>
        )}

        <div className="chat-stack">
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
          <div className="flex items-start gap-4 px-4 py-6">
            <div className="chalk-bubble flex h-9 w-9 items-center justify-center rounded-full">
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
            <div className="chalk-bubble flex-1 rounded-lg p-4 text-sm">
              <div className="text-[var(--chalk-white-faded)] flex items-center gap-2 text-xs uppercase tracking-wider">
                <span>Assistent</span>
                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--chalk-white-faded)]" />
                <span>Schreibt …</span>
              </div>
              <div className="mt-3 flex gap-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--chalk-white-faded)]" />
                <div
                  className="h-2 w-2 animate-pulse rounded-full bg-[var(--chalk-white-faded)]"
                  style={{ animationDelay: "0.15s" }}
                />
                <div
                  className="h-2 w-2 animate-pulse rounded-full bg-[var(--chalk-white-faded)]"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Scroll to Bottom FAB - Fixed Position */}
        {!isSticking && (
          <div className="pointer-events-none fixed bottom-28 left-1/2 z-fab -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <button
              onClick={() => scrollToBottom()}
              className="chalk-button px-4 py-2 text-sm rounded-full shadow-lg hover:shadow-xl"
              aria-label="Zu neuen Nachrichten scrollen"
            >
              ↓ Nach unten
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
