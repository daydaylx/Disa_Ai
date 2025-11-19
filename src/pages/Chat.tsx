import { useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useToasts } from "@/ui";
import { AppHeader } from "@/ui/AppHeader";
import { Button } from "@/ui/Button";
import { ChatStartCard } from "@/ui/ChatStartCard";
import { GlassCard } from "@/ui/GlassCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SectionHeader } from "@/ui/SectionHeader";
import { Typography } from "@/ui/Typography";

import { ChatComposer } from "../components/chat/ChatComposer";
import { QuickstartGrid } from "../components/chat/QuickstartGrid";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { useConversationStats } from "../hooks/use-storage";
import { useChat } from "../hooks/useChat";
import { useConversationManager } from "../hooks/useConversationManager";
import { useMemory } from "../hooks/useMemory";
import { useRoles } from "../hooks/useRoles";
import { useSettings } from "../hooks/useSettings";
import { MAX_PROMPT_LENGTH, validatePrompt } from "../lib/chat/validation";
import {
  BookOpenCheck,
  KeyRound,
  MessageCircle,
  Settings,
  Shield,
  Sparkles,
  Waves,
} from "../lib/icons";

export default function Chat() {
  const toasts = useToasts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const composerContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { activeRole } = useRoles();
  const { settings } = useSettings();
  const { isEnabled: memoryEnabled } = useMemory();
  const { stats } = useConversationStats();

  const {
    messages,
    append,
    isLoading,
    setMessages,
    input,
    setInput,
    stop,
    setCurrentSystemPrompt,
  } = useChat({
    onError: (error) => {
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: error.message || "Ein Fehler ist aufgetreten",
      });
    },
  });

  useConversationManager({
    messages,
    isLoading,
    setMessages,
    setCurrentSystemPrompt,
    onNewConversation: () => {},
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
      <AppHeader pageTitle="Chat" />
      {isEmpty ? (
        <div className="flex flex-col gap-4 sm:gap-6 px-[var(--spacing-4)] py-3 sm:py-[var(--spacing-6)]">
          <SectionHeader
            variant="compact"
            title="Chat-Start"
            subtitle="Starte eine neue Unterhaltung oder nutze vorgefertigte Workflows"
          />

          <ChatStartCard
            onNewChat={focusComposer}
            conversationCount={stats.totalConversations}
          />

          <QuickstartGrid
            onStart={startWithPreset}
            title="Fokus-Workflows"
            description="Vorbereitete Presets für Recherche, Schreiben und Pair Programming"
          />
        </div>
      ) : (
        <div
          className="flex-1 overflow-y-auto rounded-2xl border border-[color:var(--glass-border-soft)] bg-surface-panel/80 p-4 shadow-lg"
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
              console.warn("Retry functionality not implemented for messageId:", messageId);
            }}
            className="h-full"
          />
        </div>
      )}

      <div className="sticky bottom-0 bg-gradient-to-t from-surface-base to-transparent pt-4 z-10 safe-area-bottom">
        <div className="px-page-padding-x safe-area-horizontal" ref={composerContainerRef}>
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
