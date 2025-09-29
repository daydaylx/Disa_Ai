import { Bot, Copy, RotateCcw, User } from "lucide-react";
import { useState } from "react";

import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export interface ChatMessageType {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  tokens?: number;
  model?: string;
}

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
}

function CodeBlock({ children, language }: { children: string; language?: string }) {
  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-lg">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-white/60">
        <span className="text-xs uppercase tracking-wide text-white/60">{language || "Text"}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 rounded-full border border-white/10 bg-white/5 p-0 text-white/60 hover:bg-white/10 hover:text-white"
          onClick={() => void navigator.clipboard?.writeText(children)}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      <pre className="overflow-x-auto bg-black/60 p-4">
        <code className="text-sm text-white/90">{children}</code>
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
        "group relative flex gap-3 px-3 py-5 transition-all duration-200",
        isUser && "flex-row-reverse",
        isSystem && "justify-center opacity-70",
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <Avatar
        className={cn("h-9 w-9 shadow-[0_8px_24px_rgba(15,23,42,0.45)]", isSystem && "hidden")}
      >
        <AvatarFallback
          className={cn(
            "bg-white/10 text-white",
            isUser
              ? "bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-500 text-white"
              : "border border-white/20 bg-black/40",
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-sky-200" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn("flex-1 space-y-2", isUser && "text-right", isSystem && "text-center")}>
        {/* Message Header */}
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

        {/* Message Content */}
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-3xl border p-4 text-sm leading-relaxed shadow-[0_16px_38px_rgba(8,15,31,0.45)]",
            isUser
              ? "ml-12 border-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 text-white"
              : "border-white/10 bg-white/10 text-white/90 backdrop-blur-xl",
            isSystem &&
              "mx-auto max-w-xs border-white/10 bg-white/5 text-center text-white/70 backdrop-blur",
          )}
        >
          {!isUser && !isSystem && (
            <div className="pointer-events-none absolute -top-8 right-6 h-20 w-20 rounded-full bg-[radial-gradient(circle,_rgba(168,85,247,0.25),_transparent_60%)]" />
          )}
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

        {/* Action Buttons */}
        {!isSystem && showActions && (
          <div
            className={cn(
              "flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100",
              isUser && "justify-end",
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full border border-white/20 bg-white/10 p-0 text-white/70 backdrop-blur hover:bg-white/20 hover:text-white"
              onClick={handleCopy}
              title="Nachricht kopieren"
            >
              <Copy className="h-3 w-3" />
            </Button>
            {isAssistant && isLast && onRetry && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full border border-white/20 bg-white/10 p-0 text-white/70 backdrop-blur hover:bg-white/20 hover:text-white"
                onClick={handleRetry}
                title="Antwort erneut anfordern"
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
