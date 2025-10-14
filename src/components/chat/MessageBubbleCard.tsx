import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

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

  return (
    <article
      className={cn(
        "relative w-full max-w-[min(100%,640px)] overflow-hidden rounded-base border px-4 py-3",
        variant === "assistant"
          ? "border-border bg-surface-1 pl-6"
          : "border-border bg-surface-2 pr-6",
        className,
      )}
      {...props}
    >
      {variant === "assistant" && (
        <span className="brand-rail absolute left-0 top-0 h-full w-1 bg-brand" aria-hidden="true" />
      )}
      <header
        className={cn(
          "mb-2 flex items-baseline gap-3 text-xs font-medium uppercase tracking-[0.08em]",
          variant === "assistant" ? "text-text-1" : "text-text-1",
        )}
      >
        <span className="truncate">{author}</span>
        {label ? (
          <time className="text-[11px] font-normal text-text-1" dateTime={iso}>
            {label}
          </time>
        ) : null}
      </header>
      <p className="whitespace-pre-wrap text-sm leading-6 text-text-0">{body}</p>
    </article>
  );
}
