import * as React from "react";

import { cn } from "../../lib/utils/cn";
import { CopyButton } from "../ui/CopyButton";
import { Icon, type IconName } from "../ui/Icon";

export type BubbleStatus = "sent" | "delivered" | "error" | "streaming";

type BaseBubbleProps = {
  children: React.ReactNode;
  timestamp?: number;
  status?: BubbleStatus;
  copyText?: string;
  onCopy?: () => void;
  className?: string;
};

type Variant = "assistant" | "user";

const statusIcon: Record<BubbleStatus, { name: IconName; tone: "muted" | "error" }> = {
  sent: { name: "check", tone: "muted" },
  delivered: { name: "success", tone: "muted" },
  error: { name: "error", tone: "error" },
  streaming: { name: "sparkles", tone: "muted" },
};

function formatTime(timestamp?: number): string {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BubbleBase({
  children,
  timestamp,
  status,
  copyText,
  onCopy,
  variant,
  className,
}: BaseBubbleProps & { variant: Variant }) {
  const hasTimestamp = typeof timestamp === "number";
  const time = hasTimestamp ? formatTime(timestamp) : "";
  const resolvedTimestamp = hasTimestamp ? timestamp : undefined;
  const metaIcon = status ? statusIcon[status] : undefined;

  return (
    <div className={cn("chat-bubble", `chat-bubble--${variant}`, className)} data-status={status}>
      {copyText ? (
        <CopyButton
          text={copyText}
          onCopied={onCopy}
          className="chat-bubble__copy"
          aria-label="Nachricht kopieren"
        >
          <Icon name="copy" size={16} title="Kopieren" />
        </CopyButton>
      ) : null}

      <div className="chat-bubble__content">{children}</div>

      {(time || metaIcon) && (
        <div className="chat-bubble__meta">
          {resolvedTimestamp !== undefined ? (
            <time
              className="chat-bubble__timestamp"
              dateTime={new Date(resolvedTimestamp).toISOString()}
            >
              {time}
            </time>
          ) : null}
          {metaIcon ? (
            <span
              className={cn(
                "chat-bubble__status",
                metaIcon.tone === "error" ? "chat-bubble__status--error" : undefined,
              )}
            >
              <Icon name={metaIcon.name} size={14} aria-hidden />
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

export type UserBubbleProps = BaseBubbleProps;
export function UserBubble({ children, ...props }: UserBubbleProps) {
  return (
    <BubbleBase variant="user" {...props}>
      {children}
    </BubbleBase>
  );
}

export type AssistantBubbleProps = BaseBubbleProps;
export function AssistantBubble({ children, ...props }: AssistantBubbleProps) {
  return (
    <BubbleBase variant="assistant" {...props}>
      {children}
    </BubbleBase>
  );
}
