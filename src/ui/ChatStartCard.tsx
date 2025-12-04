import { Link } from "react-router-dom";

import { BrandWordmark } from "../app/components/BrandWordmark";
import { History, Plus, Sparkles } from "../lib/icons";
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
      className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-[var(--border-chalk-strong)] bg-[radial-gradient(circle_at_50%_20%,rgba(243,214,138,0.08),transparent_52%),var(--bg-surface)] px-4 py-7 text-center shadow-[var(--shadow-lg)]"
      style={{
        backgroundImage: "var(--chalk-noise), var(--chalk-dust)",
        backgroundBlendMode: "overlay, screen",
        boxShadow:
          "0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px var(--border-chalk-strong), inset 0 2px 0 rgba(255,255,255,0.05), inset 0 0 80px rgba(243,214,138,0.04)",
      }}
    >
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-[color-mix(in_srgb,var(--accent-primary)_70%,transparent)] bg-[radial-gradient(circle,rgba(243,214,138,0.14),rgba(243,214,138,0.05))] text-accent-primary shadow-[0_16px_42px_rgba(243,214,138,0.45),var(--chalk-glow-accent)]">
        <Sparkles className="h-6 w-6 drop-shadow-[var(--chalk-glow-strong)]" />
        <span
          className="presence-indicator absolute -right-1 -top-1 inline-flex h-3 w-3 rounded-full bg-[var(--accent-secondary)]"
          aria-hidden
        />
      </div>

      <BrandWordmark
        className="text-[1.75rem] sm:text-[1.9rem] tracking-[0.05em] drop-shadow-[var(--chalk-glow-strong)]"
        state="idle"
      />

      <p className="max-w-md text-[13px] leading-relaxed text-text-secondary/90 tracking-[0.02em]">
        Klare Antworten statt Deko.<br />
        Schieferoberfläche, dezente Kreide.
      </p>

      <div className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row">
        <button
          onClick={onNewChat}
          className="group flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-[color-mix(in_srgb,var(--accent-primary)_80%,transparent)] bg-[var(--accent-primary)] px-5 py-3 text-[15px] font-semibold text-[var(--ink-on-accent)] shadow-[0_18px_42px_rgba(243,214,138,0.55),var(--chalk-glow-accent)] transition-all hover:translate-y-[-2px] hover:shadow-[0_24px_54px_rgba(243,214,138,0.65),var(--chalk-glow-accent-strong)] hover:border-[color-mix(in_srgb,var(--accent-primary)_90%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent-primary)_60%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
        >
          <Plus className="h-[18px] w-[18px] drop-shadow-[0_0_2px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110" />
          Neues Gespräch
        </button>

        {conversationCount > 0 && (
          <Link
            to="/chat/history"
            className={buttonVariants({
              variant: "secondary",
              size: "default",
              className:
                "flex w-full items-center justify-center gap-2 border border-[var(--border-chalk-strong)] bg-[rgba(255,255,255,0.05)] text-text-primary shadow-[0_10px_24px_rgba(0,0,0,0.35)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(236,236,236,0.6)] transition-all",
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
