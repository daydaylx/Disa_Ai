import { Info } from "lucide-react";
import { type CSSProperties, forwardRef, useState } from "react";

import { cn } from "../../lib/utils";

export interface RoleTint {
  from: string;
  to: string;
}

export interface RoleCardProps extends React.HTMLAttributes<HTMLDivElement> {
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
export const RoleCard = forwardRef<HTMLDivElement, RoleCardProps>(
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
          "flex min-h-[104px] flex-col p-5 text-left text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35",
          !disabled && "cursor-pointer",
          disabled && "cursor-not-allowed opacity-70",
          variant === "tinted"
            ? "glass-card tinted hover:-translate-y-[1px]"
            : "bg-corporate-bg-card/90 hover:border-white/16 rounded-2xl border border-white/10 shadow-[0_18px_48px_-28px_rgba(6,10,26,0.75)]",
          isActive && "border-white/30 ring-2 ring-white/25",
          className,
        )}
        role="button"
        tabIndex={0}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        style={mergedStyle}
        {...props}
      >
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
              {expanded ? (
                <p className="mt-2 line-clamp-4 text-sm leading-6 text-white/90 [text-shadow:0_0_8px_rgba(6,10,24,0.35)]">
                  {description}
                </p>
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
      </div>
    );
  },
);

RoleCard.displayName = "RoleCard";
