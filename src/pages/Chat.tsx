import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Bookmark, Cpu } from "@/lib/icons"; // Using Icon directly instead of component
import { useToasts } from "@/ui";
import { Button } from "@/ui/Button";

import { ChatStatusBanner } from "../components/chat/ChatStatusBanner";
import { UnifiedInputBar } from "../components/chat/UnifiedInputBar";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { AppMenuDrawer, useMenuDrawer } from "../components/layout/AppMenuDrawer";
import { AppShell } from "../components/layout/AppShell";
import { HistorySidePanel } from "../components/navigation/HistorySidePanel";
import { QUICKSTARTS } from "../config/quickstarts";
import { useModelCatalog } from "../contexts/ModelCatalogContext";
import { useRoles } from "../contexts/RolesContext";
import { useChat } from "../hooks/useChat";
import { useConversationHistory } from "../hooks/useConversationHistory";
import { useConversationManager } from "../hooks/useConversationManager";
import { useMemory } from "../hooks/useMemory";
import { useSettings } from "../hooks/useSettings";
import { buildSystemPrompt } from "../lib/chat/prompt-builder";
import { MAX_PROMPT_LENGTH, validatePrompt } from "../lib/chat/validation";
import { mapCreativityToParams } from "../lib/creativity";
import { humanErrorToToast } from "../lib/errors/humanError";
import { getSamplingCapabilities } from "../lib/modelCapabilities";

export default function Chat() {
  const toasts = useToasts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeRole, setActiveRole } = useRoles();
  const { settings } = useSettings();

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

  const hasActiveConversation = !!activeConversationId;
  const isEmpty = !hasActiveConversation && messages.length === 0;

  return (
    <>
      <AppShell
        title={activeConversation?.title || "Neue Unterhaltung"}
        onMenuClick={openMenu}
        headerActions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsHistoryOpen(true)}
            aria-label="Verlauf öffnen"
            className="gap-2 px-2xs"
          >
            <Bookmark className="h-4 w-4 text-ink-secondary" />
            <span className="hidden sm:inline">Verlauf</span>
          </Button>
        }
      >
        <div className="flex h-full flex-col">
          <h1 className="sr-only">Disa AI – Chat</h1>
          <ChatStatusBanner status={apiStatus} error={error} rateLimitInfo={rateLimitInfo} />

          {/* Model Pill above chat */}
          <div className="flex-none px-xs pt-safe-top pb-3xs">
            <div className="max-w-3xl mx-auto">
              <button
                onClick={() => navigate("/models")}
                className="flex items-center gap-1.5 rounded-full border glass-subtle px-2xs py-3xs text-sm font-medium text-ink-secondary transition-colors hover:border-medium hover:text-ink-primary hover:bg-surface-2"
              >
                <Cpu className="h-4 w-4 opacity-70" />
                <span className="truncate max-w-[160px]">
                  {settings.preferredModelId.split("/").pop() || "Modell"}
                </span>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <main
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto min-h-0"
            role="log"
            aria-label="Chat messages"
          >
            <div className="px-2xs sm:px-xs py-2xs sm:py-xs max-w-3xl mx-auto w-full min-h-full flex flex-col">
              <div className="flex-1 rounded-3xl border bg-surface-1 px-2xs sm:px-sm py-xs sm:py-sm shadow-md flex flex-col gap-4">
                {isEmpty ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-3 px-xs max-w-sm">
                      <p className="text-sm font-semibold text-ink-primary">Direkt loslegen</p>
                      <p className="text-xs text-ink-secondary leading-relaxed">
                        Tippe unten deine erste Nachricht. Deine Gespräche bleiben nur auf diesem
                        Gerät gespeichert.
                      </p>
                      <div className="flex flex-col gap-2 items-center">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleStartNewChat}
                          className="w-full max-w-[220px]"
                        >
                          Neues Gespräch
                        </Button>
                        <button
                          type="button"
                          onClick={() => navigate("/settings")}
                          className="text-[12px] font-medium text-accent-primary hover:text-accent-primary/80 underline underline-offset-4"
                        >
                          Mehr zu Disa AI
                        </button>
                      </div>
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
                    className="w-full pb-2"
                    scrollContainerRef={chatScrollRef}
                  />
                )}
                <div ref={messagesEndRef} className="h-3" />
              </div>
            </div>
          </main>

          {/* Input Area - Fixed at bottom */}
          <div className="flex-none w-full bg-bg-app border-t border-subtle">
            <div className="max-w-3xl mx-auto px-xs py-2xs pb-safe-bottom">
              <UnifiedInputBar
                value={input}
                onChange={setInput}
                onSend={handleSend}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </AppShell>

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
