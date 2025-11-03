import * as React from "react";

import { cn } from "../../lib/cn";

export interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: "user" | "ai";
}

const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ className, variant, children, ...props }, ref) => {
    const wrapperClasses = cn("flex w-full", variant === "user" ? "justify-end" : "justify-start");

    const baseClasses = ["max-w-[80%] rounded-2xl px-4 py-3 shadow-neo-sm transition-colors"];
    const variantClasses =
      variant === "user"
        ? [
            "bg-[var(--acc2)]",
            "text-[var(--color-text-on-accent)]",
            "shadow-[var(--shadow-glow-accent-subtle)]",
          ]
        : [
            "bg-[var(--surface-neumorphic-base)]",
            "border border-[var(--border-neumorphic-subtle)]",
            "text-[var(--color-text-primary)]",
          ];
    const bubbleClasses = cn(...baseClasses, ...variantClasses, className);

    return (
      <div ref={ref} className={wrapperClasses} data-testid="message-bubble" {...props}>
        <div className={bubbleClasses} data-testid="message-content">
          {children}
        </div>
      </div>
    );
  },
);
MessageBubble.displayName = "MessageBubble";

export { MessageBubble };
