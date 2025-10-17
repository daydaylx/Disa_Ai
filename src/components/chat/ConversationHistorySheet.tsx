import { Clock, MessageSquare, Trash2 } from "lucide-react";

import type { Conversation } from "../../lib/conversation-manager";
import { formatRelativeTime } from "../../lib/formatRelativeTime";
import { cn } from "../../lib/utils";
import { BottomSheet } from "../ui/bottom-sheet";
import { Button } from "../ui/button";

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
          <div className="border-border bg-surface-1 rounded-lg border p-6 text-center">
            <div className="space-y-3">
              <div className="border-border bg-surface-2 mx-auto flex h-12 w-12 items-center justify-center rounded-full border">
                <MessageSquare className="text-text-1 h-6 w-6" />
              </div>
              <div>
                <p className="text-text-0 font-medium">Noch kein Verlauf gespeichert</p>
                <p className="text-text-1 mt-2 text-sm">
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
                      "border-border bg-surface-2 text-text-0 hover:bg-surface-1 rounded-lg border p-5 text-left transition-colors",
                      isActive && "ring-brand ring-2",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(conversation.id)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-text-0 text-sm font-semibold">{conversation.title}</p>
                          {isActive ? (
                            <span className="bg-brand/20 text-brand rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
                              Aktiv
                            </span>
                          ) : null}
                        </div>
                        <p
                          className="text-text-1 mt-2 text-xs"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {preview}
                        </p>
                        <div className="text-text-1 mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
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
                            <span className="text-text-1 inline-flex items-center gap-1">
                              Modell: {conversation.model}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(conversation.id);
                      }}
                      className="text-text-1 hover:bg-surface-2 absolute right-3 top-3 h-8 w-8 opacity-0 hover:text-danger group-hover:opacity-100"
                      aria-label="Konversation löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
