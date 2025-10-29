import { Info } from "lucide-react";
import { useId } from "react";

import { cn } from "../../lib/utils";
import { getCategoryData, normalizeCategoryKey } from "../../utils/category-mapping";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Card } from "./card";

export interface ModelCardProps {
  id: string;
  name: string;
  provider: string;
  priceIn: number;
  priceOut: number;
  contextTokens?: number;
  description: string;
  category?: string;
  isSelected: boolean;
  isOpen: boolean;
  onSelect: () => void;
  onToggleDetails: () => void;
  providerTier?: "free" | "premium" | "enterprise";
  isMobile?: boolean;
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
  category,
  isSelected,
  isOpen,
  onSelect,
  onToggleDetails,
  providerTier = "free",
  isMobile = false,
}: ModelCardProps) {
  const detailId = useId();

  // Determine category based on provider tier if not explicitly provided
  const effectiveCategory =
    category || (providerTier === "premium" ? "Modell: Premium" : "Modell: Alltag");
  const categoryKey = normalizeCategoryKey(effectiveCategory);
  const categoryData = getCategoryData(effectiveCategory);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  // Determine badge variant based on pricing
  const getBadgeVariant = () => {
    if (priceIn === 0 && priceOut === 0) return "success";
    if (priceIn < 0.5 && priceOut < 0.5) return "default";
    return "outline";
  };

  return (
    <div className="relative w-full">
      <Card
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        elevation={isSelected ? "surface-prominent" : "raised"}
        interactive="gentle"
        padding="md"
        state={isSelected ? "selected" : "default"}
        data-cat={categoryKey}
        className={cn(
          "category-border category-tint category-focus relative w-full overflow-hidden",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-base",
          isSelected && "shadow-glow-brand bg-brand/5 border-brand/30",
          isMobile && "mobile-model-card touch-target",
        )}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        data-testid={`${isMobile ? "mobile-" : ""}model-card-${id}`}
      >
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <Avatar size="md" className={cn("shadow-surface-subtle", isMobile && "touch-target")}>
              {provider.slice(0, 1)}
            </Avatar>
            {providerTier === "premium" && (
              <Badge
                size="xs"
                variant="brand"
                className={cn("absolute -right-1 -top-1", isMobile && "touch-target")}
              >
                ★
              </Badge>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-title-base text-text-strong font-semibold truncate">{name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="truncate text-sm text-text-muted">{provider}</p>
                  <span
                    className={cn(
                      "category-badge inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      isMobile && "touch-target",
                    )}
                  >
                    <span className="category-dot h-1 w-1 rounded-full" />
                    {categoryData.label}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="font-mono text-sm text-text-muted">
                  {priceIn === 0 && priceOut === 0 ? " Kostenlos" : `${priceIn}/${priceOut}M`}
                </div>
              </div>
            </div>

            {description && (
              <p
                className={cn(
                  "mt-2 text-sm leading-relaxed text-text-secondary",
                  !isOpen && (isMobile ? "line-clamp-3" : "line-clamp-2"),
                )}
              >
                {description}
              </p>
            )}

            {isOpen && (
              <div
                id={detailId}
                role="region"
                aria-live="polite"
                className={cn(
                  "mt-3 space-y-3 rounded-lg border border-border-subtle bg-surface-subtle/60 p-3",
                  isMobile && "text-sm",
                )}
              >
                <dl className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2 md:text-sm">
                  <div className="space-y-1">
                    <dt className="text-text-strong font-semibold uppercase tracking-wide">
                      Kontextlänge
                    </dt>
                    <dd className="font-mono">{formatContext(contextTokens)}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-text-strong font-semibold uppercase tracking-wide">
                      Provider
                    </dt>
                    <dd>{provider}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-text-strong font-semibold uppercase tracking-wide">
                      Preis Eingabe
                    </dt>
                    <dd className="font-mono">{formatPrice(priceIn)}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-text-strong font-semibold uppercase tracking-wide">
                      Preis Ausgabe
                    </dt>
                    <dd className="font-mono">{formatPrice(priceOut)}</dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-divider">
              <div className="flex items-center gap-2">
                <Badge
                  variant={getBadgeVariant()}
                  size="sm"
                  className={cn(isMobile && "touch-target")}
                >
                  {contextTokens ? formatContext(contextTokens) : "N/A"}
                </Badge>
                {contextTokens && contextTokens > 100000 && (
                  <Badge variant="info" size="sm" className={cn(isMobile && "touch-target")}>
                    ⚡
                  </Badge>
                )}
              </div>

              <Badge
                variant={isSelected ? "brand" : "outline"}
                size="sm"
                className={cn("px-3 py-1", isMobile && "touch-target")}
              >
                {isSelected ? "Aktiv" : "Auswählen"}
              </Badge>
            </div>
          </div>
        </div>
        {/* Info button positioned absolutely outside the Card to avoid nested interactive elements */}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleDetails();
          }}
          aria-label={isOpen ? "Modelldetails verbergen" : "Modelldetails anzeigen"}
          aria-expanded={isOpen}
          className={cn(
            "absolute top-3 right-3 flex items-center justify-center rounded-full border border-border-subtle bg-surface-subtle text-text-primary transition hover:border-border-strong hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]",
            isMobile ? "h-10 w-10 touch-target" : "h-8 w-8",
          )}
        >
          <Info className="h-4 w-4" aria-hidden="true" />
        </button>
      </Card>
    </div>
  );
}
