import { Check, Info } from "lucide-react";
import { useId } from "react";

import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader } from "./card";
import { Badge } from "./badge";
import { Avatar } from "./avatar";

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
  providerTier?: 'free' | 'premium' | 'enterprise';
}

const priceFormatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

function formatPrice(value: number) {
  if (value === 0) return "Kostenlos";
  return `${priceFormatter.format(value)}/1M`;
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
  providerTier = 'free',
}: ModelCardProps) {
  const detailId = useId();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-controls={detailId}
      elevation={isSelected ? "surface-prominent" : "raised"}
      interactive="gentle"
      padding="md"
      state={isSelected ? "selected" : "default"}
      className={cn(
        "w-full relative overflow-hidden",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-base",
        isSelected && "shadow-glow-brand bg-brand/5 border-brand/30",
      )}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      data-testid={`model-card-${id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar size="md" className="shadow-surface-subtle">
              {provider.slice(0, 1)}
            </Avatar>
            {providerTier === 'premium' && (
              <Badge
                size="xs"
                variant="brand"
                className="absolute -top-1 -right-1"
              >★</Badge>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-title-base text-text-strong truncate">
              {name}
            </h3>
            <p className="text-sm text-text-muted truncate">{provider}</p>
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
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-surface-subtle text-text-primary transition hover:border-border-strong hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
          >
            <Info className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {description && (
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" size="sm">
              {contextTokens ? formatContext(contextTokens) : 'N/A'} Kontext
            </Badge>
            {contextTokens && contextTokens > 100000 && (
              <Badge variant="info" size="sm">⚡ Hoch</Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-text-muted">
              ${priceIn}/{priceOut}
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-border-divider">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-subtle">
              {isSelected ? "Aktiv" : "Erkunden"}
            </span>
            {isSelected && (
              <Check className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
            )}
          </div>
          
          <Badge
            variant={isSelected ? "brand" : "outline"}
            size="sm"
          >
            {isSelected ? "Aktiv" : "Auswählen"}
          </Badge>
        </div>
      </CardContent>

      {isOpen && (
        <div
          id={detailId}
          role="region"
          aria-live="polite"
          className="border-t border-border-divider mt-3 pt-3 space-y-3"
        >
          <p className="text-description-base text-text-secondary">{description}</p>
          <div className="grid grid-cols-2 gap-3 text-description-sm">
            <div>
              <dt className="font-semibold text-text-strong">Kontextlänge</dt>
              <dd className="mt-1">{formatContext(contextTokens)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-text-strong">Provider</dt>
              <dd className="mt-1">{provider}</dd>
            </div>
            <div>
              <dt className="font-semibold text-text-strong">Input</dt>
              <dd className="mt-1">{formatPrice(priceIn)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-text-strong">Output</dt>
              <dd className="mt-1">{formatPrice(priceOut)}</dd>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
