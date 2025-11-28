import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button, useToasts } from "@/ui";
import { ChatStartCard } from "@/ui/ChatStartCard";
import { SectionHeader } from "@/ui/SectionHeader";

import { ChatComposer } from "../components/chat/ChatComposer";
import { ChatStatusBanner } from "../components/chat/ChatStatusBanner";
import { ModelSelector } from "../components/chat/ModelSelector";
import { QuickstartGrid } from "../components/chat/QuickstartGrid";
import { RoleActiveBanner } from "../components/chat/RoleActiveBanner";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { Bookmark } from "../components/navigation/Bookmark";
import { BookSwipeGesture } from "../components/navigation/BookSwipeGesture";
import { HistorySidePanel } from "../components/navigation/HistorySidePanel";
import type { ModelEntry } from "../config/models";
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
import { History } from "../lib/icons";
import { getSamplingCapabilities } from "../lib/modelCapabilities";

export default function Chat() {
  const toasts = useToasts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const composerContainerRef = useRef<HTMLDivElement>(null);
  const { activeRole, setActiveRole } = useRoles();
  const { settings, setPreferredModel } = useSettings();
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

  const startWithPreset = (system: string, user?: string) => {
    setCurrentSystemPrompt(system);
    if (user) {
      void append({
        role: "user",
        content: user,
      });
    }
  };

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
  const memoryBadge = memoryEnabled ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-surface-2 text-ink-secondary px-2 py-1 text-[11px] font-medium border border-border-ink">
      • Memory aktiv
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-md bg-surface-2 text-ink-secondary px-2 py-1 text-[11px] font-medium border border-border-ink opacity-70">
      • Kein Autosave
    </span>
  );

  const handleModelChange = useCallback(
    (modelId: string) => {
      setPreferredModel(modelId);
      toasts.push({
        kind: "success",
        title: "Modell gewechselt",
        message: `Nutze jetzt: ${modelId.split("/").pop()}`,
      });
    },
    [setPreferredModel, toasts],
  );

  // HEADER: Pinned to top of the page area
  const infoBar = (
    <div className="sticky top-0 z-sticky-content w-full bg-bg-page/95 border-b border-border-ink px-4 py-3 flex items-center gap-2">
      <ModelSelector currentModelId={settings.preferredModelId} onModelChange={handleModelChange} />
      {activeRole && (
        <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-surface-2 border border-border-ink px-2 py-1 text-xs font-medium text-ink-secondary min-h-[24px]">
          {activeRole.name}
        </span>
      )}
      <div className="ml-auto flex items-center gap-2">
        <span className="hidden sm:inline-flex">{memoryBadge}</span>
      </div>
    </div>
  );

  return (
    <BookSwipeGesture
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      canSwipeRight={
        swipeStack.length > 1 &&
        swipeStack.indexOf(activeConversationId || "") < swipeStack.length - 1
      }
      className="h-full max-h-[100dvh] bg-bg-app flex justify-center overflow-hidden" // Outer Canvas: bg-bg-app
    >
      {/*
        PAGE CONTAINER
        This is the "Sheet of Paper".
        Centered, max-width on desktop, white bg, subtle shadow.
      */}
      <div className="relative w-full max-w-4xl h-full flex flex-col bg-bg-page shadow-page sm:my-2 sm:rounded-lg sm:border sm:border-border-ink overflow-hidden isolate">
        {/* Stacked Page Hint (Visual only, behind the main page) */}
        <div
          className="absolute inset-0 z-[-1] bg-bg-page translate-x-1 translate-y-1 rounded-lg border border-border-ink opacity-50 hidden sm:block pointer-events-none"
          aria-hidden="true"
        />

        <h1 className="sr-only">Disa AI – Chat</h1>

        {/* Bookmark: Positioned absolutely relative to the Page Container */}
        <Bookmark
          onClick={() => setIsHistoryOpen(true)}
          className="top-0 right-6 sm:right-8 z-50"
        />

        <ChatStatusBanner status={apiStatus} error={error} rateLimitInfo={rateLimitInfo} />
        <RoleActiveBanner />

        {!isEmpty && infoBar}

        {isEmpty ? (
          <div className="flex flex-col gap-6 px-4 py-6 overflow-y-auto flex-1 bg-bg-page">
            <div className="flex items-start justify-between gap-3 mt-8 sm:mt-4">
              <SectionHeader
                variant="compact"
                title="Notizbuch"
                subtitle="Eine neue leere Seite."
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsHistoryOpen(true)}
                className="self-start gap-2"
              >
                <History className="h-4 w-4" />
                Inhaltsverzeichnis
              </Button>
            </div>

            <ChatStartCard
              onNewChat={focusComposer}
              conversationCount={stats?.totalConversations || 0}
            />

            <QuickstartGrid
              onStart={startWithPreset}
              title="Themen"
              description="Wähle ein Thema für diese Seite."
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto bg-bg-page" data-testid="chat-message-list">
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

                if (targetUserIndex === -1) return;

                const userMessage = messages[targetUserIndex];
                if (!userMessage) return;
                const historyContext = messages.slice(0, targetUserIndex);
                setMessages(historyContext);
                void append({ role: "user", content: userMessage.content }, historyContext);
              }}
              className="h-full pb-4"
            />
          </div>
        )}

        {/* COMPOSER: Pinned Note at bottom */}
        <div className="sticky bottom-0 bg-bg-page pt-2 z-composer border-t border-border-ink/50 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
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
              placeholder="Notiere etwas..."
            />
          </div>
        </div>

        <div ref={messagesEndRef} />

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
    </BookSwipeGesture>
  );
}
