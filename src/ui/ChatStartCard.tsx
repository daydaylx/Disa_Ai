import { Link } from "react-router-dom";

import { BrandWordmark } from "../app/components/BrandWordmark";
import { History, MessageCircle } from "../lib/icons";
import { buttonVariants } from "./Button";
import { PremiumCard } from "./PremiumCard";
import { PrimaryButton } from "./PrimaryButton";

/**
 * ChatStartCard - Premium Hero Card mit Lila-Akzent
 *
 * CHANGES:
 * - Nutzt PremiumCard (Signature-Komponente)
 * - Hero-Variant für visuelles Gewicht
 * - Bessere Mobile-Touch-Ziele
 * - Integriertes Animated Branding
 */

interface ChatStartCardProps {
  onNewChat: () => void;
  conversationCount?: number;
}

export function ChatStartCard({ onNewChat, conversationCount = 0 }: ChatStartCardProps) {
  return (
    <PremiumCard variant="hero" className="text-center relative overflow-hidden">
      <div className="space-y-6 relative z-10">
        <div className="flex flex-col items-center gap-3">
          <BrandWordmark className="text-3xl sm:text-4xl" state="idle" />
          <h2 className="sr-only">Disa AI Chat</h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            Deine intelligente Assistentin für produktive Gespräche.
            <br />
            Starte eine neue Unterhaltung oder wähle einen Workflow.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <PrimaryButton
            size="lg"
            onClick={onNewChat}
            className="flex items-center justify-center gap-2 w-full sm:w-auto shadow-brandGlow"
          >
            <MessageCircle className="h-4 w-4" />
            Neuer Chat
          </PrimaryButton>

          <Link
            to="/chat/history"
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
              className: "flex items-center justify-center gap-2 w-full sm:w-auto",
            })}
          >
            <History className="h-4 w-4" />
            Verlauf
            {conversationCount > 0 && <span className="opacity-60">({conversationCount})</span>}
          </Link>
        </div>
      </div>
    </PremiumCard>
  );
}
