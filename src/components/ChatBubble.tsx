import React from "react";

import { SoftDepthSurface } from "./Glass";

type BubbleKind = "assistant" | "user";

interface ChatBubbleProps {
  kind: BubbleKind;
  children: React.ReactNode;
  timestamp?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ kind, children, timestamp }) => {
  const side = kind === "user" ? "items-end ml-auto" : "items-start mr-auto";
  const surfaceVariant = kind === "user" ? "standard" : "subtle";

  return (
    <SoftDepthSurface
      variant={surfaceVariant}
      className={`max-w-[78%] ${side} px-2 py-1 transition-all duration-300 ease-out`}
    >
      <div className="flex flex-col">
        <p className="text-[var(--fg)]/92 leading-6">{children}</p>
        {timestamp && (
          <span className="mt-1 self-end text-xs text-[var(--fg-dim)]">{timestamp}</span>
        )}
      </div>
    </SoftDepthSurface>
  );
};
