import { Copy, ThumbsDown, ThumbsUp } from "../../lib/icons";
import { cn } from "../../lib/utils";
import type { ChatMessageType } from "../../types";
import { Button } from "../ui/button";

export function MessageBubble({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  const wrapperClasses = cn("flex w-full", isUser ? "justify-end" : "justify-start");

  const baseClasses = [
    "max-w-[80%] rounded-2xl px-4 py-3 shadow-[var(--shadow-neumorphic-sm)] transition-colors",
  ];
  const variantClasses = isUser
    ? [
        "bg-[var(--acc2)]",
        "text-[var(--color-text-on-accent)]",
        "shadow-[var(--shadow-glow-accent-subtle)]",
      ]
    : [
        "bg-[var(--surface-neumorphic-base)]",
        "border border-[var(--border-neumorphic-subtle)]",
        "text-[var(--color-text-primary)]",
      ];
  const bubbleClasses = cn(...baseClasses, ...variantClasses);

  return (
    <div className={wrapperClasses} data-testid="message-bubble">
      <div className={bubbleClasses} data-testid="message-content">
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
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 min-h-[40px] min-w-[40px] touch-target" // Android-friendly size
              aria-label="Nachricht positiv bewerten"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 min-h-[40px] min-w-[40px] touch-target" // Android-friendly size
              aria-label="Nachricht negativ bewerten"
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 min-h-[40px] min-w-[40px] touch-target" // Android-friendly size
              aria-label="Nachricht kopieren"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
