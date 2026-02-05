import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useCallback, useEffect, useRef } from "react";

import { useStickToBottom } from "../../hooks/useStickToBottom";
import { cn } from "../../lib/utils";
import type { ChatMessageType } from "../../types/chatMessage";
import { TypingIndicator } from "../../ui/TypingIndicator";
import { ChatMessage } from "./ChatMessage";

// Configuration constants
const DEFAULT_SCROLL_TO_BOTTOM_THRESHOLD_PX = 160; // Distance from bottom before "scroll to bottom" appears
const DEFAULT_VIRTUALIZATION_THRESHOLD = 40; // Minimum messages before windowing kicks in
const DEFAULT_OVERSCAN = 6; // Extra items rendered above/below viewport
const DEFAULT_ESTIMATED_ROW_HEIGHT = 160; // px (measured dynamically after first render)

// Memoized ChatMessage for performance optimization
const MemoizedChatMessage = React.memo(ChatMessage, (prevProps, nextProps) => {
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.timestamp === nextProps.message.timestamp &&
    prevProps.isLast === nextProps.isLast &&
    prevProps.index === nextProps.index
  );
});

interface VirtualizedMessageListProps {
  messages: ChatMessageType[];
  /**
   * Optional key used to reset scroll-to-bottom behavior when the conversation changes.
   * Pass `activeConversationId` from the parent when available.
   */
  conversationKey?: string;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onFollowUp?: (prompt: string) => void;
  isLoading?: boolean;
  className?: string;
  virtualizationThreshold?: number;
  overscan?: number;
  estimateRowHeight?: number;
  scrollContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

export function VirtualizedMessageList({
  messages,
  conversationKey,
  onRetry,
  onCopy,
  onEdit,
  onDelete,
  onFollowUp,
  isLoading = false,
  className,
  virtualizationThreshold = DEFAULT_VIRTUALIZATION_THRESHOLD,
  overscan = DEFAULT_OVERSCAN,
  estimateRowHeight = DEFAULT_ESTIMATED_ROW_HEIGHT,
  scrollContainerRef,
}: VirtualizedMessageListProps) {
  const didInitialScrollRef = useRef(false);
  const lastConversationKeyRef = useRef<string | undefined>(conversationKey);

  const { scrollRef, isSticking, scrollToBottom } = useStickToBottom({
    threshold: DEFAULT_SCROLL_TO_BOTTOM_THRESHOLD_PX,
    enabled: true,
    containerRef: scrollContainerRef,
  });

  const shouldVirtualize = messages.length > virtualizationThreshold;

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

  const getScrollElement = useCallback(
    () => scrollContainerRef?.current ?? scrollRef.current,
    [scrollContainerRef, scrollRef],
  );

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement,
    estimateSize: () => estimateRowHeight,
    overscan,
  });

  // Ensure we start at the bottom when mounting or when the conversation changes.
  useEffect(() => {
    if (messages.length === 0) return;

    const conversationChanged =
      typeof conversationKey === "string" && conversationKey !== lastConversationKeyRef.current;

    if (conversationChanged) {
      lastConversationKeyRef.current = conversationKey;
      didInitialScrollRef.current = false;
    }

    if (didInitialScrollRef.current) return;
    didInitialScrollRef.current = true;

    requestAnimationFrame(() => {
      try {
        rowVirtualizer.scrollToIndex(messages.length - 1, { align: "end" });
      } catch {
        scrollToBottom("instant");
      }
    });
  }, [conversationKey, messages.length, rowVirtualizer, scrollToBottom]);

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
        {shouldVirtualize ? (
          <div className="relative w-full" style={{ height: rowVirtualizer.getTotalSize() }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const message = messages[virtualRow.index];
              if (!message) return null;

              return (
                <div
                  key={message.id}
                  data-testid="message-row"
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  className={cn(
                    "absolute left-0 top-0 w-full",
                    virtualRow.index === messages.length - 1 ? "pb-0" : "pb-6",
                  )}
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  <MemoizedChatMessage
                    message={message}
                    isLast={virtualRow.index === messages.length - 1 && !isLoading}
                    index={virtualRow.index}
                    onRetry={handleRetry}
                    onCopy={handleCopy}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onFollowUp={onFollowUp}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {messages.map((message, index) => (
              <div key={message.id} data-testid="message-row">
                <MemoizedChatMessage
                  message={message}
                  isLast={index === messages.length - 1 && !isLoading}
                  index={index}
                  onRetry={handleRetry}
                  onCopy={handleCopy}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onFollowUp={onFollowUp}
                />
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="py-4 animate-fade-in">
            <TypingIndicator />
          </div>
        )}

        {/* Scroll to Bottom FAB */}
        {!isSticking && (
          <div className="pointer-events-none fixed bottom-[calc(7.5rem+env(safe-area-inset-bottom))] left-1/2 z-fab -translate-x-1/2 animate-fade-in">
            <button
              onClick={() => scrollToBottom()}
              className="pointer-events-auto flex h-10 items-center gap-2 rounded-full bg-surface-2/80 px-4 text-sm font-medium text-ink-primary backdrop-blur border border-white/10 shadow-lg hover:bg-surface-3 hover:border-accent-chat-border hover:shadow-glow-sm"
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
