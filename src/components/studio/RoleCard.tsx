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
          "card-depth border-border bg-surface-1 text-text-0 focus-visible:ring-brand relative flex min-h-[96px] flex-col rounded-lg border p-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2",
          !disabled && "hover:bg-surface-2 cursor-pointer",
          disabled && "cursor-not-allowed opacity-70",
          isActive && "ring-brand ring-2",
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
              <h3 className="text-text-0 text-base font-semibold tracking-tight sm:text-lg">
                {title}
              </h3>
              {expanded ? (
                <p className="text-text-1 mt-2 line-clamp-3 text-sm leading-6 sm:leading-7">
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
