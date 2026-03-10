import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getChatLogoState } from "@/app/components/logoState";
import { DRAWER_NAV_ITEMS } from "@/config/navigation";
import { type ChatApiStatus } from "@/hooks/useChat";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { RefreshCw } from "@/lib/icons";
import { AnimatedBrandmark } from "@/ui/AnimatedBrandmark";
import { Button } from "@/ui/Button";
import { HistoryFAB } from "@/ui/HistoryFAB";
import { ScrollToBottom } from "@/ui/ScrollToBottom";

import { ChatStatusBanner } from "../components/chat/ChatStatusBanner";
import { QuickstartStrip } from "../components/chat/QuickstartStrip";
import { UnifiedInputBar, type UnifiedInputBarHandle } from "../components/chat/UnifiedInputBar";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { AppMenuDrawer } from "../components/layout/AppMenuDrawer";
import { ChatLayout } from "../components/layout/ChatLayout";
import { HistorySidePanel } from "../components/navigation/HistorySidePanel";
import { getQuickstarts } from "../config/quickstarts";
import { useChatPageLogic } from "../hooks/useChatPageLogic";
import { useChatQuickstart } from "../hooks/useChatQuickstart";

// Define actions for the reducer
interface UIState {
  isHistoryOpen: boolean;
  isMenuOpen: boolean;
}

type UIAction =
  | { type: "TOGGLE_HISTORY" }
  | { type: "SET_HISTORY_OPEN"; open: boolean }
  | { type: "OPEN_MENU" }
  | { type: "CLOSE_MENU" };

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case "TOGGLE_HISTORY": {
      const nextHistoryOpen = !state.isHistoryOpen;
      return {
        ...state,
        isHistoryOpen: nextHistoryOpen,
        isMenuOpen: nextHistoryOpen ? false : state.isMenuOpen,
      };
    }
    case "SET_HISTORY_OPEN":
      return {
        ...state,
        isHistoryOpen: action.open,
        isMenuOpen: action.open ? false : state.isMenuOpen,
      };
    case "OPEN_MENU":
      return { ...state, isMenuOpen: true, isHistoryOpen: false };
    case "CLOSE_MENU":
      return { ...state, isMenuOpen: false };
    default:
      return state;
  }
};

// Initial state
const initialState: UIState = {
  isHistoryOpen: false,
  isMenuOpen: false,
};

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // UI State
  const [uiState, dispatch] = useReducer(uiReducer, initialState);

  // Dismissed status banners (reset on successful message send)
  const [dismissedBanners, setDismissedBanners] = useState<Set<ChatApiStatus>>(new Set());

  const dismissBanner = useCallback((statusKey: ChatApiStatus) => {
    setDismissedBanners((prev) => new Set(prev).add(statusKey));
  }, []);

  const closeMenu = useCallback(() => {
    dispatch({ type: "CLOSE_MENU" });
  }, []);

  const setHistoryOpen = useCallback((open: boolean) => {
    dispatch({ type: "SET_HISTORY_OPEN", open });
  }, []);

  const toggleHistory = useCallback(() => {
    dispatch({ type: "TOGGLE_HISTORY" });
  }, []);

  const closeHistory = useCallback(() => {
    setHistoryOpen(false);
  }, [setHistoryOpen]);

  const handleOpenMenu = useCallback(() => {
    dispatch({ type: "OPEN_MENU" });
  }, []);

  const handleComposerFocus = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  const handleToggleHistory = useCallback(() => {
    toggleHistory();
  }, [toggleHistory]);

  // Swipe-Right Navigation (zurück zur Übersicht)
  const { handlers: swipeHandlersNative, dragOffset } = useSwipeGesture({
    onSwipeRight: () => {
      void navigate("/");
    },
    threshold: 100, // 100px zum Triggern
  });

  // Wrap native handlers für React
  const swipeHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      swipeHandlersNative.onTouchStart(e.nativeEvent);
    },
    onTouchMove: (e: React.TouchEvent) => {
      swipeHandlersNative.onTouchMove(e.nativeEvent);
    },
    onTouchEnd: () => {
      swipeHandlersNative.onTouchEnd();
    },
    onTouchCancel: () => {
      swipeHandlersNative.onTouchCancel();
    },
  };

  // Scroll-to-bottom button state
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const lastMessageCountRef = useRef(0);
  const composerRef = useRef<HTMLDivElement>(null);
  const inputBarRef = useRef<UnifiedInputBarHandle>(null);
  const [composerHeight, setComposerHeight] = useState(0);
  const [showHeroActions, setShowHeroActions] = useState(false);

  // Preset handler will be defined after chatLogic
  const startWithPreset = useRef<(system: string, user?: string) => void>(() => {});

  // All business logic encapsulated in custom hook
  const chatLogic = useChatPageLogic({
    onStartWithPreset: (system, user) => startWithPreset.current(system, user),
  });

  // Loaded once — static data, no network call
  const quickstarts = useMemo(() => getQuickstarts(), []);

  const logoState = useMemo(
    () =>
      getChatLogoState({
        hasError: Boolean(chatLogic.error),
        isLoading: chatLogic.isLoading,
        inputValue: chatLogic.input,
      }),
    [chatLogic.error, chatLogic.isLoading, chatLogic.input],
  );

  // Define preset handler now that chatLogic is available
  startWithPreset.current = useCallback(
    (_system: string, user?: string) => {
      chatLogic.setInput(user || "");
      // Note: setCurrentSystemPrompt is called internally by useChatPageLogic
      if (user) {
        setTimeout(() => chatLogic.handleSend(), 100);
      }
    },
    [chatLogic],
  );

  // Handle quickstart from URL params
  useChatQuickstart({
    onStartWithPreset: (system, user) => startWithPreset.current(system, user),
  });

  // History selection handlers
  const handleSelectConversation = useCallback(
    (id: string) => {
      void chatLogic.selectConversation(id);
      closeHistory();
      closeMenu();
    },
    [chatLogic, closeHistory, closeMenu],
  );

  const handleStartNewChat = useCallback(() => {
    chatLogic.handleStartNewChat();
    closeHistory();
    closeMenu();
  }, [chatLogic, closeHistory, closeMenu]);

  // Scroll to bottom handler
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessageCount(0);
  }, []);

  const handleInsertRandomPrompt = useCallback(() => {
    inputBarRef.current?.insertRandomPrompt();
  }, []);

  // Track scroll position to show/hide scroll-to-bottom button
  useEffect(() => {
    const scrollContainer = chatScrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      // Show button when user is more than 200px from bottom
      setShowScrollButton(distanceFromBottom > 200);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateComposerHeight = () => {
      const height = composerRef.current?.offsetHeight ?? 0;
      setComposerHeight(height);
      document.documentElement.style.setProperty("--composer-offset", `${height}px`);
    };

    updateComposerHeight();

    const observer = new ResizeObserver(updateComposerHeight);
    if (composerRef.current) {
      observer.observe(composerRef.current);
    }

    window.addEventListener("resize", updateComposerHeight, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateComposerHeight);
      document.documentElement.style.removeProperty("--composer-offset");
    };
  }, []);

  useEffect(() => {
    if (!chatLogic.isEmpty) {
      setShowHeroActions(false);
      return;
    }

    let timeoutId: number | undefined;
    let idleId: number | undefined;
    const idleWindow = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (
          callback: IdleRequestCallback,
          options?: IdleRequestOptions,
        ) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
    const revealActions = () => {
      setShowHeroActions(true);
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(
        () => {
          revealActions();
        },
        { timeout: 600 },
      );
    } else {
      timeoutId = window.setTimeout(revealActions, 180);
    }

    return () => {
      if (idleId !== undefined && typeof idleWindow.cancelIdleCallback === "function") {
        idleWindow.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [chatLogic.isEmpty]);

  // Track new messages while user is scrolled up
  useEffect(() => {
    if (chatLogic.isEmpty) {
      lastMessageCountRef.current = 0;
      setNewMessageCount(0);
      return;
    }

    const currentCount = chatLogic.messages.length;
    if (currentCount > lastMessageCountRef.current && showScrollButton) {
      setNewMessageCount((prev) => prev + 1);
    }
    lastMessageCountRef.current = currentCount;
  }, [chatLogic.messages.length, chatLogic.isEmpty, showScrollButton]);

  // Reset dismissed banners on successful message send
  useEffect(() => {
    if (chatLogic.apiStatus === "ok" && dismissedBanners.size > 0) {
      setDismissedBanners(new Set());
    }
  }, [chatLogic.apiStatus, dismissedBanners.size]);

  return (
    <>
      <ChatLayout
        title={chatLogic.activeConversation?.title || "Neue Unterhaltung"}
        onMenuClick={handleOpenMenu}
        logoState={logoState}
      >
        <div
          {...swipeHandlers}
          className="flex flex-col relative w-full transition-transform flex-1 min-h-0"
          style={{
            // Visual feedback während Swipe
            transform:
              dragOffset.x > 0 ? `translateX(${Math.min(dragOffset.x * 0.3, 100)}px)` : undefined,
            transition: dragOffset.x === 0 ? "transform 0.3s ease" : "none",
          }}
        >
          {!dismissedBanners.has(chatLogic.apiStatus) && (
            <ChatStatusBanner
              status={chatLogic.apiStatus}
              error={chatLogic.error}
              rateLimitInfo={chatLogic.rateLimitInfo}
              onDismiss={() => dismissBanner(chatLogic.apiStatus)}
            />
          )}

          {/* Messages Area */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto min-h-0 pt-3"
            role="log"
            aria-label="Chat messages"
            data-scroll-owner="active"
          >
            <div className="relative px-4 max-w-3xl mx-auto w-full min-h-full flex flex-col">
              <div
                className="relative z-[1] flex-1 flex flex-col gap-6 py-4"
                style={{
                  paddingBottom: `calc(var(--inset-safe-bottom, 0px) + ${Math.max(composerHeight + 16, 96)}px)`,
                }}
              >
                {!chatLogic.isEmpty && (
                  <>
                    <div className="chat-active-atmosphere" aria-hidden="true" />
                    <div className="hero-noise chat-active-noise" aria-hidden="true" />
                  </>
                )}
                {chatLogic.isEmpty ? (
                  <div className="relative flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-[14%]">
                    <div
                      className="pointer-events-none absolute h-52 w-52 rounded-full blur-3xl sm:h-80 sm:w-80 sm:motion-safe:animate-pulse-glow"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(56,189,248,0.25) 45%, transparent 70%)",
                      }}
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute hidden h-44 w-44 rounded-full border-2 border-brand-primary/60 motion-safe:animate-ping-slow sm:block"
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute hidden h-44 w-44 rounded-full border-2 border-accent-chat/50 motion-safe:animate-ping-slow sm:block"
                      style={{ animationDelay: "1.5s" }}
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute h-44 w-44 rounded-full border border-brand-primary/20 sm:h-56 sm:w-56"
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 hidden sm:block"
                      style={{
                        background:
                          "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, rgba(0, 0, 0, 0.18) 100%)",
                      }}
                      aria-hidden="true"
                    />
                    <div className="hero-noise hidden sm:block" aria-hidden="true" />
                    <div className="relative text-center sm:hidden">
                      <h1
                        className="text-5xl font-bold tracking-tight text-ink-primary"
                        style={{ fontWeight: 750 }}
                      >
                        <span className="bg-gradient-to-r from-brand-primary via-purple-400 to-brand-primary bg-clip-text text-transparent">
                          Disa
                        </span>{" "}
                        <span className="bg-gradient-to-r from-accent-chat to-purple-400 bg-clip-text text-transparent">
                          AI
                        </span>
                      </h1>
                    </div>
                    <AnimatedBrandmark
                      className="relative mx-auto hidden scale-75 sm:block"
                      intensity="subtle"
                      mode="hero"
                      playIntro={chatLogic.isEmpty}
                      state={logoState}
                    />
                    <p className="relative text-sm text-ink-secondary text-center">
                      Womit kann ich dir heute helfen?
                    </p>
                    <div className="w-full min-h-[15.5rem] px-1 sm:min-h-[14rem]">
                      {showHeroActions ? (
                        <div className="space-y-3">
                          <QuickstartStrip
                            quickstarts={quickstarts}
                            limit={4}
                            animate={false}
                            onSelect={(q) =>
                              void chatLogic.append({ role: "user", content: q.user }, undefined, {
                                systemPrompt: q.system,
                              })
                            }
                          />
                          <Button
                            type="button"
                            onClick={handleInsertRandomPrompt}
                            variant="glass"
                            size="default"
                            className="h-11 w-full gap-2 rounded-2xl text-xs font-semibold text-ink-primary hover:text-ink-primary"
                            aria-label="Zufallsfrage einfügen"
                            data-testid="quickstart-random-prompt"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Zufallsfrage</span>
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <VirtualizedMessageList
                    messages={chatLogic.messages}
                    conversationKey={chatLogic.activeConversationId ?? "new"}
                    isLoading={chatLogic.isLoading}
                    onEdit={chatLogic.handleEdit}
                    onFollowUp={chatLogic.handleFollowUp}
                    onRetry={chatLogic.handleRetry}
                    onDelete={chatLogic.handleDelete}
                    className="w-full pb-4"
                    scrollContainerRef={chatScrollRef}
                  />
                )}
                <div ref={messagesEndRef} className="h-3" />
              </div>
            </div>
          </div>

          {/* Input Area - Floating Glass Bottom */}
          <div
            ref={composerRef}
            className="sticky bottom-0 z-composer flex-none w-full pointer-events-none"
            style={{
              paddingBottom: "var(--inset-safe-bottom, 0px)",
            }}
          >
            <div className="max-w-3xl mx-auto px-4 pt-2 pb-4 pointer-events-auto">
              <UnifiedInputBar
                ref={inputBarRef}
                value={chatLogic.input}
                onChange={chatLogic.setInput}
                onSend={chatLogic.handleSend}
                onInputFocus={handleComposerFocus}
                isLoading={chatLogic.isLoading}
              />
            </div>
          </div>

          {/* FABs: History (left) and Scroll (right) */}
          {!chatLogic.isEmpty && (
            <>
              <HistoryFAB
                onClick={handleToggleHistory}
                isOpen={uiState.isHistoryOpen}
                conversationCount={chatLogic.conversations?.length ?? 0}
              />
              <ScrollToBottom
                visible={showScrollButton}
                onClick={scrollToBottom}
                newMessageCount={newMessageCount}
              />
            </>
          )}
        </div>
      </ChatLayout>

      {/* Global Menu */}
      <AppMenuDrawer
        isOpen={uiState.isMenuOpen}
        onClose={closeMenu}
        navItems={DRAWER_NAV_ITEMS}
        secondaryItems={[]}
      />

      {/* History Side Panel */}
      <HistorySidePanel
        isOpen={uiState.isHistoryOpen}
        onClose={closeHistory}
        conversations={chatLogic.conversations}
        activeId={chatLogic.activeConversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleStartNewChat}
      />
    </>
  );
}
