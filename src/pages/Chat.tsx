import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { ChatInputBar } from "../components/chat/ChatInputBar";
import { ThemenBottomSheet } from "../components/chat/ThemenBottomSheet";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { Bookmark } from "../components/navigation/Bookmark";
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
import { Loader2, Send, Square } from "../lib/icons";
import { getSamplingCapabilities } from "../lib/modelCapabilities";
import {
  Badge,
  Button,
  ChatStartCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToasts,
} from "../ui";

export default function Chat() {
  const toasts = useToasts();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeRole, setActiveRole, roles } = useRoles();
  const { settings, setPreferredModel, setCreativity } = useSettings();
  const { isEnabled: memoryEnabled } = useMemory();
  const { stats } = useConversationStats();
  const [isQuickstartOpen, setIsQuickstartOpen] = useState(false);
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
    onError: (err) => {
      toasts.push(humanErrorToToast(err));
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

    void append({ role: "user", content: validation.sanitized }).catch((err: Error) => {
      toasts.push({
        kind: "error",
        title: "Senden fehlgeschlagen",
        message: err.message || "Die Nachricht konnte nicht gesendet werden.",
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
        void navigate("/chat", { replace: true });
      }
    }
  }, [searchParams, navigate, startWithPreset]);

  const inlineStatus = useMemo(() => {
    const statusBadges = [] as {
      label: string;
      variant: "default" | "secondary" | "destructive";
    }[];
    if (isLoading) statusBadges.push({ label: "Antwort läuft", variant: "secondary" });
    if (apiStatus === "rate_limited" || rateLimitInfo?.isLimited)
      statusBadges.push({ label: "Rate Limit aktiv", variant: "secondary" });
    if (apiStatus === "missing_key")
      statusBadges.push({ label: "API-Key fehlt", variant: "secondary" });
    if (apiStatus === "error" || error)
      statusBadges.push({ label: "Fehler", variant: "destructive" });
    return statusBadges;
  }, [apiStatus, error, isLoading, rateLimitInfo]);

  const isEmpty = messages.length === 0;

  const activeConversation = conversations?.find((c) => c.id === activeConversationId);

  const visibleRoles = roles.slice(0, 6);
  const modelOptions =
    (modelCatalog || []).slice(0, 6).length > 0
      ? (modelCatalog || []).slice(0, 6)
      : [
          {
            id: settings.preferredModelId,
            label: settings.preferredModelId,
            provider: settings.preferredModelId.split("/")[0],
          } as ModelEntry,
        ];
  const preferredModelLabel =
    modelCatalog?.find((model) => model.id === settings.preferredModelId)?.label ||
    settings.preferredModelId;

  return (
    <div className="relative min-h-[90vh] bg-bg-app">
      <Bookmark onClick={() => navigate("/chat/history")} className="top-4 sm:top-6" />
      <h1 className="sr-only">Disa AI – Chat</h1>

      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-3 pb-10 pt-6 sm:px-6">
        <div className="rounded-3xl border border-border-ink/15 bg-bg-page/80 px-4 py-3 shadow-md backdrop-blur sm:px-6">
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
                Aktuelle Seite
              </span>
              <span className="text-base font-semibold text-ink-primary">
                {activeConversation?.title || "Neue Unterhaltung"}
              </span>
              <span className="text-xs text-ink-secondary">
                {activeRole ? activeRole.name : "Standard"} · {preferredModelLabel}
              </span>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsQuickstartOpen(true)}>
                Quickstart
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => navigate("/chat/history")}
              >
                Verlauf
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  newConversation();
                  setInput("");
                }}
              >
                Neuer Chat
              </Button>
            </div>
          </div>
          {inlineStatus.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {inlineStatus.map((badge) => (
                <Badge key={badge.label} variant={badge.variant} className="text-[11px]">
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-border-ink/15 bg-bg-page/90 shadow-lg">
          <div className="flex-1 overflow-hidden rounded-[22px] border border-border-ink/10 bg-surface-1/80">
            <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-6">
              {isEmpty ? (
                <div className="flex h-full items-center justify-center">
                  <ChatStartCard
                    onNewChat={() => {
                      newConversation();
                      setInput("");
                    }}
                    conversationCount={stats?.totalConversations || 0}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-border-ink/10 bg-surface-1 shadow-sm">
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
            </div>
          </div>

          <div className="border-t border-border-ink/15 bg-bg-page/80 px-3 py-3 sm:px-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end sm:gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-ink-primary">Rolle</p>
                <Select
                  value={activeRole?.id ?? "default"}
                  onValueChange={(value) => {
                    if (value === "default") {
                      setActiveRole(null);
                      return;
                    }
                    const role = roles.find((r) => r.id === value);
                    if (role) setActiveRole(role);
                  }}
                >
                  <SelectTrigger aria-label="Rolle auswählen">
                    <SelectValue>{activeRole ? activeRole.name : "Standard"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Standard</SelectItem>
                    {visibleRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="__all_roles" disabled>
                      Weitere Rollen im Rollen-Menü
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-ink-primary">Modell</p>
                <Select
                  value={settings.preferredModelId}
                  onValueChange={(value) => setPreferredModel(value)}
                >
                  <SelectTrigger aria-label="Modell auswählen">
                    <SelectValue>{preferredModelLabel}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.label ?? model.id}
                      </SelectItem>
                    ))}
                    <SelectItem value="__all_models" disabled>
                      Alle Modelle im Modell-Menü
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-ink-primary">
                  <span>Kreativität</span>
                  <span className="text-[11px] text-ink-secondary">{settings.creativity}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.creativity}
                  onChange={(e) => setCreativity(Number(e.target.value))}
                  className="w-full accent-accent-primary"
                  aria-label="Kreativität einstellen"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border-ink/20 bg-bg-page/95 px-3 pb-3 pt-2 backdrop-blur sm:px-6">
            <div className="flex items-end gap-2">
              <ChatInputBar
                value={input}
                onChange={setInput}
                onSend={handleSend}
                isLoading={isLoading}
                className="flex-1"
              />
              <Button
                size="lg"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-12 w-14 rounded-xl"
                aria-label={isLoading ? "Antwort wird generiert" : "Nachricht senden"}
                data-testid="composer-send"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
              {isLoading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={stop}
                  className="h-12 w-12 rounded-xl"
                  aria-label="Antwort stoppen"
                >
                  <Square className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-ink-tertiary">
              <span>{activeConversation?.title || "Neue Unterhaltung"}</span>
              <Link to="/chat/history" className="text-ink-secondary underline">
                Verlauf öffnen
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ThemenBottomSheet
        isOpen={isQuickstartOpen}
        onClose={() => setIsQuickstartOpen(false)}
        onStart={startWithPreset}
      />
    </div>
  );
}
