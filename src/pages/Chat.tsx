import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Bookmark, MessageSquare } from "@/lib/icons"; // Using Icon directly instead of component
import { useToasts } from "@/ui";
import { Button } from "@/ui/Button";

import { ChatStatusBanner } from "../components/chat/ChatStatusBanner";
import { UnifiedInputBar } from "../components/chat/UnifiedInputBar";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { AppMenuDrawer, useMenuDrawer } from "../components/layout/AppMenuDrawer";
import { ChatLayout } from "../components/layout/ChatLayout";
import { HistorySidePanel } from "../components/navigation/HistorySidePanel";
import { QUICKSTARTS } from "../config/quickstarts";
import { useModelCatalog } from "../contexts/ModelCatalogContext";
import { useRoles } from "../contexts/RolesContext";
import { useChat } from "../hooks/useChat";
import { useConversationHistory } from "../hooks/useConversationHistory";
import { useConversationManager } from "../hooks/useConversationManager";
import { useMemory } from "../hooks/useMemory";
import { useSettings } from "../hooks/useSettings";
import { useVisualViewport } from "../hooks/useVisualViewport";
import { buildSystemPrompt } from "../lib/chat/prompt-builder";
import { MAX_PROMPT_LENGTH, validatePrompt } from "../lib/chat/validation";
import { mapCreativityToParams } from "../lib/creativity";
import { humanErrorToToast } from "../lib/errors/humanError";
import { getSamplingCapabilities } from "../lib/modelCapabilities";

const STARTER_PROMPTS = [
  "Schreib ein kurzes Gedicht",
  "Erkläre mir Quantenphysik",
  "Was koche ich heute?",
  "Erzähl mir einen Witz",
];

export default function Chat() {
  const toasts = useToasts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeRole, setActiveRole } = useRoles();
  const { settings } = useSettings();
  const viewport = useVisualViewport();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isEnabled: memoryEnabled } = useMemory();
  const { models: modelCatalog } = useModelCatalog();
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // UI State
  const { isOpen: isMenuOpen, openMenu, closeMenu } = useMenuDrawer();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const requestOptions = useMemo(() => {
    const capabilities = getSamplingCapabilities(settings.preferredModelId, modelCatalog ?? null);
    const params = mapCreativityToParams(settings.creativity ?? 45, settings.preferredModelId);
    return {
      model: settings.preferredModelId,
      temperature: capabilities.temperature ? params.temperature : undefined,
      top_p: capabilities.top_p ? params.top_p : undefined,
      presence_penalty: capabilities.presence_penalty ? params.presence_penalty : undefined,
    };
  }, [modelCatalog, settings.creativity, settings.preferredModelId]);

  const handleError = useCallback(
    (error: Error) => {
      toasts.push(humanErrorToToast(error));
    },
    [toasts],
  );

  const {
    messages,
    append,
    isLoading,
    setMessages,
    input,
    setInput,
    setCurrentSystemPrompt,
    setRequestOptions,
    apiStatus,
    rateLimitInfo,
    error,
  } = useChat({
    onError: handleError,
  });

  useEffect(() => {
    const combinedPrompt = buildSystemPrompt(settings, activeRole);
    setCurrentSystemPrompt(combinedPrompt || undefined);
  }, [activeRole, settings, setCurrentSystemPrompt]);

  useEffect(() => {
    setRequestOptions(requestOptions);
  }, [requestOptions, setRequestOptions]);

  useEffect(() => {
    if (!settings.showNSFWContent && activeRole) {
      const isMature =
        activeRole.category === "erwachsene" ||
        activeRole.tags?.some((t) => ["nsfw", "adult", "18+", "erotic"].includes(t.toLowerCase()));

      if (isMature) {
        setActiveRole(null);
        toasts.push({
          kind: "warning",
          title: "Rolle deaktiviert",
          message: "Diese Rolle ist aufgrund deiner Jugendschutz-Einstellungen nicht verfügbar.",
        });
      }
    }
  }, [activeRole, settings.showNSFWContent, setActiveRole, toasts]);

  const { activeConversationId, newConversation, conversations, selectConversation } =
    useConversationManager({
      messages,
      isLoading,
      setMessages,
      setCurrentSystemPrompt,
      onNewConversation: () => {
        setInput("");
      },
      saveEnabled: memoryEnabled,
      restoreEnabled: settings.restoreLastConversation && memoryEnabled,
    });

  useEffect(() => {
    // Only scroll if we are near bottom or it's a new message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = useCallback(() => {
    if (isLoading) {
      toasts.push({
        kind: "warning",
        title: "Verarbeitung läuft",
        message: "Bitte warte einen Moment, bis die aktuelle Antwort fertig ist.",
      });
      return;
    }

    const validation = validatePrompt(input);

    if (!validation.valid) {
      if (validation.reason === "too_long") {
        toasts.push({
          kind: "error",
          title: "Nachricht zu lang",
          message: `Die Eingabe darf maximal ${MAX_PROMPT_LENGTH.toLocaleString("de-DE")} Zeichen enthalten. Wir haben sie entsprechend gekürzt.`,
        });
        setInput(validation.sanitized);
      } else {
        toasts.push({
          kind: "warning",
          title: "Leere Nachricht",
          message: "Bitte gib eine Nachricht ein, bevor du sendest.",
        });
      }
      return;
    }

    void append({ role: "user", content: validation.sanitized }).catch((error: Error) => {
      toasts.push({
        kind: "error",
        title: "Senden fehlgeschlagen",
        message: error.message || "Die Nachricht konnte nicht gesendet werden.",
      });
    });
    setInput("");
  }, [append, input, isLoading, setInput, toasts]);

  const handleEdit = useCallback(
    (messageId: string, newContent: string) => {
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return;
      const newMessages = messages.slice(0, messageIndex);
      setMessages(newMessages);
      void append({ role: "user", content: newContent }, newMessages);
    },
    [messages, setMessages, append],
  );

  const handleFollowUp = useCallback(
    (prompt: string) => {
      if (isLoading) {
        toasts.push({
          kind: "warning",
          title: "Antwort läuft",
          message: "Warte kurz, bis die aktuelle Antwort fertig ist.",
        });
        return;
      }
      setInput(prompt);
      setTimeout(() => {
        const validation = validatePrompt(prompt);
        if (validation.valid) {
          void append({ role: "user", content: validation.sanitized });
          setInput("");
        }
      }, 100);
    },
    [setInput, append, isLoading, toasts],
  );

  const startWithPreset = useCallback(
    (system: string, user?: string) => {
      setCurrentSystemPrompt(system);
      if (user) {
        void append({
          role: "user",
          content: user,
        });
      }
    },
    [setCurrentSystemPrompt, append],
  );

  const processedQuickstartRef = useRef<string | null>(null);

  useEffect(() => {
    const quickstartId = searchParams.get("quickstart");
    if (quickstartId && QUICKSTARTS.length > 0) {
      // Prevent infinite loop by checking if we already processed this ID
      if (processedQuickstartRef.current === quickstartId) {
        // ID is still in URL but we processed it? Clean it up if needed, but don't re-send.
        // We can optionally force a navigate here just in case the previous one failed.
        return;
      }

      const quickstart = QUICKSTARTS.find((q) => q.id === quickstartId);
      if (quickstart) {
        processedQuickstartRef.current = quickstartId;
        startWithPreset(quickstart.system, quickstart.user);
        // Navigate to /chat (clean URL) to remove the query param
        void navigate("/chat", { replace: true });
      }
    }
  }, [searchParams, navigate, startWithPreset]);

  const { activeConversation } = useConversationHistory(conversations, activeConversationId);

  const handleStartNewChat = useCallback(() => {
    newConversation();
    setInput("");
    setIsHistoryOpen(false);
  }, [newConversation, setInput]);

  // History Selection
  const handleSelectConversation = useCallback(
    (id: string) => {
      void selectConversation(id);
      setIsHistoryOpen(false);
    },
    [selectConversation],
  );

  const handleStarterClick = (prompt: string) => {
    setInput(prompt);
    // Optional: Auto-send on click? Usually better to let user confirm.
    // But for "Starter Prompts" immediate action feels snappy.
    // Let's just set input for now to be safe and allow editing.
  };

  const hasActiveConversation = !!activeConversationId;
  const isEmpty = !hasActiveConversation && messages.length === 0;

  return (
    <>
      <ChatLayout
        title={activeConversation?.title || "Neue Unterhaltung"}
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
            height: viewport.height ? `${viewport.height}px` : "100%",
            minHeight: viewport.height ? `${viewport.height}px` : "100dvh",
          }}
        >
          <h1 className="sr-only">Disa AI – Chat</h1>
          <ChatStatusBanner status={apiStatus} error={error} rateLimitInfo={rateLimitInfo} />

          {/* Messages Area */}
          <main
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto min-h-0 pt-4" /* pt-4 reduced from pt-12 as model pill is gone */
            role="log"
            aria-label="Chat messages"
          >
            <div className="px-4 max-w-3xl mx-auto w-full min-h-full flex flex-col">
              {/* Removed bg-surface-1 container to allow ambient background to shine through */}
              <div className="flex-1 flex flex-col gap-6 py-4">
                {isEmpty ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-8 pb-20">
                    <div className="text-center space-y-4 px-4 max-w-sm bg-surface-glass p-8 rounded-3xl backdrop-blur-xl border border-white/5 shadow-lg">
                      <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-brand-primary" />
                      </div>
                      <p className="text-lg font-semibold text-ink-primary">
                        Willkommen bei Disa AI
                      </p>
                      <p className="text-sm text-ink-secondary leading-relaxed">
                        Beginne ein neues Gespräch. Deine Nachrichten sind privat und sicher.
                      </p>
                      <div className="flex flex-col gap-3 items-center w-full pt-4">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleStartNewChat}
                          className="w-full"
                        >
                          Neues Gespräch starten
                        </Button>
                        <button
                          type="button"
                          onClick={() => navigate("/settings")}
                          className="text-xs font-medium text-ink-tertiary hover:text-brand-primary transition-colors"
                        >
                          Einstellungen
                        </button>
                      </div>
                    </div>

                    {/* Starter Prompts */}
                    <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
                      {STARTER_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleStarterClick(prompt)}
                          className="flex items-center gap-3 p-3 text-left rounded-2xl bg-surface-1/40 border border-white/5 hover:bg-surface-1/60 hover:border-brand-primary/30 hover:shadow-glow-sm transition-all group"
                        >
                          <div className="p-2 rounded-xl bg-surface-2/50 text-ink-tertiary group-hover:text-brand-primary transition-colors">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-medium text-ink-secondary group-hover:text-ink-primary">
                            {prompt}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <VirtualizedMessageList
                    messages={messages}
                    isLoading={isLoading}
                    onCopy={(content) => {
                      void navigator.clipboard.writeText(content);
                    }}
                    onEdit={handleEdit}
                    onFollowUp={handleFollowUp}
                    onRetry={(_messageId) => {
                      /* TODO: Implement retry logic properly */
                    }}
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
            {" "}
            {/* Wrapper to let clicks pass through in empty space */}
            <div className="max-w-3xl mx-auto px-4 pb-safe-bottom pt-2 pointer-events-auto">
              <UnifiedInputBar
                value={input}
                onChange={setInput}
                onSend={handleSend}
                isLoading={isLoading}
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
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleStartNewChat}
      />
    </>
  );
}

// Helper import for the welcome screen icon
function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
