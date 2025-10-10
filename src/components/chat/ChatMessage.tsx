import { Bot, Copy, RotateCcw, User } from "lucide-react";
import { useState } from "react";

import { useStudio } from "../../app/state/StudioContext";
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
    <div className="relative my-4 overflow-hidden">
      <div className="glass-card-tertiary space-y-0 p-4">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-xs font-medium uppercase tracking-wide text-white/70">
            {language || "Text"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="btn-ghost h-6 w-6 rounded-full p-0"
            onClick={() => void navigator.clipboard?.writeText(children)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        <pre className="overflow-x-auto">
          <code className="text-sm leading-relaxed text-white/95">{children}</code>
        </pre>
      </div>
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
  const { accentColor } = useStudio();

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  const parsedContent = parseMessageContent(message.content);

  const bubbleClass = cn(
    "max-w-[85%] text-left p-4 rounded-lg",
    isUser ? "glass-card-primary ml-auto text-right" : "glass-card-secondary",
    isSystem && "glass-card-tertiary mx-auto max-w-[70%] text-center",
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
        "group relative flex gap-3 px-3 py-5 transition-all duration-200",
        isUser && "flex-row-reverse",
        isSystem && "justify-center opacity-70",
      )}
      data-testid="message.item"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isSystem && (
        <div className="relative">
          <Avatar className="h-9 w-9 border border-white/15 shadow-[0_8px_24px_rgba(15,23,42,0.45)] backdrop-blur-sm">
            <AvatarFallback
              className={cn("border-0 text-white", isUser ? "bg-primary" : "bg-secondary")}
            >
              {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60"
          />
        </div>
      )}

      <div className={cn("flex-1 space-y-2", isUser && "text-right", isSystem && "text-center")}>
        {!isSystem && (
          <div
            className={cn(
              "flex items-center gap-2 text-[13px] text-white/60",
              isUser && "justify-end",
            )}
          >
            <span className="font-medium text-white/90">{isUser ? "Ich" : "Assistent"}</span>
            {message.model && (
              <Badge
                variant="secondary"
                className="border-white/10 bg-white/10 text-xs text-white/75"
              >
                {message.model}
              </Badge>
            )}
            {message.tokens && (
              <Badge variant="outline" className="border-white/20 text-xs text-white/60">
                {message.tokens} Token
              </Badge>
            )}
            <span className="text-xs">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
        )}

        <div className={bubbleClass}>
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
              "flex items-center gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100",
              isUser && "justify-end",
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              className="btn-ghost h-8 w-8 rounded-full p-0"
              onClick={handleCopy}
              title="Nachricht kopieren"
              data-testid="message.copy"
            >
              <Copy className="h-3 w-3" />
            </Button>
            {isAssistant && isLast && onRetry && (
              <Button
                variant="ghost"
                size="sm"
                className="btn-ghost h-8 w-8 rounded-full p-0"
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
