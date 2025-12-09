import { useEffect, useRef, useState } from "react";

import { Check, Copy, Edit2, RotateCcw } from "@/lib/icons";
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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard?.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 overflow-hidden rounded-xl bg-surface-inset border border-white/5 shadow-inner">
      <div className="flex items-center justify-between bg-surface-2/50 px-3 py-1.5 border-b border-white/5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-ink-tertiary">
          {language || "Code"}
        </span>
        <button
          onClick={handleCopy}
          className="p-1 text-ink-tertiary hover:text-ink-primary transition-colors"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-status-success" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3">
        <code className="font-mono text-sm leading-relaxed text-ink-primary">{children}</code>
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const parsedContent = parseMessageContent(message.content);

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

  // Follow-up suggestions - only show first 3 to avoid clutter
  const followUpSuggestions = ["Erkläre das genauer", "Gib mir Beispiele", "Fasse zusammen"];

  if (isSystem) return null;

  return (
    <div
      className={cn(
        "group flex w-full gap-3 animate-fade-in",
        isUser ? "justify-end" : "justify-start",
      )}
      data-testid="message.item"
    >
      {/* Message Content Container */}
      <div
        className={cn("relative max-w-[85%] sm:max-w-[75%]", isUser ? "items-end" : "items-start")}
      >
        {/* Bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm backdrop-blur-md",
            isUser
              ? "bg-brand-primary/10 text-ink-primary border border-brand-primary/20 rounded-tr-sm"
              : "bg-surface-1/60 text-ink-primary border border-white/5 rounded-tl-sm",
          )}
          data-testid="message-bubble"
        >
          {/* Content Body */}
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[80px] p-3 rounded-lg bg-bg-app border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-ink-primary resize-none text-sm"
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
            <div className="space-y-1">
              {parsedContent.map((part, index) => (
                <div key={index}>
                  {part.type === "text" ? (
                    <div className="whitespace-pre-wrap break-words">{part.content}</div>
                  ) : (
                    <CodeBlock language={part.language}>{part.content}</CodeBlock>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Row */}
        {!isEditing && (
          <div
            className={cn(
              "flex items-center gap-1 mt-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity",
              isUser ? "justify-end" : "justify-start",
            )}
          >
            <button
              onClick={handleCopy}
              className="p-1.5 text-ink-tertiary hover:text-ink-primary hover:bg-surface-2/50 rounded-md transition-colors"
              title="Kopieren"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>

            {isUser && onEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-ink-tertiary hover:text-ink-primary hover:bg-surface-2/50 rounded-md transition-colors"
                title="Bearbeiten"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            )}

            {isAssistant && isLast && (
              <button
                onClick={handleRetry}
                className="p-1.5 text-ink-tertiary hover:text-ink-primary hover:bg-surface-2/50 rounded-md transition-colors"
                title="Neu generieren"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}

            <span className="text-[10px] text-ink-muted ml-1 select-none">
              {new Date(message.timestamp).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Follow-up Suggestions - Always visible for last assistant message */}
        {isAssistant && isLast && onFollowUp && (
          <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
            {followUpSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onFollowUp(suggestion)}
                className="text-xs bg-accent-chat/10 text-accent-chat hover:bg-accent-chat/20 hover:text-accent-chat px-3 py-2 rounded-full border border-accent-chat/20 hover:border-accent-chat/40 transition-all shadow-sm backdrop-blur-sm font-medium"
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
