import { useEffect, useRef } from "react";

import { cn } from "../../lib/utils";
import type { ChatMessage as ChatMessageType } from "./ChatMessage";
import { ChatMessage } from "./ChatMessage";

interface ChatListProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  className?: string;
}

export function ChatList({ messages, isLoading, onRetry, onCopy, className }: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const handleCopy = (content: string) => {
    onCopy?.(content);
    // Could add toast notification here
  };

  return (
    <div ref={containerRef} className={cn("flex-1 overflow-y-auto scroll-smooth", className)}>
      <div className="mx-auto max-w-4xl">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <svg
                  className="h-6 w-6 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  Start a conversation
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Send a message to begin chatting with the AI assistant.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
                onRetry={onRetry}
                onCopy={handleCopy}
              />
            ))}

            {isLoading && (
              <div className="flex gap-3 px-4 py-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <svg
                    className="h-4 w-4 text-neutral-600 dark:text-neutral-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Assistant
                    </span>
                  </div>
                  <div className="rounded-lg bg-white p-4 dark:bg-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-400"></div>
                        <div
                          className="h-2 w-2 animate-pulse rounded-full bg-neutral-400"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-pulse rounded-full bg-neutral-400"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-neutral-500">Typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}
