import { useState } from "react";

import { Bot, Copy, Edit2, MoreHorizontal, RotateCcw, User } from "@/lib/icons";
import { Avatar, AvatarFallback } from "@/ui/Avatar";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { MaterialCard } from "@/ui/MaterialCard";

import { cn } from "../../lib/utils";
import type { ChatMessageType } from "../../types/chatMessage";

export type { ChatMessageType } from "../../types/chatMessage";

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onFollowUp?: (prompt: string) => void;
}

function CodeBlock({ children, language }: { children: string; language?: string }) {
  return (
    <div className="border-border bg-surface-subtle relative my-4 overflow-hidden rounded-lg border">
      <div className="border-border flex items-center justify-between border-b px-4 py-2">
        <span className="text-text-secondary text-xs font-medium uppercase tracking-wide">
          {language || "Text"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-text-secondary hover:bg-card hover:text-text-primary h-8 w-8"
          onClick={() => void navigator.clipboard?.writeText(children)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-text-primary text-sm leading-relaxed">{children}</code>
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

export function ChatMessage({
  message,
  isLast,
  onRetry,
  onCopy,
  onEdit,
  onFollowUp,
}: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showFollowUps, setShowFollowUps] = useState(false);

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  const parsedContent = parseMessageContent(message.content);

  const bubbleClass = cn(
    "w-full max-w-[92vw] sm:max-w-3xl text-left",
    isUser && "ml-auto text-right",
    isSystem && "mx-auto max-w-[88vw] sm:max-w-2xl text-center",
  );

  const handleCopy = () => {
    onCopy?.(message.content);
    void navigator.clipboard?.writeText(message.content);
  };

  const handleRetry = () => {
    onRetry?.(message.id);
  };

  const handleEdit = () => {
    if (isEditing && editContent !== message.content) {
      onEdit?.(message.id, editContent);
    }
    setIsEditing(!isEditing);
  };

  const handleFollowUp = (prompt: string) => {
    onFollowUp?.(prompt);
    setShowFollowUps(false);
  };

  const followUpSuggestions = [
    "Erkläre das genauer",
    "Gib mir Beispiele",
    "Fasse zusammen",
    "In einfacheren Worten",
  ];

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
          <AvatarFallback className={cn("bg-surface-subtle text-text-primary")}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className={cn("flex-1 space-y-2", isUser && "text-right", isSystem && "text-center")}>
        {!isSystem && (
          <div
            className={cn(
              "text-text-secondary flex items-center gap-2 text-[13px]",
              isUser && "justify-end",
            )}
          >
            <span className="text-text-primary font-medium">{isUser ? "Ich" : "Assistent"}</span>
            {message.model && (
              <Badge
                variant="secondary"
                className="border-border bg-card text-text-secondary text-xs"
              >
                {message.model}
              </Badge>
            )}
            {message.tokens && (
              <Badge variant="outline" className="border-border text-text-secondary text-xs">
                {message.tokens} Token
              </Badge>
            )}
            <span className="text-xs">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
        )}

        <MaterialCard
          variant={isUser ? "inset" : "raised"}
          className={cn(bubbleClass, "p-4 sm:p-5")}
          data-testid="message-bubble"
        >
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[100px] p-3 rounded-lg bg-surface-2 border border-surface-3 focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  Abbrechen
                </Button>
                <Button variant="primary" size="sm" onClick={handleEdit}>
                  Speichern & Senden
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {parsedContent.map((part, index) => (
                <div key={index}>
                  {part.type === "text" ? (
                    <div className="whitespace-pre-wrap text-base leading-7 sm:text-[17px] sm:leading-8">
                      {part.content}
                    </div>
                  ) : (
                    <CodeBlock language={part.language}>{part.content}</CodeBlock>
                  )}
                </div>
              ))}
            </div>
          )}
        </MaterialCard>

        {/* Actions - Always visible on mobile, hover on desktop */}
        {!isSystem && !isEditing && (
          <div
            className={cn(
              "flex items-center gap-2 mt-2 transition-opacity duration-150",
              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
              isUser && "justify-end",
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-text-secondary hover:bg-card hover:text-text-primary h-8 w-8"
              onClick={handleCopy}
              title="Nachricht kopieren"
              data-testid="message.copy"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            {isUser && onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="text-text-secondary hover:bg-card hover:text-text-primary h-8 w-8"
                onClick={() => setIsEditing(true)}
                title="Nachricht bearbeiten"
                data-testid="message.edit"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
            )}
            {isAssistant && isLast && onRetry && (
              <Button
                variant="ghost"
                size="icon"
                className="text-text-secondary hover:bg-card hover:text-text-primary h-8 w-8"
                onClick={handleRetry}
                title="Antwort erneut anfordern"
                data-testid="message.retry"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
            {isAssistant && isLast && onFollowUp && (
              <Button
                variant="ghost"
                size="icon"
                className="text-text-secondary hover:bg-card hover:text-text-primary h-8 w-8"
                onClick={() => setShowFollowUps(!showFollowUps)}
                title="Weiterfragen"
                data-testid="message.followup"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}

        {/* Follow-up suggestions */}
        {isAssistant && isLast && showFollowUps && (
          <div className="flex flex-wrap gap-2 mt-3">
            {followUpSuggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="secondary"
                size="sm"
                onClick={() => handleFollowUp(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
