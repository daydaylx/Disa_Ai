import * as React from "react";

import { cn } from "../../lib/cn";

export interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: "user" | "ai";
}

const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ className, variant, children, ...props }, ref) => {
    const wrapperClasses = cn("flex w-full", variant === "user" ? "justify-end" : "justify-start");

    const bubbleClasses = cn(
      "max-w-[80%] rounded-2xl px-4 py-3",
      variant === "user" ? "bg-brand text-white" : "bg-surface-1 text-text-0",
      className,
    );

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
