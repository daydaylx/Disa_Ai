import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useToasts } from "@/ui";
import { ChatStartCard } from "@/ui/ChatStartCard";
import { SectionHeader } from "@/ui/SectionHeader";

import { useStudio } from "../app/state/StudioContext";
import { ChatComposer } from "../components/chat/ChatComposer";
import { QuickstartGrid } from "../components/chat/QuickstartGrid";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import type { ModelEntry } from "../config/models";
import {
  getDiscussionMaxSentences,
  getDiscussionPreset,
  getDiscussionStrictMode,
} from "../config/settings";
import { useConversationStats } from "../hooks/use-storage";
import { useChat } from "../hooks/useChat";
import { useConversationManager } from "../hooks/useConversationManager";
import { useMemory } from "../hooks/useMemory";
import { useSettings } from "../hooks/useSettings";
import { MAX_PROMPT_LENGTH, validatePrompt } from "../lib/chat/validation";
import { mapCreativityToParams } from "../lib/creativity";
import { History } from "../lib/icons";
import { getSamplingCapabilities } from "../lib/modelCapabilities";
import { discussionPresets } from "../prompts/discussion/presets";

export default function Chat() {
  const toasts = useToasts();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const composerContainerRef = useRef<HTMLDivElement>(null);
  const { activeRole } = useStudio();
  const { settings } = useSettings();
  const { isEnabled: memoryEnabled } = useMemory();
  const { stats } = useConversationStats();
  const [modelCatalog, setModelCatalog] = useState<ModelEntry[] | null>(null);

  useEffect(() => {
    const isTestEnv = typeof (globalThis as any).vitest !== "undefined";
    if (typeof window === "undefined" || isTestEnv || typeof window.fetch === "undefined") return;
    import("../config/models")
      .then((mod) => mod.loadModelCatalog().then(setModelCatalog))
      .catch(() => setModelCatalog(null));
  }, []);

  const safetyPrompt = useMemo(
    () =>
      settings.showNSFWContent
        ? ""
        : "Content-Safety: Keine sexualisierten, verstörenden oder jugendgefährdenden Inhalte. Bleibe sachlich, respektvoll und filtere NSFW-Anfragen.",
    [settings.showNSFWContent],
  );

  const discussionPrompt = useMemo(() => {
    const preset = getDiscussionPreset();
    const presetStyle = discussionPresets[preset];
    const strict = getDiscussionStrictMode();
    const maxSentences = getDiscussionMaxSentences();
    const language = settings.language || "de";

    const parts = [
      `Antwortsprache: ${language}.`,
      presetStyle ? `Diskussionsstil: ${presetStyle}.` : "",
      `Begrenze Antworten auf maximal ${maxSentences} Sätze. Falls kürzere Antworten klarer sind, wähle prägnante Formulierungen.`,
      strict
        ? "Strenger Moderationsmodus: filtere riskante, hetzerische oder gesetzeswidrige Inhalte, antworte neutral und verweise respektvoll auf Richtlinien."
        : "",
    ].filter(Boolean);

    return parts.join(" ");
  }, [settings.language]);

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
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: error.message || "Ein Fehler ist aufgetreten",
      });
    },
  });

  useEffect(() => {
    const combinedPrompt = [safetyPrompt, discussionPrompt, activeRole?.systemPrompt]
      .filter(Boolean)
      .join("\n\n");
    setCurrentSystemPrompt(combinedPrompt || undefined);
  }, [activeRole?.systemPrompt, discussionPrompt, safetyPrompt, setCurrentSystemPrompt]);

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
  const memoryBadge = memoryEnabled ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-1 text-[11px] font-semibold shadow-inset">
      • Memory aktiv
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-inset text-text-secondary px-2 py-1 text-[11px] font-semibold shadow-inset">
      • Kein Autosave
    </span>
  );

  const infoBar = (
    <div className="sticky top-0 z-20 mx-[var(--spacing-4)] mb-3 mt-2 rounded-md border border-surface-2 bg-surface-1/90 backdrop-blur px-3 py-2 flex flex-wrap items-center gap-3 shadow-raise">
      <span className="text-xs font-semibold text-text-secondary">Kontext</span>
      <button
        type="button"
        onClick={() => navigate("/models")}
        className="inline-flex items-center gap-1 rounded-full bg-surface-inset px-2 py-1 text-xs font-semibold text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
      >
        Modell: {settings.preferredModelId}
      </button>
      <button
        type="button"
        onClick={() => navigate("/settings/filters")}
        className="inline-flex items-center gap-1 rounded-full bg-surface-inset px-2 py-1 text-xs font-semibold text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
      >
        Kreativität: {settings.creativity ?? 45}
      </button>
      {activeRole && (
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-inset px-2 py-1 text-xs font-semibold text-text-primary">
          Rolle: {activeRole.name}
        </span>
      )}
      <div className="ml-auto">{memoryBadge}</div>
    </div>
  );

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      {!isEmpty && infoBar}
      {isEmpty ? (
        <div className="flex flex-col gap-[var(--spacing-4)] sm:gap-[var(--spacing-6)] px-[var(--spacing-4)] py-[var(--spacing-3)] sm:py-[var(--spacing-6)]">
          <div className="flex items-start justify-between gap-3">
            <SectionHeader
              variant="compact"
              title="Chat-Start"
              subtitle="Starte eine neue Unterhaltung oder nutze vorgefertigte Workflows"
            />
            <button
              type="button"
              onClick={() => navigate("/chat/history")}
              className="inline-flex items-center gap-2 rounded-md border border-surface-2 bg-surface-1 px-3 py-2 text-sm font-medium text-text-secondary shadow-raise hover:text-text-primary hover:shadow-raiseLg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <History className="h-4 w-4" />
              Verlauf
            </button>
          </div>

          <ChatStartCard
            onNewChat={focusComposer}
            conversationCount={stats?.totalConversations || 0}
          />

          <div className="rounded-lg bg-surface-inset/80 shadow-inset px-[var(--spacing-3)] py-[var(--spacing-3)]">
            <QuickstartGrid
              onStart={startWithPreset}
              title="Fokus-Workflows"
              description="Vorbereitete Presets für Recherche, Schreiben und Pair Programming"
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
