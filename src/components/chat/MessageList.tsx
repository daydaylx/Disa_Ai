/**
 * Virtualized Message List with auto-scroll and performance optimization
 * Supports 100+ messages with efficient rendering and scroll management
 */

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "../../lib/utils/cn";
import Avatar from "./Avatar";

export interface MessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

export interface MessageListProps {
  messages: MessageData[];
  isLoading?: boolean;
  className?: string;
  onCopyMessage?: (content: string) => void;
  virtualizeThreshold?: number;
  renderMessage?: (message: MessageData, onCopy: () => void) => React.ReactNode;
}

const ITEM_HEIGHT_ESTIMATE = 120; // Estimated height per message
const VIEWPORT_BUFFER = 5; // Number of items to render outside viewport
const SCROLL_THRESHOLD = 100; // Distance from bottom to show scroll fab

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false,
  className,
  onCopyMessage,
  virtualizeThreshold = 50,
  renderMessage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollFab, setShowScrollFab] = useState(false);
  const [virtualStart, setVirtualStart] = useState(0);
  const [virtualEnd, setVirtualEnd] = useState(0);
  const [itemHeights, setItemHeights] = useState<Map<string, number>>(new Map());
  const lastMessageCount = useRef(messages.length);

  const shouldVirtualize = messages.length > virtualizeThreshold;

  // Calculate visible range for virtualization
  const calculateVisibleRange = useCallback(() => {
    if (!containerRef.current || !shouldVirtualize) {
      setVirtualStart(0);
      setVirtualEnd(messages.length);
      return;
    }

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    // Estimate start and end indices
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT_ESTIMATE) - VIEWPORT_BUFFER);
    const visibleItems = Math.ceil(containerHeight / ITEM_HEIGHT_ESTIMATE);
    const endIndex = Math.min(messages.length, startIndex + visibleItems + VIEWPORT_BUFFER * 2);

    setVirtualStart(startIndex);
    setVirtualEnd(endIndex);
  }, [messages.length, shouldVirtualize]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Check if near bottom
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const nearBottom = distanceFromBottom < SCROLL_THRESHOLD;

    setIsAtBottom(nearBottom);
    setShowScrollFab(!nearBottom && messages.length > 10);

    // Update virtual range if virtualizing
    if (shouldVirtualize) {
      calculateVisibleRange();
    }
  }, [shouldVirtualize, calculateVisibleRange, messages.length]);

  // Scroll to bottom function
  const scrollToBottom = useCallback((smooth: boolean = true) => {
    if (!containerRef.current) return;

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messageCountChanged = messages.length !== lastMessageCount.current;
    lastMessageCount.current = messages.length;

    if (messageCountChanged && isAtBottom) {
      // Small delay to ensure DOM is updated
      requestAnimationFrame(() => {
        scrollToBottom(true);
      });
    }
  }, [messages.length, isAtBottom, scrollToBottom]);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const throttledScroll = throttle(handleScroll, 16); // ~60fps
    container.addEventListener("scroll", throttledScroll, { passive: true });

    // Initial calculation
    calculateVisibleRange();

    return () => container.removeEventListener("scroll", throttledScroll);
  }, [handleScroll, calculateVisibleRange]);

  // Measure item heights for better virtualization
  const measureItemHeight = useCallback((id: string, height: number) => {
    setItemHeights((prev) => {
      const updated = new Map(prev);
      updated.set(id, height);
      return updated;
    });
  }, []);

  // Calculate total height for virtualized container
  const getTotalHeight = useCallback(() => {
    if (!shouldVirtualize) return "auto";

    let totalHeight = 0;
    messages.forEach((msg) => {
      const measuredHeight = itemHeights.get(msg.id);
      totalHeight += measuredHeight || ITEM_HEIGHT_ESTIMATE;
    });

    return totalHeight;
  }, [messages, itemHeights, shouldVirtualize]);

  // Calculate offset for virtual start
  const getOffsetTop = useCallback(() => {
    if (!shouldVirtualize) return 0;

    let offset = 0;
    for (let i = 0; i < virtualStart; i++) {
      const msg = messages[i];
      if (msg) {
        const measuredHeight = itemHeights.get(msg.id);
        offset += measuredHeight || ITEM_HEIGHT_ESTIMATE;
      }
    }

    return offset;
  }, [virtualStart, messages, itemHeights, shouldVirtualize]);

  // Get visible messages
  const visibleMessages = shouldVirtualize ? messages.slice(virtualStart, virtualEnd) : messages;

  // Default message renderer
  const defaultRenderMessage = useCallback(
    (message: MessageData, onCopy: () => void) => {
      const isUser = message.role === "user";

      return (
        <MessageItem
          key={message.id}
          message={message}
          isUser={isUser}
          onCopy={onCopy}
          onHeightChange={(height) => measureItemHeight(message.id, height)}
        />
      );
    },
    [measureItemHeight],
  );

  const messageRenderer = renderMessage || defaultRenderMessage;

  return (
    <div className={cn("relative flex-1 overflow-hidden", className)}>
      <div
        ref={containerRef}
        className="h-full overflow-y-auto"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        <div
          ref={listRef}
          className="relative"
          style={{
            height: shouldVirtualize ? getTotalHeight() : "auto",
            paddingTop: shouldVirtualize ? getOffsetTop() : 0,
          }}
        >
          {visibleMessages.map((message) => {
            const handleCopy = () => onCopyMessage?.(message.content);
            return messageRenderer(message, handleCopy);
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="my-2 flex items-start gap-2">
              <Avatar kind="assistant" />
              <div className="glass-solid rounded-2xl p-3">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom FAB */}
      {showScrollFab && (
        <button
          onClick={() => scrollToBottom(true)}
          className={cn(
            "fixed bottom-24 right-4 z-30",
            "flex h-12 w-12 items-center justify-center",
            "rounded-full bg-primary text-primary-foreground shadow-lg",
            "transition-all duration-200 hover:scale-110",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          )}
          aria-label="Scroll to bottom"
          type="button"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

// Individual message item component with height measurement
interface MessageItemProps {
  message: MessageData;
  isUser: boolean;
  onCopy: () => void;
  onHeightChange: (height: number) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isUser, onCopy, onHeightChange }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Measure height when component mounts or content changes
  useEffect(() => {
    if (ref.current) {
      const height = ref.current.offsetHeight;
      onHeightChange(height);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.content]); // onHeightChange intentionally excluded to prevent infinite loop

  return (
    <div
      ref={ref}
      className={cn("msg my-3 flex items-start gap-2", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && <Avatar kind="assistant" />}
      <div
        className={cn(
          "chat-bubble relative max-w-[min(92%,42.5rem)] rounded-2xl p-3 text-text",
          isUser
            ? "border border-transparent bg-grad-primary text-white shadow-glow"
            : "glass-solid",
        )}
      >
        {/* Copy button */}
        <button
          onClick={onCopy}
          className="absolute right-2 top-2 rounded p-1 text-xs opacity-0 transition-opacity duration-200 hover:opacity-100 group-hover:opacity-100"
          aria-label="Copy message"
          type="button"
        >
          📋
        </button>

        {/* Message content */}
        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
      </div>
      {isUser && <Avatar kind="user" />}
    </div>
  );
};

// Utility: throttle function for scroll performance
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;

  return (...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          func(...args);
          lastExecTime = Date.now();
        },
        delay - (currentTime - lastExecTime),
      );
    }
  };
}

export default MessageList;
