import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";

import type { ChatMessageType } from "../../types";
import { Button } from "../ui/button";
import { MessageBubble as UIMessageBubble } from "../ui/MessageBubble";

export function MessageBubble({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  const variant = isUser ? "user" : "ai";

  return (
    <UIMessageBubble variant={variant}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-medium opacity-80">{isUser ? "Du" : "Disa AI"}</span>
        {message.timestamp && (
          <span className="text-xs opacity-60">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
      <div className="whitespace-pre-wrap">{message.content}</div>
      {!isUser && (
        <div className="flex items-center gap-2 mt-2">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ThumbsDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}
    </UIMessageBubble>
  );
}
