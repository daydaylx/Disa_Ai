/**
 * Virtualized Message List with auto-scroll and performance optimization
 * Supports 100+ messages with efficient rendering and scroll management
 */

import type { ReactNode } from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "../../lib/utils/cn";
import { LoadingDots } from "../ui/Skeleton";
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
  renderMessage?: (message: MessageData, onCopy: () => void) => ReactNode;
  onScrollStateChange?: (state: { isAtBottom: boolean; showScrollFab: boolean }) => void;
}

const ITEM_HEIGHT_ESTIMATE = 120; // Estimated height per message
const VIEWPORT_BUFFER = 5; // Number of items to render outside viewport
const SCROLL_THRESHOLD = 100; // Distance from bottom to show scroll fab

export interface MessageListHandle {
  scrollToBottom: (smooth?: boolean) => void;
}

export const MessageList = forwardRef<MessageListHandle, MessageListProps>(
  (
    {
      messages,
      isLoading = false,
      className,
      onCopyMessage,
      virtualizeThreshold = 50,
      renderMessage,
      onScrollStateChange,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const endAnchorRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [hasOverflow, setHasOverflow] = useState(false);
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
      const startIndex = Math.max(
        0,
        Math.floor(scrollTop / ITEM_HEIGHT_ESTIMATE) - VIEWPORT_BUFFER,
      );
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
      setHasOverflow(scrollHeight > clientHeight + 8);

      // Update virtual range if virtualizing
      if (shouldVirtualize) {
        calculateVisibleRange();
      }
    }, [shouldVirtualize, calculateVisibleRange]);

    // Scroll to bottom function
    const scrollToBottom = useCallback((smooth: boolean = true) => {
      if (!containerRef.current) return;

      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        scrollToBottom,
      }),
      [scrollToBottom],
    );

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
      requestAnimationFrame(() => {
        handleScroll();
      });

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

    // Track bottom visibility via IntersectionObserver for accurate scroll-lock detection
    useEffect(() => {
      const container = containerRef.current;
      const sentinel = endAnchorRef.current;
      if (!container || !sentinel) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          const atBottom = entry?.isIntersecting ?? false;
          setIsAtBottom(atBottom);
        },
        { root: container, threshold: 1 },
      );

      observer.observe(sentinel);

      return () => observer.disconnect();
    }, []);

    // Observe container size changes to determine overflow state
    useEffect(() => {
      const container = containerRef.current;
      if (!container || typeof ResizeObserver === "undefined") {
        setHasOverflow((container?.scrollHeight ?? 0) > (container?.clientHeight ?? 0) + 8);
        return;
      }

      const updateOverflow = () => {
        setHasOverflow(container.scrollHeight > container.clientHeight + 8);
      };

      updateOverflow();
      const resizeObserver = new ResizeObserver(updateOverflow);
      resizeObserver.observe(container);

      return () => resizeObserver.disconnect();
    }, [messages.length, virtualStart, virtualEnd]);

    const showScrollFab = useMemo(() => !isAtBottom && hasOverflow, [isAtBottom, hasOverflow]);

    useEffect(() => {
      if (!onScrollStateChange) return;
      onScrollStateChange({ isAtBottom, showScrollFab });
    }, [isAtBottom, showScrollFab, onScrollStateChange]);

    return (
      <div className={cn("relative flex-1 overflow-hidden", className)}>
        <div
          ref={containerRef}
          className="h-full overflow-y-auto scroll-smooth"
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

            <div ref={endAnchorRef} aria-hidden className="h-1 w-full" />
          </div>
        </div>
      </div>
    );
  },
);

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

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      ref={ref}
      className={cn("mb-4 flex items-start", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && <Avatar kind="assistant" />}
      <div
        className={cn(
          "chat-bubble relative max-w-[min(92vw,42ch)] rounded-2xl p-3 text-text",
          isUser
            ? "border border-transparent bg-grad-primary text-white shadow-glow"
            : "glass-solid",
        )}
      >
        {/* Copy button */}
        <button
          onClick={onCopy}
          className="focus-visible:ring-accent-2/70 absolute right-2 top-2 rounded-full border border-white/15 bg-black/40 p-1 text-xs opacity-80 transition duration-200 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
          aria-label="Nachricht kopieren"
          type="button"
        >
          {/* Copy button */}
          <button
            onClick={onCopy}
            className="touch-target absolute right-2 top-2 rounded p-1 text-xs opacity-60 transition-opacity hover:opacity-100 focus:opacity-100"
            aria-label="Nachricht kopieren"
            type="button"
          >
            📋
          </button>

          {/* Message content */}
          <div className="whitespace-pre-wrap pr-8 text-base leading-6">{message.content}</div>
        </div>

        {/* Timestamp */}
        {message.timestamp && (
          <div className={cn("mt-1 text-xs text-neutral-600", isUser && "text-right")}>
            {formatTime(message.timestamp)}
          </div>
        )}
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
