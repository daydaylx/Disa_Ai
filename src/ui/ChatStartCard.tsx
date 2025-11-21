import { Link } from "react-router-dom";

import { History, MessageCircle } from "../lib/icons";
import { Button } from "./Button";
import { PremiumCard } from "./PremiumCard";
import { PrimaryButton } from "./PrimaryButton";

/**
 * ChatStartCard - Premium Hero Card mit Lila-Akzent
 *
 * CHANGES:
 * - Nutzt PremiumCard (Signature-Komponente)
 * - Hero-Variant für visuelles Gewicht
 * - Bessere Mobile-Touch-Ziele
 */

interface ChatStartCardProps {
  onNewChat: () => void;
  conversationCount?: number;
}

export function ChatStartCard({ onNewChat, conversationCount = 0 }: ChatStartCardProps) {
  return (
    <PremiumCard variant="hero" className="text-center">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">Disa AI Chat</h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            Starte ein neues Gespräch oder wähle aus vorbereiteten Workflows
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <PrimaryButton
            size="lg"
            onClick={onNewChat}
            className="flex items-center justify-center gap-2 w-full sm:w-auto shadow-brandGlow"
          >
            <MessageCircle className="h-4 w-4" />
            Neuer Chat
          </PrimaryButton>

          {conversationCount > 0 && (
            <Button
              variant="secondary"
              size="lg"
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Link to="/chat/history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Verlauf ({conversationCount})
              </Link>
            </Button>
          )}
        </div>
      </div>
    </PremiumCard>
  );
}
