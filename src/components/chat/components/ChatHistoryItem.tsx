import { Trash2 } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Typography } from "@/ui/Typography";

import type { Conversation } from "../../../lib/conversation-manager-modern";

interface ChatHistoryItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export function ChatHistoryItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: ChatHistoryItemProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      onSelect(conversation.id);
    }
  };

  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200",
        "hover:bg-surface-2",
        isActive
          ? "bg-accent-primary/10 border-l-2 border-accent-primary"
          : "border-l-2 border-transparent",
      )}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex-1 min-w-0 mr-2">
        <Typography variant="body-sm" className="font-medium truncate text-text-primary">
          {conversation.title || "Neue Konversation"}
        </Typography>
        <Typography variant="body-xs" className="text-text-secondary truncate">
          {new Date(conversation.updatedAt || conversation.createdAt || "").toLocaleDateString()}
          {" • "}
          {conversation.messageCount ?? conversation.messages?.length ?? 0} Nachrichten
        </Typography>
      </div>

      <button
        onClick={(e) => onDelete(e, conversation.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-text-secondary hover:text-status-error hover:bg-surface-3 transition-all focus:opacity-100"
        aria-label="Chat löschen"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
