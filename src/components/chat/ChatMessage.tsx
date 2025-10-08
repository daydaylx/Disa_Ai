import { Bot, Copy, RotateCcw, User } from "lucide-react";
import { useMemo, useState } from "react";

import { useStudio } from "../../app/state/StudioContext";
import { useGlassPalette } from "../../hooks/useGlassPalette";
import {
  createRoleTint,
  DEFAULT_GLASS_VARIANTS,
  type GlassTint,
  gradientToTint,
} from "../../lib/theme/glass";
import { cn } from "../../lib/utils";
import type { ChatMessageType } from "../../types/chatMessage";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { StaticGlassCard } from "../ui/StaticGlassCard";

export type { ChatMessageType } from "../../types/chatMessage";

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
      content: match[2] || "",
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
  const { accentColor, activeRole } = useStudio();
  const palette = useGlassPalette();

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  const parsedContent = parseMessageContent(message.content);

  const userTint = useMemo(() => createRoleTint(accentColor), [accentColor]);
  const assistantTint = useMemo(() => {
    const roleAccent = activeRole?.styleHints?.accentColor;
    if (roleAccent) return createRoleTint(roleAccent);
    const gradient: string = palette[1] ?? palette[0] ?? DEFAULT_GLASS_VARIANTS[0]!;
    return gradientToTint(gradient) ?? createRoleTint();
  }, [activeRole?.styleHints?.accentColor, palette]);

  const systemTint: GlassTint = {
    from: "hsla(220, 26%, 28%, 0.9)",
    to: "hsla(220, 28%, 20%, 0.78)",
  };

  const bubbleTint = isUser ? userTint : isAssistant ? assistantTint : systemTint;

  const bubbleClass = cn(
    "max-w-[85%] text-left",
    isUser && "ml-auto text-right",
    isSystem && "mx-auto max-w-[70%] text-center",
  );

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
      data-testid="message.item"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <Avatar
        className={cn("h-9 w-9 shadow-[0_8px_24px_rgba(15,23,42,0.45)]", isSystem && "hidden")}
      >
        <AvatarFallback
          className={cn("border border-white/15 bg-black/30 text-white", isUser && "text-zinc-900")}
          style={
            isUser
              ? { background: `linear-gradient(135deg, ${userTint.from} 0%, ${userTint.to} 100%)` }
              : undefined
          }
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
        <StaticGlassCard
          tint={bubbleTint}
          contrastOverlay={isSystem}
          padding="sm"
          className={bubbleClass}
        >
          <div className="space-y-3">
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
        </StaticGlassCard>

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
              data-testid="message.copy"
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
}
