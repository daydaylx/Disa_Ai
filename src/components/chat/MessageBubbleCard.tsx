import type { ComponentPropsWithoutRef } from "react";

import type { GlassTint } from "@/lib/theme/glass";
import { cn } from "@/lib/utils";

import { StaticGlassCard } from "../ui/StaticGlassCard";

interface MessageBubbleCardProps extends ComponentPropsWithoutRef<typeof StaticGlassCard> {
  author: string;
  body: string;
  tint: GlassTint;
  timestamp?: number;
  align?: "left" | "right";
}

/**
 * Read-only message bubble for chat transcripts.
 * Intentionally non-interactive to avoid misleading button semantics.
 */
export function MessageBubbleCard({
  author,
  body,
  tint,
  timestamp,
  align = "left",
  className,
  ...rest
}: MessageBubbleCardProps) {
  const isoTimestamp =
    typeof timestamp === "number" ? new Date(timestamp).toISOString() : undefined;
  const timeLabel =
    typeof timestamp === "number"
      ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : undefined;

  return (
    <StaticGlassCard
      tint={tint}
      padding="sm"
      className={cn(
        "cursor-text select-text transition-none hover:translate-y-0 hover:shadow-none",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
      {...rest}
    >
      <div className="space-y-2">
        <div
          className={cn(
            "flex items-baseline gap-3 text-sm font-semibold text-white",
            align === "right" ? "justify-end" : "justify-start",
          )}
        >
          <span>{author}</span>
          {timeLabel ? (
            <time className="text-xs font-medium text-white/60" dateTime={isoTimestamp}>
              {timeLabel}
            </time>
          ) : null}
        </div>

        <p className="whitespace-pre-wrap text-sm leading-6 text-white/85">{body}</p>
      </div>
    </StaticGlassCard>
  );
}
