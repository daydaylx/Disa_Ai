import { Link } from "react-router-dom";

import { BrandWordmark } from "../app/components/BrandWordmark";
import { Book, History, Sparkles } from "../lib/icons";
import { buttonVariants } from "./Button";

/**
 * ChatStartCard - Tinte auf Papier Stil
 *
 * Buch-Metapher: "Seite 1 - Ein neues Kapitel"
 * Dezent, einladend, keine bunten Kacheln
 */

interface ChatStartCardProps {
  onNewChat: () => void;
  conversationCount?: number;
}

export function ChatStartCard({ onNewChat, conversationCount = 0 }: ChatStartCardProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      {/* Buch-Icon */}
      <div className="w-16 h-16 rounded-2xl bg-surface-1 border border-border-ink/20 flex items-center justify-center mb-6 shadow-sm">
        <Book className="w-8 h-8 text-accent-primary" />
      </div>

      {/* Branding */}
      <BrandWordmark className="text-2xl sm:text-3xl mb-3" state="idle" />

      {/* Tagline */}
      <p className="text-sm text-ink-secondary max-w-xs mx-auto leading-relaxed mb-8">
        Dein digitales Notizbuch für Gespräche.
        <br />
        <span className="text-ink-tertiary">Schreibe los – diese Seite wartet auf dich.</span>
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={onNewChat}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ink-primary text-surface-1 font-medium text-sm hover:bg-ink-primary/90 active:scale-[0.98] transition-all shadow-sm w-full"
        >
          <Sparkles className="h-4 w-4" />
          Beginne zu schreiben
        </button>

        {conversationCount > 0 && (
          <Link
            to="/chat/history"
            className={buttonVariants({
              variant: "secondary",
              size: "default",
              className: "flex items-center justify-center gap-2 w-full border-border-ink/30",
            })}
          >
            <History className="h-4 w-4" />
            Verlauf ({conversationCount})
          </Link>
        )}
      </div>
    </div>
  );
}
