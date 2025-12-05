import { Link } from "react-router-dom";

import { History, MessageCircle, Plus } from "../lib/icons";
import { cn } from "../lib/utils";
import { Button } from "./Button";

/**
 * ChatStartCard - Minimalist welcome card
 *
 * Clean, calm design without decorative clutter.
 * Focuses on the primary action: starting a new conversation.
 */

interface ChatStartCardProps {
  onNewChat: () => void;
  conversationCount?: number;
}

export function ChatStartCard({ onNewChat, conversationCount = 0 }: ChatStartCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-12 text-center max-w-sm mx-auto">
      {/* Icon */}
      <div className="h-16 w-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
        <MessageCircle className="h-8 w-8" />
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-ink-primary tracking-tight">
          Worüber möchtest du sprechen?
        </h2>
        <p className="text-sm text-ink-secondary leading-relaxed">
          Stelle Fragen, lass dir helfen oder erkunde neue Ideen.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button
          onClick={onNewChat}
          variant="primary"
          size="lg"
          className="w-full gap-2"
        >
          <Plus className="h-5 w-5" />
          Neues Gespräch
        </Button>

        {conversationCount > 0 && (
          <Link to="/chat/history" className="w-full">
            <Button
              variant="secondary"
              size="lg"
              className={cn("w-full gap-2")}
            >
              <History className="h-4 w-4" />
              Verlauf ({conversationCount})
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
