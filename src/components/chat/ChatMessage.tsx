import React, { lazy, Suspense, useEffect, useState } from "react";

import { useFeatureFlag } from "../../hooks/useFeatureFlags";
import { highlightCode } from "../../lib/highlighting/lazySyntaxHighlighter";
import { loadPrismCSS } from "../../lib/highlighting/prismTheme";
import { Bot, Copy, RotateCcw, User } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { safeWarn } from "../../lib/utils/production-logger";
import type { ChatMessageType } from "../../types/chatMessage";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export type { ChatMessageType } from "../../types/chatMessage";

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
}

// Lazy-Load Markdown Components - loaded only when needed
const ReactMarkdown = lazy(() => import("react-markdown"));

// Lazy-Load KaTeX CSS - loaded only when needed
const loadKaTeXCSS = () => import("katex/dist/katex.min.css");

function MarkdownRenderer({ content }: { content: string }) {
  const [, setKaTeXCSS] = useState(false);

  useEffect(() => {
    // Load KaTeX CSS only when math is detected
    if (content.includes("$") || content.includes("\\(")) {
      void loadKaTeXCSS().then(() => setKaTeXCSS(true));
    }
  }, [content]);

  return (
    <Suspense fallback={<div className="animate-pulse">Loading content...</div>}>
      <ReactMarkdown
        components={{
          // @ts-expect-error - ReactMarkdown component types sind komplex
          code({ node: _node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <CodeBlock language={match[1]}>{String(children).replace(/\n$/, "")}</CodeBlock>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Suspense>
  );
}

function CodeBlock({ children, language }: { children: string; language?: string }) {
  const isLazyHighlighterEnabled = useFeatureFlag("lazyHighlighter");
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightSuccess, setHighlightSuccess] = useState(false);

  useEffect(() => {
    if (!isLazyHighlighterEnabled || !language || language === "text") {
      return;
    }

    setIsLoading(true);

    // Lazy load CSS first, then highlight
    loadPrismCSS()
      .then(() => highlightCode(children, language))
      .then((result) => {
        if (result.success) {
          setHighlightedCode(result.highlighted);
          setHighlightSuccess(true);
        }
      })
      .catch((error) => {
        safeWarn("[CodeBlock] Highlighting failed:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [children, language, isLazyHighlighterEnabled]);

  const handleCopy = () => {
    void navigator.clipboard?.writeText(children);
  };

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <span className="code-block-language">
          {language || "text"}
          {isLazyHighlighterEnabled && highlightSuccess && (
            <span className="ml-2 text-xs opacity-75">✨ highlighted</span>
          )}
        </span>
        <button className="code-block-copy" onClick={handleCopy} title="Copy code">
          <Copy className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="code-block-loading">Loading syntax highlighting</div>
      ) : highlightedCode && highlightSuccess ? (
        <pre className={`language-${language}`}>
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      ) : (
        <pre className="overflow-x-auto p-4">
          <code className="text-sm leading-relaxed font-mono">{children}</code>
        </pre>
      )}
    </div>
  );
}

const ChatMessageComponent = ({ message, isLast, onRetry, onCopy }: ChatMessageProps) => {
  const [showActions, setShowActions] = useState(false);

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  const bubbleClass = cn("max-w-[70%]", isUser && "ml-auto", isSystem && "mx-auto max-w-[60%]");

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
        "group relative flex gap-3 px-3 py-4",
        isUser && "flex-row-reverse",
        isSystem && "justify-center opacity-70",
      )}
      data-testid="message.item"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className={cn("relative flex-shrink-0", isSystem && "hidden")}>
        <Avatar className="border-border h-9 w-9 border">
          <AvatarFallback className={cn("bg-[var(--surface-glass-panel)] text-text-primary")}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-1.5",
          isUser && "items-end",
          isSystem && "items-center",
        )}
      >
        {/* Chat Bubble */}
        <Card
          intent={isUser ? "accent" : "default"}
          tone={isUser ? "glass-primary" : "glass-subtle"}
          padding="md"
          className={cn(bubbleClass)}
        >
          <div className="space-y-3 text-left">
            {contentContainsMarkdown(message.content) ? (
              <MarkdownRenderer content={message.content} />
            ) : (
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
            )}
          </div>
        </Card>

        {/* Timestamp und Meta unter der Bubble */}
        {!isSystem && (
          <div
            className={cn(
              "flex items-center gap-2 text-xs text-text-muted px-2",
              isUser && "flex-row-reverse",
            )}
          >
            <span className="font-medium text-text-secondary">{isUser ? "Ich" : "Assistent"}</span>
            {message.model && (
              <Badge variant="secondary" className="border-border bg-card text-text-muted text-xs">
                {message.model}
              </Badge>
            )}
            {message.tokens && (
              <Badge variant="outline" className="border-border text-text-muted text-xs">
                {message.tokens}t
              </Badge>
            )}
            <span className="text-text-muted">
              {new Date(message.timestamp).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Actions neben Timestamp */}
        {!isSystem && showActions && (
          <div
            className={cn(
              "flex items-center gap-1 px-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
              isUser && "flex-row-reverse",
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-text-muted hover:bg-surface-glass-panel hover:text-text-primary"
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
                className="h-7 px-2 text-text-muted hover:bg-surface-glass-panel hover:text-text-primary"
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
};

// Helper function to detect markdown content
function contentContainsMarkdown(content: string): boolean {
  // Simple detection: check for markdown syntax
  return (
    content.includes("**") ||
    content.includes("*") ||
    content.includes("`") ||
    content.includes("#") ||
    content.includes("[") ||
    content.includes("$") ||
    content.includes("\\(")
  );
}

const MemoizedChatMessage = React.memo(ChatMessageComponent);
export { MemoizedChatMessage as ChatMessage };
