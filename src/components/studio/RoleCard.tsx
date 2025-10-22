import { Info } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef, useState } from "react";

import { cn } from "../../lib/utils";
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
    const detailId = `${title.replace(/\s+/g, "-").toLowerCase()}-details`;

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
          cardVariants({ interactive: true, padding: "md" }),
          "flex flex-col gap-3 text-left",
          !disabled && "cursor-pointer",
          disabled && "cursor-not-allowed opacity-70",
          isActive && "ring-brand ring-2",
          className,
        )}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-raised text-sm font-semibold uppercase text-text-primary shadow-surface">
            {title.slice(0, 1)}
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <h3 className="text-sm font-semibold leading-tight sm:text-base">{title}</h3>
                {badge && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide opacity-75">
                    {badge}
                  </span>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleInfoToggle}
                aria-label={expanded ? "Beschreibung verbergen" : "Beschreibung anzeigen"}
                aria-expanded={expanded}
                aria-controls={detailId}
                className="border border-border-subtle bg-surface-subtle text-text-primary hover:border-border-strong hover:bg-surface-raised"
              >
                <Info className="h-4 w-4" />
              </Button>
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
      </button>
    );
  },
);

RoleCard.displayName = "RoleCard";
