import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button, useToasts } from "@/ui";
import { ChatStartCard } from "@/ui/ChatStartCard";
import { SectionHeader } from "@/ui/SectionHeader";

import { ChatComposer } from "../components/chat/ChatComposer";
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
import { Brain } from "../lib/icons";
import { History } from "../lib/icons";
import { getSamplingCapabilities } from "../lib/modelCapabilities";

export default function Chat() {
  const toasts = useToasts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const composerContainerRef = useRef<HTMLDivElement>(null);
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

  const focusComposer = () => {
    const textarea = composerContainerRef.current?.querySelector("textarea");
    if (textarea instanceof HTMLTextAreaElement) {
      textarea.focus();
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      composerContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex flex-col text-ink-primary h-full max-h-[100dvh] overflow-hidden bg-canvas">
      <BookPageAnimator
        activeChatId={activeConversationId}
        swipeStack={swipeStack}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        canSwipeLeft={messages.length > 0} // Can swipe left if current chat is not empty
        canSwipeRight={
          swipeStack.length > 1 &&
          swipeStack.indexOf(activeConversationId || "") < swipeStack.length - 1
        }
      >
        <div className="relative flex flex-col text-ink-primary h-full max-h-[100dvh] overflow-hidden bg-bg-page">
          <h1 className="sr-only">Disa AI – Chat</h1>

          {/* Bookmark Component */}
          <Bookmark onClick={() => setIsHistoryOpen(true)} className="top-14 sm:top-4" />

          <ChatStatusBanner status={apiStatus} error={error} rateLimitInfo={rateLimitInfo} />

          {/* FAB for New Chat on mobile/tablet */}
          {!isEmpty && (
            <button
              onClick={handleSwipeLeft}
              className="fixed bottom-32 right-4 z-50 flex items-center justify-center w-14 h-14 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-full shadow-lg tap-target focus:outline-none focus:ring-2 focus:ring-accent-primary/50 sm:hidden"
              aria-label="Neuen Chat starten (Swipe left)"
              title="Swipe left or tap for new chat"
            >
              <span className="sr-only sm:not-sr-only">Neuer Chat</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}
          {isEmpty ? (
            <div className="flex flex-col gap-6 px-4 py-6 overflow-y-auto flex-1 bg-bg-page">
              <div className="flex items-start justify-between gap-3">
                <SectionHeader
                  variant="compact"
                  title="Seite 1"
                  subtitle="Ein neues Kapitel beginnt."
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsHistoryOpen(true)}
                  className="self-start gap-2"
                >
                  <History className="h-4 w-4" />
                  Verlauf
                </Button>
              </div>

              <ChatStartCard
                onNewChat={focusComposer}
                conversationCount={stats?.totalConversations || 0}
              />
            </div>
          ) : (
            <div
              className="flex-1 overflow-y-auto mx-0 sm:mx-4 sm:my-2 sm:rounded-lg bg-bg-page sm:border sm:border-border-ink"
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

          <div className="sticky bottom-0 bg-bg-page z-composer border-t-0">
            <ContextBar modelCatalog={modelCatalog} />

            <div
              className="px-4 safe-area-horizontal pb-[env(safe-area-inset-bottom)]"
              ref={composerContainerRef}
            >
              <ChatComposer
                value={input}
                onChange={setInput}
                onSend={handleSend}
                onStop={stop}
                isLoading={isLoading}
                canSend={!isLoading}
                placeholder="Schreibe auf diese Seite..."
                className="pt-2"
              />
            </div>

            <div className="pt-2 flex justify-center pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsThemenSheetOpen(true)}
                className="gap-1.5 text-ink-secondary hover:text-ink-primary"
              >
                <Brain className="h-3.5 w-3.5" />
                Themen auswählen…
              </Button>
            </div>
          </div>

          <div ref={messagesEndRef} />
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
