import { Info } from "lucide-react";
import { type CSSProperties, forwardRef, useState } from "react";

import { cn } from "../../lib/utils";

export interface RoleTint {
  from: string;
  to: string;
}

export interface RoleCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  description: string;
  badge?: string;
  tint: RoleTint;
  isActive?: boolean;
  contrastOverlay?: boolean;
  showDescriptionOnToggle?: boolean;
}

/**
 * Glassmorphism role card used on the studio role screen.
 * Renders as an accessible button so it can be focused/tapped.
 */
export const RoleCard = forwardRef<HTMLButtonElement, RoleCardProps>(
  (
    {
      title,
      description,
      badge,
      tint,
      isActive = false,
      contrastOverlay: _contrastOverlay = false,
      className,
      type = "button",
      style,
      showDescriptionOnToggle = false,
      ...props
    },
    ref,
  ) => {
    const accentVariables:
      | (CSSProperties & {
          "--card-tint-from"?: string;
          "--card-tint-to"?: string;
        })
      | undefined = tint
      ? {
          "--card-tint-from": tint.from,
          "--card-tint-to": tint.to,
        }
      : undefined;

    const mergedStyle = accentVariables ? { ...style, ...accentVariables } : style;
    const [expanded, setExpanded] = useState(!showDescriptionOnToggle);

    const handleInfoToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setExpanded((prev) => !prev);
    };

    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "glass-card tinted flex min-h-[128px] flex-col p-5 text-left text-white transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.995]",
          isActive && "border-white/30 ring-2 ring-white/25",
          className,
        )}
        style={mergedStyle}
        {...props}
      >
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
              {expanded ? (
                <p className="mt-2 text-sm leading-6 text-white/85">{description}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {badge ? (
                <span className="pointer-events-none rounded-full border border-white/[0.14] bg-white/[0.06] px-2.5 py-1 text-[11px] leading-4 text-white/85 backdrop-blur-sm">
                  {badge}
                </span>
              ) : null}
              {showDescriptionOnToggle ? (
                <button
                  type="button"
                  onClick={handleInfoToggle}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  aria-label={expanded ? "Beschreibung verbergen" : "Beschreibung anzeigen"}
                  aria-expanded={expanded}
                >
                  <Info className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </button>
    );
  },
);

RoleCard.displayName = "RoleCard";
