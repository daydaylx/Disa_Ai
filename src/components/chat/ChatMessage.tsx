import { useEffect, useMemo, useRef, useState } from "react";

import { Check, Copy, Edit2, RotateCcw, Save, Trash2 } from "@/lib/icons";
import { BottomSheet } from "@/ui/BottomSheet";
import { Button } from "@/ui/Button";

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
  onFollowUp?: (prompt: string) => void;
}

function CodeBlock({ children, language }: { children: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { elementRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Cleanup timeout on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = () => {
    void navigator.clipboard?.writeText(children).catch(() => {});
    setCopied(true);
    // Clear any existing timeout before setting a new one
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

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
  index = 0,
  onRetry,
  onCopy,
  onEdit,
  onFollowUp,
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const [showActionsSheet, setShowActionsSheet] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
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

  // Cleanup copy timeout on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Memoize parsing to avoid re-parsing on every render
  const parsedContent = useMemo(() => parseMessageContent(message.content), [message.content]);

  const handleCopy = () => {
    onCopy?.(message.content);
    void navigator.clipboard?.writeText(message.content).catch(() => {});
    setCopied(true);
    setShowActionsSheet(false);
    // Clear any existing timeout before setting a new one
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleRetry = () => {
    onRetry?.(message.id);
    setShowActionsSheet(false);
  };

  const handleEdit = () => {
    if (isEditing && editContent !== message.content) {
      onEdit?.(message.id, editContent);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveAsNote = () => {
    // Placeholder for saving as note functionality
    console.warn("Saving as note:", message.content);
    setShowActionsSheet(false);
  };

  const handleDelete = () => {
    // Placeholder for delete functionality
    console.warn("Deleting message:", message.id);
    setShowActionsSheet(false);
  };

  const handleLongPress = () => {
    setShowActionsSheet(true);
  };

  const handleTouchStart = () => {
    longPressTimerRef.current = window.setTimeout(handleLongPress, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Follow-up suggestions - only show first 3 to avoid clutter
  const followUpSuggestions = ["Erkläre das genauer", "Gib mir Beispiele", "Fasse zusammen"];

  if (isSystem) return null;

  return (
    <>
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* Message Content Container */}
        <div
          className={cn(
            "relative max-w-[85%] sm:max-w-[75%]",
            isUser ? "items-end" : "items-start",
          )}
        >
          {/* Bubble */}
          <div
            className={cn(
              "relative rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm backdrop-blur-md ring-1 ring-white/5 message-bubble-hover",
              isUser
                ? "bg-gradient-to-br from-accent-chat-surface via-brand-primary/10 to-surface-1/30 text-ink-primary border border-accent-chat-border rounded-tr-sm hover:shadow-glow-sm"
                : "bg-gradient-to-br from-surface-1/80 to-surface-2/40 text-ink-primary border border-white/5 rounded-tl-sm",
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

          {/* Actions Row - hidden on mobile, shown on desktop */}
          {!isEditing && (
            <div
              className={cn(
                "hidden sm:flex items-center gap-1 mt-1 opacity-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity",
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
            <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
              {followUpSuggestions.map((suggestion, idx) => (
                <button
                  key={suggestion}
                  onClick={() => onFollowUp(suggestion)}
                  className="min-h-[2.75rem] text-sm bg-accent-chat-surface text-accent-chat hover:bg-accent-chat-dim px-4 py-2.5 rounded-full border border-accent-chat-border transition-all shadow-sm backdrop-blur-sm font-medium follow-up-hover focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-chat"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Long-Press Action Sheet */}
      <BottomSheet isOpen={showActionsSheet} onClose={() => setShowActionsSheet(false)}>
        <div className="space-y-2">
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2/50 transition-colors text-left"
          >
            <Copy className="h-5 w-5 text-ink-secondary" />
            <span>Kopieren</span>
          </button>

          {isUser && onEdit && (
            <button
              onClick={() => {
                setIsEditing(true);
                setShowActionsSheet(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2/50 transition-colors text-left"
            >
              <Edit2 className="h-5 w-5 text-ink-secondary" />
              <span>Bearbeiten</span>
            </button>
          )}

          {isAssistant && isLast && onRetry && (
            <button
              onClick={handleRetry}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2/50 transition-colors text-left"
            >
              <RotateCcw className="h-5 w-5 text-ink-secondary" />
              <span>Neu generieren</span>
            </button>
          )}

          <button
            onClick={handleSaveAsNote}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2/50 transition-colors text-left"
          >
            <Save className="h-5 w-5 text-ink-secondary" />
            <span>Als Notiz speichern</span>
          </button>

          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2/50 transition-colors text-left text-red-400"
          >
            <Trash2 className="h-5 w-5" />
            <span>Löschen</span>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
