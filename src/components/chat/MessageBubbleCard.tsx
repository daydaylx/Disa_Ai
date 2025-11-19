import { GlassCard } from "@/ui";

import { cn } from "../../lib/utils";

interface MessageBubbleCardProps {
  author: string;
  body: string;
  timestamp: string | number | Date;
  variant?: "user" | "assistant";
  className?: string;
}

const timeFormatter = new Intl.DateTimeFormat("de-DE", {
  hour: "2-digit",
  minute: "2-digit",
});

export function MessageBubbleCard({
  author,
  body,
  timestamp,
  variant = "assistant",
  className,
}: MessageBubbleCardProps) {
  const isUser = variant === "user";
  const formattedTime =
    timestamp instanceof Date
      ? timeFormatter.format(timestamp)
      : timeFormatter.format(new Date(timestamp));

  return (
    <GlassCard
      className={cn(
        "px-4 py-3 text-left",
        isUser
          ? "border-[var(--glass-border-medium)] bg-[var(--glass-surface-strong)] text-[var(--color-text-primary)]"
          : "border-[var(--glass-border-soft)] bg-[var(--glass-surface-subtle)] text-[var(--text-primary)]",
        className,
      )}
    >
      <div
        className={cn(
          "mb-1 flex items-center justify-between text-xs font-medium",
          isUser && "flex-row-reverse",
        )}
      >
        <span>{author}</span>
        <span className="text-[var(--text-muted)]">{formattedTime}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{body}</p>
    </GlassCard>
  );
}
