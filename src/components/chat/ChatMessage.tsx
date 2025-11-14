import React, { lazy, Suspense, useEffect, useState } from "react";

import { useFeatureFlag } from "../../hooks/useFeatureFlags";
import { highlightCode } from "../../lib/highlighting/lazySyntaxHighlighter";
import { loadPrismCSS } from "../../lib/highlighting/prismTheme";
import { Copy, RotateCcw } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { loadStylesheet } from "../../lib/utils/loadStylesheet";
import { safeWarn } from "../../lib/utils/production-logger";
import type { ChatMessageType } from "../../types/chatMessage";

export type { ChatMessageType } from "../../types/chatMessage";

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
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
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  const widthClass = isSystem ? "max-w-[70%]" : "max-w-[88%]";
  const bubbleAlignment = cn(
    "flex w-full flex-col gap-2",
    widthClass,
    isSystem && "self-center items-center text-center",
    isUser && "self-end items-end",
    isAssistant && "self-start items-start",
  );

  const bubbleClass = cn(
    "w-full rounded-3xl border border-[var(--glass-border-soft)] px-4 py-3 text-sm leading-relaxed shadow-[0_25px_45px_rgba(0,0,0,0.45)] backdrop-blur-2xl bubble-in",
    isUser &&
      "bg-[var(--accent)] text-[var(--text-inverted)] border-transparent shadow-[0_25px_45px_rgba(97,231,255,0.35)]",
    isAssistant && "bg-[var(--surface-chat)] text-text-primary",
    isSystem &&
      "bg-[var(--surface-inline)] text-text-muted border-dashed border-[var(--glass-border-soft)]",
  );

  const timestamp = new Date(message.timestamp).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedModel = message.model?.split("/").pop();
  const metaClass = cn(
    "flex w-full flex-wrap items-center gap-2 text-[11px] text-text-muted",
    isUser && "justify-end text-white/70",
  );
  const actionButtonClass = cn(
    "inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--glass-border-soft)] bg-surface-inline/70 text-text-muted transition-colors hover:border-[var(--glass-border-strong)] hover:text-text-primary",
    isUser && "border-white/30 bg-white/15 text-white/80 hover:text-white",
  );

  const handleCopy = () => {
    onCopy?.(message.content);
    void navigator.clipboard?.writeText(message.content);
  };

  const handleRetry = () => {
    onRetry?.(message.id);
  };

  return (
    <div className="flex px-3 py-4" data-testid="message.item">
      <div className={bubbleAlignment}>
        <div className={bubbleClass}>
          {contentContainsMarkdown(message.content) ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <div className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</div>
          )}
        </div>

        {!isSystem && (
          <div className={metaClass}>
            <span>{timestamp}</span>
            {formattedModel && (
              <span className="uppercase tracking-[0.2em] text-[10px]">{formattedModel}</span>
            )}
            {typeof message.tokens === "number" && (
              <span>{message.tokens.toLocaleString("de-DE")} Token</span>
            )}
            <div className="ml-auto flex items-center gap-1">
              <button
                className={actionButtonClass}
                onClick={handleCopy}
                title="Nachricht kopieren"
                data-testid="message.copy"
              >
                <Copy className="h-4 w-4" />
              </button>
              {isAssistant && isLast && onRetry && (
                <button
                  className={actionButtonClass}
                  onClick={handleRetry}
                  title="Antwort erneut anfordern"
                  data-testid="message.retry"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
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
