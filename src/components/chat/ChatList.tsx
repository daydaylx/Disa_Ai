import { Clock, MessageSquare, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { QuickstartAction } from "../../config/quickstarts";
import { getQuickstartsWithFallback } from "../../config/quickstarts";
import { getRoles } from "../../data/roles";
import { useQuickstartFlow } from "../../hooks/useQuickstartFlow";
import { useStickToBottom } from "../../hooks/useStickToBottom";
import type { Conversation } from "../../lib/conversation-manager";
import { formatRelativeTime } from "../../lib/formatRelativeTime";
import { cn } from "../../lib/utils";
import type { ChatMessageType } from "../../types/chatMessage";
import { RoleCard } from "../studio/RoleCard";
import { Button } from "../ui/button";
import { ChatStatusBanner } from "./ChatStatusBanner";
import { VirtualizedMessageList } from "./VirtualizedMessageList";

const SUGGESTION_ACTIONS: Array<{ label: string; prompt: string }> = [
  {
    label: "Schreibe eine freundliche Antwort auf diese E-Mail",
    prompt: "Schreibe eine freundliche Antwort auf diese E-Mail",
  },
  {
    label: "Fasse den heutigen Kundencall in Stichpunkten zusammen",
    prompt: "Fasse den heutigen Kundencall in Stichpunkten zusammen",
  },
  {
    label: "Entwirf eine Social-Media-Post-Idee zum Thema KI",
    prompt: "Entwirf eine Social-Media-Post-Idee zum Thema KI",
  },
];

const QUICKSTART_FALLBACK_SUBTITLE =
  "Starte mit einer vorgefertigten Idee und komm sofort ins Schreiben.";

function formatQuickstartTag(tag: string) {
  const normalised = tag.replace(/[-_]/g, " ");
  return normalised.charAt(0).toUpperCase() + normalised.slice(1);
}

function createRoleQuickstarts(): QuickstartAction[] {
  const roles = getRoles();
  if (roles.length === 0) return [];
  return [...roles]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((role) => ({
      id: `role-${role.id}`,
      title: role.name,
      subtitle: role.description ?? "Aktiviere diese Chat-Rolle und starte mit einer ersten Frage.",
      gradient: "from-brand/20 via-brand/0 to-brand/5",
      flowId: `role.${role.id}`,
      autosend: false,
      persona: role.id,
      prompt: `Starte ein Gespräch als ${role.name}.`,
      tags: role.tags,
    }));
}

interface ChatListProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onQuickstartFlow?: (prompt: string, autosend: boolean) => void;
  isQuickstartLoading?: boolean;
  currentModel?: string;
  className?: string;
  conversations?: Conversation[];
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  onShowHistory?: () => void;
  activeConversationId?: string | null;
}

export function ChatList({
  messages,
  isLoading,
  onRetry,
  onCopy,
  onQuickstartFlow,
  isQuickstartLoading,
  currentModel,
  className,
  conversations = [],
  onSelectConversation,
  onDeleteConversation,
  onShowHistory,
  activeConversationId,
}: ChatListProps) {
  const [quickstarts, setQuickstarts] = useState<QuickstartAction[]>([]);
  const [isLoadingQuickstarts, setIsLoadingQuickstarts] = useState(true);
  const [quickstartError, setQuickstartError] = useState<Error | null>(null);
  const [activeQuickstart, setActiveQuickstart] = useState<string | null>(null);

  const { startQuickstartFlow } = useQuickstartFlow({
    onStartFlow: onQuickstartFlow || (() => {}),
    currentModel,
  });

  const { scrollRef, isSticking, scrollToBottom } = useStickToBottom({
    threshold: 0.9,
    enabled: true,
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadQuickstartData = useCallback(async () => {
    setIsLoadingQuickstarts(true);
    setQuickstartError(null);

    let fallbackReason: "empty" | "error" | null = null;
    let fallbackError: Error | null = null;

    try {
      const actions = await getQuickstartsWithFallback({
        onFallback: ({ reason, error }) => {
          fallbackReason = reason;
          if (reason === "empty") {
            fallbackError = new Error(
              "Keine Schnellstarts verfügbar. Wir zeigen alternative Rollen.",
            );
          } else if (reason === "error") {
            fallbackError =
              error instanceof Error
                ? error
                : new Error(error ? String(error) : "Fehler beim Laden der Schnellstarts.");
          }
        },
      });

      if (!isMountedRef.current) return;

      if (fallbackReason) {
        setQuickstartError(fallbackError);
        if (fallbackReason === "error") {
          setQuickstarts(createRoleQuickstarts());
        } else {
          setQuickstarts(actions.length > 0 ? actions : createRoleQuickstarts());
        }
      } else {
        setQuickstartError(null);
        setQuickstarts(actions);
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      const fallback =
        error instanceof Error
          ? error
          : new Error(error ? String(error) : "Fehler beim Laden der Schnellstarts.");
      setQuickstartError(fallback);
      setQuickstarts(createRoleQuickstarts());
    } finally {
      if (isMountedRef.current) {
        setIsLoadingQuickstarts(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadQuickstartData();
  }, [loadQuickstartData]);

  const handleQuickstartReload = useCallback(() => {
    void loadQuickstartData();
  }, [loadQuickstartData]);

  const handleQuickstartClick = (action: QuickstartAction) => {
    setActiveQuickstart(action.id);
    startQuickstartFlow(action);
  };

  const handleStartStandardChat = () => {
    onQuickstartFlow?.("Hallo! Wie kann ich dir heute helfen?", false);
  };

  const handleCopy = (content: string) => {
    onCopy?.(content);
  };

  const recentConversations = useMemo(() => conversations.slice(0, 4), [conversations]);

  return (
    <div
      ref={scrollRef}
      className={cn("scroll-smooth px-1 pb-16", className)}
      role="log"
      aria-label="Chat messages"
      data-testid="chat-log"
    >
      <div className="mx-auto flex w-full max-w-md flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-5 px-1 py-3">
            <div className="brand-panel space-y-4 p-6">
              <span className="brand-chip w-fit">Disa&nbsp;AI Studio</span>
              <h1 className="text-text-primary text-2xl font-semibold leading-tight">
                Was möchtest du heute erschaffen?
              </h1>
              <p className="text-text-secondary text-sm leading-relaxed">
                Nutze die vorgeschlagenen Flows oder stelle einfach deine Frage. Disa AI reagiert in
                Sekunden.
              </p>
              <Button onClick={handleStartStandardChat} className="w-full" variant="brand">
                Neues Gespräch beginnen
              </Button>
            </div>

            <div className="space-y-3 px-1">
              {isLoadingQuickstarts ? (
                <div className="grid gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card
                      key={`quickstart-skeleton-${index}`}
                      className="border-border animate-pulse rounded-lg border p-4"
                    >
                      <div className="bg-surface-subtle h-4 w-32 rounded" />
                      <div className="bg-surface-subtle mt-2 h-3 w-48 rounded" />
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {quickstartError ? (
                    <div className="space-y-3">
                      <ChatStatusBanner
                        error={quickstartError}
                        onRetry={handleQuickstartReload}
                        className="px-3"
                      />
                      <Button
                        onClick={handleStartStandardChat}
                        className="w-full"
                        variant="brand"
                        data-testid="start-standard-chat"
                      >
                        Direkt im Chat starten
                      </Button>
                    </div>
                  ) : null}

                  {quickstarts.length === 0 ? (
                    <Card className="border-border rounded-lg border p-6 text-center">
                      <h3 className="text-text-primary text-lg font-semibold">
                        Keine Schnellstarts verfügbar
                      </h3>
                      <p className="text-text-secondary mt-2 text-sm">
                        Wir konnten keine Schnellstarts laden. Versuche es später erneut oder starte
                        direkt einen Chat.
                      </p>
                      <Button onClick={handleQuickstartReload} className="mt-4" variant="secondary">
                        Erneut laden
                      </Button>
                    </Card>
                  ) : (
                    quickstarts.map((action) => {
                      const badge = action.tags?.[0]
                        ? formatQuickstartTag(action.tags[0]!)
                        : "Schnellstart";

                      return (
                        <RoleCard
                          key={action.id}
                          data-testid={`quickstart-${action.id}`}
                          title={action.title}
                          description={action.subtitle ?? QUICKSTART_FALLBACK_SUBTITLE}
                          badge={badge}
                          isActive={activeQuickstart === action.id}
                          disabled={isQuickstartLoading && activeQuickstart !== action.id}
                          onClick={() => handleQuickstartClick(action)}
                          className="min-h-[140px]"
                        />
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 px-1">
              {SUGGESTION_ACTIONS.map((item) => {
                return (
                  <Card
                    key={item.label}
                    className="border-border hover:bg-surface-subtle rounded-lg border p-4 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => onQuickstartFlow?.(item.prompt, false)}
                      className="text-text-primary flex w-full items-center justify-between gap-3 text-sm font-medium transition-colors"
                    >
                      <span className="text-left">{item.label}</span>
                      <MessageSquare className="text-text-secondary h-4 w-4" />
                    </button>
                  </Card>
                );
              })}
            </div>

            {recentConversations.length > 0 && (
              <div className="space-y-3 px-1 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
                    Letzte Chats
                  </h2>
                  {onShowHistory && (
                    <button
                      type="button"
                      onClick={onShowHistory}
                      className="text-text-secondary hover:text-text-primary text-xs font-medium transition-colors"
                    >
                      Alle ansehen
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {recentConversations.map((conversation) => {
                    const isActive = activeConversationId === conversation.id;
                    const messageCount =
                      conversation.messageCount ?? conversation.messages?.length ?? 0;
                    const lastMessage =
                      conversation.messages?.[conversation.messages.length - 1]?.content ?? "";
                    const preview = lastMessage.trim() || "Noch keine Nachrichten gespeichert.";
                    const lastActivityString = conversation.lastActivity ?? conversation.updatedAt;
                    const lastActivity = new Date(lastActivityString).getTime();

                    return (
                      <Card
                        key={conversation.id}
                        className={cn(
                          "border-border hover:bg-surface-subtle group relative flex items-start gap-3 rounded-lg border p-4 transition-colors",
                          isActive && "ring-brand ring-2",
                        )}
                      >
                        <button
                          type="button"
                          className="flex-1 text-left"
                          onClick={() => onSelectConversation?.(conversation.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-text-primary text-sm font-semibold">
                              {conversation.title}
                            </span>
                          </div>
                          <p
                            className="text-text-secondary mt-1 text-xs"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {preview}
                          </p>
                          <div className="text-text-secondary mt-3 flex flex-wrap items-center gap-3 text-xs">
                            {Number.isFinite(lastActivity) && (
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatRelativeTime(lastActivity)}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <MessageSquare className="h-3.5 w-3.5" />
                              {messageCount} Nachricht{messageCount === 1 ? "" : "en"}
                            </span>
                          </div>
                        </button>
                        {onDeleteConversation && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteConversation(conversation.id)}
                            className="text-text-secondary hover:bg-surface-subtle hover:text-danger absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100"
                            aria-label="Verlauf löschen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1">
            <VirtualizedMessageList
              messages={messages}
              onRetry={onRetry}
              onCopy={handleCopy}
              isLoading={isLoading}
            />
          </div>
        )}

        <div className="flex items-center justify-between px-2 pt-2">
          <div className="h-1 flex-1" />
          {!isSticking && (
            <Button variant="outline" size="sm" onClick={() => scrollToBottom()}>
              <span>Nach unten</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
