import { useCallback, useEffect, useMemo, useRef } from "react";

import { useToasts } from "@/ui";
import { ChatStartCard } from "@/ui/ChatStartCard";
import { SectionHeader } from "@/ui/SectionHeader";

import { useStudio } from "../app/state/StudioContext";
import { ChatComposer } from "../components/chat/ChatComposer";
import { QuickstartGrid } from "../components/chat/QuickstartGrid";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { useConversationStats } from "../hooks/use-storage";
import { useChat } from "../hooks/useChat";
import { useConversationManager } from "../hooks/useConversationManager";
import { useMemory } from "../hooks/useMemory";
import { useSettings } from "../hooks/useSettings";
import { MAX_PROMPT_LENGTH, validatePrompt } from "../lib/chat/validation";

export default function Chat() {
  const toasts = useToasts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const composerContainerRef = useRef<HTMLDivElement>(null);
  const { activeRole } = useStudio();
  const { settings } = useSettings();
  const { isEnabled: memoryEnabled } = useMemory();
  const { stats } = useConversationStats();

  const safetyPrompt = useMemo(
    () =>
      settings.showNSFWContent
        ? ""
        : "Content-Safety: Keine sexualisierten, verstörenden oder jugendgefährdenden Inhalte. Bleibe sachlich, respektvoll und filtere NSFW-Anfragen.",
    [settings.showNSFWContent],
  );

  const requestOptions = useMemo(
    () => ({
      model: settings.preferredModelId,
    }),
    [settings.preferredModelId],
  );

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
  } = useChat({
    onError: (error) => {
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: error.message || "Ein Fehler ist aufgetreten",
      });
    },
  });

  useEffect(() => {
    const combinedPrompt = [safetyPrompt, activeRole?.systemPrompt].filter(Boolean).join("\n\n");
    setCurrentSystemPrompt(combinedPrompt || undefined);
  }, [activeRole?.systemPrompt, safetyPrompt, setCurrentSystemPrompt]);

  useEffect(() => {
    setRequestOptions(requestOptions);
  }, [requestOptions, setRequestOptions]);

  useConversationManager({
    messages,
    isLoading,
    setMessages,
    setCurrentSystemPrompt,
    onNewConversation: () => {},
    saveEnabled: memoryEnabled,
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

  const startWithPreset = (system: string, user?: string) => {
    void append({ role: "system", content: system });
    if (user) {
      void append({ role: "user", content: user });
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

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      {isEmpty ? (
        <div className="flex flex-col gap-[var(--spacing-4)] sm:gap-[var(--spacing-6)] px-[var(--spacing-4)] py-[var(--spacing-3)] sm:py-[var(--spacing-6)]">
          <SectionHeader
            variant="compact"
            title="Chat-Start"
            subtitle="Starte eine neue Unterhaltung oder nutze vorgefertigte Workflows"
          />

          <ChatStartCard
            onNewChat={focusComposer}
            conversationCount={stats?.totalConversations || 0}
          />

          <QuickstartGrid
            onStart={startWithPreset}
            title="Fokus-Workflows"
            description="Vorbereitete Presets für Recherche, Schreiben und Pair Programming"
          />
        </div>
      ) : (
        <div
          className="flex-1 overflow-y-auto mx-[var(--spacing-4)] rounded-md bg-surface-2 shadow-raise p-[var(--spacing-4)]"
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
            onRetry={(messageId) => {
              const messageIndex = messages.findIndex((m) => m.id === messageId);
              if (messageIndex === -1) return;

              const targetUserIndex = (() => {
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
              void append(
                { role: "user", content: userMessage.content },
                messages.slice(0, targetUserIndex),
              );
            }}
            className="h-full"
          />
        </div>
      )}

      <div className="sticky bottom-0 bg-gradient-to-t from-surface-base to-transparent pt-[var(--spacing-4)] pb-[calc(var(--spacing-4)+env(safe-area-inset-bottom))] z-10">
        <div className="px-[var(--spacing-4)] safe-area-horizontal" ref={composerContainerRef}>
          <ChatComposer
            value={input}
            onChange={setInput}
            onSend={handleSend}
            onStop={stop}
            isLoading={isLoading}
            canSend={!isLoading}
            placeholder="Nachricht an Disa AI schreiben..."
          />
        </div>
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}
