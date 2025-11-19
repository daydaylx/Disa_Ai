import { MessageCircle, History } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "./Button";
import { GlassCard } from "./GlassCard";
import { PrimaryButton } from "./PrimaryButton";

interface ChatStartCardProps {
  onNewChat: () => void;
  conversationCount?: number;
}

export function ChatStartCard({ onNewChat, conversationCount = 0 }: ChatStartCardProps) {
  return (
    <GlassCard className="text-center space-y-3 sm:space-y-4">
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">
          Disa AI Chat
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
          Starte ein neues Gespräch oder wähle aus vorbereiteten Workflows
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-2 sm:gap-3">
        <PrimaryButton
          size="lg"
          onClick={onNewChat}
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <MessageCircle className="h-4 w-4" />
          + Neuer Chat
        </PrimaryButton>

        {conversationCount > 0 && (
          <Button variant="secondary" size="lg" className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <Link to="/chat/history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Verlauf ({conversationCount})
            </Link>
          </Button>
        )}
      </div>
    </GlassCard>
  );
}