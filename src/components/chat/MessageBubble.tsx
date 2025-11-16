import type { ChatMessageType } from "../../types";
import { MessageBubbleCard } from "./MessageBubbleCard";

export function MessageBubble({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <MessageBubbleCard
        author={isUser ? "Du" : "Disa AI"}
        body={message.content}
        timestamp={message.timestamp}
        variant={isUser ? "user" : "assistant"}
        className={`max-w-[85%] ${isUser ? "ml-12" : "mr-12"}`}
      />
    </div>
  );
}
