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
        "group relative w-full max-w-[min(100%,640px)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] bg-surface-card text-text-primary shadow-surface transition-all duration-small ease-standard focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-canvas)]",
        variant === "assistant"
          ? "py-3 pl-6 pr-5 sm:py-4 sm:pl-8 sm:pr-6"
          : "bg-surface-2 py-3 pl-5 pr-6 sm:py-4 sm:pl-6 sm:pr-8",
        "motion-safe:hover:-translate-y-[1px] motion-safe:hover:shadow-raised",
        className,
      )}
      {...props}
    >
      {/* Brand rail for assistant messages */}
      {variant === "assistant" && (
        <span
          className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-[var(--color-brand-primary)]"
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
          "mb-2 flex items-baseline gap-3 text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary transition-colors duration-small ease-standard",
          variant === "assistant" ? "sm:pl-1" : "sm:pr-1",
        )}
      >
        <span className="truncate font-semibold">{author}</span>
        {label ? (
          <time
            className="text-[11px] font-normal text-text-muted opacity-70 transition-opacity duration-small ease-standard group-hover:opacity-100"
            dateTime={iso}
          >
            {label}
          </time>
        ) : null}
      </header>

      <p className="whitespace-pre-wrap text-[15px] leading-7 text-text-strong transition-colors duration-small ease-standard">
        {body}
      </p>
    </article>
  );
}
