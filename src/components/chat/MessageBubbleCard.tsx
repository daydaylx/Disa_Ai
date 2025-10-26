import type { ComponentPropsWithoutRef, CSSProperties } from "react";

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

  const cardConfig: Record<
    MessageBubbleVariant,
    {
      alignment: "justify-start" | "justify-end";
      accentColor: string;
      bubbleTint: number;
      badgeTint: number;
      badgeText: string;
      badgeIcon: string;
    }
  > = {
    assistant: {
      alignment: "justify-start",
      accentColor: "var(--color-brand-primary)",
      bubbleTint: 6,
      badgeTint: 14,
      badgeText: "var(--color-brand-strong)",
      badgeIcon: "🤖",
    },
    user: {
      alignment: "justify-end",
      accentColor: "var(--acc2)",
      bubbleTint: 5,
      badgeTint: 12,
      badgeText: "var(--color-text-primary)",
      badgeIcon: "👤",
    },
  };

  const config = cardConfig[variant];
  const bubbleStyles: CSSProperties = {
    background: `color-mix(in srgb, ${config.accentColor} ${config.bubbleTint}%, var(--color-surface-card))`,
    borderColor: `color-mix(in srgb, ${config.accentColor} 18%, var(--color-border-hairline))`,
  };
  const badgeStyles: CSSProperties = {
    background: `color-mix(in srgb, ${config.accentColor} ${config.badgeTint}%, var(--color-surface-card))`,
    borderColor: `color-mix(in srgb, ${config.accentColor} 32%, transparent)`,
    color: config.badgeText,
  };
  const accentStyles: CSSProperties = {
    background: `color-mix(in srgb, ${config.accentColor} 65%, transparent)`,
  };

  return (
    <div className={cn("flex w-full", config.alignment)}>
      <Card
        role="article"
        tone="default"
        elevation="surface"
        interactive={false}
        padding="none"
        className={cn(
          "relative w-full max-w-[min(100%,640px)] overflow-visible border border-border-hairline text-text-primary",
          className,
        )}
        style={bubbleStyles}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-4 bottom-4 w-1 rounded-full",
            variant === "assistant" ? "left-2" : "right-2",
          )}
          style={accentStyles}
        />
        {/* Role Badge Header */}
        <CardHeader className="pb-2">
          <div
            className={cn(
              "inline-flex max-w-fit items-center gap-2 rounded-[var(--radius-card-inner)] border px-3 py-1.5 text-sm font-medium",
            )}
            style={badgeStyles}
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
          <div className="text-text-primary whitespace-pre-wrap text-sm leading-relaxed">
            {body}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
