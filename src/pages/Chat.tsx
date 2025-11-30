import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { ChatInputBar } from "../components/chat/ChatInputBar";
import { ThemenBottomSheet } from "../components/chat/ThemenBottomSheet";
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
import { Loader2, Send, SlidersHorizontal, Square } from "../lib/icons";
import { getSamplingCapabilities } from "../lib/modelCapabilities";
import {
  Badge,
  Button,
  ChatStartCard,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  useToasts,
} from "../ui";

export default function Chat() {
  const toasts = useToasts();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeRole, setActiveRole, roles } = useRoles();
  const { settings, setPreferredModel, setCreativity, toggleNeko } = useSettings();
  const { isEnabled: memoryEnabled } = useMemory();
  const { stats } = useConversationStats();
  const [isQuickstartOpen, setIsQuickstartOpen] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);
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

  return (
    <div className="flex h-full min-h-[80vh] flex-col overflow-hidden rounded-none bg-bg-page">
      <h1 className="sr-only">Disa AI – Chat</h1>

      <div className="border-b border-border-ink/15 bg-bg-page/70 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-ink-primary">Aktuelle Unterhaltung</span>
            <span className="text-xs text-ink-tertiary">
              {activeRole ? activeRole.name : "Standard"} · {settings.preferredModelId}
            </span>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsContextOpen(true)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" /> Kontext
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsQuickstartOpen(true)}>
              Quickstart
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/chat/history")}
              className="hidden sm:inline-flex"
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

      <div className="flex flex-1 flex-col overflow-hidden">
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

        <div className="sticky bottom-0 border-t border-border-ink/20 bg-bg-page/95 px-3 pb-3 pt-2 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Badge variant="outline" className="text-[12px]">
              Modell: {settings.preferredModelId.split("/").pop()}
            </Badge>
            <Badge variant="outline" className="text-[12px]">
              Rolle: {activeRole ? activeRole.name : "Standard"}
            </Badge>
            <Badge variant="outline" className="text-[12px]">
              Kreativität: {settings.creativity}
            </Badge>
          </div>
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

      <Dialog open={isContextOpen} onOpenChange={setIsContextOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Kontext & Modelle</DialogTitle>
            <DialogDescription className="text-sm text-ink-secondary">
              Wähle Rolle, Modell und Kreativität für diese Unterhaltung.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink-primary">Rolle</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {roles.slice(0, 6).map((role) => (
                  <Button
                    key={role.id}
                    variant={activeRole?.id === role.id ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveRole(role)}
                  >
                    {role.name}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigate("/roles")}
                >
                  Weitere Rollen
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink-primary">Modell</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(modelCatalog || []).slice(0, 6).map((model) => (
                  <Button
                    key={model.id}
                    variant={settings.preferredModelId === model.id ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setPreferredModel(model.id)}
                  >
                    <span className="font-medium">{model.label ?? model.id}</span>
                    <span className="ml-auto text-xs text-ink-tertiary">{model.provider}</span>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigate("/models")}
                >
                  Alle Modelle
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-semibold text-ink-primary">
                <span>Kreativität</span>
                <span className="text-xs text-ink-secondary">{settings.creativity}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.creativity}
                onChange={(e) => setCreativity(Number(e.target.value))}
                className="w-full accent-accent-primary"
              />
            </div>

            <div className="rounded-xl border border-border-ink/20 bg-surface-1 px-3 py-2 text-sm text-ink-secondary">
              <label className="flex items-center gap-2 text-sm font-medium text-ink-primary">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={settings.enableNeko}
                  onChange={() => toggleNeko()}
                />
                Experimente (Neko) aktivieren
              </label>
              <p className="mt-1 text-xs text-ink-tertiary">
                Gimmicks sind jetzt optional. Standardmäßig ist die Oberfläche reduziert.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ThemenBottomSheet
        isOpen={isQuickstartOpen}
        onClose={() => setIsQuickstartOpen(false)}
        onStart={startWithPreset}
      />
    </div>
  );
}
