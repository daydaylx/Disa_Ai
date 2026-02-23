import { lazy, memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { type LogoState } from "@/app/components/AnimatedLogo";
import { DRAWER_NAV_ITEMS } from "@/config/navigation";
import { useModelCatalog } from "@/contexts/ModelCatalogContext";
import { useRoles } from "@/contexts/RolesContext";
import { useMemory } from "@/hooks/useMemory";
import { useSettings } from "@/hooks/useSettings";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { Bookmark, Cpu, HardDrive, MessageSquare, User } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { AnimatedBrandmark } from "@/ui/AnimatedBrandmark";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
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

type UIAction = { type: "TOGGLE_HISTORY" };

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case "TOGGLE_HISTORY":
      return { ...state, isHistoryOpen: !state.isHistoryOpen };
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
  const toggleHistory = () => dispatch({ type: "TOGGLE_HISTORY" });

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
      closeMenu();
    },
    [chatLogic, closeMenu],
  );

  const handleStartNewChat = useCallback(() => {
    chatLogic.handleStartNewChat();
    closeMenu();
  }, [chatLogic, closeMenu]);

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

  return (
    <>
      <ChatLayout
        title={chatLogic.activeConversation?.title || "Neue Unterhaltung"}
        onMenuClick={openMenu}
        logoState={getLogoState()}
        headerActions={
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleHistory}
            aria-label="Verlauf öffnen"
            aria-expanded={uiState.isHistoryOpen}
            className={cn(
              "gap-2 px-3 relative overflow-visible",
              "border-accent-chat/15 hover:border-accent-chat/30",
              "hover:bg-accent-chat/4 transition-all duration-200",
              uiState.isHistoryOpen && "bg-accent-chat/8 border-accent-chat/30",
              "min-h-[44px] sm:min-h-0", // Mobile touch target optimization
            )}
          >
            <Bookmark
              className={cn(
                "h-4 w-4 transition-colors",
                uiState.isHistoryOpen
                  ? "text-accent-chat fill-accent-chat/23"
                  : "text-accent-chat/53",
              )}
            />
            <span className="hidden sm:inline text-ink-primary">Verlauf</span>
            {chatLogic.conversations && chatLogic.conversations.length > 0 && (
              <span
                className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent-chat shadow-[0_0_6px_rgba(var(--accent-chat-glow),0.45)]"
                aria-label={`${chatLogic.conversations.length} Unterhaltungen`}
              />
            )}
          </Button>
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
          <ChatStatusBanner
            status={chatLogic.apiStatus}
            error={chatLogic.error}
            rateLimitInfo={chatLogic.rateLimitInfo}
          />

          <div className="px-4 pt-2">
            <div className="mx-auto flex w-full max-w-3xl items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => chatLogic.navigate("/settings/api-data")}
                className={cn(
                  "inline-flex min-h-[44px] items-center gap-2 rounded-full border bg-surface-1/70 px-3 py-2",
                  "text-xs font-medium text-ink-secondary transition-colors whitespace-nowrap",
                  "border-accent-models/30 hover:border-accent-models/50 hover:text-ink-primary",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-models/60",
                )}
                aria-label={`Aktives Modell: ${activeModelLabel}`}
              >
                <Cpu className="h-3.5 w-3.5 text-accent-models" />
                <span>Modell: {activeModelLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => chatLogic.navigate("/roles")}
                className={cn(
                  "inline-flex min-h-[44px] items-center gap-2 rounded-full border bg-surface-1/70 px-3 py-2",
                  "text-xs font-medium text-ink-secondary transition-colors whitespace-nowrap",
                  "border-accent-roles/30 hover:border-accent-roles/50 hover:text-ink-primary",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-roles/60",
                )}
                aria-label={`Aktive Rolle: ${roleLabel}`}
              >
                <User className="h-3.5 w-3.5 text-accent-roles" />
                <span>Rolle: {roleLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => chatLogic.navigate("/settings/memory")}
                className={cn(
                  "inline-flex min-h-[44px] items-center gap-2 rounded-full border bg-surface-1/70 px-3 py-2",
                  "text-xs font-medium transition-colors whitespace-nowrap",
                  memoryEnabled
                    ? "border-status-success/35 text-ink-secondary hover:border-status-success/50 hover:text-ink-primary"
                    : "border-status-warning/35 text-ink-secondary hover:border-status-warning/50 hover:text-ink-primary",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60",
                )}
                aria-label={`Memory ist ${memoryEnabled ? "aktiv" : "deaktiviert"}`}
              >
                <HardDrive
                  className={cn(
                    "h-3.5 w-3.5",
                    memoryEnabled ? "text-status-success" : "text-status-warning",
                  )}
                />
                <span>Memory: {memoryEnabled ? "Aktiv" : "Aus"}</span>
              </button>
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

          {/* Scroll to Bottom FAB */}
          {!chatLogic.isEmpty && (
            <ScrollToBottom
              visible={showScrollButton}
              onClick={scrollToBottom}
              newMessageCount={newMessageCount}
            />
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
        onClose={toggleHistory}
        conversations={chatLogic.conversations}
        activeId={chatLogic.activeConversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleStartNewChat}
      />
    </>
  );
}
