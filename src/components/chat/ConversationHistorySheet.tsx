import { Clock, MessageSquare, Trash2 } from "lucide-react";

import type { Conversation } from "../../lib/conversation-manager";
import { formatRelativeTime } from "../../lib/formatRelativeTime";
import { cn } from "../../lib/utils";
import { BottomSheet } from "../ui/bottom-sheet";

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
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Chat-Verlauf">
      <div className="max-h-[65vh] overflow-y-auto px-6 py-4">
        {conversations.length === 0 ? (
          <div className="glass-card-secondary p-6 text-center">
            <div className="space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10">
                <MessageSquare className="h-6 w-6 text-white/70" />
              </div>
              <div>
                <p className="font-medium text-white">Noch kein Verlauf gespeichert</p>
                <p className="mt-2 text-sm text-white/70">
                  Unterhaltungen werden automatisch gesichert, sobald du Nachrichten austauschst.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {conversations.map((conversation) => {
              const messageCount = conversation.messageCount ?? conversation.messages?.length ?? 0;
              const lastMessage =
                conversation.messages?.[conversation.messages.length - 1]?.content ?? "";
              const lastActivity = conversation.lastActivity ?? conversation.updatedAt;
              const preview = lastMessage.trim() || EMPTY_PREVIEW;
              const isActive = conversation.id === activeId;

              return (
                <li key={conversation.id} className="group relative">
                  <div
                    className={cn(
                      "px-5 py-4 text-left text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]",
                      isActive ? "glass-card-primary" : "glass-card-secondary",
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
                            <span className="glass-card-tertiary rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
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
                      className="btn-danger absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100"
                      aria-label="Konversation löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </BottomSheet>
  );
}
