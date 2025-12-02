import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { BrandWordmark } from "@/app/components/BrandWordmark";
import { AppMenuDrawer, MenuIcon, useMenuDrawer } from "@/components/layout/AppMenuDrawer";
import { Bookmark } from "@/components/navigation/Bookmark";
import { HistorySidePanel } from "@/components/navigation/HistorySidePanel";
import { useToasts } from "@/ui";
import { Button } from "@/ui/Button";
import { ChatStartCard } from "@/ui/ChatStartCard";

import { ChatInputBar } from "../components/chat/ChatInputBar";
import { ChatStatusBanner } from "../components/chat/ChatStatusBanner";
import { ContextBar } from "../components/chat/ContextBar";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import type { ModelEntry } from "../config/models";
import { QUICKSTARTS } from "../config/quickstarts";
import { useRoles } from "../contexts/RolesContext";
import { useConversationStats } from "../hooks/use-storage";
import { useChat } from "../hooks/useChat";
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
  const { isOpen: isMenuOpen, openMenu, closeMenu } = useMenuDrawer();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  const {
    activeConversationId,
    newConversation,
    conversations,
    isHistoryOpen,
    openHistory,
    closeHistory,
    selectConversation,
  } = useConversationManager({
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

  const conversationList = useMemo(() => conversations ?? [], [conversations]);

  const activeConversation = conversationList.find((c) => c.id === activeConversationId);
  const conversationCount = conversationList.length;

  const sortedConversations = useMemo(
    () =>
      [...conversationList].sort(
        (a, b) =>
          new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
          new Date(a.updatedAt ?? a.createdAt ?? 0).getTime(),
      ),
    [conversationList],
  );

  const historyPages = useMemo(
    () =>
      sortedConversations.map((conversation) => ({
        id: conversation.id,
        title: conversation.title || "Unbenannter Chat",
        date: (() => {
          const referenceDate = conversation.updatedAt || conversation.createdAt;
          if (!referenceDate) return "Unbekannt";

          return new Date(referenceDate).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "short",
          });
        })(),
      })),
    [sortedConversations],
  );

  const activeHistoryPages = historyPages.slice(0, 3);
  const archivedHistoryPages = historyPages.slice(3);

  const handleStartNewChat = useCallback(() => {
    newConversation();
    setInput("");
  }, [newConversation, setInput]);

  const handleOpenHistory = useCallback(() => {
    openHistory();
  }, [openHistory]);

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex min-h-[calc(var(--vh,1vh)*100)] flex-col bg-bg-app text-text-primary">
      <h1 className="sr-only">Disa AI – Chat</h1>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <BrandWordmark className="text-xl sm:text-2xl" />
          <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary sm:inline">
            Disa AI
          </span>
        </div>
        <div className="flex flex-1 justify-center">
          <span className="rounded-full bg-surface-2 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-secondary shadow-sm">
            Chat
          </span>
        </div>
        <MenuIcon onClick={openMenu} />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-10">
        <div className="relative flex min-h-[70vh] flex-1 flex-col overflow-hidden rounded-2xl border border-border-ink/25 bg-bg-paper shadow-raise">
          <div className="flex items-center justify-between gap-3 border-b border-border-ink/20 bg-bg-paper/90 px-5 py-4 backdrop-blur-sm supports-[backdrop-filter]:backdrop-blur-md">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
                Aktive Unterhaltung
              </p>
              <p className="truncate text-lg font-semibold text-text-primary">
                {activeConversation?.title || "Neue Unterhaltung"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartNewChat}
              className="text-sm font-medium text-ink-secondary hover:text-ink-primary"
            >
              Neues Kapitel
            </Button>
          </div>

          <div className="space-y-3 px-3 pt-3 sm:px-5">
            <ChatStatusBanner status={apiStatus} error={error} rateLimitInfo={rateLimitInfo} />
          </div>

          <div className="flex flex-1 flex-col px-3 pb-3 sm:px-5 sm:pb-4">
            {isEmpty ? (
              <ChatStartCard
                onNewChat={handleStartNewChat}
                conversationCount={stats?.totalConversations ?? conversationCount}
                onOpenHistory={handleOpenHistory}
              />
            ) : (
              <div className="relative flex min-h-[320px] flex-1 flex-col overflow-hidden rounded-xl border border-border-ink/30 bg-bg-paper">
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
                  className="h-full px-3 py-4 sm:px-5 sm:py-6"
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border-ink/25 bg-bg-paper/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:backdrop-blur-lg sm:px-5 sm:py-4">
            <div className="mx-auto w-full max-w-4xl space-y-3">
              <ChatInputBar
                value={input}
                onChange={setInput}
                onSend={handleSend}
                isLoading={isLoading}
                onQuickAction={(prompt) => setInput(prompt)}
              />

              <ContextBar
                modelCatalog={modelCatalog}
                onSend={handleSend}
                onStop={stop}
                isLoading={isLoading}
                canSend={!!input.trim()}
                className="border-t border-border-ink/30 pt-3"
              />
            </div>
          </div>
        </div>
      </div>

      <Bookmark onClick={handleOpenHistory} className="fixed right-3 top-1/2 -translate-y-1/2" />

      <HistorySidePanel
        isOpen={isHistoryOpen}
        onClose={closeHistory}
        activePages={activeHistoryPages}
        archivedPages={archivedHistoryPages}
        activeChatId={activeConversationId}
        onSelectChat={(id) => selectConversation(id)}
      />

      <AppMenuDrawer isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  );
}
