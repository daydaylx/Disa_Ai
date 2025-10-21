import { Info } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef, useState } from "react";

import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cardVariants } from "../ui/card";

export interface RoleCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  title: string;
  description: string;
  badge?: string;
  isActive?: boolean;
  defaultExpanded?: boolean;
  disabled?: boolean;
}

export const RoleCard = forwardRef<HTMLButtonElement, RoleCardProps>(
  (
    {
      title,
      description,
      badge,
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

    const handleInfoToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setExpanded((prev) => !prev);
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          cardVariants({ interactive: true }),
          "flex flex-col p-3 text-left",
          !disabled && "cursor-pointer",
          disabled && "cursor-not-allowed opacity-70",
          isActive && "ring-2 ring-brand",
          className,
        )}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        {...props}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold tracking-tight text-text-0 sm:text-base">
                {title}
              </h3>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleInfoToggle}
                aria-label={expanded ? "Beschreibung verbergen" : "Beschreibung anzeigen"}
                aria-expanded={expanded}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {expanded && (
            <div className="mt-3 border-t border-border/60 pt-3">
              <p className="whitespace-pre-line break-words text-xs leading-5 text-text-1 sm:text-sm sm:leading-6">
                {description}
              </p>
              {badge && (
                <div className="mt-2">
                  <Badge variant="secondary">{badge}</Badge>
                </div>
              )}
            </div>
          )}
        </div>
      </button>
    );
  },
);

RoleCard.displayName = "RoleCard";
