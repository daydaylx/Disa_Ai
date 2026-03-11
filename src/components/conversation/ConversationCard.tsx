import { useLongPress } from "@/hooks/useLongPress";
import { ChevronDown, MessageSquare, Trash2 } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button, Card } from "@/ui";

import type { Conversation } from "../../types";

interface ConversationCardProps {
  conversation: Conversation;
  isExpanded: boolean;
  onOpen: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleExpansion: (id: string) => void;
  onLongPress: () => void;
}

export function ConversationCard({
  conversation,
  isExpanded,
  onOpen,
  onDelete,
  onToggleExpansion,
  onLongPress,
}: ConversationCardProps) {
  // Long-Press Handler
  const { handlers: longPressHandlers } = useLongPress({
    onLongPress,
    delay: 500,
    enableHaptic: true,
  });

  // Wrap native handlers for React
  const longPressReactHandlers = {
    onTouchStart: (e: React.TouchEvent) => longPressHandlers.onTouchStart(e),
    onTouchMove: (e: React.TouchEvent) => longPressHandlers.onTouchMove(e),
    onTouchEnd: (e: React.TouchEvent) => longPressHandlers.onTouchEnd(e),
    onTouchCancel: () => longPressHandlers.onTouchCancel(),
    onMouseDown: (e: React.MouseEvent) => longPressHandlers.onMouseDown(e),
    onMouseMove: (e: React.MouseEvent) => longPressHandlers.onMouseMove(e),
    onMouseUp: (e: React.MouseEvent) => longPressHandlers.onMouseUp(e),
    onMouseLeave: () => longPressHandlers.onMouseLeave(),
  };
  const lastPreviewMessage = conversation.messages?.[conversation.messages.length - 1];

  return (
    <Card
      {...longPressReactHandlers}
      variant="surface"
      notch="none"
      padding="none"
      className={cn(
        "group relative overflow-hidden rounded-[24px] border-white/[0.10] bg-surface-1/82 shadow-[0_14px_34px_-28px_rgba(0,0,0,0.72)] ring-1 ring-inset ring-white/[0.04] backdrop-blur-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-surface-2/76 hover:shadow-[0_18px_44px_-32px_rgba(0,0,0,0.8)]",
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_26%,rgba(0,0,0,0.14)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[3px] rounded-l-[24px] bg-accent-chat"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 top-0 hidden h-24 w-24 rounded-full bg-white/[0.05] blur-3xl sm:block"
        aria-hidden
      />
      <div className="relative flex items-start gap-4 p-4 sm:p-5">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-accent-chat-border/40 bg-accent-chat-surface text-accent-chat shadow-inner">
          <MessageSquare className="h-6 w-6" />
        </div>

        <div
          className="min-w-0 flex-1 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-chat/40"
          onClick={() => void onOpen(conversation.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              void onOpen(conversation.id);
            }
          }}
        >
          <h3 className="truncate text-[15px] font-semibold tracking-tight text-ink-primary sm:text-base">
            {conversation.title || "Unbenannte Unterhaltung"}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-ink-secondary">
              {new Date(conversation.updatedAt || conversation.createdAt || "").toLocaleString(
                "de-DE",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}
            </span>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-ink-secondary">
              {conversation.messageCount ?? conversation.messages?.length ?? 0} Nachrichten
            </span>
          </div>
          {lastPreviewMessage?.content ? (
            <p className="mt-3 line-clamp-2 text-sm font-medium leading-relaxed text-ink-secondary">
              Zuletzt {lastPreviewMessage.role === "user" ? "von dir" : "von Disa"}:{" "}
              {lastPreviewMessage.content}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpansion(conversation.id);
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-black/[0.12] text-ink-tertiary shadow-inner transition-colors hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-ink-primary"
            aria-label={isExpanded ? "Verlaufsdetails einklappen" : "Verlaufsdetails ausklappen"}
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
            />
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-white/[0.08] bg-black/[0.12] text-ink-secondary shadow-inner hover:border-status-error/25 hover:bg-status-error/10 hover:text-status-error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(conversation.id).catch(console.error);
            }}
            title="Löschen"
            aria-label="Unterhaltung löschen"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isExpanded && conversation.messages && conversation.messages.length > 0 && (
        <div className="animate-fade-in px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
          <div className="space-y-3 rounded-[18px] border border-white/[0.06] bg-black/[0.10] px-4 py-4 shadow-inner sm:rounded-[20px] sm:bg-black/[0.16]">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-tertiary">
              Nachrichten-Vorschau (letzte 3):
            </p>
            {conversation.messages.slice(-3).map((msg, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-3 text-xs"
              >
                <span
                  className={cn(
                    "font-medium",
                    msg.role === "user" ? "text-accent-chat" : "text-accent-models",
                  )}
                >
                  {msg.role === "user" ? "Du" : "Disa"}:
                </span>
                <p className="mt-1 line-clamp-2 leading-relaxed text-ink-secondary">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
