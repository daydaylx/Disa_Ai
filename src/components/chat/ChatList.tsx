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
  const [quickstartError, setQuickstartError] = useState<string | null>(null);
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

  // Handle fallback to standard chat
  const handleStartStandardChat = () => {
    onQuickstartFlow?.("Hallo! Wie kann ich dir heute helfen?", false);
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
        setQuickstartError(null);
        const actions = await loadQuickstarts();

        if (actions.length === 0) {
          setQuickstartError("Keine Schnellstarts verfügbar");
          console.warn("Quickstarts configuration is empty");
        } else {
          setQuickstarts(actions);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
        setQuickstartError(`Fehler beim Laden der Schnellstarts: ${errorMessage}`);
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
              {isLoadingQuickstarts ? (
                // Loading skeleton
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
              ) : quickstartError ? (
                // Error/Empty state
                <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6 text-center">
                  <div className="mb-4">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        className="h-6 w-6 text-yellow-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833-.23 2.5 1.31 2.5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-100">
                      {quickstartError.includes("verfügbar")
                        ? "Keine Schnellstarts verfügbar"
                        : "Konfigurationsfehler"}
                    </h3>
                    <p className="mt-2 text-sm text-yellow-200/80">{quickstartError}</p>
                  </div>
                  <button
                    onClick={handleStartStandardChat}
                    className="tap-target inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-6 py-3 font-medium text-white shadow-[0_18px_38px_rgba(168,85,247,0.4)] transition-transform hover:translate-y-[-1px] hover:shadow-[0_20px_45px_rgba(168,85,247,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    data-testid="start-standard-chat"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.97 8.97 0 01-4.906-1.442l-3.657 1.082a1 1 0 01-1.28-1.28l1.082-3.657A8.97 8.97 0 013 12a8 8 0 1118 0z"
                      />
                    </svg>
                    Standard-Chat starten
                  </button>
                </div>
              ) : quickstarts.length === 0 ? (
                // No quickstarts but no error (shouldn't happen with defaults)
                <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6 text-center">
                  <div className="mb-4">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                      <svg
                        className="h-6 w-6 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-100">
                      Keine Schnellstarts verfügbar
                    </h3>
                    <p className="mt-2 text-sm text-blue-200/80">
                      Du kannst trotzdem direkt mit dem Chat beginnen.
                    </p>
                  </div>
                  <button
                    onClick={handleStartStandardChat}
                    className="tap-target inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-6 py-3 font-medium text-white shadow-[0_18px_38px_rgba(168,85,247,0.4)] transition-transform hover:translate-y-[-1px] hover:shadow-[0_20px_45px_rgba(168,85,247,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    data-testid="start-standard-chat"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.97 8.97 0 01-4.906-1.442l-3.657 1.082a1 1 0 01-1.28-1.28l1.082-3.657A8.97 8.97 0 113 12a8 8 0 1118 0z"
                      />
                    </svg>
                    Standard-Chat starten
                  </button>
                </div>
              ) : (
                quickstarts.map((action) => {
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
                })
              )}
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
