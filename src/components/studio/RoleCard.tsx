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
  isMobile?: boolean;
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
      isMobile = false,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const detailId = `${title.replace(/\s+/g, "-").toLowerCase()}-details`;

    // Normalize category and get data
    const categoryKey = normalizeCategoryKey(category);
    const categoryData = getCategoryData(category);

    const handleInfoToggle = (event: React.MouseEvent | React.KeyboardEvent) => {
      event.stopPropagation();
      setExpanded((prev) => !prev);
    };

    const handleCardClick = (
      event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      // If clicking on the info button, don't trigger the card click
      const target = event.target as HTMLElement;
      if (
        target.closest('[aria-label="Details zur Rolle"]') ||
        target.closest(".info-button-container")
      ) {
        event.stopPropagation(); // Prevent card click when info button is clicked
        return;
      }

      if (!disabled && onClick) {
        onClick(event as React.MouseEvent<HTMLDivElement>);
      }
    };

    // Create accessible info toggle that's not a nested button
    const InfoToggle = ({ className }: { className?: string }) => (
      <div
        onClick={handleInfoToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleInfoToggle(e);
          }
        }}
        aria-label="Details zur Rolle"
        aria-expanded={expanded}
        aria-controls={detailId}
        className={cn(
          "info-button-container", // Changed class name for identification
          "absolute top-2 right-2 z-10",
          "flex items-center justify-center",
          "rounded-lg border border-border-subtle bg-surface-base/80 backdrop-blur-sm",
          "text-text-secondary hover:text-text-primary",
          "transition-all duration-200 ease-in-out",
          "hover:bg-surface-subtle hover:border-border-strong",
          "focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
          "active:bg-surface-raised",
          "cursor-pointer",
          // 44x44px touch target for mobile
          isMobile ? "h-11 w-11 touch-target" : "h-10 w-10",
          // Ensure proper z-index layering
          "shadow-sm hover:shadow-md",
          className,
        )}
        role="button"
        tabIndex={0}
      >
        <Info
          className={cn(
            "info-icon",
            "transition-transform duration-200",
            isMobile ? "h-5 w-5" : "h-4 w-4",
          )}
        />
      </div>
    );

    return (
      <div className={cn("relative", className)}>
        <Card
          ref={ref as any}
          interactive={isActive ? "dramatic" : "gentle"}
          padding="md"
          state={isActive ? "selected" : disabled ? "disabled" : "default"}
          data-cat={categoryKey}
          className={cn(
            "category-border category-tint category-focus text-left",
            !disabled && "cursor-pointer",
            disabled && "cursor-not-allowed opacity-70",
            isActive && "ring-brand ring-2 bg-brand/10",
            isMobile && "mobile-role-card touch-target",
            // Add padding-right to prevent text overlap with info button
            isMobile ? "pr-16" : "pr-14",
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
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-raised text-sm font-semibold uppercase text-text-primary shadow-surface",
                isMobile ? "h-12 w-12 touch-target" : "h-10 w-10",
              )}
            >
              {title.slice(0, 1)}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <div className="min-w-0 flex-1">
                <h3
                  className={cn(
                    "role-title-typography text-heading-sm text-high-contrast line-clamp-1",
                    isMobile ? "text-heading-md" : "text-heading-sm",
                  )}
                >
                  {title}
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {badge && (
                    <span
                      className={cn(
                        "category-badge inline-flex items-center gap-2 rounded-full border border-white/30 font-semibold uppercase tracking-wide",
                        isMobile
                          ? "mobile-category-badge px-3 py-1 text-xs touch-target"
                          : "px-2 py-0.5 text-[10px]",
                      )}
                    >
                      <span
                        className={cn(
                          "category-dot rounded-full",
                          isMobile ? "mobile-category-dot h-2 w-2" : "h-1.5 w-1.5",
                        )}
                      />
                      {badge}
                    </span>
                  )}
                  {category && (
                    <span
                      className={cn(
                        "category-badge inline-flex items-center rounded-full font-medium uppercase tracking-wide",
                        isMobile
                          ? "mobile-category-badge gap-2 px-3 py-1 text-xs touch-target"
                          : "gap-1.5 px-2 py-0.5 text-[10px]",
                      )}
                    >
                      <span className={isMobile ? "text-sm" : "text-xs"}>{categoryData.icon}</span>
                      {categoryData.label}
                    </span>
                  )}
                  {isActive && (
                    <span
                      className={cn(
                        "text-text-1 text-xs rounded-full border border-border-subtle bg-surface-subtle",
                        isMobile ? "px-3 py-1 touch-target" : "px-2 py-0.5",
                      )}
                    >
                      Aktiv
                    </span>
                  )}
                </div>
              </div>

              <div className="role-text">
                <p
                  className={cn(
                    "role-description-typography typography-base text-medium-contrast",
                    isMobile ? "text-body-base line-clamp-3" : "text-body-small line-clamp-2",
                  )}
                >
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Expanded Details Section */}
          {expanded && (
            <div
              id={detailId}
              className={cn(
                "expanded-details",
                "mt-4 pt-4 border-t border-border-subtle",
                "typography-base",
              )}
            >
              <p
                className={cn(
                  "role-description-typography whitespace-pre-line text-medium-contrast",
                  isMobile ? "text-body-base" : "text-body-small",
                )}
              >
                {description}
              </p>
            </div>
          )}
        </Card>
        {/* Info Toggle - Positioned absolutely top-right - Separate from card */}
        <InfoToggle />
      </div>
    );
  },
);

RoleCard.displayName = "RoleCard";
