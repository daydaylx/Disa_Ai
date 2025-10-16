import React from "react";

import { Glass } from "./Glass";

type BubbleKind = "assistant" | "user";

interface ChatBubbleProps {
  kind: BubbleKind;
  children: React.ReactNode;
  timestamp?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ kind, children, timestamp }) => {
  const side = kind === "user" ? "items-end ml-auto" : "items-start mr-auto";
  const glassVariant = kind === "user" ? "standard" : "subtle";

  return (
    <Glass
      variant={glassVariant}
      className={`max-w-[78%] ${side} px-3 py-2 transition-all duration-300 ease-out`}
    >
      <div className="flex flex-col">
        <p className="text-[var(--fg)]/92 leading-6">{children}</p>
        {timestamp && (
          <span className="mt-1 self-end text-xs text-[var(--fg-dim)]">{timestamp}</span>
        )}
      </div>
    </Glass>
  );
};
