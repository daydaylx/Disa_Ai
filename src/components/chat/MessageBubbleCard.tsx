import { MaterialCard } from "@/ui";

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
    <MaterialCard
      variant={isUser ? "inset" : "raised"}
      spineSide={isUser ? "right" : "left"}
      className={cn(
        "w-full max-w-[92vw] sm:max-w-3xl px-4 py-3 sm:px-5 sm:py-4 text-left animate-bubble-in",
        isUser ? "bg-surface-inset" : "bg-surface-2",
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
      <p className="whitespace-pre-wrap text-base leading-7 sm:text-[17px] sm:leading-8">{body}</p>
    </MaterialCard>
  );
}
