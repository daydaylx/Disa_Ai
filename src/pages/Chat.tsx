import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useToasts } from "@/ui";
import { ChatStartCard } from "@/ui/ChatStartCard";

import { ChatStatusBanner } from "../components/chat/ChatStatusBanner";
import { ContextDropdownBar } from "../components/chat/ContextDropdownBar";
import { UnifiedInputBar } from "../components/chat/UnifiedInputBar";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { AppMenuDrawer, useMenuDrawer } from "../components/layout/AppMenuDrawer";
import { BookLayout } from "../components/layout/BookLayout";
import { BookPageAnimator } from "../components/navigation/BookPageAnimator";
import { HistorySidePanel } from "../components/navigation/HistorySidePanel";
import { QUICKSTARTS } from "../config/quickstarts";
import { useModelCatalog } from "../contexts/ModelCatalogContext";
import { useRoles } from "../contexts/RolesContext";
import { useConversationStats } from "../hooks/use-storage";
import { useChat } from "../hooks/useChat";
import { useConversationHistory } from "../hooks/useConversationHistory";
import { useConversationManager } from "../hooks/useConversationManager";
import { useMemory } from "../hooks/useMemory";
import { useSettings } from "../hooks/useSettings";
import { buildSystemPrompt } from "../lib/chat/prompt-builder";
import { MAX_PROMPT_LENGTH, validatePrompt } from "../lib/chat/validation";
import { mapCreativityToParams } from "../lib/creativity";
import { humanErrorToToast } from "../lib/errors/humanError";
import { Clock } from "../lib/icons";
import { getSamplingCapabilities } from "../lib/modelCapabilities";

export default function Chat() {
  const toasts = useToasts();
  // ... (hooks setup remains same)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeRole, setActiveRole } = useRoles();
  const { settings } = useSettings();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isEnabled: memoryEnabled } = useMemory();
  const { stats } = useConversationStats();
  const {
    models: modelCatalog,
    loading: modelsLoading,
    error: modelsError,
    refresh: refreshModels,
  } = useModelCatalog();
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
    onError: (error) => {
      toasts.push(humanErrorToToast(error));
    },
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

  useEffect(() => {
    const quickstartId = searchParams.get("quickstart");
    if (quickstartId && QUICKSTARTS.length > 0) {
      const quickstart = QUICKSTARTS.find((q) => q.id === quickstartId);
      if (quickstart) {
        startWithPreset(quickstart.system, quickstart.user);
        void navigate("/", { replace: true });
      }
    }
  }, [searchParams, navigate, startWithPreset]);

  const { activeConversation, conversationCount } = useConversationHistory(
    conversations,
    activeConversationId,
  );

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

  const hasActiveConversation = !!activeConversationId;
  const isEmpty = !hasActiveConversation && messages.length === 0;

  return (
    <>
      <BookLayout
        title={activeConversation?.title || "Neue Unterhaltung"}
        onMenuClick={openMenu}
        onBookmarkClick={() => setIsHistoryOpen(true)}
      >
        <BookPageAnimator pageKey={activeConversationId || "new"}>
          <div className="flex h-[calc(var(--vh,1vh)*100)] flex-col relative">
            <h1 className="sr-only">Disa AI – Chat</h1>
            <ChatStatusBanner status={apiStatus} error={error} rateLimitInfo={rateLimitInfo} />

            {/* Floating Action Button - Chalk Style */}
            <button
              type="button"
              onClick={() => {
                /* TODO: Implementiere History-Funktion oder andere Aktion */
              }}
              className="fixed right-4 top-20 z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 chalk-border bg-[rgba(19,19,20,0.85)] text-ink-primary backdrop-blur transition-all duration-200 hover:chalk-border-strong hover:bg-[rgba(19,19,20,0.95)] hover:shadow-[var(--chalk-glow)] active:scale-95"
              aria-label="Verlauf anzeigen"
            >
              <Clock className="h-6 w-6" />
            </button>

            <main
              ref={chatScrollRef}
              className="scroll-smooth flex-1 overflow-y-auto px-3 py-3 sm:px-8 sm:py-6 min-h-0"
              role="log"
              aria-label="Chat messages"
              data-testid="virtualized-chat-log"
            >
              {isEmpty ? (
                <div className="mx-auto mt-8 max-w-2xl">
                  <ChatStartCard
                    onNewChat={handleStartNewChat}
                    conversationCount={stats?.totalConversations ?? conversationCount}
                  />
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
                    /* TODO: Implement simple retry */ return void 0;
                  }}
                  className="mx-auto h-full max-w-3xl"
                  scrollContainerRef={chatScrollRef}
                />
              )}
              <div ref={messagesEndRef} />
            </main>

            {/* Unified Input Area */}
            <div className="z-sticky-content bg-bg-page/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md border-t border-border-ink/10">
              <UnifiedInputBar
                value={input}
                onChange={setInput}
                onSend={handleSend}
                isLoading={isLoading}
              />
              <ContextDropdownBar
                models={modelCatalog}
                modelsLoading={modelsLoading}
                modelsError={modelsError}
                onRefreshModels={refreshModels}
              />
            </div>
          </div>
        </BookPageAnimator>
      </BookLayout>

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
