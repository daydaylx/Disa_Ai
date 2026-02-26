import { lazy, memo, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { type LogoState } from "@/app/components/AnimatedLogo";
import { DRAWER_NAV_ITEMS } from "@/config/navigation";
import { useModelCatalog } from "@/contexts/ModelCatalogContext";
import { useRoles } from "@/contexts/RolesContext";
import { type ChatApiStatus } from "@/hooks/useChat";
import { useMemory } from "@/hooks/useMemory";
import { useSettings } from "@/hooks/useSettings";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { Cpu, HardDrive, History, Plus, SlidersHorizontal, User } from "@/lib/icons";
import { AnimatedBrandmark } from "@/ui/AnimatedBrandmark";
import { BottomSheet } from "@/ui/BottomSheet";
import { Button } from "@/ui/Button";
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
  const [isContextSheetOpen, setIsContextSheetOpen] = useState(false);

  const { activeRole } = useRoles();
  const { isEnabled: memoryEnabled } = useMemory();
  const { settings } = useSettings();
  const { models } = useModelCatalog();

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
    setIsContextSheetOpen(false);
    openMenu();
  }, [closeHistory, openMenu, uiState.isHistoryOpen]);

  const handleToggleHistory = useCallback(() => {
    if (!uiState.isHistoryOpen && isMenuOpen) {
      closeMenu();
    }
    setIsContextSheetOpen(false);
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

  const selectedModel = models?.find((model) => model.id === settings.preferredModelId);
  const modelLabel =
    selectedModel?.label?.split("/").pop() ||
    selectedModel?.id?.split("/").pop() ||
    settings.preferredModelId.split("/").pop() ||
    "Automatisch";
  const roleLabel = activeRole?.name || "Standard";
  const memoryLabel = memoryEnabled ? "Aktiv" : "Aus";

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

  const closeContextSheet = useCallback(() => {
    setIsContextSheetOpen(false);
  }, []);

  const navigateFromContext = useCallback(
    (path: string) => {
      closeContextSheet();
      closeHistory();
      closeMenu();
      void navigate(path);
    },
    [closeContextSheet, closeHistory, closeMenu, navigate],
  );

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
        headerActions={
          <div className="flex items-center gap-1.5">
            <Button
              variant={uiState.isHistoryOpen ? "secondary" : "ghost"}
              size="icon"
              onClick={handleToggleHistory}
              aria-label={uiState.isHistoryOpen ? "Verlauf schließen" : "Verlauf öffnen"}
              className={uiState.isHistoryOpen ? "text-ink-primary" : "text-ink-secondary"}
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStartNewChat}
              aria-label="Neue Unterhaltung starten"
              className="text-ink-secondary hover:text-ink-primary"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        }
        subHeader={
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => navigateFromContext("/models")}
              className="group inline-flex min-h-[2.75rem] items-center gap-2.5 rounded-2xl border border-white/12 bg-surface-1/78 px-3.5 py-2 text-ink-primary transition-colors hover:border-accent-models/38 hover:bg-surface-1/88"
              aria-label={`Aktives Modell: ${modelLabel}`}
            >
              <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-models/14 text-accent-models">
                <Cpu className="h-3.5 w-3.5" />
              </span>
              <span className="flex min-w-0 flex-col text-left">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">
                  Modell
                </span>
                <span className="truncate text-[0.78rem] font-medium text-ink-primary">
                  {modelLabel}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigateFromContext("/roles")}
              className="group inline-flex min-h-[2.75rem] items-center gap-2.5 rounded-2xl border border-white/12 bg-surface-1/78 px-3.5 py-2 text-ink-primary transition-colors hover:border-accent-roles/38 hover:bg-surface-1/88"
              aria-label={`Aktive Rolle: ${roleLabel}`}
            >
              <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-roles/14 text-accent-roles">
                <User className="h-3.5 w-3.5" />
              </span>
              <span className="flex min-w-0 flex-col text-left">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">
                  Rolle
                </span>
                <span className="truncate text-[0.78rem] font-medium text-ink-primary">
                  {roleLabel}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                closeHistory();
                closeMenu();
                setIsContextSheetOpen(true);
              }}
              className="inline-flex min-h-[2.75rem] items-center gap-2.5 rounded-2xl border border-white/12 bg-surface-1/78 px-3.5 py-2 text-ink-secondary transition-colors hover:border-white/22 hover:bg-surface-1/88 hover:text-ink-primary"
              aria-label="Weitere Chat-Optionen"
            >
              <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/8">
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </span>
              <span className="flex min-w-0 flex-col text-left">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">
                  Kontext
                </span>
                <span className="truncate text-[0.78rem] font-medium text-ink-secondary">Mehr</span>
              </span>
            </button>
          </div>
        }
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
            className="flex-1 min-h-0 overflow-y-auto pt-2"
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
                  <div className="relative flex flex-1 items-center justify-center px-2">
                    <section className="animate-fade-in-scale relative mx-auto w-full max-w-xl overflow-hidden rounded-[1.5rem] border border-white/12 bg-surface-1/78 px-5 py-6 shadow-[0_14px_36px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-20"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.04) 56%, transparent 100%)",
                        }}
                        aria-hidden="true"
                      />

                      <AnimatedBrandmark className="relative mx-auto scale-[0.68]" />

                      <div className="relative mt-4 text-center">
                        <h2 className="text-xl font-semibold tracking-tight text-ink-primary">
                          Womit kann ich dir helfen?
                        </h2>
                        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-secondary">
                          Stell eine Frage oder starte mit einer kurzen Idee.
                        </p>
                      </div>

                      <div className="relative mt-6 grid gap-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            chatLogic.handleStarterClick(
                              "Schreib mir ein kurzes Gedicht ueber den Mond.",
                            )
                          }
                          className="group inline-flex min-h-[2.75rem] items-center gap-2 rounded-xl border border-white/14 bg-surface-2/72 px-4 py-3 text-left text-sm font-medium text-ink-primary transition-colors hover:border-accent-chat/30 hover:bg-surface-2/85"
                        >
                          <span className="h-5 w-1 rounded-full bg-accent-chat/80 transition-opacity group-hover:opacity-100" />
                          Schreib mir ein kurzes Gedicht.
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            chatLogic.handleStarterClick(
                              "Erklaere mir ein aktuelles Thema in einfachen Worten mit Beispielen.",
                            )
                          }
                          className="group inline-flex min-h-[2.75rem] items-center gap-2 rounded-xl border border-white/14 bg-surface-2/72 px-4 py-3 text-left text-sm font-medium text-ink-primary transition-colors hover:border-accent-chat/30 hover:bg-surface-2/85"
                        >
                          <span className="h-5 w-1 rounded-full bg-accent-chat/80 transition-opacity group-hover:opacity-100" />
                          Erklaere ein Thema einfach.
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigateFromContext("/themen")}
                        className="relative mt-5 inline-flex min-h-[2.75rem] items-center justify-center rounded-full border border-white/14 bg-surface-2/58 px-5 text-sm font-medium text-ink-secondary transition-colors hover:border-white/22 hover:text-ink-primary"
                      >
                        Mehr Inspiration in Quickstarts
                      </button>
                    </section>
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

          {/* FAB: Scroll to bottom */}
          {!chatLogic.isEmpty && (
            <ScrollToBottom
              visible={showScrollButton}
              onClick={scrollToBottom}
              newMessageCount={newMessageCount}
            />
          )}
        </div>
      </ChatLayout>

      <BottomSheet
        open={isContextSheetOpen}
        onClose={closeContextSheet}
        title="Chat-Kontext"
        description="Schnell zu den wichtigsten Einstellungen wechseln."
      >
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => navigateFromContext("/models")}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/12 bg-surface-1/72 px-3.5 py-3 text-left transition-colors hover:border-accent-models/32 hover:bg-surface-1/82"
          >
            <span className="inline-flex min-w-0 items-center gap-2.5 text-ink-primary">
              <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-models/14 text-accent-models">
                <Cpu className="h-4 w-4" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">
                  Modell
                </span>
                <span className="truncate text-sm font-medium text-ink-primary">{modelLabel}</span>
              </span>
            </span>
            <span className="text-xs text-ink-secondary">Oeffnen</span>
          </button>

          <button
            type="button"
            onClick={() => navigateFromContext("/roles")}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/12 bg-surface-1/72 px-3.5 py-3 text-left transition-colors hover:border-accent-roles/32 hover:bg-surface-1/82"
          >
            <span className="inline-flex min-w-0 items-center gap-2.5 text-ink-primary">
              <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-roles/14 text-accent-roles">
                <User className="h-4 w-4" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">
                  Rolle
                </span>
                <span className="truncate text-sm font-medium text-ink-primary">{roleLabel}</span>
              </span>
            </span>
            <span className="text-xs text-ink-secondary">Oeffnen</span>
          </button>

          <button
            type="button"
            onClick={() => navigateFromContext("/settings/memory")}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/12 bg-surface-1/72 px-3.5 py-3 text-left transition-colors hover:border-status-success/32 hover:bg-surface-1/82"
          >
            <span className="inline-flex min-w-0 items-center gap-2.5 text-ink-primary">
              <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-status-success/14 text-status-success">
                <HardDrive className="h-4 w-4" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">
                  Memory
                </span>
                <span className="truncate text-sm font-medium text-ink-primary">{memoryLabel}</span>
              </span>
            </span>
            <span className="text-xs text-ink-secondary">Oeffnen</span>
          </button>

          <button
            type="button"
            onClick={() => navigateFromContext("/settings/behavior")}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/12 bg-surface-1/72 px-3.5 py-3 text-left transition-colors hover:border-accent-primary/32 hover:bg-surface-1/82"
          >
            <span className="inline-flex min-w-0 items-center gap-2.5 text-ink-primary">
              <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary/14 text-accent-primary">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">
                  Stil
                </span>
                <span className="truncate text-sm font-medium text-ink-primary">
                  Kreativitaet und Verhalten
                </span>
              </span>
            </span>
            <span className="text-xs text-ink-secondary">Oeffnen</span>
          </button>
        </div>
      </BottomSheet>

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
