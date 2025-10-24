import { Info } from \"lucide-react\";
import { forwardRef, type HTMLAttributes, useState } from \"react\";

import { cn } from \"../../lib/utils\";
import { getCategoryData, normalizeCategoryKey } from \"../../utils/category-mapping\";
import { Card } from \"../ui/card\";

export interface MobileRoleCardProps extends Omit<HTMLAttributes<HTMLDivElement>, \"title\"> {
  title: string;
  description: string;
  badge?: string;
  category?: string;
  isActive?: boolean;
  defaultExpanded?: boolean;
  disabled?: boolean;
}

export const MobileRoleCard = forwardRef<HTMLDivElement, MobileRoleCardProps>(
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
    const detailId = `${title.replace(/\\s+/g, \"-\").toLowerCase()}-details`;

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
      if (target.closest('[aria-label*=\"Beschreibung\"]')) {
        return;
      }

      if (!disabled && onClick) {
        onClick(event);
      }
    };

    return (
      <Card
        ref={ref as any}
        interactive={isActive ? \"dramatic\" : \"gentle\"}
        padding=\"md\"
        state={isActive ? \"selected\" : disabled ? \"disabled\" : \"default\"}
        data-cat={categoryKey}
        className={cn(
          \"mobile-role-card category-border category-tint category-focus text-left touch-target\",
          !disabled && \"cursor-pointer\",
          disabled && \"cursor-not-allowed opacity-70\",
          isActive && \"ring-brand ring-2 bg-brand/10\",
          className,
        )}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if ((e.key === \"Enter\" || e.key === \" \") && !disabled) {
            e.preventDefault();
            handleCardClick(e as any);
          }
        }}
        role=\"button\"
        tabIndex={disabled ? -1 : 0}
        aria-pressed={isActive}
        aria-label={`${title} ${isActive ? \"ausgewählt\" : \"auswählen\"}`}
        data-testid={`mobile-role-card-${title.replace(/\\s+/g, \"_\").toLowerCase()}`}
        {...props}
      >
        <div className=\"flex w-full items-start gap-3\">
          <div className=\"flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-raised text-sm font-semibold uppercase text-text-primary shadow-surface touch-target\">
            {title.slice(0, 1)}
          </div>

          <div className=\"flex flex-1 flex-col gap-2\">
            <div className=\"flex flex-1 items-start justify-between gap-2\">
              <div className=\"min-w-0 flex-1\">
                <h3 className=\"text-base font-semibold leading-tight\">{title}</h3>
                <div className=\"flex flex-wrap gap-2 mt-1\">
                  {badge && (
                    <span className=\"category-badge mobile-category-badge inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide touch-target\">
                      <span className=\"category-dot mobile-category-dot h-2 w-2 rounded-full\" />
                      {badge}
                    </span>
                  )}
                  {category && (
                    <span className=\"category-badge mobile-category-badge inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide touch-target\">
                      <span className=\"text-sm\">{categoryData.icon}</span>
                      {categoryData.label}
                    </span>
                  )}
                  {isActive && (
                    <span className=\"text-text-1 text-xs px-3 py-1 rounded-full border border-border-subtle bg-surface-subtle touch-target\">
                      Aktiv
                    </span>
                  )}
                </div>
              </div>

              <div
                role=\"button\"
                tabIndex={0}
                onClick={(e) =>
                  handleInfoToggle(e as unknown as React.MouseEvent<HTMLButtonElement>)
                }
                onKeyDown={(e) => {
                  if (e.key === \"Enter\" || e.key === \" \") {
                    e.preventDefault();
                    handleInfoToggle(e as any);
                  }
                }}
                aria-label={expanded ? \"Beschreibung verbergen\" : \"Beschreibung anzeigen\"}
                aria-expanded={expanded}
                aria-controls={detailId}
                className=\"mobile-info-btn inline-flex h-12 w-12 items-center justify-center rounded-md border border-border-subtle bg-surface-subtle text-sm font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-surface-raised focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-base)] disabled:pointer-events-none disabled:opacity-50 touch-target\"
              >
                <Info className=\"h-5 w-5\" />
              </div>
            </div>

            <p className=\"text-sm text-text-secondary line-clamp-3\">{description}</p>
          </div>
        </div>

        {expanded && (
          <div
            id={detailId}
            className=\"mobile-role-details mt-4 pt-4 border-t border-border-subtle text-sm leading-6\"
          >
            <p className=\"whitespace-pre-line break-words\">{description}</p>
          </div>
        )}
      </Card>
    );
  },
);

MobileRoleCard.displayName = \"MobileRoleCard\";