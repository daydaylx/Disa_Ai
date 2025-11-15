import React, { lazy, Suspense, useEffect, useState } from "react";

import { useFeatureFlag } from "../../hooks/useFeatureFlags";
import { highlightCode } from "../../lib/highlighting/lazySyntaxHighlighter";
import { loadPrismCSS } from "../../lib/highlighting/prismTheme";
import { Bot, Check, Copy, RotateCcw, Settings, User } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { loadStylesheet } from "../../lib/utils/loadStylesheet";
import { safeWarn } from "../../lib/utils/production-logger";
import type { ChatMessageType } from "../../types/chatMessage";
import { BodyText, Typography } from "../ui/typography";

export type { ChatMessageType } from "../../types/chatMessage";

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  showAvatar?: boolean;
  compact?: boolean;
}

type ReactMarkdownModule = typeof import("react-markdown");

const REACT_MARKDOWN_URL =
  "https://esm.sh/react-markdown@10.1.0?bundle&target=es2020&deps=react@19.0.0,react-dom@19.0.0";

const loadReactMarkdown = (() => {
  let promise: Promise<ReactMarkdownModule> | null = null;
  return () => {
    if (!promise) {
      promise = import(
        /* @vite-ignore */
        REACT_MARKDOWN_URL
      ) as Promise<ReactMarkdownModule>;
    }
    return promise;
  };
})();

// Lazy-Load Markdown Component from CDN - shipped outside main bundle
const ReactMarkdown = lazy(async () => {
  const module = await loadReactMarkdown();
  return { default: module.default };
});

const KATEX_STYLESHEET_ID = "katex-stylesheet";
const KATEX_CDN_URL = "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css";
const KATEX_INTEGRITY = "sha384-WcoG4HRXMzYzfCgiyfrySxx90XSl2rxY5mnVY5TwtWE6KLrArNKn0T/mOgNL0Mmi";

// Lazy-load KaTeX CSS from CDN to avoid bundling heavy font assets
const loadKaTeXCSS = (() => {
  let cachedPromise: Promise<void> | null = null;

  return () => {
    if (cachedPromise) {
      return cachedPromise;
    }

    cachedPromise = loadStylesheet({
      href: KATEX_CDN_URL,
      id: KATEX_STYLESHEET_ID,
      crossOrigin: "anonymous",
      integrity: KATEX_INTEGRITY,
      referrerPolicy: "no-referrer",
      importance: "low",
    }).catch((error: unknown) => {
      cachedPromise = null;
      safeWarn("[ChatMessage] Failed to load KaTeX stylesheet", error);
      throw error;
    });

    return cachedPromise;
  };
})();

function MarkdownRenderer({ content }: { content: string }) {
  const [, setKaTeXCSS] = useState(false);

  useEffect(() => {
    // Load KaTeX CSS only when math is detected
    if (content.includes("$") || content.includes("\\(")) {
      void loadKaTeXCSS().then(() => setKaTeXCSS(true));
    }
  }, [content]);

  return (
    <Suspense
      fallback={
        <div className="animate-pulse bg-[var(--color-neutral-100)] rounded-[var(--radius-md)] h-4 w-full"></div>
      }
    >
      <ReactMarkdown
        components={{
          // @ts-expect-error - ReactMarkdown component types sind komplex
          code({ node: _node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <CodeBlock language={match[1]}>{String(children).replace(/\n$/, "")}</CodeBlock>
            ) : (
              <code
                className={cn(
                  "font-mono text-sm bg-[var(--color-neutral-100)] text-[var(--color-neutral-800)] px-1.5 py-0.5 rounded-[var(--radius-xs)]",
                  className,
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          // @ts-expect-error - ReactMarkdown component types
          p({ children }) {
            return <BodyText className="mb-3 last:mb-0">{children}</BodyText>;
          },
          // @ts-expect-error - ReactMarkdown component types
          h1({ children }) {
            return (
              <Typography variant="h3" className="mb-4 mt-6 first:mt-0">
                {children}
              </Typography>
            );
          },
          // @ts-expect-error - ReactMarkdown component types
          h2({ children }) {
            return (
              <Typography variant="h4" className="mb-3 mt-5 first:mt-0">
                {children}
              </Typography>
            );
          },
          // @ts-expect-error - ReactMarkdown component types
          h3({ children }) {
            return (
              <Typography variant="h5" className="mb-2 mt-4 first:mt-0">
                {children}
              </Typography>
            );
          },
          // @ts-expect-error - ReactMarkdown component types
          ul({ children }) {
            return <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>;
          },
          // @ts-expect-error - ReactMarkdown component types
          ol({ children }) {
            return <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>;
          },
          // @ts-expect-error - ReactMarkdown component types
          li({ children }) {
            return <li className="text-[var(--text-primary)]">{children}</li>;
          },
          // @ts-expect-error - ReactMarkdown component types
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-[var(--color-primary-300)] pl-4 py-2 mb-3 bg-[var(--color-primary-50)] rounded-r-[var(--radius-md)]">
                {children}
              </blockquote>
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
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      safeWarn("[CodeBlock] Failed to copy code:", error);
    }
  };

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between bg-[var(--color-neutral-800)] text-[var(--color-neutral-200)] px-4 py-2 rounded-t-[var(--radius-md)] text-sm">
        <span className="font-medium">
          {language || "text"}
          {isLazyHighlighterEnabled && highlightSuccess && (
            <span className="ml-2 text-xs text-[var(--color-success-400)]">✨ highlighted</span>
          )}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-600)] transition-colors text-sm"
          title="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="bg-[var(--color-neutral-900)] rounded-b-[var(--radius-md)] overflow-x-auto">
        {isLoading ? (
          <div className="p-4 text-[var(--color-neutral-400)] text-sm">
            Loading syntax highlighting...
          </div>
        ) : highlightedCode && highlightSuccess ? (
          <pre className="p-4 overflow-x-auto">
            <code
              className={cn("text-sm leading-relaxed font-mono", `language-${language}`)}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        ) : (
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm leading-relaxed font-mono text-[var(--color-neutral-200)]">
              {children}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}

const ChatMessageComponent = ({
  message,
  isLast,
  onRetry,
  onCopy,
  showAvatar = true,
  compact = false,
}: ChatMessageProps) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.(message.content);
    } catch (error) {
      safeWarn("[ChatMessage] Failed to copy message:", error);
    }
  };

  const handleRetry = () => {
    onRetry?.(message.id);
  };

  const timestamp = new Date(message.timestamp).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedModel = message.model?.split("/").pop();

  // Avatar component
  const Avatar = () => {
    if (!showAvatar) return null;

    const avatarClass = cn(
      "flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0",
      isUser &&
        "bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white shadow-[var(--shadow-light)]",
      isAssistant &&
        "bg-gradient-to-br from-[var(--color-success-500)] to-[var(--color-success-600)] text-white shadow-[var(--shadow-light)]",
      isSystem && "bg-[var(--color-neutral-400)] text-white",
    );

    const Icon = isUser ? User : isAssistant ? Bot : Settings;

    return (
      <div className={avatarClass}>
        <Icon className="h-4 w-4" />
      </div>
    );
  };

  // Message bubble styles
  const bubbleClass = cn(
    "relative rounded-2xl px-4 py-3 shadow-[var(--shadow-light)] transition-all duration-[var(--duration-normal)]",
    "max-w-[85%] sm:max-w-[75%]",
    isUser && [
      "bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white",
      "ml-auto rounded-br-md",
    ],
    isAssistant && [
      "bg-[var(--surface-card)] border border-[var(--border-muted)] text-[var(--text-primary)]",
      "mr-auto rounded-bl-md",
    ],
    isSystem && [
      "bg-[var(--color-neutral-100)] border border-dashed border-[var(--border-muted)] text-[var(--text-muted)]",
      "mx-auto text-center max-w-[70%] rounded-lg",
    ],
  );

  // Message container styles
  const messageContainerClass = cn(
    "flex gap-3 px-4 py-3",
    isUser && "flex-row-reverse",
    isSystem && "justify-center",
    compact && "py-2",
  );

  // Action buttons
  const ActionButtons = () => (
    <div className={cn("flex items-center gap-1 mt-2", isUser ? "justify-end" : "justify-start")}>
      <button
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-[var(--radius-xs)] text-xs font-medium transition-all duration-[var(--duration-fast)]",
          "hover:bg-[var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2",
          isUser && "text-white/80 hover:bg-white/10",
        )}
        title="Nachricht kopieren"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "Kopiert!" : "Kopieren"}
      </button>

      {isAssistant && isLast && onRetry && (
        <button
          onClick={handleRetry}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-[var(--radius-xs)] text-xs font-medium transition-all duration-[var(--duration-fast)]",
            "hover:bg-[var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2",
          )}
          title="Antwort erneut anfordern"
        >
          <RotateCcw className="h-3 w-3" />
          Erneut
        </button>
      )}
    </div>
  );

  // Message metadata
  const MessageMetadata = () => (
    <div
      className={cn(
        "flex items-center gap-2 text-xs text-[var(--text-muted)] mt-1",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <span>{timestamp}</span>
      {formattedModel && (
        <span className="uppercase tracking-wider font-medium">{formattedModel}</span>
      )}
      {typeof message.tokens === "number" && (
        <span>{message.tokens.toLocaleString("de-DE")} Token</span>
      )}
    </div>
  );

  return (
    <div
      className={cn("animate-in slide-in-from-bottom-2 duration-300", messageContainerClass)}
      data-testid="message.item"
    >
      <Avatar />

      <div
        className={cn(
          "flex flex-col min-w-0",
          isUser && "items-end",
          isAssistant && "items-start",
          isSystem && "items-center",
        )}
      >
        <div className={bubbleClass}>
          {contentContainsMarkdown(message.content) ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <BodyText
              className={cn(
                "whitespace-pre-wrap break-words leading-relaxed",
                isUser && "text-white",
                isSystem && "text-[var(--text-muted)] italic",
              )}
            >
              {message.content}
            </BodyText>
          )}
        </div>

        {!isSystem && (
          <>
            <ActionButtons />
            <MessageMetadata />
          </>
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
    content.includes("\\(") ||
    content.includes("```") ||
    content.includes(">") ||
    content.includes("- ") ||
    content.includes("1. ")
  );
}

const MemoizedChatMessage = React.memo(ChatMessageComponent);
export { MemoizedChatMessage as ChatMessage };
