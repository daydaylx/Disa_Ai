import React from "react";

import type { Quickstart } from "@/config/quickstarts";
import { CATEGORY_LABELS, QUICKSTARTS } from "@/config/quickstarts";
import { Brain, Link2 } from "@/lib/icons";
import { buttonVariants } from "@/ui/Button";
import { PremiumCard } from "@/ui/PremiumCard";

const LINK_ACTIONS = [
  { label: "Modelle vergleichen", href: "/models" },
  { label: "Rollenbibliothek erkunden", href: "/roles" },
  { label: "API-Key prüfen", href: "/settings/api-data" },
];

interface QuickstartGridProps {
  onStart: (system: string, user?: string) => void;
  title?: string;
  description?: string;
}

export function QuickstartGrid({
  onStart,
  title = "Schnellstart-Flows",
  description = "Vorgefertigte Prompts für typische Aufgaben – tippe und starte direkt fokussiert.",
}: QuickstartGridProps) {
  // Accessibility helper for keyboard navigation
  const handleKeyActivate = (event: React.KeyboardEvent, system: string, user?: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onStart(system, user);
    }
  };

  // Split discussions: Regular vs. Conspiracy Theories
  const regularDiscussions = QUICKSTARTS.filter((q) => q.category !== "verschwörungstheorien");
  const conspiracyDiscussions = QUICKSTARTS.filter((q) => q.category === "verschwörungstheorien");

  // Helper: Render carousel for a given set of quickstarts
  const renderCarousel = (quickstarts: Quickstart[]) => (
    <section
      className="flex gap-4 overflow-x-auto touch-pan-x overscroll-x-contain snap-x snap-mandatory pb-3 -mx-[var(--spacing-3)] px-[var(--spacing-3)]"
      style={{
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <style>{`
        section::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {quickstarts.map((quickstart) => {
        const Icon = quickstart.icon || Brain;
        const categoryInfo = quickstart.category ? CATEGORY_LABELS[quickstart.category] : null;
        return (
          <PremiumCard
            key={quickstart.id}
            withAccentStrip={false}
            className="flex flex-col gap-3 snap-center shrink-0 w-[86vw] sm:w-[48vw] md:w-[32vw] lg:w-[300px] bg-bg-page border border-border-ink shadow-[0_10px_24px_-18px_rgba(17,24,39,0.65)] before:opacity-0 focus-visible:ring-2 focus-visible:ring-border-ink focus-visible:ring-offset-4 focus-visible:ring-offset-bg-page"
            onClick={() => onStart(quickstart.system, quickstart.user)}
            interactiveRole="button"
            onKeyDown={(event) => handleKeyActivate(event, quickstart.system, quickstart.user)}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-ink bg-surface-2 text-ink-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="text-base font-semibold text-ink-primary leading-tight">
                  {quickstart.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {categoryInfo && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border-ink/60 bg-bg-page text-ink-primary">
                      {categoryInfo.label}
                    </span>
                  )}
                  {quickstart.speculative && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-900/20 bg-amber-50 text-amber-800">
                      Hypothese
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-ink-secondary/90 flex-1 leading-relaxed">
              {quickstart.description}
            </p>
            <span className="text-xs font-semibold text-ink-primary inline-flex items-center gap-1">
              Starten
              <span className="text-ink-secondary">→</span>
            </span>
          </PremiumCard>
        );
      })}
    </section>
  );

  return (
    <div className="space-y-6">
      {(title || description) && (
        <section className="rounded-xl border border-border-ink bg-bg-page shadow-[0_18px_50px_-40px_rgba(15,23,42,0.6)] px-[var(--spacing-4)] py-[var(--spacing-4)] space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-secondary/80">
            Workflows
          </p>
          {title && <h2 className="text-2xl font-semibold text-ink-primary">{title}</h2>}
          {description && (
            <p className="max-w-2xl text-sm text-ink-secondary/90 leading-relaxed">{description}</p>
          )}
          <div className="h-px w-full bg-gradient-to-r from-border-ink/70 via-border-ink/30 to-transparent" />
        </section>
      )}

      {/* Card 1: Regular Discussions */}
      <div className="rounded-xl border border-border-ink bg-bg-page shadow-[0_18px_50px_-40px_rgba(15,23,42,0.6)] px-[var(--spacing-4)] py-[var(--spacing-4)] space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-ink-primary">Diskussionen</h3>
          <p className="text-xs text-ink-secondary/90">
            Wähle ein Thema und starte eine Diskussion mit der KI.
          </p>
        </div>
        {renderCarousel(regularDiscussions)}
      </div>

      {/* Card 2: Conspiracy Theories – Separate card below */}
      {conspiracyDiscussions.length > 0 && (
        <div className="rounded-xl border border-border-ink bg-bg-page shadow-[0_18px_50px_-40px_rgba(15,23,42,0.6)] px-[var(--spacing-4)] py-[var(--spacing-4)] space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-ink-primary flex items-center gap-2">
              Verschwörungstheorien
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-border-ink/60 bg-surface-2 text-ink-secondary/90">
                Kontrovers
              </span>
            </h3>
            <p className="text-xs text-ink-secondary/90">
              Hier kannst du kontroverse Themen kritisch mit einer KI besprechen.
            </p>
          </div>
          {renderCarousel(conspiracyDiscussions)}
        </div>
      )}

      <section className="flex flex-wrap gap-2">
        {LINK_ACTIONS.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "inline-flex items-center gap-2 text-ink-primary",
            })}
          >
            <Link2 className="h-3.5 w-3.5" />
            {action.label}
          </a>
        ))}
      </section>
    </div>
  );
}
