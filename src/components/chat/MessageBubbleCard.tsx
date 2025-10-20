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
        "relative w-full max-w-[min(100%,640px)] overflow-hidden rounded-base border transition-all duration-200",
        variant === "assistant"
          ? "glass glass--subtle border-border/80 pl-6 hover:-translate-y-[1px] hover:shadow-level2"
          : "glass glass--strong border-border/60 pr-6 hover:-translate-y-[1px] hover:shadow-level3",
        className,
      )}
      {...props}
    >
      {/* Brand rail for assistant messages */}
      {variant === "assistant" && (
        <span
          className="brand-rail absolute left-0 top-0 h-full w-1 rounded-r-full"
          aria-hidden="true"
        />
      )}

      {/* User indicator */}
      {variant === "user" && (
        <div
          className="from-accent1/80 to-accent2/80 absolute right-0 top-0 h-full w-1 rounded-l-full bg-gradient-to-b"
          aria-hidden="true"
        />
      )}

      <header
        className={cn(
          "mb-2 flex items-baseline gap-3 text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-200",
          variant === "assistant" ? "text-text-1" : "text-text-1",
        )}
      >
        <span className="truncate font-semibold">{author}</span>
        {label ? (
          <time
            className="text-[11px] font-normal text-text-1 opacity-70 transition-opacity duration-200 group-hover:opacity-100"
            dateTime={iso}
          >
            {label}
          </time>
        ) : null}
      </header>

      <p className="whitespace-pre-wrap text-sm leading-6 text-text-0 transition-colors duration-200">
        {body}
      </p>

      {/* Subtle hover effect overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-base bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </article>
  );
}
