import React, { useEffect, useState } from "react";

import type { QuickstartAction } from "../../config/quickstarts";
import { getQuickstartsWithFallback } from "../../config/quickstarts";
import { getRoles } from "../../data/roles";
import { useQuickstartFlow } from "../../hooks/useQuickstartFlow";
import { useStickToBottom } from "../../hooks/useStickToBottom";
import { cn } from "../../lib/utils";
import { GlassBackdrop } from "../ui/GlassBackdrop";
import { GlassTile } from "../ui/GlassTile";
import type { ChatMessageType } from "./ChatMessage";
import { VirtualizedMessageList } from "./VirtualizedMessageList";

type QuickstartTone = "warm" | "cool" | "fresh" | "sunset" | "violet" | "default";
const toneFallbackOrder: ReadonlyArray<Exclude<QuickstartTone, "default">> = [
  "warm",
  "cool",
  "fresh",
  "sunset",
  "violet",
] as const;

const toneClassNameMap: Record<QuickstartTone, string> = {
  warm: "hover:border-amber-200/60 focus-visible:ring-amber-300/40",
  cool: "hover:border-sky-200/60 focus-visible:ring-sky-300/40",
  fresh: "hover:border-emerald-200/60 focus-visible:ring-emerald-300/40",
  sunset: "hover:border-orange-200/60 focus-visible:ring-orange-300/30",
  violet: "hover:border-fuchsia-200/60 focus-visible:ring-fuchsia-300/40",
  default: "hover:border-white/25 focus-visible:ring-white/30",
};

const isQuickstartTone = (value: unknown): value is QuickstartTone =>
  typeof value === "string" && value in toneClassNameMap;

const quickstartColorPresets = [
  {
    gradient: "from-amber-400/80 via-yellow-300/65 to-orange-400/70",
    glow: "shadow-[0_25px_70px_rgba(250,204,21,0.28)]",
    tone: "warm" as QuickstartTone,
  },
  {
    gradient: "from-sky-500/80 via-blue-500/65 to-indigo-500/70",
    glow: "shadow-[0_25px_70px_rgba(56,189,248,0.32)]",
    tone: "cool" as QuickstartTone,
  },
  {
    gradient: "from-emerald-400/75 via-teal-500/60 to-lime-500/60",
    glow: "shadow-[0_25px_70px_rgba(34,197,94,0.3)]",
    tone: "fresh" as QuickstartTone,
  },
  {
    gradient: "from-orange-500/80 via-amber-500/65 to-rose-500/60",
    glow: "shadow-[0_25px_70px_rgba(249,115,22,0.3)]",
    tone: "sunset" as QuickstartTone,
  },
  {
    gradient: "from-fuchsia-500/80 via-purple-500/65 to-violet-500/70",
    glow: "shadow-[0_25px_70px_rgba(168,85,247,0.32)]",
    tone: "violet" as QuickstartTone,
  },
];

const formatQuickstartTag = (tag: string) => {
  const normalised = tag.replace(/[-_]/g, " ");
  return normalised.charAt(0).toUpperCase() + normalised.slice(1);
};

function applyColorPresets(list: QuickstartAction[]): QuickstartAction[] {
  return list.map((action, index) => {
    const preset = quickstartColorPresets[index % quickstartColorPresets.length];
    if (!preset) return action;
    return {
      ...action,
      gradient: preset.gradient,
      glow: preset.glow,
      tone: preset.tone,
    };
  });
}

function createRoleQuickstarts(): QuickstartAction[] {
  const roles = getRoles();
  if (roles.length === 0) return [];

  const shuffled = [...roles].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, quickstartColorPresets.length).map((role) => ({
    id: `role-${role.id}`,
    title: role.name,
    subtitle: role.description ?? "Aktiviere diese Chat-Rolle und starte mit einer ersten Frage.",
    gradient: "", // Wird durch applyColorPresets überschrieben
    flowId: `role.${role.id}`,
    autosend: false,
    persona: role.id,
    prompt: `Starte ein Gespräch als ${role.name}.`,
    tags: role.tags,
    tone: "default",
  }));
}

interface ChatListProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onQuickstartFlow?: (prompt: string, autosend: boolean) => void;
  isQuickstartLoading?: boolean;
  currentModel?: string; // For analytics tracking
  className?: string;
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
}: ChatListProps) {
  const [quickstarts, setQuickstarts] = useState<QuickstartAction[]>([]);
  const [isLoadingQuickstarts, setIsLoadingQuickstarts] = useState(true);
  const [quickstartError, setQuickstartError] = useState<string | null>(null);
  const [activeQuickstart, setActiveQuickstart] = useState<string | null>(null);

  const { scrollRef, isSticking, scrollToBottom } = useStickToBottom({
    threshold: 0.8,
    enabled: true,
  });

  const { startQuickstartFlow } = useQuickstartFlow({
    onStartFlow: onQuickstartFlow || (() => {}),
    currentModel,
  });

  // Handle quickstart click with visual feedback
  const handleQuickstartClick = (action: QuickstartAction) => {
    setActiveQuickstart(action.id);
    startQuickstartFlow(action);
  };

  // Handle fallback to standard chat
  const handleStartStandardChat = () => {
    onQuickstartFlow?.("Hallo! Wie kann ich dir heute helfen?", false);
  };

  // Clear active state when not loading anymore
  React.useEffect(() => {
    if (!isQuickstartLoading) {
      setActiveQuickstart(null);
    }
  }, [isQuickstartLoading]);

  // Load quickstarts on mount
  useEffect(() => {
    const loadQuickstartActions = async () => {
      try {
        setIsLoadingQuickstarts(true);
        setQuickstartError(null);
        const roleQuickstarts = applyColorPresets(createRoleQuickstarts());

        if (roleQuickstarts.length > 0) {
          setQuickstarts(roleQuickstarts);
        } else {
          const actions = await getQuickstartsWithFallback();

          if (actions.length === 0) {
            setQuickstartError("Keine Schnellstarts verfügbar");
            console.warn("Quickstarts configuration is empty");
          } else {
            setQuickstarts(applyColorPresets(actions));
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
        setQuickstartError(`Fehler beim Laden der Schnellstarts: ${errorMessage}`);
        console.error("Failed to load quickstarts:", error);
      } finally {
        setIsLoadingQuickstarts(false);
      }
    };

    void loadQuickstartActions();
  }, []);

  const handleCopy = (content: string) => {
    onCopy?.(content);
    // Could add toast notification here
  };

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
            <div className="glass-strong relative overflow-hidden rounded-[28px] p-6">
              <div className="pointer-events-none absolute inset-x-0 -top-32 h-48 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_70%)]" />
              <div
                className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
                style={{
                  backgroundImage:
                    "radial-gradient(120% 120% at 110% 0%, rgba(20,104,255,0.45), transparent), radial-gradient(120% 120% at -10% 10%, rgba(236,72,153,0.55), transparent)",
                }}
              />
              <GlassBackdrop variant="panel" />
              <div className="relative">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-zinc-200">
                  Willkommen zurück
                </span>
                <h1 className="mb-3 text-[26px] font-semibold leading-tight text-zinc-100">
                  Was möchtest du heute erschaffen?
                </h1>
                <p className="text-[14px] leading-relaxed text-zinc-400">
                  Nutze die vorgeschlagenen Flows oder stelle einfach deine Frage. Disa AI reagiert
                  in Sekunden.
                </p>
              </div>
            </div>

            <div className="space-y-3 px-1">
              {isLoadingQuickstarts ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="tile flex min-h-[84px] animate-pulse flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-32 rounded bg-white/20"></div>
                      <div className="h-6 w-20 rounded-full bg-white/10"></div>
                    </div>
                    <div className="mt-1 h-3 w-full rounded bg-white/10"></div>
                  </div>
                ))
              ) : quickstartError ? (
                // Error/Empty state
                <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6 text-center">
                  <div className="mb-4">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        className="h-6 w-6 text-yellow-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833-.23 2.5 1.31 2.5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-100">
                      {quickstartError.includes("verfügbar")
                        ? "Keine Schnellstarts verfügbar"
                        : "Konfigurationsfehler"}
                    </h3>
                    <p className="mt-2 text-sm text-yellow-200/80">{quickstartError}</p>
                  </div>
                  <button
                    onClick={handleStartStandardChat}
                    className="tap-target inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-6 py-3 font-medium text-white shadow-[0_18px_38px_rgba(168,85,247,0.4)] transition-transform hover:translate-y-[-1px] hover:shadow-[0_20px_45px_rgba(168,85,247,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    data-testid="start-standard-chat"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.97 8.97 0 01-4.906-1.442l-3.657 1.082a1 1 0 01-1.28-1.28l1.082-3.657A8.97 8.97 0 013 12a8 8 0 1118 0z"
                      />
                    </svg>
                    Standard-Chat starten
                  </button>
                </div>
              ) : quickstarts.length === 0 ? (
                // No quickstarts but no error (shouldn't happen with defaults)
                <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6 text-center">
                  <div className="mb-4">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                      <svg
                        className="h-6 w-6 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-100">
                      Keine Schnellstarts verfügbar
                    </h3>
                    <p className="mt-2 text-sm text-blue-200/80">
                      Du kannst trotzdem direkt mit dem Chat beginnen.
                    </p>
                  </div>
                  <button
                    onClick={handleStartStandardChat}
                    className="tap-target inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-6 py-3 font-medium text-white shadow-[0_18px_38px_rgba(168,85,247,0.4)] transition-transform hover:translate-y-[-1px] hover:shadow-[0_20px_45px_rgba(168,85,247,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    data-testid="start-standard-chat"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.97 8.97 0 01-4.906-1.442l-3.657 1.082a1 1 0 01-1.28-1.28l1.082-3.657A8.97 8.97 0 113 12a8 8 0 1118 0z"
                      />
                    </svg>
                    Standard-Chat starten
                  </button>
                </div>
              ) : (
                quickstarts.map((action, index) => {
                  const isActive = activeQuickstart === action.id;
                  const fallbackTone =
                    toneFallbackOrder[index % toneFallbackOrder.length] ?? "default";
                  let tone: QuickstartTone = fallbackTone;
                  if (isQuickstartTone(action.tone)) {
                    tone = action.tone;
                  }
                  const primaryTag = action.tags?.[0];
                  const badgeLabel = primaryTag ? formatQuickstartTag(primaryTag) : "Schnellstart";

                  return (
                    <GlassTile
                      key={action.id}
                      data-testid={`quickstart-${action.id}`}
                      title={action.title}
                      subtitle={action.subtitle}
                      gradient={action.gradient}
                      glowClassName={action.glow}
                      onPress={() => handleQuickstartClick(action)}
                      disabled={isQuickstartLoading && !isActive}
                      className={toneClassNameMap[tone]}
                      badgeLabel={badgeLabel}
                      badgeTone={tone}
                    />
                  );
                })
              )}
            </div>

            {/* Suggestion Buttons */}
            <div className="space-y-2 px-1">
              <button
                onClick={() =>
                  onQuickstartFlow?.("Schreibe eine freundliche Antwort auf diese E-Mail", false)
                }
                className="glass w-full rounded-full px-6 py-3 text-[14px] text-zinc-200 transition-colors hover:bg-white/10 hover:text-zinc-100"
              >
                Schreibe eine freundliche Antwort auf diese E-Mail
              </button>
              <button
                onClick={() =>
                  onQuickstartFlow?.(
                    "Fasse den heutigen Kundencall in Stichpunkten zusammen",
                    false,
                  )
                }
                className="glass w-full rounded-full px-6 py-3 text-[14px] text-zinc-200 transition-colors hover:bg-white/10 hover:text-zinc-100"
              >
                Fasse den heutigen Kundencall in Stichpunkten zusammen
              </button>
              <button
                onClick={() =>
                  onQuickstartFlow?.("Entwirf eine Social-Media-Post-Idee zum Thema KI", false)
                }
                className="glass w-full rounded-full px-6 py-3 text-[14px] text-zinc-200 transition-colors hover:bg-white/10 hover:text-zinc-100"
              >
                Entwirf eine Social-Media-Post-Idee zum Thema KI
              </button>
            </div>
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

        {/* Scroll anchor and stick indicator */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="h-1 flex-1" />
          {!isSticking && (
            <button
              onClick={() => scrollToBottom()}
              className="glass inline-flex animate-bounce items-center gap-1 rounded-full px-3 py-1 text-xs text-zinc-300 transition hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Nach unten
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
