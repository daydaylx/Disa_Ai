import { Clock, MessageSquare, Trash2 } from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useState } from "react";

import type { QuickstartAction } from "../../config/quickstarts";
import { getQuickstartsWithFallback } from "../../config/quickstarts";
import { getRoles } from "../../data/roles";
import { useGlassPalette } from "../../hooks/useGlassPalette";
import { useQuickstartFlow } from "../../hooks/useQuickstartFlow";
import { useStickToBottom } from "../../hooks/useStickToBottom";
import type { Conversation } from "../../lib/conversation-manager";
import { formatRelativeTime } from "../../lib/formatRelativeTime";
import { FRIENDLY_TINTS, type GlassTint } from "../../lib/theme/glass";
import { cn } from "../../lib/utils";
import type { ChatMessageType } from "../../types/chatMessage";
import { RoleCard } from "../studio/RoleCard";
import { VirtualizedMessageList } from "./VirtualizedMessageList";

const QUICKSTART_TINTS: GlassTint[] = FRIENDLY_TINTS;

const QUICKSTART_GRADIENTS = [
  "from-rose-400/70 via-orange-300/60 to-amber-300/50",
  "from-sky-400/70 via-indigo-300/60 to-purple-300/50",
  "from-emerald-400/70 via-teal-300/60 to-cyan-300/50",
  "from-fuchsia-400/70 via-pink-400/60 to-violet-300/50",
  "from-blue-400/70 via-sky-300/60 to-cyan-200/50",
  "from-amber-300/70 via-orange-300/60 to-rose-400/50",
] as const;

type CardTintStyle = CSSProperties & {
  "--card-tint-from"?: string;
  "--card-tint-to"?: string;
};

const HERO_CARD_TINT: CardTintStyle = {
  "--card-tint-from": "rgba(249, 168, 212, 0.35)",
  "--card-tint-to": "rgba(129, 140, 248, 0.3)",
};

const QUICKSTART_ERROR_TINT: CardTintStyle = {
  "--card-tint-from": "rgba(96, 165, 250, 0.32)",
  "--card-tint-to": "rgba(59, 130, 246, 0.26)",
};

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
    .slice(0, QUICKSTART_TINTS.length)
    .map((role, index) => ({
      id: `role-${role.id}`,
      title: role.name,
      subtitle: role.description ?? "Aktiviere diese Chat-Rolle und starte mit einer ersten Frage.",
      flowId: `role.${role.id}`,
      autosend: false,
      persona: role.id,
      prompt: `Starte ein Gespräch als ${role.name}.`,
      tags: role.tags,
      gradient:
        QUICKSTART_GRADIENTS[index % QUICKSTART_GRADIENTS.length] ?? QUICKSTART_GRADIENTS[0],
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
  const [quickstartError, setQuickstartError] = useState<string | null>(null);
  const [activeQuickstart, setActiveQuickstart] = useState<string | null>(null);

  const palette = useGlassPalette();
  const friendlyPalette = palette.length > 0 ? palette : QUICKSTART_TINTS;

  const { startQuickstartFlow } = useQuickstartFlow({
    onStartFlow: onQuickstartFlow || (() => {}),
    currentModel,
  });

  const { scrollRef, isSticking, scrollToBottom } = useStickToBottom({
    threshold: 0.9,
    enabled: true,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoadingQuickstarts(true);
        setQuickstartError(null);
        const actions = await getQuickstartsWithFallback();
        if (!mounted) return;
        if (actions.length > 0) {
          setQuickstarts(actions);
        } else {
          setQuickstarts(createRoleQuickstarts());
        }
      } catch (error) {
        if (!mounted) return;
        const message = error instanceof Error ? error.message : "Unbekannter Fehler";
        setQuickstartError(message);
        setQuickstarts(createRoleQuickstarts());
      } finally {
        if (mounted) {
          setIsLoadingQuickstarts(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
            <div className="glass-card tinted space-y-4 p-6" style={HERO_CARD_TINT}>
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-gradient-to-r from-rose-400/35 via-orange-300/30 to-amber-200/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_6px_18px_rgba(249,168,212,0.35)] backdrop-blur-sm">
                  Willkommen zurück
                </span>
                <h1 className="text-[26px] font-semibold leading-tight text-white">
                  Was möchtest du heute erschaffen?
                </h1>
                <p className="text-[14px] leading-relaxed text-white/85">
                  Nutze die vorgeschlagenen Flows oder stelle einfach deine Frage. Disa AI reagiert
                  in Sekunden.
                </p>
              </div>
              <button
                type="button"
                onClick={handleStartStandardChat}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-gradient-to-r from-rose-400/25 via-orange-300/20 to-amber-200/20 px-5 py-3 text-sm font-medium text-white shadow-[0_16px_40px_rgba(250,204,171,0.35)] backdrop-blur-md transition-all duration-200 hover:-translate-y-[1px] hover:brightness-110 active:scale-[0.98]"
              >
                Neues Gespräch beginnen
              </button>
            </div>

            <div className="space-y-3 px-1">
              {isLoadingQuickstarts ? (
                <div className="grid gap-3">
                  {Array.from({ length: 4 }).map((_, index) => {
                    return (
                      <div
                        key={`quickstart-skeleton-${index}`}
                        className="glass-card animate-pulse p-4"
                      >
                        <div className="h-4 w-32 rounded bg-white/25" />
                        <div className="mt-2 h-3 w-48 rounded bg-white/20" />
                      </div>
                    );
                  })}
                </div>
              ) : quickstartError ? (
                <div className="glass-card tinted p-6 text-center" style={QUICKSTART_ERROR_TINT}>
                  <div className="bg-white/12 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833-.23 2.5 1.31 2.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {quickstartError.includes("verfügbar")
                      ? "Keine Schnellstarts verfügbar"
                      : "Konfigurationsfehler"}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">{quickstartError}</p>
                  <button
                    type="button"
                    onClick={handleStartStandardChat}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium text-white"
                    data-testid="start-standard-chat"
                  >
                    Direkt im Chat starten
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {quickstarts.map((action, index) => {
                    const badge = action.tags?.[0]
                      ? formatQuickstartTag(action.tags[0]!)
                      : "Schnellstart";
                    const tint =
                      friendlyPalette[index % friendlyPalette.length] ?? FRIENDLY_TINTS[0]!;

                    return (
                      <RoleCard
                        key={action.id}
                        data-testid={`quickstart-${action.id}`}
                        title={action.title}
                        description={action.subtitle ?? QUICKSTART_FALLBACK_SUBTITLE}
                        badge={badge}
                        tint={tint}
                        isActive={activeQuickstart === action.id}
                        disabled={isQuickstartLoading && activeQuickstart !== action.id}
                        onClick={() => handleQuickstartClick(action)}
                        className="min-h-[140px]"
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2 px-1">
              {SUGGESTION_ACTIONS.map((item) => {
                return (
                  <div
                    key={item.label}
                    className="glass-card tinted group p-4 transition-all duration-200 hover:-translate-y-[1px]"
                  >
                    <button
                      type="button"
                      onClick={() => onQuickstartFlow?.(item.prompt, false)}
                      className="flex w-full items-center justify-between gap-3 text-sm font-medium text-white transition-colors"
                    >
                      <span className="text-left">{item.label}</span>
                      <MessageSquare className="h-4 w-4 opacity-75 transition-all group-hover:scale-110 group-hover:opacity-100" />
                    </button>
                  </div>
                );
              })}
            </div>

            {recentConversations.length > 0 && (
              <div className="space-y-3 px-1 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    Letzte Chats
                  </h2>
                  {onShowHistory && (
                    <button
                      type="button"
                      onClick={onShowHistory}
                      className="text-[12px] font-medium text-white/80 transition hover:text-white"
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
                    const lastActivity = conversation.lastActivity ?? conversation.updatedAt;

                    return (
                      <div
                        key={conversation.id}
                        className={cn(
                          "glass-card group relative flex items-start gap-3 p-4 transition-all duration-200 hover:-translate-y-[1px]",
                          isActive && "shadow-glass-strong ring-2 ring-white/25",
                        )}
                      >
                        <button
                          type="button"
                          className="flex-1 text-left"
                          onClick={() => onSelectConversation?.(conversation.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">
                              {conversation.title}
                            </span>
                          </div>
                          <p
                            className="mt-1 text-xs text-white/80"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {preview}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-white/75">
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
                          <button
                            type="button"
                            onClick={() => onDeleteConversation(conversation.id)}
                            className="bg-white/8 relative z-10 mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-red-400/40 hover:bg-red-500/25 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent group-hover:opacity-100"
                            aria-label="Verlauf löschen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
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
            <button
              type="button"
              onClick={() => scrollToBottom()}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80 shadow-[0_10px_24px_-14px_rgba(8,11,28,0.7)] transition hover:-translate-y-[1px]"
            >
              <span>Nach unten</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
