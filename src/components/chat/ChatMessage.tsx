import { useEffect, useRef, useState } from "react";

import { Copy, Edit2, MoreHorizontal, RotateCcw } from "@/lib/icons";
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
    <div className="relative my-4 overflow-hidden rounded-xl border border-[var(--border-chalk)] bg-[rgba(255,255,255,0.02)] shadow-[0_0_0_1px_var(--border-chalk)]">
      <div className="flex items-center justify-between border-b border-[var(--border-chalk)] px-4 py-2 backdrop-blur-sm">
        <span className="text-ink-tertiary text-xs font-medium uppercase tracking-[0.08em]">
          {language || "Text"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-ink-tertiary hover:bg-[rgba(255,255,255,0.05)] hover:text-ink-primary h-8 w-8"
          onClick={() => void navigator.clipboard?.writeText(children)}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
      <pre className="overflow-x-auto bg-[rgba(0,0,0,0.35)] p-4">
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

  // Handle textarea focus when entering edit mode - funktioniert für Desktop und Mobile
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const parsedContent = parseMessageContent(message.content);

  // Schiefer & Kreide: feine Kreidelinien auf mattem Schiefer
  // User: Blue chalk hatching box
  // AI: Minimalist text on stone

  const userBubbleClass = cn(
    "relative max-w-[92%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] px-4 py-3 sm:px-5 sm:py-4",
    "border-chalk text-xl tracking-wide", // Use the new class
    "chalk-text",
  );

  const aiBubbleClass = cn(
    "relative max-w-[92%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] px-4 py-2 sm:px-5 sm:py-3",
    "border-l-2 border-chalk-dim pl-4", // Fine line on left
    "chalk-text",
  );

  const bubbleClass = isUser
    ? userBubbleClass
    : isAssistant
      ? aiBubbleClass
      : "mx-auto max-w-[95%] opacity-80 text-center italic text-chalk-dim";

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
      className={cn("group relative px-3 py-3 sm:px-5 sm:py-4", isSystem && "opacity-70")}
      data-testid="message.item"
    >
      {/* Message Bubble - Tinte auf Papier Stil */}
      <div className={bubbleClass} data-testid="message-bubble">
        {/* Header mit Absender */}
        {!isSystem && (
          <div
            className={cn(
              "flex items-center gap-2 mb-2 text-[12px]",
              isUser ? "justify-end" : "justify-start",
            )}
          >
            <span className="text-[var(--chalk-white-faded)] font-medium">
              {isUser ? "Du" : "Disa"}
            </span>
            {message.model && (
              <Badge
                variant="secondary"
                className="bg-surface-2 text-ink-tertiary text-[10px] px-1.5 py-0"
              >
                {message.model.split("/").pop()}
              </Badge>
            )}
            <span className="text-[var(--chalk-white-faded)] text-[11px]">
              {new Date(message.timestamp).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Content */}
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[100px] p-3 rounded-lg bg-surface-1 border border-border-ink focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-ink-primary"
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
          <div className="space-y-2">
            {parsedContent.map((part, index) => (
              <div key={index}>
                {part.type === "text" ? (
                  <div className="whitespace-pre-wrap text-[15px] sm:text-base leading-relaxed chalk-text">
                    {part.content}
                  </div>
                ) : (
                  <CodeBlock language={part.language}>{part.content}</CodeBlock>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions - im Bubble integriert */}
        {!isSystem && !isEditing && (
          <div
            className={cn(
              "flex items-center gap-0.5 mt-2 pt-2 border-t border-[var(--border-chalk)] transition-opacity duration-150",
              "opacity-80 group-hover:opacity-100",
              isUser ? "justify-end" : "justify-start",
            )}
          >
            {/* DEBUG: Using native button element for copy functionality */}
            <button
              type="button"
              className="chalk-button text-[var(--chalk-white-faded)] hover:text-[var(--chalk-white)] hover:bg-[rgba(236,236,236,0.05)] h-11 w-11 min-h-[44px] min-w-[44px] touch-manipulation"
              onClick={handleCopy}
              title="Kopieren"
              data-testid="message.copy"
            >
              <Copy className="h-4 w-4" />
            </button>
            {isUser && onEdit && (
              <button
                type="button"
                className="chalk-button text-[var(--chalk-white-faded)] hover:text-[var(--chalk-white)] hover:bg-[rgba(236,236,236,0.05)] h-11 w-11 min-h-[44px] min-w-[44px] touch-manipulation"
                onClick={() => setIsEditing(true)}
                title="Bearbeiten"
                data-testid="message.edit"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            {isAssistant && isLast && onRetry && (
              <button
                type="button"
                className="chalk-button text-[var(--chalk-white-faded)] hover:text-[var(--chalk-white)] hover:bg-[rgba(236,236,236,0.05)] h-11 w-11 min-h-[44px] min-w-[44px] touch-manipulation"
                onClick={handleRetry}
                title="Neu generieren"
                data-testid="message.retry"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            {isAssistant && isLast && onFollowUp && (
              <button
                type="button"
                className="chalk-button text-[var(--chalk-white-faded)] hover:text-[var(--chalk-white)] hover:bg-[rgba(236,236,236,0.05)] h-11 w-11 min-h-[44px] min-w-[44px] touch-manipulation"
                onClick={() => setShowFollowUps(!showFollowUps)}
                title="Weiterfragen"
                data-testid="message.followup"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Follow-up suggestions */}
        {isAssistant && isLast && showFollowUps && (
          <div className="flex flex-wrap gap-2 mt-3 pt-2">
            {/* DEBUG: Mapping follow-up suggestions with native button elements */}
            {followUpSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleFollowUp(suggestion)}
                className="chalk-pill text-xs border-[var(--chalk-white-faded)] bg-transparent text-[var(--chalk-white-faded)] hover:border-[var(--chalk-white)] hover:text-[var(--chalk-white)]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
