import React, { useEffect, useState } from "react";

import type { QuickstartAction } from "../../config/quickstarts";
import { getQuickstartsWithFallback } from "../../config/quickstarts";
import { useQuickstartFlow } from "../../hooks/useQuickstartFlow";
import { useStickToBottom } from "../../hooks/useStickToBottom";
import { cn } from "../../lib/utils";
import { GlassTile } from "../ui/GlassTile";
import type { ChatMessageType } from "./ChatMessage";
import { VirtualizedMessageList } from "./VirtualizedMessageList";

interface ChatListProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onQuickstartFlow?: (prompt: string, autosend: boolean) => void;
  isQuickstartLoading?: boolean;
  currentModel?: string; // For analytics tracking
  className?: string;
}

export function ChatList({
  messages,
  isLoading,
  onRetry,
  onCopy,
  onQuickstartFlow,
  isQuickstartLoading,
  currentModel,
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
    currentModel,
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
        const actions = await getQuickstartsWithFallback();

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
          <div className="flex-1 space-y-4 px-2 pt-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-white backdrop-blur-lg">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">
                  Was möchtest du heute erschaffen?
                </h2>
                <p className="text-sm text-white/65">
                  Nutze die vorgeschlagenen Flows oder stelle einfach deine Frage. Disa AI reagiert
                  in Sekunden.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {isLoadingQuickstarts ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="tile flex min-h-[120px] animate-pulse flex-col items-center justify-center"
                  >
                    <div className="mb-2 h-8 w-8 rounded-full bg-white/20"></div>
                    <div className="h-4 w-20 rounded bg-white/20"></div>
                    <div className="mt-2 h-3 w-24 rounded bg-white/10"></div>
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

                  return (
                    <GlassTile
                      key={action.id}
                      icon={action.icon || "✨"}
                      title={action.title}
                      subtitle={action.subtitle}
                      onPress={() => handleQuickstartClick(action)}
                      disabled={isQuickstartLoading && !isActive}
                    />
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <VirtualizedMessageList
              messages={messages}
              onRetry={onRetry}
              onCopy={handleCopy}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Scroll anchor and stick indicator */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="h-1 flex-1" />
          {!isSticking && (
            <button
              onClick={() => scrollToBottom()}
              className="inline-flex animate-bounce items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-lg transition hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Nach unten
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
