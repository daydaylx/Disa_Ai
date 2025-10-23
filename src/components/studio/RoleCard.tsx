import { Info } from "lucide-react";
import { forwardRef, type HTMLAttributes, useState } from "react";

import { cn } from "../../lib/utils";
import { getCategoryData, normalizeCategoryKey } from "../../utils/category-mapping";
import { Card } from "../ui/card";

export interface RoleCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  description: string;
  badge?: string;
  category?: string;
  isActive?: boolean;
  defaultExpanded?: boolean;
  disabled?: boolean;
}

export const RoleCard = forwardRef<HTMLDivElement, RoleCardProps>(
  (
    {
      title,
      description,
      badge,
      category,
      isActive = false,
      className,
      defaultExpanded = false,
      onClick,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const detailId = `${title.replace(/\s+/g, "-").toLowerCase()}-details`;

    // Normalize category and get data
    const categoryKey = normalizeCategoryKey(category);
    const categoryData = getCategoryData(category);

    const handleInfoToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setExpanded((prev) => !prev);
    };

    const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
      // If clicking on the info button, don't trigger the card click
      const target = event.target as HTMLElement;
      if (target.closest('[aria-label*="Beschreibung"]')) {
        return;
      }

      if (!disabled && onClick) {
        onClick(event);
      }
    };

    return (
      <Card
        ref={ref as any}
        interactive={isActive ? "dramatic" : "gentle"}
        padding="md"
        state={isActive ? "selected" : disabled ? "disabled" : "default"}
        data-cat={categoryKey}
        className={cn(
          "category-border category-tint category-focus flex flex-col gap-3 text-left",
          !disabled && "cursor-pointer",
          disabled && "cursor-not-allowed opacity-70",
          isActive && "ring-brand ring-2 bg-brand/10",
          className,
        )}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            handleCardClick(e as any);
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-pressed={isActive}
        aria-label={`${title} ${isActive ? "ausgewählt" : "auswählen"}`}
        data-testid={`role-card-${title.replace(/\s+/g, "_").toLowerCase()}`}
        {...props}
      >
        <div className="flex w-full items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-raised text-sm font-semibold uppercase text-text-primary shadow-surface">
            {title.slice(0, 1)}
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <h3 className="text-sm font-semibold leading-tight sm:text-base">{title}</h3>
                {badge && (
                  <span className="category-badge inline-flex items-center gap-2 rounded-full border border-white/30 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                    <span className="category-dot h-1.5 w-1.5 rounded-full" />
                    {badge}
                  </span>
                )}
                {category && (
                  <span className="category-badge inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide">
                    <span className="text-xs">{categoryData.icon}</span>
                    {categoryData.label}
                  </span>
                )}
              </div>
              <div
                tabIndex={0}
                onClick={handleInfoToggle}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleInfoToggle(e as any);
                  }
                }}
                aria-label={expanded ? "Beschreibung verbergen" : "Beschreibung anzeigen"}
                aria-expanded={expanded}
                aria-controls={detailId}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border-subtle bg-surface-subtle text-sm font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-surface-raised focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-base)] disabled:pointer-events-none disabled:opacity-50"
              >
                <Info className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {expanded && (
          <div
            id={detailId}
            className="rounded-xl border border-border-subtle bg-surface-subtle p-3 text-xs leading-5 opacity-85 sm:text-sm sm:leading-6"
          >
            <p className="whitespace-pre-line break-words">{description}</p>
          </div>
        )}
      </Card>
    );
  },
);

RoleCard.displayName = "RoleCard";
