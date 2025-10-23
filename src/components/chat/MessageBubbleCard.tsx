import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader } from "../../components/ui/card";

type MessageBubbleVariant = "assistant" | "user";

interface MessageBubbleCardProps extends ComponentPropsWithoutRef<"article"> {
  author: string;
  body: string;
  timestamp?: number;
  variant: MessageBubbleVariant;
}

function formatTimestamp(timestamp?: number) {
  if (typeof timestamp !== "number") return { iso: undefined, label: undefined };
  const date = new Date(timestamp);
  return {
    iso: date.toISOString(),
    label: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export function MessageBubbleCard({
  author,
  body,
  timestamp,
  variant,
  className,
  ...props
}: MessageBubbleCardProps) {
  const { iso, label } = formatTimestamp(timestamp);

  // Neo-Depth Configuration based on variant
  const cardConfig = {
    assistant: {
      tone: "glass-subtle" as const,
      borderClass: "border-l-4 border-l-brand",
      bgClass: "bg-brand/3",
      badgeIcon: "🤖",
      badgeClass: "bg-brand/10 text-brand border border-brand/20",
      alignment: "justify-start" as const,
    },
    user: {
      tone: "glass-subtle" as const,
      borderClass: "border-r-4 border-r-purple-500",
      bgClass: "bg-gradient-to-r from-purple-500/3 to-blue-500/3",
      badgeIcon: "👤",
      badgeClass: "bg-purple-500/10 text-purple-700 border border-purple-500/20",
      alignment: "justify-end" as const,
    },
  };

  const config = cardConfig[variant];

  return (
    <div className={cn("flex w-full", config.alignment)}>
      <Card
        role="article"
        tone={config.tone}
        elevation="raised"
        interactive="gentle"
        padding="none"
        className={cn(
          "relative w-full max-w-[min(100%,640px)] overflow-visible",
          config.borderClass,
          config.bgClass,
          className,
        )}
        {...props}
      >
        {/* Role Badge Header */}
        <CardHeader className="pb-2">
          <div
            className={cn(
              "inline-flex max-w-fit items-center gap-2 rounded-[var(--radius-card-inner)] px-3 py-1.5 text-sm font-medium",
              config.badgeClass,
            )}
          >
            <span className="text-sm">{config.badgeIcon}</span>
            <span className="font-semibold">{author}</span>
            {label && (
              <>
                <span className="text-current/50">•</span>
                <time className="text-xs opacity-75" dateTime={iso} title={iso}>
                  {label}
                </time>
              </>
            )}
          </div>
        </CardHeader>

        {/* Message Content with Enhanced Typography */}
        <CardContent className="pt-0">
          <div className="text-text-strong whitespace-pre-wrap text-sm leading-relaxed">{body}</div>
        </CardContent>
      </Card>
    </div>
  );
}
