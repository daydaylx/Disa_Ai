import { lazy, memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { type LogoState } from "@/app/components/AnimatedLogo";
import { DRAWER_NAV_ITEMS } from "@/config/navigation";
import { useModelCatalog } from "@/contexts/ModelCatalogContext";
import { useRoles } from "@/contexts/RolesContext";
import { type ChatApiStatus } from "@/hooks/useChat";
import { useMemory } from "@/hooks/useMemory";
import { useSettings } from "@/hooks/useSettings";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { MessageSquare } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { AnimatedBrandmark } from "@/ui/AnimatedBrandmark";
import { Card } from "@/ui/Card";
import { HistoryFAB } from "@/ui/HistoryFAB";
import { ScrollToBottom } from "@/ui/ScrollToBottom";

import { ChatQuickSettings } from "../components/chat/ChatQuickSettings";
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

const RAW_STARTER_PROMPTS = [
  "Schreib ein kurzes Gedicht",
  "Erkläre mir Quantenphysik",
  "Was koche ich heute?",
  "Erzähl mir einen Witz",
];

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
  const { models } = useModelCatalog();
  const { activeRole } = useRoles();
  const { settings } = useSettings();
  const { isEnabled: memoryEnabled } = useMemory();

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

  // Deduplicate prompts with strict text normalization
  const uniquePrompts = useMemo(() => {
    const seen = new Set<string>();
    return RAW_STARTER_PROMPTS.filter((prompt) => {
      // Stricter normalization: trim + lowercase + collapse whitespace
      const normalized = prompt.trim().toLowerCase().replace(/\s+/g, " ");
      if (seen.has(normalized)) {
        if (import.meta.env.DEV) {
          console.warn(`[Chat] Filtered duplicate prompt: "${prompt}"`);
        }
        return false;
      }
      seen.add(normalized);
      return true;
    });
  }, []);

  const activeModelLabel = useMemo(() => {
    if (!settings.preferredModelId) return "Automatisch";
    const selectedModel = models?.find((model) => model.id === settings.preferredModelId);
    const rawLabel = selectedModel?.label || selectedModel?.id || settings.preferredModelId;
    return rawLabel.split("/").pop() || rawLabel;
  }, [models, settings.preferredModelId]);

  const roleLabel = useMemo(() => activeRole?.name || "Standard", [activeRole]);

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

          <div className="px-4 pt-2">
            <div className="mx-auto flex w-full max-w-3xl items-center">
              <ChatQuickSettings
                activeModelLabel={activeModelLabel}
                roleLabel={roleLabel}
                memoryEnabled={memoryEnabled}
                onNavigateModels={() => chatLogic.navigate("/settings/api-data")}
                onNavigateRoles={() => chatLogic.navigate("/roles")}
                onNavigateMemory={() => chatLogic.navigate("/settings/memory")}
              />
            </div>
          </div>

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
                  <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-16 sm:pb-20 px-4 animate-fade-in">
                    <div className="w-full max-w-md animate-fade-in-scale">
                      <Card variant="surface" className="space-y-5 p-6 sm:p-8 text-center">
                        <AnimatedBrandmark className="mx-auto origin-top scale-[0.62] sm:scale-[0.7]" />
                        <div className="mx-auto h-px w-20 bg-white/12" />
                        <div className="space-y-2">
                          <h2 className="text-lg font-semibold text-ink-primary">
                            Was kann ich für dich tun?
                          </h2>
                          <p className="text-sm text-ink-secondary leading-relaxed">
                            Tippe unten eine Frage ein oder nutze einen Schnellstart.
                          </p>
                        </div>
                      </Card>
                    </div>

                    <div className="w-full max-w-md flex gap-2.5 overflow-x-auto px-1 pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-1 sm:gap-3 sm:overflow-visible">
                      {uniquePrompts.slice(0, 3).map((prompt, index) => {
                        const accentStyles = [
                          {
                            bar: "bg-accent-chat/80",
                            iconWrap: "bg-accent-chat/12 text-accent-chat",
                            border: "border-accent-chat/25",
                          },
                          {
                            bar: "bg-accent-models/80",
                            iconWrap: "bg-accent-models/12 text-accent-models",
                            border: "border-accent-models/25",
                          },
                          {
                            bar: "bg-brand-primary/80",
                            iconWrap: "bg-brand-primary/12 text-brand-primary",
                            border: "border-brand-primary/25",
                          },
                        ] as const;
                        const accent = accentStyles[index % accentStyles.length]!;

                        return (
                          <button
                            key={prompt}
                            type="button"
                            className={cn(
                              "group relative flex min-h-[56px] min-w-[240px] snap-start items-center gap-3 overflow-hidden rounded-2xl border bg-surface-card px-3 py-3 text-left",
                              "text-ink-primary transition-all animate-slide-up opacity-0 fill-mode-forwards sm:min-w-0 sm:gap-4 sm:px-4 sm:py-4",
                              "hover:border-white/[0.22] hover:bg-surface-2/60",
                              "focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2",
                              "active:translate-y-px",
                              accent.border,
                            )}
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => chatLogic.handleStarterClick(prompt)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                chatLogic.handleStarterClick(prompt);
                              }
                            }}
                            aria-label={`Starter-Prompt: ${prompt}`}
                          >
                            <span
                              className={cn(
                                "absolute inset-y-2 left-2 w-1 rounded-full",
                                accent.bar,
                              )}
                            />
                            <span
                              className={cn(
                                "inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl",
                                accent.iconWrap,
                              )}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </span>
                            <span className="flex-1 text-sm font-medium leading-snug text-ink-primary">
                              {prompt}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => chatLogic.navigate("/settings")}
                      className="mt-1 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-surface-1/50 px-3 py-2 text-sm text-ink-secondary transition-colors hover:border-white/20 hover:text-ink-primary"
                    >
                      Einstellungen anpassen
                      <span className="text-xs">→</span>
                    </button>
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
            <div className="max-w-3xl mx-auto px-4 pt-2 pointer-events-auto">
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
