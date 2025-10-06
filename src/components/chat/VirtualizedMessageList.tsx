/**
 * VirtualizedMessageList Component
 * Implements Issue #106 - Virtual scrolling for large message lists
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useStickToBottom } from "../../hooks/useStickToBottom";
import { cn } from "../../lib/cn";
import type { ChatMessageType } from "../../types/chatMessage";
import { ChatMessage } from "./ChatMessage";

interface VirtualizedMessageListProps {
  messages: ChatMessageType[];
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  isLoading?: boolean;
  className?: string;
  /** Number of messages to render initially and load incrementally */
  initialRenderCount?: number;
  /** Number of messages to load when "Load more" is clicked */
  loadMoreCount?: number;
  /** Threshold for virtualization (messages count above which virtualization kicks in) */
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

  // Combine refs
  const setRefs = useCallback(
    (element: HTMLDivElement | null) => {
      containerRef.current = element;
      scrollRef.current = element;
    },
    [scrollRef],
  );

  // Auto-scroll to bottom when new messages arrive (only if user was at bottom)
  useEffect(() => {
    if (isSticking && messages.length > 0) {
      setTimeout(() => scrollToBottom(), 50);
    }
  }, [messages.length, isSticking, scrollToBottom]);

  // Calculate which messages to render
  const { visibleMessages, shouldVirtualize, hiddenCount } = useMemo(() => {
    const shouldVirtualize = messages.length > virtualizationThreshold;

    if (!shouldVirtualize) {
      return {
        visibleMessages: messages,
        shouldVirtualize: false,
        hiddenCount: 0,
      };
    }

    // For virtualization, show the most recent messages up to visibleCount
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

    // Scroll to maintain position after loading
    requestAnimationFrame(() => {
      const container = containerRef.current;
      if (container) {
        // Scroll to maintain relative position
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
      {/* Load older messages button */}
      {shouldVirtualize && hiddenCount > 0 && (
        <div className="sticky top-0 z-10 flex justify-center py-2">
          <button
            onClick={loadOlderMessages}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/80 backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            data-testid="load-older-messages"
          >
            ↑ {hiddenCount} ältere Nachrichten laden
          </button>
        </div>
      )}

      {/* Virtualized messages */}
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

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-start gap-4 px-4 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 shadow-[0_10px_28px_rgba(8,15,31,0.45)]">
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
          <div className="flex-1 rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-white/70 shadow-[0_18px_40px_rgba(8,15,31,0.45)] backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50">
              <span>Assistent</span>
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
              <span>Schreibt …</span>
            </div>
            <div className="mt-3 flex gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-white/70" />
              <div
                className="h-2 w-2 animate-pulse rounded-full bg-white/70"
                style={{ animationDelay: "0.15s" }}
              />
              <div
                className="h-2 w-2 animate-pulse rounded-full bg-white/70"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Performance optimization: Add scroll anchor when not sticking */}
      {!isSticking && (
        <div className="flex justify-center py-2">
          <button
            onClick={() => scrollToBottom()}
            className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur transition hover:bg-white/20"
            aria-label="Zu neuen Nachrichten scrollen"
          >
            ↓ Nach unten
          </button>
        </div>
      )}
    </div>
  );
}
