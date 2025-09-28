import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";
import { Copy, RotateCcw, User, Bot } from "lucide-react";
import { useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  tokens?: number;
  model?: string;
}

interface ChatMessageProps {
  message: ChatMessage;
  isLast?: boolean;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
}

function CodeBlock({ children, language }: { children: string; language?: string }) {
  return (
    <div className="relative my-4 rounded-md bg-neutral-900 dark:bg-neutral-800">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-700">
        <span className="text-xs text-neutral-400">{language || "text"}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-neutral-400 hover:text-neutral-200"
          onClick={() => void navigator.clipboard?.writeText(children)}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-sm text-neutral-100">{children}</code>
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
    // Add text before code block
    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index);
      if (textContent.trim()) {
        parts.push({ type: "text", content: textContent });
      }
    }

    // Add code block
    parts.push({
      type: "code",
      content: match[2],
      language: match[1] || "text",
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
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
        "group relative flex gap-3 px-4 py-6 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50",
        isUser && "flex-row-reverse",
        isSystem && "justify-center opacity-70"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <Avatar className={cn("h-8 w-8", isSystem && "hidden")}>
        <AvatarFallback className={cn(
          isUser ? "bg-accent-500 text-white" : "bg-neutral-200 dark:bg-neutral-700"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn("flex-1 space-y-2", isUser && "text-right", isSystem && "text-center")}>
        {/* Message Header */}
        {!isSystem && (
          <div className={cn("flex items-center gap-2", isUser && "justify-end")}>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {isUser ? "Sie" : "Assistant"}
            </span>
            {message.model && (
              <Badge variant="secondary" className="text-xs">
                {message.model}
              </Badge>
            )}
            {message.tokens && (
              <Badge variant="outline" className="text-xs">
                {message.tokens} tokens
              </Badge>
            )}
            <span className="text-xs text-neutral-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Message Content */}
        <Card className={cn(
          "p-4 text-sm leading-relaxed",
          isUser ? "bg-accent-500 text-white ml-12" : "bg-white dark:bg-neutral-800",
          isSystem && "bg-neutral-100 dark:bg-neutral-800 text-center"
        )}>
          {parsedContent.map((part, index) => (
            <div key={index}>
              {part.type === "text" ? (
                <div className="whitespace-pre-wrap">{part.content}</div>
              ) : (
                <CodeBlock language={part.language}>{part.content}</CodeBlock>
              )}
            </div>
          ))}
        </Card>

        {/* Action Buttons */}
        {!isSystem && showActions && (
          <div className={cn(
            "flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100",
            isUser && "justify-end"
          )}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleCopy}
              title="Copy message"
            >
              <Copy className="h-3 w-3" />
            </Button>
            {isAssistant && isLast && onRetry && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleRetry}
                title="Retry generation"
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