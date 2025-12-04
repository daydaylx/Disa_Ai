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
      className="relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-[var(--border-chalk-strong)] bg-[radial-gradient(circle_at_50%_20%,rgba(243,214,138,0.06),transparent_48%),var(--bg-surface)] px-4 py-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.55),0_0_0_1px_var(--border-chalk)]"
      style={{
        backgroundImage: "var(--chalk-noise)",
        backgroundBlendMode: "overlay",
        boxShadow:
          "0 14px 44px rgba(0,0,0,0.6), 0 0 0 1px var(--border-chalk-strong), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-chalk-strong)] bg-[rgba(243,214,138,0.08)] text-accent-primary shadow-[0_10px_30px_rgba(243,214,138,0.28)]">
        <Sparkles className="h-5 w-5 drop-shadow-[var(--chalk-glow)]" />
        <span
          className="absolute -right-1 -top-1 inline-flex h-3 w-3 animate-pulse rounded-full bg-[var(--accent-secondary)] shadow-[0_0_0_6px_rgba(125,220,211,0.12)]"
          aria-hidden
        />
      </div>

      <BrandWordmark
        className="text-2xl sm:text-[1.6rem] tracking-[0.04em] drop-shadow-[var(--chalk-glow)]"
        state="idle"
      />

      <p className="max-w-xl text-sm leading-snug text-text-secondary tracking-[0.02em]">
        Klare Antworten statt Deko. Matte Schieferoberfläche, dezente Kreide.
      </p>

      <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--accent-primary)_65%,transparent)] bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-on-accent)] shadow-[0_14px_32px_rgba(243,214,138,0.4)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_42px_rgba(243,214,138,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent-primary)_55%,transparent)]"
        >
          <Plus className="h-4 w-4" />
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
