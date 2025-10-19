import { Clock, MessageSquare, Plus, Trash2 } from "lucide-react";

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
          <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-border bg-surface-1 p-6">
            <div className="max-w-xs space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-2">
                <MessageSquare className="h-8 w-8 text-text-1" />
              </div>
              <div className="space-y-2">
                <h3 className="typo-h5 text-text-0">Noch kein Verlauf gespeichert</h3>
                <p className="typo-body-sm text-text-1">
                  Unterhaltungen werden automatisch gesichert, sobald du Nachrichten austauschst.
                </p>
              </div>
              <Button variant="default" size="sm" onClick={onClose} className="mx-auto">
                <Plus className="h-4 w-4" />
                Erste Unterhaltung starten
              </Button>
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
                      "rounded-lg border border-border bg-surface-2 p-5 text-left text-text-0 transition-colors hover:bg-surface-1",
                      isActive && "ring-2 ring-brand",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(conversation.id)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-text-0">{conversation.title}</p>
                          {isActive ? (
                            <span className="rounded-full bg-brand/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand">
                              Aktiv
                            </span>
                          ) : null}
                        </div>
                        <p
                          className="mt-2 text-xs text-text-1"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {preview}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-1">
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
                            <span className="inline-flex items-center gap-1 text-text-1">
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
                      className="absolute right-3 top-3 h-8 w-8 text-text-1 opacity-0 hover:bg-surface-2 hover:text-danger group-hover:opacity-100"
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
