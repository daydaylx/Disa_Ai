import { lazy, Suspense, useCallback, useMemo, useRef, useState } from "react";

import { useModelCatalog } from "@/contexts/ModelCatalogContext";
import { useCoreStatus } from "@/hooks/useCoreStatus";
import { getCycleColor } from "@/lib/categoryColors";
import { Bookmark, MessageSquare } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { discussionPresetOptions } from "@/prompts/discussion/presets";
import { Button } from "@/ui/Button";

import { ChatStatusBanner } from "../components/chat/ChatStatusBanner";
import { UnifiedInputBar } from "../components/chat/UnifiedInputBar";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { AppMenuDrawer, useMenuDrawer } from "../components/layout/AppMenuDrawer";
import { ChatLayout } from "../components/layout/ChatLayout";
import { HistorySidePanel } from "../components/navigation/HistorySidePanel";
import { useChatPageLogic } from "../hooks/useChatPageLogic";
import { useChatQuickstart } from "../hooks/useChatQuickstart";
import { useSettings } from "../hooks/useSettings";
import { useVisualViewport } from "../hooks/useVisualViewport";

// Lazy load 3D component to reduce initial bundle (Three.js is ~1MB)
const ChatHeroCore3D = lazy(() =>
  import("@/components/chat/ChatHeroCore3D").then((m) => ({ default: m.ChatHeroCore3D })),
);

const STARTER_PROMPTS = [
  "Schreib ein kurzes Gedicht",
  "Erkläre mir Quantenphysik",
  "Was koche ich heute?",
  "Erzähl mir einen Witz",
];

function getCreativityLabel(value: number): string {
  if (value < 30) return "Präzise";
  if (value < 70) return "Ausgewogen";
  return "Kreativ";
}

export default function Chat() {
  const viewport = useVisualViewport();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // UI State
  const { isOpen: isMenuOpen, openMenu, closeMenu } = useMenuDrawer();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Settings & Meta
  const { settings } = useSettings();
  const { models } = useModelCatalog();

  // Preset handler will be defined after chatLogic
  const startWithPreset = useRef<(system: string, user?: string) => void>(() => {});

  // All business logic encapsulated in custom hook
  const chatLogic = useChatPageLogic({
    onStartWithPreset: (system, user) => startWithPreset.current(system, user),
  });

  // Derived Core Status (centralized via hook)
  const coreStatus = useCoreStatus({
    isLoading: chatLogic.isLoading,
    error: chatLogic.error,
    messages: chatLogic.messages,
  });

  // Derived Meta Info
  const modelName = useMemo(() => {
    const m = models?.find((x) => x.id === settings.preferredModelId);
    return m?.label || settings.preferredModelId || "Unbekannt";
  }, [models, settings.preferredModelId]);

  const toneLabel = useMemo(() => {
    return (
      discussionPresetOptions.find((o) => o.key === settings.discussionPreset)?.label || "Standard"
    );
  }, [settings.discussionPreset]);

  const creativityLabel = useMemo(
    () => getCreativityLabel(settings.creativity),
    [settings.creativity],
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
          <h1 className="sr-only">Disa AI – Chat</h1>
          <ChatStatusBanner
            status={chatLogic.apiStatus}
            error={chatLogic.error}
            rateLimitInfo={chatLogic.rateLimitInfo}
          />

          {/* Messages Area */}
          <main
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto min-h-0 pt-4"
            role="log"
            aria-label="Chat messages"
          >
            <div className="px-4 max-w-3xl mx-auto w-full min-h-full flex flex-col">
              <div className="flex-1 flex flex-col gap-6 py-4">
                {chatLogic.isEmpty ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-20 px-4">
                    {/* Cinematic 3D Core Header (lazy loaded) */}
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center w-full min-h-[320px]">
                          <div className="animate-pulse flex flex-col items-center gap-3">
                            <div className="w-32 h-32 bg-surface-3/30 rounded-3xl" />
                            <div className="h-4 w-24 bg-surface-3/30 rounded-full" />
                          </div>
                        </div>
                      }
                    >
                      <ChatHeroCore3D
                        status={coreStatus}
                        modelName={modelName}
                        toneLabel={toneLabel}
                        creativityLabel={creativityLabel}
                        lastErrorMessage={chatLogic.error?.message}
                      />
                    </Suspense>

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
                              "bg-surface-1/40 border border-white/5",
                              theme.hoverBg,
                              theme.hoverBorder,
                              theme.hoverGlow,
                            )}
                          >
                            <div
                              className={cn(
                                "p-2 rounded-xl transition-colors",
                                "bg-surface-2/50 text-ink-tertiary",
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
          </main>

          {/* Input Area - Floating Glass Bottom */}
          <div className="flex-none w-full pointer-events-none">
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
