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

  return (
    <Card
      {...longPressReactHandlers}
      variant="surface"
      interactive
      notch="none"
      padding="none"
      className={cn(
        "relative group overflow-hidden border-white/[0.08]",
        "hover:border-white/[0.14] hover:bg-surface-2/65",
      )}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-accent-chat"
        aria-hidden
      />
      {/* Main Row */}
      <div className="flex items-center gap-4 p-4">
        {/* Icon */}
        <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-accent-chat-surface flex items-center justify-center text-accent-chat">
          <MessageSquare className="h-6 w-6" />
        </div>

        {/* Info - Clickable */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
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
          <h3 className="text-base font-semibold text-ink-primary truncate">
            {conversation.title || "Unbenannte Unterhaltung"}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-surface-2/70 px-2 py-0.5 text-[10px] text-ink-secondary border border-white/5">
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
            <span className="rounded-full bg-surface-2/70 px-2 py-0.5 text-[10px] text-ink-secondary border border-white/5">
              {conversation.messageCount ?? conversation.messages?.length ?? 0} Nachrichten
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpansion(conversation.id);
            }}
            className="inline-flex h-11 w-11 items-center justify-center gap-1 rounded-lg border-none bg-transparent text-xs text-ink-tertiary transition-colors hover:bg-surface-2/70 hover:text-ink-primary"
            aria-label={isExpanded ? "Verlaufsdetails einklappen" : "Verlaufsdetails ausklappen"}
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
            />
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="text-ink-secondary hover:text-status-error hover:bg-status-error/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(conversation.id).catch(console.error);
            }}
            title="Löschen"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && conversation.messages && conversation.messages.length > 0 && (
        <div className="px-4 pb-4 pt-0 animate-fade-in">
          <div className="space-y-2 rounded-xl border border-white/10 px-4 py-3 bg-surface-1/30">
            <p className="text-xs text-ink-tertiary font-medium mb-2">
              Nachrichten-Vorschau (letzte 3):
            </p>
            {conversation.messages.slice(-3).map((msg, idx) => (
              <div
                key={idx}
                className="text-xs bg-surface-2/50 rounded-lg p-2 border border-white/5"
              >
                <span
                  className={cn(
                    "font-medium",
                    msg.role === "user" ? "text-accent-chat" : "text-accent-models",
                  )}
                >
                  {msg.role === "user" ? "Du" : "Disa"}:
                </span>
                <p className="text-ink-secondary mt-1 line-clamp-2">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
