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
  tint?: RoleTint;
  isActive?: boolean;
  contrastOverlay?: boolean;
  showDescriptionOnToggle?: boolean;
  badgeStyle?: CSSProperties;
  badgeClassName?: string;
  disabled?: boolean;
  variant?: "tinted" | "surface";
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
      style,
      showDescriptionOnToggle = false,
      badgeStyle,
      badgeClassName,
      onClick,
      disabled,
      variant = "tinted",
      type: buttonType = "button",
      ...props
    },
    ref,
  ) => {
    const accentVariables:
      | (CSSProperties & {
          "--card-tint-from"?: string;
          "--card-tint-to"?: string;
          "--card-overlay-gradient"?: string;
          "--card-glow-shadow"?: string;
        })
      | undefined =
      tint && variant === "tinted"
        ? {
            "--card-tint-from": tint.from,
            "--card-tint-to": tint.to,
          }
        : undefined;

    const mergedStyle = accentVariables ? { ...style, ...accentVariables } : style;
    const [expanded, setExpanded] = useState(!showDescriptionOnToggle);

    const handleInfoToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      setExpanded((prev) => !prev);
    };

    return (
      <div className="relative">
        <button
          ref={ref}
          type={buttonType}
          aria-pressed={isActive}
          data-state={isActive ? "active" : "inactive"}
          className={cn(
            "flex min-h-[104px] w-full flex-col p-5 text-left text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35",
            !disabled && "cursor-pointer",
            disabled && "cursor-not-allowed opacity-70",
            variant === "tinted"
              ? "glass-card tinted hover:-translate-y-[1px]"
              : "bg-corporate-bg-card/90 hover:border-white/16 rounded-2xl border border-white/10 shadow-[0_18px_48px_-28px_rgba(6,10,26,0.75)]",
            isActive && "border-white/30 ring-2 ring-white/25",
            className,
          )}
          disabled={disabled}
          onClick={disabled ? undefined : onClick}
          style={mergedStyle}
          {...props}
        >
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className={cn("flex-1", showDescriptionOnToggle ? "pr-10" : undefined)}>
                <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
                {expanded ? (
                  <p className="mt-2 text-sm leading-6 text-white/85">{description}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {badge ? (
                  <span
                    className={cn(
                      "pointer-events-none rounded-full border px-2.5 py-1 text-[11px] leading-4 backdrop-blur-sm",
                      badgeClassName,
                    )}
                    style={badgeStyle}
                  >
                    {badge}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </button>
        {showDescriptionOnToggle ? (
          <button
            type="button"
            onClick={handleInfoToggle}
            className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label={expanded ? "Beschreibung verbergen" : "Beschreibung anzeigen"}
            aria-expanded={expanded}
          >
            <Info className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    );
  },
);

RoleCard.displayName = "RoleCard";
