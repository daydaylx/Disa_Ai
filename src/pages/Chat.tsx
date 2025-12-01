import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { useToasts } from "@/ui";
import { ChatStartCard } from "@/ui/ChatStartCard";

import { ChatInputBar } from "../components/chat/ChatInputBar";
import { ChatStatusBanner } from "../components/chat/ChatStatusBanner";
import { ContextBar } from "../components/chat/ContextBar";
import { ThemenBottomSheet } from "../components/chat/ThemenBottomSheet";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { Bookmark } from "../components/navigation/Bookmark";
import { BookPageAnimator } from "../components/navigation/BookPageAnimator";
import { HistorySidePanel } from "../components/navigation/HistorySidePanel";
import type { ModelEntry } from "../config/models";
import { QUICKSTARTS } from "../config/quickstarts";
import { useRoles } from "../contexts/RolesContext";
import { useConversationStats } from "../hooks/use-storage";
import { useBookNavigation } from "../hooks/useBookNavigation";
import { useChat } from "../hooks/useChat";
import { useConversationManager } from "../hooks/useConversationManager";
import { useMemory } from "../hooks/useMemory";
import { useSettings } from "../hooks/useSettings";
import { buildSystemPrompt } from "../lib/chat/prompt-builder";
import { MAX_PROMPT_LENGTH, validatePrompt } from "../lib/chat/validation";
import { mapCreativityToParams } from "../lib/creativity";
import { humanErrorToToast } from "../lib/errors/humanError";
import { Plus } from "../lib/icons";
import { getSamplingCapabilities } from "../lib/modelCapabilities";

export default function Chat() {
  const toasts = useToasts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeRole, setActiveRole } = useRoles();
  const { settings } = useSettings();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isThemenSheetOpen, setIsThemenSheetOpen] = useState(false);
  const { isEnabled: memoryEnabled } = useMemory();
  const { stats } = useConversationStats();
  const [modelCatalog, setModelCatalog] = useState<ModelEntry[] | null>(null);

  useEffect(() => {
    let active = true;
    const isTestEnv = typeof (globalThis as any).vitest !== "undefined";
    if (typeof window === "undefined" || isTestEnv || typeof window.fetch === "undefined") return;
    import("../config/models")
      .then((mod) =>
        mod.loadModelCatalog().then((data) => {
          if (!active) return;
          setModelCatalog(data);
        }),
      )
      .catch(() => {
        if (!active) return;
        setModelCatalog(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const requestOptions = useMemo(() => {
    const capabilities = getSamplingCapabilities(settings.preferredModelId, modelCatalog);
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
    stop,
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

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { activeConversationId, selectConversation, newConversation, conversations } =
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

  const {
    startNewChat: bookStartNewChat,
    goBack: bookGoBack,
    navigateToChat: bookNavigateToChat,
    updateChatId,
    swipeStack,
    activeChatId: bookActiveId,
  } = useBookNavigation();

  useEffect(() => {
    if (activeConversationId && bookActiveId && activeConversationId !== bookActiveId) {
      updateChatId(bookActiveId, activeConversationId);
    }
  }, [activeConversationId, bookActiveId, updateChatId]);

  const handleSwipeLeft = useCallback(() => {
    if (messages.length > 0) {
      bookStartNewChat();
      newConversation();
      toasts.push({ kind: "info", title: "Neue Seite", message: "" });
    }
  }, [messages.length, bookStartNewChat, newConversation, toasts]);

  const handleSwipeRight = useCallback(() => {
    const currentIndex = swipeStack.indexOf(activeConversationId || "");
    if (currentIndex !== -1 && currentIndex < swipeStack.length - 1) {
      const prevId = swipeStack[currentIndex + 1];
      if (prevId) {
        bookGoBack();
        void selectConversation(prevId);
        toasts.push({ kind: "info", title: "Zurückgeblättert", message: "" });
      }
    }
  }, [swipeStack, activeConversationId, bookGoBack, selectConversation, toasts]);

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

  const isEmpty = messages.length === 0;
  const activeConversation = conversations?.find((c) => c.id === activeConversationId);
  const showFab = !isEmpty;

  return (
    <div className="relative flex flex-col text-ink-primary h-full min-h-[calc(var(--vh,1vh)*100)] bg-bg-app">
      <h1 className="sr-only">Disa AI – Chat</h1>

      {/* Mobile FAB - New Page Button */}
      {showFab && (
        <button
          onClick={handleSwipeLeft}
          className="fixed top-4 right-4 z-50 flex items-center justify-center w-11 h-11 bg-ink-primary hover:bg-ink-primary/90 text-white rounded-full shadow-lg sm:hidden opacity-90 hover:opacity-100 transition-all touch-manipulation"
          aria-label="Neuen Chat starten"
        >
          <span className="sr-only">Neuer Chat</span>
          <Plus className="w-5 h-5" />
        </button>
      )}

      <BookPageAnimator
        activeChatId={activeConversationId}
        swipeStack={swipeStack}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        canSwipeLeft={messages.length > 0}
        canSwipeRight={
          swipeStack.length > 1 &&
          swipeStack.indexOf(activeConversationId || "") < swipeStack.length - 1
        }
      >
        {/* Container matches BookPageAnimator expectations */}
        <div className="relative flex flex-col text-ink-primary h-full min-h-0 bg-bg-page">
          {/* Bookmark positioned relative to this container */}
          <Bookmark
            onClick={() => setIsHistoryOpen(true)}
            className="absolute top-0 right-3 sm:right-4"
            disabled={(conversations || []).length === 0}
          />

          {/* Simplified Header */}
          <div className="px-3 sm:px-4 pt-4 pb-2 flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
                Aktuelle Seite
              </div>
              <div className="text-lg font-semibold text-ink-primary truncate">
                {activeConversation?.title || "Neue Unterhaltung"}
              </div>
            </div>
          </div>

          <ChatStatusBanner status={apiStatus} error={error} rateLimitInfo={rateLimitInfo} />

          {/* Chat Messages Area - Scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {isEmpty ? (
              <div className="flex-1 flex items-center justify-center px-4 py-8">
                <ChatStartCard
                  onNewChat={() => setIsHistoryOpen(true)}
                  conversationCount={stats?.totalConversations || 0}
                />
              </div>
            ) : (
              /* Chat messages with visible "page" container */
              <div
                className={cn(
                  "flex-1 mx-2 sm:mx-4 my-2 rounded-xl",
                  "bg-bg-page border border-border-ink/20",
                  "shadow-sm",
                  // Stack effect: subtle pages behind
                  "relative before:absolute before:inset-x-1 before:-bottom-1 before:h-2 before:bg-bg-page/60 before:rounded-b-lg before:-z-10",
                )}
                data-testid="chat-message-list"
              >
                <VirtualizedMessageList
                  messages={messages}
                  isLoading={isLoading}
                  onCopy={(content) => {
                    navigator.clipboard.writeText(content).catch((err) => {
                      console.error("Failed to copy content:", err);
                    });
                  }}
                  onEdit={handleEdit}
                  onFollowUp={handleFollowUp}
                  onRetry={(messageId) => {
                    const messageIndex = messages.findIndex((m) => m.id === messageId);
                    if (messageIndex === -1) return;

                    const targetUserIndex = (() => {
                      const targetMsg = messages[messageIndex];
                      if (targetMsg && targetMsg.role === "user") return messageIndex;
                      for (let i = messageIndex; i >= 0; i -= 1) {
                        const candidate = messages[i];
                        if (candidate && candidate.role === "user") return i;
                      }
                      return -1;
                    })();

                    if (targetUserIndex === -1) {
                      toasts.push({
                        kind: "warning",
                        title: "Retry nicht möglich",
                        message: "Keine passende Nutzernachricht gefunden.",
                      });
                      return;
                    }

                    const userMessage = messages[targetUserIndex];
                    if (!userMessage) return;
                    const historyContext = messages.slice(0, targetUserIndex);
                    setMessages(historyContext);
                    void append({ role: "user", content: userMessage.content }, historyContext);
                  }}
                  className="h-full"
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="bg-bg-page z-composer border-t border-border-ink/30 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.06)]">
            <div className="max-w-3xl mx-auto">
              {/* Chat Input */}
              <div className="px-2 pt-1.5 sm:px-4 sm:pt-2">
                <ChatInputBar
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  isLoading={isLoading}
                  onQuickAction={(prompt) => setInput(prompt)}
                />
              </div>

              {/* Context Bar: AI Behavior Controls */}
              <ContextBar
                modelCatalog={modelCatalog}
                onSend={handleSend}
                onStop={stop}
                isLoading={isLoading}
                canSend={!!input.trim()}
                className="border-t border-border-ink/20 mt-2"
              />
            </div>
          </div>
        </div>

        <ThemenBottomSheet
          isOpen={isThemenSheetOpen}
          onClose={() => setIsThemenSheetOpen(false)}
          onStart={startWithPreset}
        />
      </BookPageAnimator>

      <HistorySidePanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        activePages={swipeStack.map((id) => {
          const conv = (conversations || []).find((c) => c.id === id);
          return { id, title: conv?.title || "Unbenannte Seite" };
        })}
        archivedPages={(conversations || [])
          .filter((c) => !swipeStack.includes(c.id))
          .map((c) => ({
            id: c.id,
            title: c.title,
            date: new Date(c.updatedAt).toLocaleDateString(),
          }))}
        activeChatId={activeConversationId}
        onSelectChat={(id) => {
          void selectConversation(id);
          bookNavigateToChat(id);
        }}
      />
    </div>
  );
}
