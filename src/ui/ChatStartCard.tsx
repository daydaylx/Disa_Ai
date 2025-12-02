import { BrandWordmark } from "../app/components/BrandWordmark";
import { History, Sparkles } from "../lib/icons";
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
  onOpenHistory?: () => void;
}

export function ChatStartCard({
  onNewChat,
  conversationCount = 0,
  onOpenHistory,
}: ChatStartCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border-ink/30 bg-paper px-6 py-8 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
        <Sparkles className="h-6 w-6" />
      </div>

      <BrandWordmark className="text-2xl sm:text-3xl" state="idle" />

      <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
        Starte ein neues Gespräch oder setze eine Unterhaltung fort. Schlanke Eingabeleiste, klare
        Kontraste und fokussierte Aktionen sorgen für Ruhe im Flow.
      </p>

      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60"
        >
          <Sparkles className="h-4 w-4" />
          Neues Gespräch
        </button>

        {conversationCount > 0 && onOpenHistory && (
          <button
            type="button"
            onClick={onOpenHistory}
            className={buttonVariants({
              variant: "secondary",
              size: "default",
              className:
                "flex w-full items-center justify-center gap-2 border-border-ink/40 bg-surface-1 text-text-primary",
            })}
          >
            <History className="h-4 w-4" />
            Verlauf ({conversationCount})
          </button>
        )}
      </div>
    </div>
  );
}
