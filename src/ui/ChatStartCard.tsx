import { Link } from "react-router-dom";

import { BrandWordmark } from "../app/components/BrandWordmark";
import { History, Sparkles } from "../lib/icons";
import { buttonVariants } from "./Button";

export interface QuickStartItem {
  label: string;
  prompt: string;
}

/**
 * ChatStartCard - Tinte auf Papier Stil
 *
 * Buch-Metapher: "Seite 1 - Ein neues Kapitel"
 * Dezent, einladend, keine bunten Kacheln
 */

interface ChatStartCardProps {
  onNewChat: () => void;
  onQuickStart?: (prompt: string) => void;
  conversationCount?: number;
  quickStarts?: QuickStartItem[];
}

const DEFAULT_QUICK_STARTS: QuickStartItem[] = [
  { label: "Frag mich nach Ideen", prompt: "Welche Ideen hast du für mein nächstes Projekt?" },
  { label: "Hilf mir bei Text", prompt: "Kannst du mir einen kurzen Teaser formulieren?" },
  { label: "Erkläre mir etwas", prompt: "Erkläre mir dieses Thema so, dass es ein Kind versteht." },
];

export function ChatStartCard({
  onNewChat,
  onQuickStart,
  conversationCount = 0,
  quickStarts = DEFAULT_QUICK_STARTS,
}: ChatStartCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border-ink/30 bg-surface-2 px-6 py-8 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
        <Sparkles className="h-6 w-6" />
      </div>

      <BrandWordmark className="text-2xl sm:text-3xl" state="idle" />

      <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
        Starte ein neues Gespräch oder setze eine Unterhaltung fort. Schlanke Eingabeleiste, klare
        Kontraste und fokussierte Aktionen sorgen für Ruhe im Flow.
      </p>

      {quickStarts.length > 0 && (
        <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:gap-3">
          {quickStarts.slice(0, 3).map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                onNewChat();
                onQuickStart?.(item.prompt);
              }}
              className="rounded-full border border-border-ink/40 bg-surface-1 px-4 py-2 text-xs font-medium text-text-primary transition hover:border-border-ink/70 hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60"
        >
          <Sparkles className="h-4 w-4" />
          Neues Gespräch
        </button>

        {conversationCount > 0 && (
          <Link
            to="/chat/history"
            className={buttonVariants({
              variant: "secondary",
              size: "default",
              className:
                "flex w-full items-center justify-center gap-2 border-border-ink/40 bg-surface-1 text-text-primary",
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
