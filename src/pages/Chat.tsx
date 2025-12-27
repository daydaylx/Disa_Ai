import { lazy, memo, Suspense, useCallback, useMemo, useReducer, useRef } from "react";

import { type LogoState } from "@/app/components/AnimatedLogo";
import { Bookmark, MessageSquare } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { AnimatedBrandmark } from "@/ui/AnimatedBrandmark";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

import { ChatStatusBanner } from "../components/chat/ChatStatusBanner";
import { UnifiedInputBar } from "../components/chat/UnifiedInputBar";
import { AppMenuDrawer, useMenuDrawer } from "../components/layout/AppMenuDrawer";
import { PageLayout } from "../components/layout/PageLayout";
import { HistorySidePanel } from "../components/navigation/HistorySidePanel";
import { useChatPageLogic } from "../hooks/useChatPageLogic";
import { useChatQuickstart } from "../hooks/useChatQuickstart";
import { useVisualViewport } from "../hooks/useVisualViewport";

const VirtualizedMessageList = memo(
  lazy(() =>
    import("../components/chat/VirtualizedMessageList").then((module) => ({
      default: module.VirtualizedMessageList,
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
  const viewport = useVisualViewport();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // UI State
  const [uiState, dispatch] = useReducer(uiReducer, initialState);
  const { isOpen: isMenuOpen, closeMenu } = useMenuDrawer();
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
      <PageLayout
        title={chatLogic.activeConversation?.title || "Neue Unterhaltung"}
        logoState={getLogoState()}
        accentColor="chat"
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
        <h1 className="sr-only">Disa AI – Chat</h1>
        <div
          className="flex flex-col relative w-full"
          style={{
            // Subtract header height (64px) from viewport height to prevent clipping
            height: viewport.height ? `${viewport.height - 64}px` : "100%",
            minHeight: viewport.height ? `${viewport.height - 64}px` : "100%",
          }}
        >
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
            <div className="px-4 max-w-3xl mx-auto w-full min-h-full flex flex-col">
              <div className="flex-1 flex flex-col gap-6 py-4">
                {chatLogic.isEmpty ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-8 pb-20 px-4 animate-fade-in">
                    {/* Hero Card - Disa Frame Branding System with Enhanced Colors */}
                    <div className="w-full max-w-md animate-fade-in-scale">
                      <Card
                        variant="hero"
                        notch="cutout"
                        notchSize="lg" // 24px for hero visibility (increased from 22px)
                        tintColor="rgb(var(--tint-color-rgb-default))"
                        className="text-center space-y-6 p-8 relative overflow-hidden"
                        style={
                          {
                            "--card-tint-alpha": "var(--tint-alpha-hero, 0.18)",
                            "--notch-edge-opacity": "0.35",
                          } as React.CSSProperties
                        }
                      >
                        {/* Decorative gradient orbs for visual interest - 25% reduced */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-accent-chat/15 to-transparent blur-xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-radial from-accent-models/11 to-transparent blur-xl pointer-events-none" />

                        {/* Main Title - Animated Brandmark with shimmer and breathing */}
                        <div className="space-y-3 relative z-10">
                          <AnimatedBrandmark />
                          <div className="space-y-2">
                            {/* Subtle accent line with gradient glow - 25% reduced */}
                            <div className="relative w-32 h-px mx-auto">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/45 to-transparent" />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-chat/30 to-transparent blur-sm" />
                            </div>
                            <p className="text-xs sm:text-sm text-ink-tertiary font-medium tracking-[0.1em] uppercase opacity-80 animate-wordmark-intro-delay-1">
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

                    {/* Starter Prompts - Suggestion Cards with Enhanced Color Accents */}
                    <div className="w-full max-w-md grid grid-cols-1 gap-3 px-2">
                      {uniquePrompts.slice(0, 3).map((prompt, index) => {
                        // Cycle through accent colors - 25% reduced intensity
                        const accentColors = [
                          {
                            bg: "bg-accent-chat/8",
                            text: "text-accent-chat",
                            border: "border-accent-chat/15",
                            glow: "group-hover:shadow-[0_0_15px_rgba(var(--accent-chat-glow),0.11)]",
                          },
                          {
                            bg: "bg-accent-models/8",
                            text: "text-accent-models",
                            border: "border-accent-models/15",
                            glow: "group-hover:shadow-[0_0_15px_rgba(var(--accent-models-glow),0.11)]",
                          },
                          {
                            bg: "bg-brand-primary/8",
                            text: "text-brand-primary",
                            border: "border-brand-primary/15",
                            glow: "group-hover:shadow-[0_0_15px_rgba(139,92,246,0.11)]",
                          },
                        ] as const;
                        const accent = accentColors[index % accentColors.length]!;

                        return (
                          <Card
                            key={prompt}
                            variant="tintedSoft"
                            notch="none"
                            tintColor="rgb(var(--tint-color-rgb-default))"
                            className={cn(
                              "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 text-left transition-all group animate-slide-up opacity-0 fill-mode-forwards cursor-pointer",
                              "min-h-[56px]", // Mobile touch target (44px + padding)
                              "hover:border-white/[0.22] hover:shadow-lg", // Enhanced hover state
                              accent.glow, // Color-specific glow on hover
                              "focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2",
                              "active:translate-y-[1px] active:shadow-sm",
                              "bg-surface-card text-ink-primary",
                              "border",
                              accent.border, // Add colored border
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
                                "p-2.5 sm:p-3 rounded-xl transition-all flex-shrink-0",
                                "bg-surface-2",
                                accent.bg,
                                accent.text,
                                "group-hover:scale-[1.04]", // Subtle scale on hover - 25% reduced
                              )}
                            >
                              <MessageSquare className="h-5 w-5 sm:h-5 sm:w-5" />
                            </div>
                            <span className="text-sm font-medium text-ink-primary flex-1 group-hover:text-ink-primary/90">
                              {prompt}
                            </span>
                          </Card>
                        );
                      })}
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
                  <Suspense fallback={<div className="w-full pb-4" aria-hidden="true" />}>
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
                  </Suspense>
                )}
                <div ref={messagesEndRef} className="h-3" />
              </div>
            </div>
          </div>

          {/* Input Area - Floating Glass Bottom */}
          <div className="flex-none w-full pointer-events-none z-20">
            <div className="max-w-3xl mx-auto px-4 pb-safe-bottom pt-2 pointer-events-auto">
              <UnifiedInputBar
                value={chatLogic.input}
                onChange={chatLogic.setInput}
                onSend={chatLogic.handleSend}
                isLoading={chatLogic.isLoading}
              />
            </div>
          </div>
        </div>
      </PageLayout>

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
