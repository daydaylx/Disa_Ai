import { useEffect, useMemo, useRef, useState } from "react";

import { useLongPress } from "@/hooks/useLongPress";
import { Check, Copy, Edit2, RotateCcw, Trash2 } from "@/lib/icons";
import { highlightCode, shouldHighlight } from "@/lib/syntaxHighlight";
import { Button } from "@/ui/Button";
import type { ContextMenuItem } from "@/ui/ContextMenu";
import { ContextMenu } from "@/ui/ContextMenu";

import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { cn } from "../../lib/utils";
import type { ChatMessageType } from "../../types/chatMessage";

export type { ChatMessageType } from "../../types/chatMessage";

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
  index?: number;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onFollowUp?: (prompt: string) => void;
}

function CodeBlock({ children, language }: { children: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const { elementRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleCopy = () => {
    void navigator.clipboard?.writeText(children).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Apply syntax highlighting if language is supported
  const highlighted = useMemo(() => {
    if (shouldHighlight(language)) {
      return highlightCode(children);
    }
    return null;
  }, [children, language]);

  return (
    <div
      ref={elementRef}
      className={cn(
        "relative my-3 overflow-hidden rounded-xl bg-surface-inset border border-white/5 shadow-inner",
        isVisible && "animate-code-block-fade-in",
      )}
    >
      <div className="flex items-center justify-between bg-surface-2/50 px-3 py-1.5 border-b border-white/5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-ink-tertiary">
          {language || "Code"}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            "p-1 text-ink-tertiary hover:text-ink-primary transition-colors action-button-hover",
            copied && "animate-copy-feedback",
          )}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-status-success" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3">
        <code className="font-mono text-sm leading-relaxed">
          {highlighted ? (
            highlighted.map((token, i) => (
              <span key={i} className={token.className}>
                {token.content}
              </span>
            ))
          ) : (
            <span className="text-ink-primary">{children}</span>
          )}
        </code>
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
  index = 0,
  onRetry,
  onCopy,
  onEdit,
  onDelete,
  onFollowUp,
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { elementRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Memoize parsing to avoid re-parsing on every render
  const parsedContent = useMemo(() => parseMessageContent(message.content), [message.content]);

  const handleCopy = () => {
    onCopy?.(message.content);
    void navigator.clipboard?.writeText(message.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const handleDelete = () => {
    onDelete?.(message.id);
  };

  // Long-Press Handler
  const { handlers: longPressHandlers } = useLongPress({
    onLongPress: () => {
      if (!isEditing) {
        setShowContextMenu(true);
      }
    },
    delay: 500,
    enableHaptic: true,
  });

  // Wrap native handlers for React events
  const longPressReactHandlers = {
    onTouchStart: (e: React.TouchEvent) => longPressHandlers.onTouchStart(e),
    onTouchMove: (e: React.TouchEvent) => longPressHandlers.onTouchMove(e),
    onTouchEnd: (e: React.TouchEvent) => longPressHandlers.onTouchEnd(e),
    onTouchCancel: () => longPressHandlers.onTouchCancel(),
    onMouseDown: (e: React.MouseEvent) => longPressHandlers.onMouseDown(e),
    onMouseMove: (e: React.MouseEvent) => longPressHandlers.onMouseMove(e),
    onMouseUp: (e: React.MouseEvent) => longPressHandlers.onMouseUp(e),
    onMouseLeave: () => longPressHandlers.onMouseLeave(),
  };

  // Context Menu Items
  const contextMenuItems: ContextMenuItem[] = [
    {
      icon: Copy,
      label: "Kopieren",
      onClick: handleCopy,
    },
    ...(isUser && onEdit
      ? [
          {
            icon: Edit2,
            label: "Bearbeiten",
            onClick: () => setIsEditing(true),
          },
        ]
      : []),
    ...(isAssistant && onRetry
      ? [
          {
            icon: RotateCcw,
            label: "Neu generieren",
            onClick: handleRetry,
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            icon: Trash2,
            label: "Löschen",
            onClick: handleDelete,
            danger: true,
          },
        ]
      : []),
  ];

  // Follow-up suggestions - only show first 3 to avoid clutter
  const followUpSuggestions = ["Erkläre das genauer", "Gib mir Beispiele", "Fasse zusammen"];

  if (isSystem) return null;

  return (
    <div
      ref={elementRef}
      className={cn(
        "group flex w-full gap-3",
        isVisible && "animate-fade-in-slide-up",
        isUser ? "justify-end" : "justify-start",
      )}
      style={
        isVisible && index > 0 ? { animationDelay: `${Math.min(index * 50, 300)}ms` } : undefined
      }
      data-testid="message.item"
    >
      {/* Message Content Container */}
      <div className="relative w-full">
        <div
          {...longPressReactHandlers}
          className={cn(
            "relative w-fit max-w-[min(100%,48rem)] rounded-2xl border px-4 py-3.5 text-[0.98rem] leading-7 shadow-sm ring-1 ring-white/5",
            isUser
              ? "ml-auto rounded-tr-sm border-accent-chat/30 bg-accent-chat-surface/65 text-ink-primary"
              : "mr-auto rounded-tl-sm border-white/10 bg-surface-card text-ink-primary",
          )}
          data-testid="message-bubble"
        >
          {/* Content Body */}
          {isEditing ? (
            <div className="space-y-3 edit-mode-transition">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[80px] p-3 rounded-lg bg-bg-app border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-ink-primary resize-none text-sm textarea-resize-transition"
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
              className={cn(
                "min-w-[2.75rem] min-h-[2.75rem] p-2 text-ink-tertiary hover:text-ink-primary hover:bg-surface-2/50 rounded-lg transition-all action-button-hover focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-chat",
                copied && "animate-copy-feedback",
              )}
              title="Kopieren"
              aria-label="Nachricht kopieren"
            >
              {copied ? (
                <Check className="h-4 w-4 text-status-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>

            {isUser && onEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="min-w-[2.75rem] min-h-[2.75rem] p-2 text-ink-tertiary hover:text-ink-primary hover:bg-surface-2/50 rounded-lg transition-all action-button-hover focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-chat"
                title="Bearbeiten"
                aria-label="Nachricht bearbeiten"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}

            {isAssistant && isLast && (
              <button
                onClick={handleRetry}
                className="min-w-[2.75rem] min-h-[2.75rem] p-2 text-ink-tertiary hover:text-ink-primary hover:bg-surface-2/50 rounded-lg transition-all action-button-hover focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-chat"
                title="Neu generieren"
                aria-label="Antwort neu generieren"
              >
                <RotateCcw className="h-4 w-4" />
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
          <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
            {followUpSuggestions.map((suggestion, idx) => (
              <button
                key={suggestion}
                onClick={() => onFollowUp(suggestion)}
                className="min-h-[2.75rem] rounded-full border border-accent-chat/30 bg-surface-1/85 px-4 py-2.5 text-sm font-medium text-accent-chat transition-colors hover:border-accent-chat/50 hover:bg-accent-chat/10 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-chat"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Context Menu (Long-Press) */}
      {showContextMenu && (
        <ContextMenu
          title={isUser ? "Deine Nachricht" : "Antwort"}
          items={contextMenuItems}
          onClose={() => setShowContextMenu(false)}
        />
      )}
    </div>
  );
}
