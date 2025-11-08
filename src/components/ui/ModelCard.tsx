import { Info } from "../../lib/icons";
import { type CSSProperties, useId } from "react";

import { cn } from "../../lib/utils";
import { getCategoryData, normalizeCategoryKey } from "../../utils/category-mapping";
import { formatPricePerK } from "../../utils/pricing";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Card } from "./card";

const BADGE_CATEGORIES = [
  "alltag",
  "business",
  "kreativ",
  "bildung",
  "familie",
  "beratung",
] as const;
type BadgeCategory = (typeof BADGE_CATEGORIES)[number];

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
  isTouchOptimized?: boolean; // Android touch optimization flag
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
  const badgeCategory: BadgeCategory =
    categoryKey === "model-premium"
      ? "business"
      : categoryKey === "model-alltag"
        ? "alltag"
        : BADGE_CATEGORIES.includes(categoryKey as BadgeCategory)
          ? (categoryKey as BadgeCategory)
          : "alltag";
  const categoryAccentStyle: CSSProperties = {
    borderLeftColor: `var(--role-accent-${badgeCategory}-border-strong)`,
    borderLeftWidth: "4px",
  };
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
        elevation={isSelected ? "dramatic" : "raised"}
        interactive="gentle"
        padding="md"
        state={isSelected ? "selected" : "default"}
        data-cat={categoryKey}
        className={cn(
          "category-border category-tint category-focus relative w-full overflow-hidden",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface-neumorphic-base)]",
          "hover:shadow-[var(--shadow-neumorphic-md)] hover:-translate-y-1",
          "active:shadow-[var(--shadow-inset-medium)] active:translate-y-1",
          isSelected &&
            "shadow-[var(--shadow-neumorphic-lg)] bg-[var(--color-brand-primary)]/5 border-[var(--color-brand-primary)]/30",
          isMobile && "mobile-model-card touch-target-preferred min-h-[64px]", // Android minimum
          "border-l-[4px]",
          "pl-5",
          // Android-optimized interactions
          "android-scroll",
        )}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        data-testid={`${isMobile ? "mobile-" : ""}model-card-${id}`}
        style={categoryAccentStyle}
      >
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <Avatar
              size="md"
              className={cn(
                "shadow-[var(--shadow-neumorphic-sm)]",
                isMobile && "touch-target-preferred min-h-[40px] min-w-[40px]",
              )}
            >
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
                  <Badge
                    variant="accent"
                    category={badgeCategory}
                    size="xs"
                    className={cn(
                      "category-badge inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-none",
                      isMobile && "touch-target",
                    )}
                  >
                    <span
                      className="category-dot h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: `var(--role-accent-${badgeCategory}-border-strong)`,
                      }}
                    />
                    {categoryData.label}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex flex-col items-end text-xs font-mono text-text-muted">
                  <span>{formatPricePerK(priceIn)}</span>
                  <span>{formatPricePerK(priceOut)}</span>
                </div>
              </div>
            </div>

            {description && (
              <p
                className={cn(
                  "mt-2 text-sm leading-relaxed text-text-secondary",
                  isMobile ? "line-clamp-3" : "line-clamp-2",
                )}
                aria-hidden={isOpen}
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
                {description && (
                  <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-line">
                    {description}
                  </p>
                )}
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
                    <dd className="font-mono">{formatPricePerK(priceIn)}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-text-strong font-semibold uppercase tracking-wide">
                      Preis Ausgabe
                    </dt>
                    <dd className="font-mono">{formatPricePerK(priceOut)}</dd>
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
            "absolute top-3 right-3 flex items-center justify-center rounded-full border border-border-subtle bg-surface-subtle text-text-primary transition hover:border-border-strong hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-neumorphic-base)]",
            isMobile ? "h-10 w-10 touch-target" : "h-8 w-8",
          )}
        >
          <Info className="h-4 w-4" aria-hidden="true" />
        </button>
      </Card>
    </div>
  );
}
