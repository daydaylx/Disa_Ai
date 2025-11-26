import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useToasts } from "@/ui";
import { ChatStartCard } from "@/ui/ChatStartCard";
import { SectionHeader } from "@/ui/SectionHeader";

import { ChatComposer } from "../components/chat/ChatComposer";
import { QuickstartGrid } from "../components/chat/QuickstartGrid";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import type { ModelEntry } from "../config/models";
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
import { History } from "../lib/icons";
import { getSamplingCapabilities } from "../lib/modelCapabilities";

export default function Chat() {
  const toasts = useToasts();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const composerContainerRef = useRef<HTMLDivElement>(null);
  const { activeRole, setActiveRole } = useRoles();
  const { settings } = useSettings();
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

  useConversationManager({
    messages,
    isLoading,
    setMessages,
    setCurrentSystemPrompt,
    onNewConversation: () => {},
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

  const startWithPreset = (system: string, user?: string) => {
    // Setze System-Prompt für nachfolgende Requests (unsichtbar für Nutzer)
    setCurrentSystemPrompt(system);

    // Trigger sofort den Start der Diskussion, wenn eine User-Nachricht vorliegt
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
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-1 text-[11px] font-semibold shadow-inset">
      • Memory aktiv
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-inset text-text-secondary px-2 py-1 text-[11px] font-semibold shadow-inset">
      • Kein Autosave
    </span>
  );

  import { Button } from "@/ui";

  // ... (inside component)

  const infoBar = (
    <div className="sticky top-0 z-20 mx-[var(--spacing-4)] mb-3 mt-2 rounded-md border border-surface-2 bg-surface-1/90 px-3 py-2 flex flex-wrap items-center gap-3 shadow-raise with-spine">
      <span className="text-xs font-semibold text-text-secondary">Kontext</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/models")}
        className="h-auto py-1 px-2 text-xs font-semibold text-text-primary bg-surface-inset hover:bg-surface-hover"
      >
        Modell: {settings.preferredModelId}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/settings/behavior")}
        className="h-auto py-1 px-2 text-xs font-semibold text-text-primary bg-surface-inset hover:bg-surface-hover"
      >
        Kreativität: {settings.creativity ?? 45}
      </Button>
      {activeRole && (
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-inset px-2 py-1 text-xs font-semibold text-text-primary min-h-[24px]">
          Rolle: {activeRole.name}
        </span>
      )}
      <div className="ml-auto">{memoryBadge}</div>
    </div>
  );

  return (
    <div className="relative flex flex-col text-text-primary h-full max-h-[100dvh] overflow-hidden">
      {!isEmpty && infoBar}
      {isEmpty ? (
        <div className="flex flex-col gap-[var(--spacing-4)] sm:gap-[var(--spacing-6)] px-[var(--spacing-4)] py-[var(--spacing-3)] sm:py-[var(--spacing-6)] overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <SectionHeader
              variant="compact"
              title="Chat-Start"
              subtitle="Starte eine neue Unterhaltung oder nutze vorgefertigte Workflows"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/chat/history")}
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

          <div className="rounded-lg bg-surface-inset/80 shadow-inset px-[var(--spacing-3)] py-[var(--spacing-3)]">
            <QuickstartGrid
              onStart={startWithPreset}
              title="Diskussionen"
              description="Vorbereitete Presets für schnelle Einstiege – tippe und starte direkt fokussiert."
            />
          </div>
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
                // If the retried message is a user message, retry from there
                const targetMsg = messages[messageIndex];
                if (targetMsg && targetMsg.role === "user") return messageIndex;
                // If it's an assistant message, find the preceding user message
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

              // Slice history up to (but not including) the user message we want to retry
              // The append function will add the user message back as a new message
              const historyContext = messages.slice(0, targetUserIndex);

              // Reset messages to this point immediately to prevent UI flicker
              setMessages(historyContext);

              void append({ role: "user", content: userMessage.content }, historyContext);
            }}
            className="h-full"
          />
        </div>
      )}

      <div className="sticky bottom-0 bg-gradient-to-t from-surface-base/95 to-transparent pt-[var(--spacing-4)] z-10">
        <div
          className="px-[var(--spacing-4)] safe-area-horizontal rounded-t-[18px] shadow-raise bg-surface-1/95 pb-[env(safe-area-inset-bottom)]"
          ref={composerContainerRef}
        >
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
