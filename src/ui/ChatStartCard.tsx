import { Link } from "react-router-dom";

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
}

export function ChatStartCard({ onNewChat, conversationCount = 0 }: ChatStartCardProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--border-chalk-blur)] bg-[rgba(255,255,255,0.02)] px-6 py-8 text-center shadow-[var(--chalk-line-shadow)] relative overflow-hidden"
      style={{
        backgroundImage: "var(--chalk-noise)",
        backgroundBlendMode: "overlay",
        boxShadow: "0 0 0 1px var(--border-chalk-blur), var(--chalk-line-shadow)",
      }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-chalk-blur)] bg-[rgba(255,255,255,0.03)] text-accent-primary shadow-[var(--chalk-glow)]">
        <Sparkles className="h-6 w-6 drop-shadow-[var(--chalk-glow)]" />
      </div>

      <BrandWordmark
        className="text-2xl sm:text-3xl drop-shadow-[var(--chalk-glow)]"
        state="idle"
      />

      <p className="max-w-xl text-sm leading-relaxed text-text-secondary tracking-[0.01em]">
        Formuliere deine Frage oder hol dir einen klaren Zweitblick. Matte Schieferoberfläche,
        dezente Kreide – der Fokus liegt auf Inhalt, nicht auf Deko.
      </p>

      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-chalk)] bg-[rgba(236,236,236,0.06)] px-5 py-3 text-sm font-semibold text-text-primary transition hover:bg-[rgba(236,236,236,0.09)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-chalk-strong)]"
        >
          <Sparkles className="h-4 w-4 text-accent-primary" />
          Neues Gespräch
        </button>

        {conversationCount > 0 && (
          <Link
            to="/chat/history"
            className={buttonVariants({
              variant: "secondary",
              size: "default",
              className:
                "flex w-full items-center justify-center gap-2 border-[var(--border-chalk)] bg-[rgba(255,255,255,0.04)] text-text-primary shadow-[0_8px_20px_rgba(0,0,0,0.22)] hover:bg-[rgba(255,255,255,0.06)]",
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
