import { Clock, MessageSquare, Trash2 } from "lucide-react";

import { useGlassPalette } from "../../hooks/useGlassPalette";
import type { Conversation } from "../../lib/conversation-manager";
import { formatRelativeTime } from "../../lib/formatRelativeTime";
import { DEFAULT_GLASS_VARIANTS, type GlassTint, gradientToTint } from "../../lib/theme/glass";
import { cn } from "../../lib/utils";
import { BottomSheet } from "../ui/bottom-sheet";
import { StaticGlassCard } from "../ui/StaticGlassCard";

interface ConversationHistorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const EMPTY_PREVIEW = "Starte eine Unterhaltung, um sie hier später wiederzufinden.";

export function ConversationHistorySheet({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelect,
  onDelete,
}: ConversationHistorySheetProps) {
  const cardPalette = useGlassPalette();

  const fallbackTint: GlassTint = {
    from: "hsla(220, 26%, 28%, 0.9)",
    to: "hsla(220, 30%, 20%, 0.78)",
  };

  const getTintForIndex = (index: number): GlassTint => {
    const gradients = cardPalette.length > 0 ? cardPalette : DEFAULT_GLASS_VARIANTS;
    const gradient = gradients[index % gradients.length];
    if (!gradient) {
      return fallbackTint;
    }
    return gradientToTint(gradient) ?? fallbackTint;
  };

  const activeTint = getTintForIndex(0);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Chat-Verlauf">
      <div className="max-h-[65vh] overflow-y-auto px-6 py-4">
        {conversations.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-zinc-300">
            <p className="font-medium text-zinc-100">Noch kein Verlauf gespeichert</p>
            <p className="mt-2 text-xs text-zinc-400">
              Unterhaltungen werden automatisch gesichert, sobald du Nachrichten austauschst.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {conversations.map((conversation, index) => {
              const messageCount = conversation.messageCount ?? conversation.messages?.length ?? 0;
              const lastMessage =
                conversation.messages?.[conversation.messages.length - 1]?.content ?? "";
              const lastActivity = conversation.lastActivity ?? conversation.updatedAt;
              const preview = lastMessage.trim() || EMPTY_PREVIEW;
              const isActive = conversation.id === activeId;
              const baseTint = getTintForIndex(index);
              const appliedTint = isActive ? activeTint : baseTint;

              return (
                <li key={conversation.id} className="group relative">
                  <StaticGlassCard
                    tint={appliedTint}
                    contrastOverlay={false}
                    padding="sm"
                    className={cn(
                      "px-5 py-4 text-left text-white",
                      isActive && "border-white/20 ring-2 ring-white/15",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(conversation.id)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{conversation.title}</p>
                          {isActive ? (
                            <span className="rounded-full border border-white/20 bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                              Aktiv
                            </span>
                          ) : null}
                        </div>
                        <p
                          className="mt-2 text-xs text-white/80"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {preview}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/80">
                          {Number.isFinite(lastActivity) ? (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {formatRelativeTime(lastActivity)}
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {messageCount} Nachricht{messageCount === 1 ? "" : "en"}
                          </span>
                          {conversation.model ? (
                            <span className="inline-flex items-center gap-1 text-white/70">
                              Modell: {conversation.model}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(conversation.id);
                      }}
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white opacity-80 transition-all duration-150 hover:bg-red-500/30 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black group-hover:opacity-100"
                      aria-label="Konversation löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </StaticGlassCard>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </BottomSheet>
  );
}
