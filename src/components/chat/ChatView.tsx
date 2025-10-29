import { History, Plus } from "lucide-react";
import { type RefObject } from "react";

import type { ChatMessageType } from "../../types/chatMessage";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { MessageBubble } from "./MessageBubble";

interface ChatViewProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  newConversation: () => void;
  openHistory: () => void;
}

export function ChatView({
  messages,
  isLoading,
  messagesEndRef,
  newConversation,
  openHistory,
}: ChatViewProps) {
  return (
    <>
      <header className="mobile-chat-header space-y-stack-gap">
        {/* Chat Header */}
        <div className="space-y-1">
          <h2 className="text-token-h2 text-text-strong text-balance font-semibold">
            Unterhaltung
          </h2>
          <p className="text-sm leading-6 text-text-muted">
            Aktuelle Unterhaltung mit Disa&nbsp;AI.
          </p>
        </div>
        <div
          className="mobile-chat-toolbar flex flex-wrap items-center gap-2 justify-center"
          role="toolbar"
        >
          <Button
            onClick={newConversation}
            variant="brand"
            size="lg"
            className="shadow-neon mobile-btn mobile-btn-primary touch-target"
          >
            <Plus className="h-4 w-4" />
            <span>Neue Unterhaltung</span>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={openHistory}
                variant="secondary"
                size="icon"
                className="mobile-btn mobile-btn-secondary touch-target"
              >
                <History className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Verlauf öffnen</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <div className="mobile-chat-messages">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="mobile-chat-loading animate-fade-in flex justify-start">
            {/* Loading Indicator */}
            <div className="border-border mr-12 max-w-[85%] rounded-lg border bg-surface-card p-4">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-brand-primary motion-safe:animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-brand-primary [animation-delay:0.15s] motion-safe:animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-brand-primary [animation-delay:0.3s] motion-safe:animate-bounce"></div>
                </div>
                <span className="text-sm text-text-muted motion-safe:animate-pulse">
                  Disa denkt nach...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
