import React from "react";

import { MessageHandlers } from "../chat/messageHandlers";
import { MessageItem } from "../chat/MessageItem";
import { Message } from "../chat/types";

export function ChatMain({
  messages,
  handlers,
}: {
  messages: Message[];
  handlers?: MessageHandlers;
}) {
  return (
    <div className="flex-1 overflow-y-auto" aria-label="Chat messages">
      <div className="mx-auto max-w-[900px] space-y-4 px-4 py-5">
        {messages.map((m) => (
          <MessageItem
            key={m.id}
            msg={m}
            align={m.role === "user" ? "right" : "left"}
            handlers={handlers}
          />
        ))}
      </div>
    </div>
  );
}
