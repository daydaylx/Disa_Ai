import { useCallback, useRef, useState } from "react";

import { type LogoState } from "@/app/components/AnimatedLogo";
import { getCycleColor } from "@/lib/categoryColors";
import { Bookmark, MessageSquare } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import { ChatStatusBanner } from "../components/chat/ChatStatusBanner";
import { UnifiedInputBar } from "../components/chat/UnifiedInputBar";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { AppMenuDrawer, useMenuDrawer } from "../components/layout/AppMenuDrawer";
import { ChatLayout } from "../components/layout/ChatLayout";
import { HistorySidePanel } from "../components/navigation/HistorySidePanel";
import { useChatPageLogic } from "../hooks/useChatPageLogic";
import { useChatQuickstart } from "../hooks/useChatQuickstart";
import { useVisualViewport } from "../hooks/useVisualViewport";

const STARTER_PROMPTS = [
  "Schreib ein kurzes Gedicht",
  "Erkläre mir Quantenphysik",
  "Was koche ich heute?",
  "Erzähl mir einen Witz",
];

export default function Chat() {
  const viewport = useVisualViewport();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // UI State
  const { isOpen: isMenuOpen, openMenu, closeMenu } = useMenuDrawer();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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
      setIsHistoryOpen(false);
    },
    [chatLogic],
  );

  const handleStartNewChat = useCallback(() => {
    chatLogic.handleStartNewChat();
    setIsHistoryOpen(false);
  }, [chatLogic]);

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
            onClick={() => setIsHistoryOpen(true)}
            aria-label="Verlauf öffnen"
            className="gap-2 px-3"
          >
            <Bookmark className="h-4 w-4 text-ink-secondary" />
            <span className="hidden sm:inline">Verlauf</span>
          </Button>
        }
      >
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
                  <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-20 px-4">
                    <div className="w-full max-w-md text-center space-y-2">
                      <h2 className="text-xl font-semibold text-ink-primary">
                        Was kann ich für dich tun?
                      </h2>
                      <p className="text-sm text-ink-secondary">
                        Tippe unten eine Frage ein oder wähle einen der Vorschläge.
                      </p>
                    </div>

                    {/* Starter Prompts */}
                    <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
                      {STARTER_PROMPTS.map((prompt, index) => {
                        const theme = getCycleColor(index);
                        return (
                          <button
                            key={prompt}
                            onClick={() => chatLogic.handleStarterClick(prompt)}
                            className={cn(
                              "flex items-center gap-3 p-3 text-left rounded-2xl transition-all group",
                              "bg-surface-2 border border-border-subtle",
                              theme.hoverBg,
                              theme.hoverBorder,
                              theme.hoverGlow,
                            )}
                          >
                            <div
                              className={cn(
                                "p-2 rounded-xl transition-colors",
                                "bg-surface-3 text-ink-tertiary",
                                theme.groupHoverIconBg,
                                theme.groupHoverIconText,
                              )}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-medium text-ink-secondary group-hover:text-ink-primary">
                              {prompt}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Link to Settings - Subtle */}
                    <button
                      type="button"
                      onClick={() => chatLogic.navigate("/settings")}
                      className="text-xs font-medium text-ink-muted hover:text-ink-secondary transition-colors mt-2"
                    >
                      Einstellungen anpassen →
                    </button>
                  </div>
                ) : (
                  <VirtualizedMessageList
                    messages={chatLogic.messages}
                    isLoading={chatLogic.isLoading}
                    onCopy={(content) => {
                      void navigator.clipboard.writeText(content);
                    }}
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
      </ChatLayout>

      {/* Global Menu */}
      <AppMenuDrawer isOpen={isMenuOpen} onClose={closeMenu} />

      {/* History Side Panel */}
      <HistorySidePanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        conversations={chatLogic.conversations}
        activeId={chatLogic.activeConversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleStartNewChat}
      />
    </>
  );
}
