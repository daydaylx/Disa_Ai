import React, { useEffect, useState } from "react";

import type { QuickstartAction } from "../../config/quickstarts";
import { loadQuickstarts } from "../../config/quickstarts";
import { useQuickstartFlow } from "../../hooks/useQuickstartFlow";
import { useStickToBottom } from "../../hooks/useStickToBottom";
import { cn } from "../../lib/utils";
import type { ChatMessageType } from "./ChatMessage";
import { ChatMessage } from "./ChatMessage";

interface ChatListProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onQuickstartFlow?: (prompt: string, autosend: boolean) => void;
  isQuickstartLoading?: boolean;
  className?: string;
}

export function ChatList({
  messages,
  isLoading,
  onRetry,
  onCopy,
  onQuickstartFlow,
  isQuickstartLoading,
  className,
}: ChatListProps) {
  const [quickstarts, setQuickstarts] = useState<QuickstartAction[]>([]);
  const [isLoadingQuickstarts, setIsLoadingQuickstarts] = useState(true);
  const [activeQuickstart, setActiveQuickstart] = useState<string | null>(null);

  const { scrollRef, isSticking, scrollToBottom } = useStickToBottom({
    threshold: 0.8,
    enabled: true,
  });

  const { startQuickstartFlow } = useQuickstartFlow({
    onStartFlow: onQuickstartFlow || (() => {}),
  });

  // Handle quickstart click with visual feedback
  const handleQuickstartClick = (action: QuickstartAction) => {
    setActiveQuickstart(action.id);
    startQuickstartFlow(action);
  };

  // Clear active state when not loading anymore
  React.useEffect(() => {
    if (!isQuickstartLoading) {
      setActiveQuickstart(null);
    }
  }, [isQuickstartLoading]);

  // Load quickstarts on mount
  useEffect(() => {
    const loadQuickstartActions = async () => {
      try {
        setIsLoadingQuickstarts(true);
        const actions = await loadQuickstarts();
        setQuickstarts(actions);
      } catch (error) {
        console.error("Failed to load quickstarts:", error);
      } finally {
        setIsLoadingQuickstarts(false);
      }
    };

    void loadQuickstartActions();
  }, []);

  const handleCopy = (content: string) => {
    onCopy?.(content);
    // Could add toast notification here
  };

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex-1 overflow-y-auto scroll-smooth px-1 pb-6",
        "[mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)]",
        "[-webkit-mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)]",
        className,
      )}
      role="log"
      aria-label="Chat messages"
      data-testid="chat-log"
    >
      <div className="mx-auto flex h-full w-full max-w-md flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 space-y-6 px-2 pt-2">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-6 text-left text-white shadow-[0_25px_60px_rgba(15,23,42,0.55)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(236,72,153,0.35),_transparent_65%)]" />
              <div className="pointer-events-none absolute bottom-[-40%] right-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.35),_transparent_65%)]" />
              <div className="relative space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                  Willkommen zurück
                </span>
                <h2 className="text-2xl font-semibold leading-tight text-white">
                  Was möchtest du heute erschaffen?
                </h2>
                <p className="max-w-[18rem] text-sm text-white/65">
                  Nutze die vorgeschlagenen Flows oder stelle einfach deine Frage. Disa AI reagiert
                  in Sekunden.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {isLoadingQuickstarts
                ? // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 text-white shadow-[0_20px_50px_rgba(12,16,35,0.55)] backdrop-blur-2xl"
                    >
                      <div className="animate-pulse">
                        <div className="h-6 w-32 rounded bg-white/20"></div>
                        <div className="mt-2 h-4 w-48 rounded bg-white/10"></div>
                      </div>
                    </div>
                  ))
                : quickstarts.map((action) => {
                    const isActive = activeQuickstart === action.id;
                    const isDisabled = isQuickstartLoading && !isActive;

                    return (
                      <button
                        key={action.id}
                        onClick={() => handleQuickstartClick(action)}
                        disabled={isDisabled}
                        className={cn(
                          "tap-target relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 text-left text-white shadow-[0_20px_50px_rgba(12,16,35,0.55)] backdrop-blur-2xl transition-all",
                          // Interactive states
                          !isDisabled &&
                            "hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(12,16,35,0.65)] active:scale-[0.98]",
                          // Focus state for A11y
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                          // Loading state
                          isActive && "scale-[0.98] opacity-80",
                          // Disabled state
                          isDisabled && "cursor-not-allowed opacity-40",
                        )}
                        data-testid={`quickstart-${action.id}`}
                        aria-label={`${action.title}: ${action.subtitle}`}
                        aria-disabled={isDisabled}
                        aria-busy={isActive}
                      >
                        <div
                          className={cn(
                            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-50",
                            action.gradient,
                          )}
                        />

                        {/* Loading overlay for active quickstart */}
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-white">
                              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M12 3a9 9 0 019 9"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="opacity-60"
                                />
                              </svg>
                              <span className="text-sm font-medium">Startet...</span>
                            </div>
                          </div>
                        )}

                        <div className="relative flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold tracking-tight">{action.title}</h3>
                            <p className="mt-1 text-sm text-white/70">{action.subtitle}</p>
                          </div>
                          <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs text-white/70">
                            {isActive ? "Lädt..." : action.autosend ? "Auto-Start" : "Schnellstart"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
            </div>
          </div>
        ) : (
          <div className="flex-1">
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
              <div className="flex items-start gap-3 px-3 py-5">
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
          </div>
        )}

        {/* Scroll anchor and stick indicator */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="h-1 flex-1" />
          {!isSticking && (
            <button
              onClick={() => scrollToBottom()}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur transition hover:bg-white/20"
            >
              ↓ Nach unten
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
