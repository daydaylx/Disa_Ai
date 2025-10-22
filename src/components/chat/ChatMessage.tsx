import { Bot, Copy, RotateCcw, User } from "lucide-react";
import { useState } from "react";

import { cn } from "../../lib/utils";
import type { ChatMessageType } from "../../types/chatMessage";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export type { ChatMessageType } from "../../types/chatMessage";

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
}

function CodeBlock({ children, language }: { children: string; language?: string }) {
  return (
    <div className="border-border bg-surface-2 relative my-4 overflow-hidden rounded-lg border">
      <div className="border-border flex items-center justify-between border-b px-4 py-2">
        <span className="text-text-1 text-xs font-medium uppercase tracking-wide">
          {language || "Text"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-text-1 hover:bg-surface-1 hover:text-text-0 h-8 w-8"
          onClick={() => void navigator.clipboard?.writeText(children)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-text-0 text-sm leading-relaxed">{children}</code>
      </pre>
    </div>
  );
}

function parseMessageContent(content: string) {
  const parts: Array<{ type: "text" | "code"; content: string; language?: string }> = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index);
      if (textContent.trim()) {
        parts.push({ type: "text", content: textContent });
      }
    }

    parts.push({
      type: "code",
      content: match[2] || "",
      language: match[1] || "text",
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const textContent = content.slice(lastIndex);
    if (textContent.trim()) {
      parts.push({ type: "text", content: textContent });
    }
  }

  return parts.length > 0 ? parts : [{ type: "text" as const, content }];
}

export function ChatMessage({ message, isLast, onRetry, onCopy }: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false);

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  const parsedContent = parseMessageContent(message.content);

  const bubbleClass = cn(
    "max-w-[85%] text-left",
    isUser && "ml-auto text-right",
    isSystem && "mx-auto max-w-[70%] text-center",
  );

  const handleCopy = () => {
    onCopy?.(message.content);
    void navigator.clipboard?.writeText(message.content);
  };

  const handleRetry = () => {
    onRetry?.(message.id);
  };

  return (
    <div
      className={cn(
        "group relative flex gap-3 px-3 py-5",
        isUser && "flex-row-reverse",
        isSystem && "justify-center opacity-70",
      )}
      data-testid="message.item"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={cn("relative", isSystem && "hidden")}>
        <Avatar className="border-border h-9 w-9 border">
          <AvatarFallback className={cn("bg-surface-2 text-text-0")}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className={cn("flex-1 space-y-2", isUser && "text-right", isSystem && "text-center")}>
        {!isSystem && (
          <div
            className={cn(
              "text-text-1 flex items-center gap-2 text-[13px]",
              isUser && "justify-end",
            )}
          >
            <span className="text-text-0 font-medium">{isUser ? "Ich" : "Assistent"}</span>
            {message.model && (
              <Badge variant="secondary" className="border-border bg-surface-1 text-text-1 text-xs">
                {message.model}
              </Badge>
            )}
            {message.tokens && (
              <Badge variant="outline" className="border-border text-text-1 text-xs">
                {message.tokens} Token
              </Badge>
            )}
            <span className="text-xs">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
        )}

        <div className={cn("border-border bg-surface-1 rounded-lg border", bubbleClass, "p-4")}>
          <div className="space-y-3">
            {parsedContent.map((part, index) => (
              <div key={index}>
                {part.type === "text" ? (
                  <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                    {part.content}
                  </div>
                ) : (
                  <CodeBlock language={part.language}>{part.content}</CodeBlock>
                )}
              </div>
            ))}
          </div>
        </div>

        {!isSystem && showActions && (
          <div
            className={cn(
              "flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
              isUser && "justify-end",
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-text-1 hover:bg-surface-1 hover:text-text-0 h-8 w-8"
              onClick={handleCopy}
              title="Nachricht kopieren"
              data-testid="message.copy"
            >
              <Copy className="h-3 w-3" />
            </Button>
            {isAssistant && isLast && onRetry && (
              <Button
                variant="ghost"
                size="icon"
                className="text-text-1 hover:bg-surface-1 hover:text-text-0 h-8 w-8"
                onClick={handleRetry}
                title="Antwort erneut anfordern"
                data-testid="message.retry"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
