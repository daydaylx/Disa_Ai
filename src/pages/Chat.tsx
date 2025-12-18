import { lazy, memo, useCallback, useMemo, useReducer, useRef } from "react";

import { type LogoState } from "@/app/components/AnimatedLogo";
import { Bookmark, MessageSquare } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

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

  // UI State
  const [uiState, dispatch] = useReducer(uiReducer, initialState);
  const { isOpen: isMenuOpen, openMenu, closeMenu } = useMenuDrawer();
  const toggleHistory = () => dispatch({ type: "TOGGLE_HISTORY" });

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
            className="gap-2 px-3"
          >
            <Bookmark className="h-4 w-4 text-ink-secondary" />
            <span className="hidden sm:inline">Verlauf</span>
          </Button>
        }
      >
        <div className="relative flex w-full flex-1 flex-col min-h-0">
          <ChatStatusBanner
            status={chatLogic.apiStatus}
            error={chatLogic.error}
            rateLimitInfo={chatLogic.rateLimitInfo}
          />

          {/* Messages Area */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto min-h-0 pt-4"
            role="log"
            aria-label="Chat messages"
          >
            <div className="max-w-3xl mx-auto w-full min-h-full flex flex-col">
              <div className="flex-1 flex flex-col gap-6 py-4 pb-[calc(12rem+env(safe-area-inset-bottom))]">
                {chatLogic.isEmpty ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-8 px-2 animate-fade-in">
                    {/* Hero Card - Disa Frame Branding System */}
                    <div className="w-full max-w-md animate-fade-in-scale">
                      <Card
                        variant="tintedSoft"
                        notch="cutout"
                        notchSize="lg" // 24px for hero visibility (increased from 22px)
                        tintColor="rgb(var(--tint-color-rgb-default))"
                        className="text-center space-y-6 p-8"
                        style={
                          {
                            "--card-tint-alpha": "var(--tint-alpha-hero, 0.14)",
                            "--notch-edge-opacity": "0.30",
                          } as React.CSSProperties
                        }
                      >
                        {/* Main Title - Wordmark with intro animation (700-800 weight) */}
                        <div className="space-y-3">
                          <h1
                            className="text-5xl sm:text-6xl text-ink-primary tracking-tight animate-wordmark-intro"
                            style={{ fontWeight: 750 }}
                          >
                            Disa AI
                          </h1>
                          <div className="space-y-2">
                            {/* Accent line - subtle 1px under wordmark */}
                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent mx-auto" />
                            <p className="text-xs sm:text-sm text-ink-tertiary font-medium tracking-[0.1em] uppercase opacity-70 animate-wordmark-intro-delay-1">
                              DEIN KI-ASSISTENT
                            </p>
                          </div>
                        </div>

                        {/* Welcome Text */}
                        <div className="space-y-3 pt-2 animate-wordmark-intro-delay-2">
                          <h2 className="text-lg font-medium text-ink-primary">
                            Was kann ich für dich tun?
                          </h2>
                          <p className="text-sm text-ink-secondary font-normal">
                            Tippe unten eine Frage ein oder wähle einen der Vorschläge.
                          </p>
                        </div>
                      </Card>
                    </div>

                    {/* Starter Prompts - Suggestion Cards with tintedSoft variant */}
                    <div className="w-full max-w-md grid grid-cols-1 gap-3 px-2">
                      {uniquePrompts.slice(0, 3).map((prompt, index) => (
                        <Card
                          key={prompt}
                          variant="tintedSoft"
                          notch="none"
                          tintColor="rgb(var(--tint-color-rgb-default))"
                          className={cn(
                            "flex items-center gap-4 p-4 text-left transition-all group animate-slide-up opacity-0 fill-mode-forwards cursor-pointer",
                            "hover:border-white/[0.18] hover:shadow-md", // Clear hover state (increased from 0.14)
                            "focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2", // Clear focus ring
                            "active:translate-y-[1px] active:shadow-sm", // Press: card sinks, shadow down
                            "bg-surface-card text-ink-primary",
                          )}
                          style={{ animationDelay: `${index * 100}ms` }}
                          onClick={() => chatLogic.handleStarterClick(prompt)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              chatLogic.handleStarterClick(prompt);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`Starter-Prompt: ${prompt}`}
                        >
                          <div
                            className={cn(
                              "p-3 rounded-xl transition-colors flex-shrink-0",
                              "bg-surface-2 text-ink-secondary",
                              "group-hover:bg-brand-primary/10 group-hover:text-brand-primary",
                            )}
                          >
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-medium text-ink-primary flex-1">
                            {prompt}
                          </span>
                        </Card>
                      ))}
                    </div>

                    {/* Quick Link to Settings - Subtle */}
                    <button
                      type="button"
                      onClick={() => chatLogic.navigate("/settings")}
                      className="text-sm text-ink-muted hover:text-ink-secondary transition-colors mt-2 flex items-center gap-2"
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
                    className="w-full pb-4"
                    scrollContainerRef={chatScrollRef}
                  />
                )}
                <div ref={messagesEndRef} className="h-3" />
              </div>
            </div>
          </div>

          {/* Input Area - Floating Glass Bottom */}
          <div className="flex-none w-full pointer-events-none z-20">
            <div className="max-w-3xl mx-auto pb-[calc(env(safe-area-inset-bottom)+var(--keyboard-offset,0px))] pt-2 pointer-events-auto">
              <UnifiedInputBar
                value={chatLogic.input}
                onChange={chatLogic.setInput}
                onSend={chatLogic.handleSend}
                isLoading={chatLogic.isLoading}
              />
            </div>
          </div>
        </div>
      </ChatLayout>

      {/* Global Menu */}
      <AppMenuDrawer isOpen={isMenuOpen} onClose={closeMenu} />

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
