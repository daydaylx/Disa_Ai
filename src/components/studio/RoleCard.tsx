import { Info } from "lucide-react";
import { forwardRef, useState } from "react";

import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export interface RoleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  badge?: string;
  isActive?: boolean;
  showDescriptionOnToggle?: boolean;
  disabled?: boolean;
}

export const RoleCard = forwardRef<HTMLDivElement, RoleCardProps>(
  (
    {
      title,
      description,
      badge,
      isActive = false,
      className,
      showDescriptionOnToggle = false,
      onClick,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState(!showDescriptionOnToggle);

    const handleInfoToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setExpanded((prev) => !prev);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    return (
      <div
        ref={ref}
        aria-pressed={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "card-depth relative flex min-h-[76px] flex-col rounded-lg border border-border bg-surface-1 p-3 text-left text-text-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
          !disabled && "cursor-pointer hover:bg-surface-2",
          disabled && "cursor-not-allowed opacity-70",
          isActive && "ring-2 ring-brand",
          className,
        )}
        role="button"
        tabIndex={0}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold tracking-tight text-text-0 sm:text-base">
                {title}
              </h3>
              {expanded ? (
                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-text-1 sm:text-sm sm:leading-6">
                  {description}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {badge && <Badge variant="secondary">{badge}</Badge>}
              {showDescriptionOnToggle && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleInfoToggle}
                  aria-label={expanded ? "Beschreibung verbergen" : "Beschreibung anzeigen"}
                  aria-expanded={expanded}
                >
                  <Info className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

RoleCard.displayName = "RoleCard";
