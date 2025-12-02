import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
import { useConversationHistory } from "../hooks/useConversationHistory";
import { useConversationManager } from "../hooks/useConversationManager";
import { useMemory } from "../hooks/useMemory";
import { useSettings } from "../hooks/useSettings";
import { buildSystemPrompt } from "../lib/chat/prompt-builder";
import { MAX_PROMPT_LENGTH, validatePrompt } from "../lib/chat/validation";
import { mapCreativityToParams } from "../lib/creativity";
import { humanErrorToToast } from "../lib/errors/humanError";
import { History, Plus } from "../lib/icons";
import { getSamplingCapabilities } from "../lib/modelCapabilities";

export default function Chat() {
  const toasts = useToasts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeRole, setActiveRole } = useRoles();
  const { settings } = useSettings();

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

  const { activeConversationId, newConversation, conversations } = useConversationManager({
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
  }, [newConversation, setInput]);

  const handleOpenHistory = useCallback(() => {
    void navigate("/chat/history");
  }, [navigate]);

  const hasActiveConversation = !!activeConversationId;
  const isEmpty = !hasActiveConversation && messages.length === 0;

  return (
    <div className="relative flex min-h-[calc(var(--vh,1vh)*100)] flex-col bg-bg-page text-text-primary">
      <h1 className="sr-only">Disa AI – Chat</h1>

      <div className="border-b border-border-ink/40 bg-surface-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              Aktive Unterhaltung
            </p>
            <p className="text-lg font-semibold text-text-primary truncate">
              {activeConversation?.title || "Neue Unterhaltung"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Verlauf öffnen"
              onClick={handleOpenHistory}
              className="hidden sm:inline-flex"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Verlauf öffnen"
              onClick={handleOpenHistory}
              className="sm:hidden"
            >
              <History className="h-4 w-4" />
            </Button>
            {!isEmpty && (
              <>
                <Button
                  variant="primary"
                  size="default"
                  onClick={handleStartNewChat}
                  className="hidden sm:inline-flex"
                  aria-label="Neuen Chat beginnen"
                >
                  <Plus className="h-4 w-4" />
                  <span className="ml-2">Neuer Chat</span>
                </Button>
                <Button
                  variant="primary"
                  size="icon"
                  onClick={handleStartNewChat}
                  className="sm:hidden"
                  aria-label="Neuen Chat beginnen"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <ChatStatusBanner status={apiStatus} error={error} rateLimitInfo={rateLimitInfo} />

      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-6 sm:py-4">
          {isEmpty ? (
            <ChatStartCard
              onNewChat={handleStartNewChat}
              conversationCount={stats?.totalConversations ?? conversationCount}
            />
          ) : (
            <div className="relative flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-border-ink/40 bg-surface-2 shadow-sm">
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

        {!isEmpty && (
          <div className="border-t border-border-ink/40 bg-surface-2/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md sm:px-6 sm:py-4">
            <div className="mx-auto w-full max-w-4xl space-y-3">
              <ContextBar
                modelCatalog={modelCatalog}
                onSend={handleSend}
                onStop={stop}
                isLoading={isLoading}
                canSend={!!input.trim()}
                className="border-b border-border-ink/30 pb-3"
              />

              <ChatInputBar
                value={input}
                onChange={setInput}
                onSend={handleSend}
                isLoading={isLoading}
                onQuickAction={(prompt) => setInput(prompt)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
