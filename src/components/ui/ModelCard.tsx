import { Check, Info } from "lucide-react";
import { useId } from "react";

import { cn } from "../../lib/utils";

interface ModelCardProps {
  id: string;
  name: string;
  provider: string;
  priceIn: number;
  priceOut: number;
  contextTokens?: number;
  description: string;
  isSelected: boolean;
  isOpen: boolean;
  onSelect: () => void;
  onToggleDetails: () => void;
}

const priceFormatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

function formatPrice(value: number) {
  if (value === 0) return "Kostenlos";
  return `$${priceFormatter.format(value)}/1M`;
}

function formatContext(ctx?: number) {
  if (!ctx) return "Unbekannte Kontextlänge";
  if (ctx >= 1_000_000) return `${(ctx / 1_000_000).toFixed(1)} Mio. Token`;
  if (ctx >= 1000) return `${(ctx / 1000).toFixed(0)}k Token`;
  return `${ctx.toLocaleString()} Token`;
}

export function ModelCard({
  id,
  name,
  provider,
  priceIn,
  priceOut,
  contextTokens,
  description,
  isSelected,
  isOpen,
  onSelect,
  onToggleDetails,
}: ModelCardProps) {
  const detailId = useId();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-controls={detailId}
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border border-[var(--border-glass)]",
        "bg-[var(--glass-layer-card)] p-4 text-left text-[var(--text-on-glass)] shadow-[var(--glass-shadow)]",
        "supports-[backdrop-filter]:backdrop-saturate-125 backdrop-blur-[var(--glass-blur)] transition-transform duration-200",
        "focus:outline-none focus-visible:ring-[var(--glass-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg)]",
        "hover:-translate-y-[1px] hover:shadow-card-hover",
        isSelected && "shadow-card-hover ring-2 ring-brand",
      )}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      data-testid={`model-card-${id}`}
    >
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-[var(--glass-overlay-strong)] text-sm font-semibold uppercase text-[var(--text-on-glass)] shadow-[var(--glass-shadow)]">
          {provider.slice(0, 1)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide opacity-75">{provider}</p>
          <h3 className="text-sm font-semibold leading-tight sm:text-base">{name}</h3>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleDetails();
          }}
          aria-label={isOpen ? "Modelldetails verbergen" : "Modelldetails anzeigen"}
          aria-expanded={isOpen}
          aria-controls={detailId}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-[var(--glass-overlay-muted)] text-[var(--text-on-glass)] transition hover:border-white/50 hover:bg-[var(--glass-overlay-strong)] focus-visible:outline-none focus-visible:ring-[var(--glass-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg)]"
        >
          <Info className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      <footer className="flex items-center justify-between text-xs font-medium opacity-80 sm:text-sm">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/15 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-on-glass)] opacity-80">
          {isSelected ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Aktiv
            </>
          ) : (
            "Erkunden"
          )}
        </span>
        <span>
          {formatPrice(priceIn)} · {formatPrice(priceOut)}
        </span>
      </footer>

      {isOpen && (
        <div
          id={detailId}
          role="region"
          aria-live="polite"
          className="space-y-3 rounded-xl border border-white/30 bg-[var(--glass-overlay-muted)] p-3 text-xs leading-relaxed text-[var(--text-on-glass)] opacity-90 sm:text-sm"
        >
          <p>{description}</p>
          <dl className="grid grid-cols-2 gap-2">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
                Kontext
              </dt>
              <dd className="font-medium">{formatContext(contextTokens)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
                Provider
              </dt>
              <dd className="font-medium">{provider}</dd>
            </div>
          </dl>
        </div>
      )}
    </article>
  );
}
