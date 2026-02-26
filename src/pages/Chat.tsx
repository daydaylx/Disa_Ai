import { lazy, memo, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { type LogoState } from "@/app/components/AnimatedLogo";
import { DRAWER_NAV_ITEMS } from "@/config/navigation";
import { type ChatApiStatus } from "@/hooks/useChat";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { AnimatedBrandmark } from "@/ui/AnimatedBrandmark";
import { HistoryFAB } from "@/ui/HistoryFAB";
import { ScrollToBottom } from "@/ui/ScrollToBottom";

import { ChatStatusBanner } from "../components/chat/ChatStatusBanner";
import { AppMenuDrawer, useMenuDrawer } from "../components/layout/AppMenuDrawer";
import { ChatLayout } from "../components/layout/ChatLayout";
import { HistorySidePanel } from "../components/navigation/HistorySidePanel";
import { useChatPageLogic } from "../hooks/useChatPageLogic";
import { useChatQuickstart } from "../hooks/useChatQuickstart";

const VirtualizedMessageList = memo(
  lazy(() =>
    import("../components/chat/VirtualizedMessageList").then((module) => ({
      default: module.VirtualizedMessageList,
    })),
  ),
);
const UnifiedInputBar = memo(
  lazy(() =>
    import("../components/chat/UnifiedInputBar").then((module) => ({
      default: module.UnifiedInputBar,
    })),
  ),
);

// Define actions for the reducer
interface UIState {
  isHistoryOpen: boolean;
}

type UIAction = { type: "TOGGLE_HISTORY" } | { type: "SET_HISTORY_OPEN"; open: boolean };

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case "TOGGLE_HISTORY":
      return { ...state, isHistoryOpen: !state.isHistoryOpen };
    case "SET_HISTORY_OPEN":
      return { ...state, isHistoryOpen: action.open };
    default:
      return state;
  }
};

// Initial state
const initialState: UIState = {
  isHistoryOpen: false,
};

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // UI State
  const [uiState, dispatch] = useReducer(uiReducer, initialState);
  const { isOpen: isMenuOpen, openMenu, closeMenu } = useMenuDrawer();

  // Dismissed status banners (reset on successful message send)
  const [dismissedBanners, setDismissedBanners] = useState<Set<ChatApiStatus>>(new Set());

  const dismissBanner = useCallback((statusKey: ChatApiStatus) => {
    setDismissedBanners((prev) => new Set(prev).add(statusKey));
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
    if (uiState.isHistoryOpen) {
      closeHistory();
    }
    openMenu();
  }, [closeHistory, openMenu, uiState.isHistoryOpen]);

  const handleToggleHistory = useCallback(() => {
    if (!uiState.isHistoryOpen && isMenuOpen) {
      closeMenu();
    }
    toggleHistory();
  }, [closeMenu, isMenuOpen, toggleHistory, uiState.isHistoryOpen]);

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
  const [composerHeight, setComposerHeight] = useState(0);

  // Preset handler will be defined after chatLogic
  const startWithPreset = useRef<(system: string, user?: string) => void>(() => {});

  // All business logic encapsulated in custom hook
  const chatLogic = useChatPageLogic({
    onStartWithPreset: (system, user) => startWithPreset.current(system, user),
  });

  // Calculate logo state for presence animation
  const getLogoState = (): LogoState => {
    if (chatLogic.error) return "error";
    if (chatLogic.isLoading) return "thinking";
    if (chatLogic.input && chatLogic.input.trim().length > 0) return "typing";
    return "idle";
  };

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
        logoState={getLogoState()}
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
            <div className="px-4 max-w-3xl mx-auto w-full min-h-full flex flex-col">
              <div
                className="flex-1 flex flex-col gap-6 py-4"
                style={{
                  paddingBottom: `calc(var(--inset-safe-bottom, 0px) + ${Math.max(composerHeight + 16, 96)}px)`,
                }}
              >
                {chatLogic.isEmpty ? (
                  <div className="relative flex flex-1 items-center justify-center px-4">
                    {/* Atmospheric glow orb */}
                    <div
                      className="absolute w-52 h-52 rounded-full blur-3xl pointer-events-none motion-safe:animate-pulse-glow"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(56,189,248,0.09) 50%, transparent 70%)",
                      }}
                      aria-hidden="true"
                    />
                    {/* Pulse ring 1 */}
                    <div
                      className="absolute w-36 h-36 rounded-full border border-brand-primary/28 pointer-events-none motion-safe:animate-ping-slow"
                      aria-hidden="true"
                    />
                    {/* Pulse ring 2 – staggered */}
                    <div
                      className="absolute w-36 h-36 rounded-full border border-accent-chat/22 pointer-events-none motion-safe:animate-ping-slow"
                      style={{ animationDelay: "1.5s" }}
                      aria-hidden="true"
                    />
                    <AnimatedBrandmark className="relative mx-auto scale-[0.85]" />
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
            <div className="max-w-3xl mx-auto px-xspt-2 pointer-events-auto">
              <UnifiedInputBar
                value={chatLogic.input}
                onChange={chatLogic.setInput}
                onSend={chatLogic.handleSend}
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
        isOpen={isMenuOpen}
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
