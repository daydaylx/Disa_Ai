import React from "react";

import { MessageItem } from "../chat/MessageItem";
import { Message } from "../chat/types";
export function ChatMain({ messages }: { messages: Message[] }) {
  return (
    <div className="flex-1 overflow-y-auto" aria-label="Chat messages">
      <div className="mx-auto max-w-[900px] space-y-4 px-4 py-5">
        {messages.map((m) => (
          <MessageItem key={m.id} msg={m} align={m.role === "user" ? "right" : "left"} />
        ))}
      </div>
    </div>
  );
}
