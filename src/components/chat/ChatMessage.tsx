import { useEffect, useRef, useState } from "react";

import { Bot, Copy, Edit2, MoreHorizontal, RotateCcw, User } from "@/lib/icons";
import { Avatar, AvatarFallback } from "@/ui/Avatar";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";

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
    <div className="border border-border-ink bg-bg-surface relative my-4 overflow-hidden rounded-md">
      <div className="border-b border-border-ink flex items-center justify-between px-4 py-2 bg-bg-surface/50">
        <span className="text-ink-secondary text-xs font-medium uppercase tracking-wide">
          {language || "Text"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-ink-secondary hover:text-ink-primary h-8 w-8"
          onClick={() => void navigator.clipboard?.writeText(children)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-ink-primary text-sm leading-relaxed font-mono">{children}</code>
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
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  // Mobile detection for conditional focus
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  // Handle textarea focus when entering edit mode (accessibility improvement)
  useEffect(() => {
    if (isMobile && isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isMobile, isEditing]);

  const parsedContent = parseMessageContent(message.content);

  // INK THEME: Chat Bubbles
  // User: Lightly tinted paper, fine border
  // Assistant: White paper, accent strip on left
  const bubbleClass = cn(
    "w-full max-w-[92vw] sm:max-w-3xl text-left p-4 sm:p-5 relative",
    isUser
      ? "ml-auto text-right bg-bg-surface border border-border-ink rounded-lg rounded-tr-none"
      : "bg-white border-l-[3px] border-accent pl-5 pr-4 py-4 rounded-r-lg shadow-sm", // Assistant style
    isSystem && "mx-auto max-w-[88vw] sm:max-w-2xl text-center bg-transparent border-none p-2",
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
    >
      <div className={cn("relative pt-1", isSystem && "hidden")}>
        <Avatar className="h-8 w-8 border border-border-ink bg-bg-surface text-ink-primary">
          <AvatarFallback className={cn("bg-bg-surface text-ink-primary")}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className={cn("flex-1 space-y-1", isUser && "text-right", isSystem && "text-center")}>
        {!isSystem && (
          <div
            className={cn(
              "text-ink-secondary flex items-center gap-2 text-[13px] mb-1",
              isUser && "justify-end",
            )}
          >
            <span className="text-ink-primary font-bold">{isUser ? "Du" : "Disa"}</span>
            {message.model && (
              <Badge
                variant="secondary"
                className="border border-border-ink bg-bg-surface text-ink-secondary text-[10px] px-1.5 py-0"
              >
                {message.model}
              </Badge>
            )}
            <span className="text-xs opacity-60">{new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        )}

        <div
          className={bubbleClass}
          data-testid="message-bubble"
        >
          {isEditing ? (
            <div className="space-y-3 text-left">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[100px] p-3 rounded-md bg-white border border-border-ink focus:outline-none focus:ring-1 focus:ring-accent text-ink-primary"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  Abbrechen
                </Button>
                <Button variant="primary" size="sm" onClick={handleEdit}>
                  Speichern
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {parsedContent.map((part, index) => (
                <div key={index}>
                  {part.type === "text" ? (
                    <div className={cn("whitespace-pre-wrap leading-relaxed text-[17px] text-ink-primary", isUser && "text-ink-primary")}>
                      {part.content}
                    </div>
                  ) : (
                    <div className="text-left">
                       <CodeBlock language={part.language}>{part.content}</CodeBlock>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions - Always visible on mobile, hover on desktop */}
        {!isSystem && !isEditing && (
          <div
            className={cn(
              "flex items-center gap-1 mt-1 transition-opacity duration-150",
              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
              isUser && "justify-end",
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-ink-secondary hover:text-accent h-7 w-7"
              onClick={handleCopy}
              title="Kopieren"
              data-testid="message.copy"
            >
              <Copy className="h-3 w-3" />
            </Button>
            {isUser && onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="text-ink-secondary hover:text-accent h-7 w-7"
                onClick={() => setIsEditing(true)}
                title="Bearbeiten"
                data-testid="message.edit"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
            {isAssistant && isLast && onRetry && (
              <Button
                variant="ghost"
                size="icon"
                className="text-ink-secondary hover:text-accent h-7 w-7"
                onClick={handleRetry}
                title="Neu generieren"
                data-testid="message.retry"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
            {isAssistant && isLast && onFollowUp && (
              <Button
                variant="ghost"
                size="icon"
                className="text-ink-secondary hover:text-accent h-7 w-7"
                onClick={() => setShowFollowUps(!showFollowUps)}
                title="Nachfragen"
                data-testid="message.followup"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* Follow-up suggestions */}
        {isAssistant && isLast && showFollowUps && (
          <div className="flex flex-wrap gap-2 mt-2">
            {followUpSuggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="secondary"
                size="sm"
                onClick={() => handleFollowUp(suggestion)}
                className="text-xs h-8 px-3"
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
